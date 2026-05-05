const pool = require("../config/db")
const { AppError } = require("../middlewares/errorHandler")

const orderService = {

  create: async (table_id, items, io) => {
    const client = await pool.connect()

    try {
      await client.query("BEGIN")

      // Verificar que la mesa existe
      const tableCheck = await client.query(
        "SELECT id FROM tables WHERE id = $1",
        [table_id]
      )
      if (tableCheck.rows.length === 0)
        throw new AppError(`La mesa con id ${table_id} no existe`, 404)

      // Verificar que todos los items del menú existen y están disponibles
      let total = 0
      const itemsWithPrice = []

      for (const item of items) {
        const menuItem = await client.query(
          "SELECT id, price, name, is_available FROM menu_items WHERE id = $1",
          [item.menu_item_id]
        )

        if (menuItem.rows.length === 0)
          throw new AppError(
            `El producto con id ${item.menu_item_id} no existe`, 404
          )

        if (!menuItem.rows[0].is_available)
          throw new AppError(
            `El producto '${menuItem.rows[0].name}' no está disponible`, 400
          )

        const price = Number(menuItem.rows[0].price)
        total += price * item.quantity
        itemsWithPrice.push({ ...item, unit_price: price })
      }

      // Crear la orden
      const orderResult = await client.query(
        `INSERT INTO orders (table_id, total)
         VALUES ($1, $2) RETURNING *`,
        [table_id, total]
      )
      const order = orderResult.rows[0]

      // Insertar cada ítem
      for (const item of itemsWithPrice) {
        await client.query(
          `INSERT INTO order_items
           (order_id, menu_item_id, quantity, unit_price, notes)
           VALUES ($1, $2, $3, $4, $5)`,
          [order.id, item.menu_item_id, item.quantity,
           item.unit_price, item.notes || null]
        )
      }

      await client.query("COMMIT")

      if (io) io.to("dashboard").emit("new-order", { ...order, items })

      return order

    } catch (error) {
      await client.query("ROLLBACK")
      throw error // re-lanzamos para que lo capture el errorHandler
    } finally {
      client.release()
    }
  },

  getActive: async () => {
    const result = await pool.query(
      `SELECT o.*, t.table_number,
              json_agg(json_build_object(
                'name', mi.name,
                'quantity', oi.quantity,
                'price', oi.unit_price,
                'notes', oi.notes
              )) AS items
       FROM orders o
       JOIN tables t       ON o.table_id = t.id
       JOIN order_items oi ON oi.order_id = o.id
       JOIN menu_items mi  ON oi.menu_item_id = mi.id
       WHERE o.status NOT IN ('delivered','cancelled')
       GROUP BY o.id, t.table_number
       ORDER BY o.created_at ASC`
    )
    return result.rows
  },

  updateStatus: async (id, status, io) => {
    const check = await pool.query(
      "SELECT id FROM orders WHERE id = $1", [id]
    )

    if (check.rows.length === 0)
      throw new AppError(`La orden con id ${id} no existe`, 404)

    const result = await pool.query(
      `UPDATE orders
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 RETURNING *`,
      [status, id]
    )

    const updated = result.rows[0]
    if (io) io.to("dashboard").emit("order-updated", updated)

    return updated
  }
}

module.exports = orderService