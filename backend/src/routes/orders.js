const express      = require("express")
const router       = express.Router()
const orderService = require("../services/orderService")
const { validate } = require("../middlewares/validate")

router.post("/",
  validate("order"),
  async (req, res, next) => {
    try {
      const { table_id, items } = req.body
      const data = await orderService.create(Number(table_id), items, req.io)
      res.status(201).json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }
)

router.get("/", async (req, res, next) => {
  try {
    const data = await orderService.getActive()
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
})

router.patch("/:id",
  validate("statusUpdate", {
    validStatuses: ["pending","confirmed","preparing","ready","delivered","cancelled"]
  }),
  async (req, res, next) => {
    try {
      const { id } = req.params
      const { status } = req.body
      const data = await orderService.updateStatus(Number(id), status, req.io)
      res.json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }
)

module.exports = router