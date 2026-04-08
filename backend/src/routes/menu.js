const express = require("express")
const router  = express.Router()
const pool    = require("../config/db")

// GET /api/menu/:restaurant_id
// Devuelve el menú completo agrupado por categorías
router.get("/:restaurant_id", async (req, res) => {
  const { restaurant_id } = req.params

  try {
    const result = await pool.query(
      `SELECT
         mc.id AS category_id,
         mc.name AS category_name,
         mc.sort_order,
         json_agg(
           json_build_object(
             'id',          mi.id,
             'name',        mi.name,
             'description', mi.description,
             'price',       mi.price,
             'image_url',   mi.image_url,
             'is_available',mi.is_available
           ) ORDER BY mi.name
         ) AS items
       FROM menu_categories mc
       JOIN menu_items mi ON mi.category_id = mc.id
       WHERE mc.restaurant_id = $1
         AND mc.is_active = true
         AND mi.is_available = true
       GROUP BY mc.id, mc.name, mc.sort_order
       ORDER BY mc.sort_order`,
      [restaurant_id]
    )
    res.json({ success: true, data: result.rows })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router