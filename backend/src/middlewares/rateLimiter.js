const rateLimit = require("express-rate-limit")

// Límite general para todas las rutas
// máximo 100 peticiones por IP cada 15 minutos
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos en milisegundos
  max: 100,
  message: {
    success: false,
    error: {
      message: "Demasiadas peticiones, intenta de nuevo en 15 minutos",
      statusCode: 429
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Límite estricto para solicitudes de mesero
// evita que un cliente presione el botón muchas veces
const requestLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 5, // máximo 5 solicitudes por minuto por IP
  message: {
    success: false,
    error: {
      message: "Demasiadas solicitudes, espera un momento",
      statusCode: 429
    }
  }
})

module.exports = { generalLimiter, requestLimiter }