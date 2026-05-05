const express     = require("express")
const router      = express.Router()
const menuService = require("../services/menuService")

router.get("/:restaurant_id", async (req, res, next) => {
  try {
    const { restaurant_id } = req.params

    if (isNaN(Number(restaurant_id)))
      return res.status(400).json({
        success: false,
        error: { message: "El id del restaurante debe ser un número", statusCode: 400 }
      })

    const data = await menuService.getByRestaurant(Number(restaurant_id))
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
})

module.exports = router