const express  = require("express")
const router   = express.Router()
const pool     = require("../config/db")

// POST /api/requests
// El cliente hace una solicitud desde su mesa
router.post("/", async (req, res) => {
  // Extraemos los datos que viene del frontend
  const { table_id, type, notes } = req.body

  try {
    // Guardamos la solicitud en la base de datos
    const result = await pool.query(
      `INSERT INTO requests (table_id, type, notes)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [table_id, type, notes]
    )

    const newRequest = result.rows[0]

    // Avisamos al dashboard en tiempo real via Socket.io
    // req.io lo configuramos en el archivo principal
    req.io.to("dashboard").emit("new-request", newRequest)

    res.json({ success: true, data: newRequest })

  } catch (error) {
    console.error("Error al crear solicitud:", error.message)
    res.status(500).json({ success: false, message: error.message })
  }
})

// GET /api/requests
// El dashboard pide todas las solicitudes pendientes
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, t.table_number
       FROM requests r
       JOIN tables t ON r.table_id = t.id
       WHERE r.status = 'pending'
       ORDER BY r.created_at ASC`
    )
    res.json({ success: true, data: result.rows })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// PATCH /api/requests/:id
// El mesero marca una solicitud como resuelta
router.patch("/:id", async (req, res) => {
  const { id } = req.params
  const { status, waiter_id } = req.body

  try {
    const result = await pool.query(
      `UPDATE requests
       SET status = $1, waiter_id = $2, resolved_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [status, waiter_id, id]
    )

    const updated = result.rows[0]

    // Avisamos al dashboard que cambió el estado
    req.io.to("dashboard").emit("request-updated", updated)

    res.json({ success: true, data: updated })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router