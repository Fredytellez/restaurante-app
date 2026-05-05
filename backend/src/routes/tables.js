const express = require("express")
const router  = require("express").Router()
const pool    = require("../config/db")

// GET /api/tables
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tables ORDER BY table_number ASC"
    )
    res.json({ success: true, data: result.rows })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// PATCH /api/tables/:id
router.patch("/:id", async (req, res) => {
  const { id } = req.params
  const { status } = req.body
  try {
    const result = await pool.query(
      "UPDATE tables SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    )
    res.json({ success: true, data: result.rows[0] })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router