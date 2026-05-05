require("dotenv").config()

const express    = require("express")
const cors       = require("cors")
const http       = require("http")
const helmet     = require("helmet")
const morgan     = require("morgan")
const { Server } = require("socket.io")

const { errorHandler } = require("./middlewares/errorHandler")
const { generalLimiter } = require("./middlewares/rateLimiter")

const requestsRouter = require("./routes/requests")
const ordersRouter   = require("./routes/orders")
const menuRouter     = require("./routes/menu")
const musicRouter    = require("./routes/music")
const tablesRouter   = require("./routes/tables")
const setupSockets   = require("./sockets/index")

/* console.log("requestsRouter:", typeof requestsRouter)
console.log("ordersRouter:",   typeof ordersRouter)
console.log("menuRouter:",     typeof menuRouter)
console.log("musicRouter:",    typeof musicRouter)
console.log("tablesRouter:",   typeof tablesRouter) */

const app    = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: { origin: "*" }
})

// ── Middlewares globales ──────────────────────────
// helmet agrega headers de seguridad automáticamente
app.use(helmet())

// morgan registra cada petición en la terminal
// "dev" muestra: método, ruta, status, tiempo
app.use(morgan("dev"))

app.use(cors())
app.use(express.json())

// Límite general de peticiones
app.use(generalLimiter)

// Inyectamos io en cada request
app.use((req, res, next) => {
  req.io = io
  next()
})

// ── Rutas ─────────────────────────────────────────
app.use("/api/requests",    requestsRouter)
app.use("/api/orders",      ordersRouter)
app.use("/api/menu",        menuRouter)
app.use("/api/music",       musicRouter)
app.use("/api/tables",      tablesRouter)

// Ruta de salud del servidor
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Servidor funcionando correctamente",
    timestamp: new Date().toISOString()
  })
})

// Ruta no encontrada (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Ruta '${req.originalUrl}' no encontrada`,
      statusCode: 404
    }
  })
})

// ── Manejador global de errores ───────────────────
// IMPORTANTE: debe ir siempre al final
app.use(errorHandler)

setupSockets(io)

const PORT = process.env.NODE_ENV || 4000
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || "development"}`)
})