const express        = require("express")
const router         = express.Router()
const requestService = require("../services/requestService")
const { validate }   = require("../middlewares/validate")
const { requestLimiter } = require("../middlewares/rateLimiter")

/* console.log("validate es:", typeof validate)
console.log("requestLimiter es:", typeof requestLimiter) */

// POST — con validación y límite de peticiones
router.post("/",
  requestLimiter,
  validate("request"),
  async (req, res, next) => {
    try {
      const { table_id, type, notes } = req.body
      const data = await requestService.create(
        Number(table_id), type, notes, req.io
      )
      res.status(201).json({ success: true, data })
    } catch (error) {
      next(error) // pasa al errorHandler
    }
  }
)

// GET — obtener pendientes
router.get("/", async (req, res, next) => {
  try {
    const data = await requestService.getPending()
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
})

// PATCH — actualizar estado
router.patch("/:id",
  validate("statusUpdate", {
    validStatuses: ["pending", "assigned", "resolved", "cancelled"]
  }),
  async (req, res, next) => {
    try {
      const { id } = req.params
      const { status, waiter_id } = req.body
      const data = await requestService.updateStatus(
        Number(id), status, waiter_id, req.io
      )
      res.json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }
)

module.exports = router