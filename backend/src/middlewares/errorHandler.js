// Códigos HTTP más comunes y su significado
// 400 → datos inválidos enviados por el cliente
// 401 → no autenticado
// 403 → no tiene permisos
// 404 → recurso no encontrado
// 409 → conflicto (ej: registro duplicado)
// 500 → error interno del servidor

// Clase base para errores personalizados
// Nos permite crear errores con código HTTP específico
class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true // errores que nosotros controlamos
  }
}

// Middleware de manejo de errores
// Express lo reconoce porque tiene 4 parámetros (err, req, res, next)
const errorHandler = (err, req, res, next) => {

  // Si el error no tiene statusCode, es un error inesperado del servidor
  let statusCode = err.statusCode || 500
  let message    = err.message    || "Error interno del servidor"

  // Errores específicos de PostgreSQL
  if (err.code === "23505") {
    // Violación de UNIQUE (registro duplicado)
    statusCode = 409
    message    = "Ya existe un registro con esos datos"
  }

  if (err.code === "23503") {
    // Violación de llave foránea
    statusCode = 400
    message    = "El recurso relacionado no existe"
  }

  if (err.code === "23502") {
    // Campo NOT NULL vacío
    statusCode = 400
    message    = `El campo '${err.column}' es obligatorio`
  }

  if (err.code === "22P02") {
    // Tipo de dato inválido (ej: texto donde va número)
    statusCode = 400
    message    = "Tipo de dato inválido en la solicitud"
  }

  // Log del error en la terminal del servidor
  // En producción esto se guardaría en un archivo de logs
  if (statusCode === 500) {
    console.error("❌ ERROR INESPERADO:")
    console.error("   Ruta:   ", req.method, req.originalUrl)
    console.error("   Mensaje:", err.message)
    console.error("   Stack:  ", err.stack)
  } else {
    console.warn(`⚠️  Error ${statusCode}: ${message} [${req.method} ${req.originalUrl}]`)
  }

  // Respuesta al cliente
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
      // Solo mostramos el stack en desarrollo, nunca en producción
      ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    }
  })
}

module.exports = { errorHandler, AppError }