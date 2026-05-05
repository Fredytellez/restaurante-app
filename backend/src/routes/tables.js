const express = require("express")
const router  = express.Router()
const pool    = require("../config/db")

// GET /api/tables
router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tables ORDER BY table_number ASC"
    )
    res.json({ success: true, data: result.rows })
  } catch (error) {
    next(error)
  }
})

// PATCH /api/tables/:id
router.patch("/:id", async (req, res, next) => {
  const { id }     = req.params
  const { status } = req.body

  const validStatuses = ["available", "occupied", "reserved", "cleaning"]

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      error: {
        message: `Estado inválido. Valores permitidos: ${validStatuses.join(", ")}`,
        statusCode: 400
      }
    })
  }

  try {
    const result = await pool.query(
      "UPDATE tables SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: `Mesa con id ${id} no encontrada`, statusCode: 404 }
      })
    }

    res.json({ success: true, data: result.rows[0] })
  } catch (error) {
    next(error)
  }
})

module.exports = router