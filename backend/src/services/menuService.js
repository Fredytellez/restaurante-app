const pool = require("../config/db")
const { AppError } = require("../middlewares/errorHandler")

const menuService = {

  getByRestaurant: async (restaurant_id) => {

    // Verificar que el restaurante existe
    const restaurantCheck = await pool.query(
      "SELECT id FROM restaurants WHERE id = $1 AND is_active = true",
      [restaurant_id]
    )

    if (restaurantCheck.rows.length === 0)
      throw new AppError(
        `El restaurante con id ${restaurant_id} no existe`, 404
      )

    const result = await pool.query(
      `SELECT
         mc.id AS category_id,
         mc.name AS category_name,
         mc.sort_order,
         json_agg(
           json_build_object(
             'id',           mi.id,
             'name',         mi.name,
             'description',  mi.description,
             'price',        mi.price,
             'image_url',    mi.image_url,
             'is_available', mi.is_available
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

    return result.rows
  }
}

module.exports = menuService