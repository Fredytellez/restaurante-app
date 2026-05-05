const pool = require("../config/db")
const { AppError } = require("../middlewares/errorHandler")

const requestService = {

  // Crear una nueva solicitud
  create: async (table_id, type, notes, io) => {

    // Verificamos que la mesa exista antes de insertar
    const tableCheck = await pool.query(
      "SELECT id FROM tables WHERE id = $1",
      [table_id]
    )

    if (tableCheck.rows.length === 0)
      throw new AppError(`La mesa con id ${table_id} no existe`, 404)

    // Verificamos que no haya una solicitud pendiente del mismo tipo
    const duplicate = await pool.query(
      `SELECT id FROM requests
       WHERE table_id = $1 AND type = $2 AND status = 'pending'`,
      [table_id, type]
    )

    if (duplicate.rows.length > 0)
      throw new AppError(
        "Ya hay una solicitud pendiente de este tipo para esta mesa",
        409
      )

    const result = await pool.query(
      `INSERT INTO requests (table_id, type, notes)
       VALUES ($1, $2, $3) RETURNING *`,
      [table_id, type, notes || null]
    )

    const newRequest = result.rows[0]

    // Emitimos el evento de socket
    if (io) io.to("dashboard").emit("new-request", newRequest)

    return newRequest
  },

  // Obtener todas las solicitudes pendientes
  getPending: async () => {
    const result = await pool.query(
      `SELECT r.*, t.table_number
       FROM requests r
       JOIN tables t ON r.table_id = t.id
       WHERE r.status != 'resolved'
       ORDER BY r.created_at ASC`
    )
    return result.rows
  },

  // Actualizar el estado de una solicitud
  updateStatus: async (id, status, waiter_id, io) => {
    const check = await pool.query(
      "SELECT id FROM requests WHERE id = $1",
      [id]
    )

    if (check.rows.length === 0)
      throw new AppError(`La solicitud con id ${id} no existe`, 404)

    const result = await pool.query(
      `UPDATE requests
       SET status = $1,
           waiter_id = $2,
           resolved_at = CASE WHEN $1 = 'resolved' THEN CURRENT_TIMESTAMP ELSE resolved_at END
       WHERE id = $3 RETURNING *`,
      [status, waiter_id || null, id]
    )

    const updated = result.rows[0]
    if (io) io.to("dashboard").emit("request-updated", updated)

    return updated
  }
}

module.exports = requestService