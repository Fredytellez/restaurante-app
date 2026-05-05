const { AppError } = require("./errorHandler")

// Validaciones reutilizables para cada entidad
const validators = {

  request: (body) => {
    const { table_id, type } = body
    const validTypes = ["waiter", "bill", "cleaning", "other"]

    if (!table_id)
      throw new AppError("El campo 'table_id' es obligatorio", 400)

    if (isNaN(Number(table_id)))
      throw new AppError("El campo 'table_id' debe ser un número", 400)

    if (!type)
      throw new AppError("El campo 'type' es obligatorio", 400)

    if (!validTypes.includes(type))
      throw new AppError(
        `El tipo '${type}' no es válido. Valores permitidos: ${validTypes.join(", ")}`,
        400
      )
  },

  order: (body) => {
    const { table_id, items } = body

    if (!table_id)
      throw new AppError("El campo 'table_id' es obligatorio", 400)

    if (isNaN(Number(table_id)))
      throw new AppError("El campo 'table_id' debe ser un número", 400)

    if (!items || !Array.isArray(items))
      throw new AppError("El campo 'items' debe ser un arreglo", 400)

    if (items.length === 0)
      throw new AppError("El pedido debe tener al menos un ítem", 400)

    items.forEach((item, index) => {
      if (!item.menu_item_id)
        throw new AppError(`El ítem ${index + 1} no tiene 'menu_item_id'`, 400)

      if (!item.quantity || item.quantity < 1)
        throw new AppError(`El ítem ${index + 1} debe tener cantidad mayor a 0`, 400)
    })
  },

  music: (body) => {
    const { table_id, song_name } = body

    if (!table_id)
      throw new AppError("El campo 'table_id' es obligatorio", 400)

    if (!song_name || song_name.trim() === "")
      throw new AppError("El campo 'song_name' es obligatorio", 400)

    if (song_name.length > 150)
      throw new AppError("El nombre de la canción no puede superar 150 caracteres", 400)
  },

  statusUpdate: (body, validStatuses) => {
    const { status } = body

    if (!status)
      throw new AppError("El campo 'status' es obligatorio", 400)

    if (!validStatuses.includes(status))
      throw new AppError(
        `El estado '${status}' no es válido. Valores permitidos: ${validStatuses.join(", ")}`,
        400
      )
  }
}

// Middleware factory: recibe el nombre del validador y lo ejecuta
// Uso: router.post("/", validate("request"), handler)
const validate = (type, options = {}) => {
  return (req, res, next) => {
    try {
      validators[type](req.body, options.validStatuses)
      next() // si no lanza error, continúa al siguiente middleware
    } catch (error) {
      next(error) // pasa el error al errorHandler
    }
  }
}

module.exports = { validate }