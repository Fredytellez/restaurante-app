const express = require("express")
const router  = express.Router()
const pool    = require("../config/db")

// POST /api/orders
// El cliente envía su pedido
router.post("/", async (req, res) => {
  const { table_id, items } = req.body
  // items es un array: [{menu_item_id, quantity, notes}, ...]

  // Usamos un "cliente" de la pool para hacer
  // varias consultas como una sola transacción.
  // Si algo falla, se cancela todo (no quedan datos a medias)
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    // 1. Calculamos el total del pedido
    let total = 0
    for (const item of items) {
      const menuItem = await client.query(
        "SELECT price FROM menu_items WHERE id = $1",
        [item.menu_item_id]
      )
      total += menuItem.rows[0].price * item.quantity
    }

    // 2. Creamos la orden
    const orderResult = await client.query(
      `INSERT INTO orders (table_id, total)
       VALUES ($1, $2) RETURNING *`,
      [table_id, total]
    )
    const order = orderResult.rows[0]

    // 3. Insertamos cada ítem de la orden
    for (const item of items) {
      const menuItem = await client.query(
        "SELECT price FROM menu_items WHERE id = $1",
        [item.menu_item_id]
      )
      await client.query(
        `INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, notes)
         VALUES ($1, $2, $3, $4, $5)`,
        [order.id, item.menu_item_id, item.quantity,
         menuItem.rows[0].price, item.notes || null]
      )
    }

    await client.query("COMMIT")

    // Avisamos al dashboard en tiempo real
    req.io.to("dashboard").emit("new-order", {
      ...order,
      items
    })

    res.json({ success: true, data: order })

  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error al crear orden:", error.message)
    res.status(500).json({ success: false, message: error.message })
  } finally {
    client.release()
  }
})

// GET /api/orders
// Dashboard: ver todas las órdenes activas
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, t.table_number,
              json_agg(json_build_object(
                'name', mi.name,
                'quantity', oi.quantity,
                'price', oi.unit_price,
                'notes', oi.notes
              )) AS items
       FROM orders o
       JOIN tables t        ON o.table_id = t.id
       JOIN order_items oi  ON oi.order_id = o.id
       JOIN menu_items mi   ON oi.menu_item_id = mi.id
       WHERE o.status NOT IN ('delivered','cancelled')
       GROUP BY o.id, t.table_number
       ORDER BY o.created_at ASC`
    )
    res.json({ success: true, data: result.rows })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// PATCH /api/orders/:id
// Cambiar estado de una orden
router.patch("/:id", async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  try {
    const result = await pool.query(
      `UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 RETURNING *`,
      [status, id]
    )
    const updated = result.rows[0]
    req.io.to("dashboard").emit("order-updated", updated)
    res.json({ success: true, data: updated })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router