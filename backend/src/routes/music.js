const express = require("express")
const router  = express.Router()
const pool    = require("../config/db")

// POST /api/music
// Cliente solicita una canción
router.post("/", async (req, res) => {
  const { table_id, song_name, artist, platform_url } = req.body

  try {
    const result = await pool.query(
      `INSERT INTO music_requests (table_id, song_name, artist, platform_url)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [table_id, song_name, artist, platform_url || null]
    )
    const newMusic = result.rows[0]
    req.io.to("dashboard").emit("new-music-request", newMusic)
    res.json({ success: true, data: newMusic })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// GET /api/music
// Dashboard ve todas las solicitudes de música pendientes
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT mr.*, t.table_number
       FROM music_requests mr
       JOIN tables t ON mr.table_id = t.id
       WHERE mr.status = 'pending'
       ORDER BY mr.created_at ASC`
    )
    res.json({ success: true, data: result.rows })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router