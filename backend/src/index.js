require("dotenv").config()

const express      = require("express")
const cors         = require("cors")
const http         = require("http")
const { Server }   = require("socket.io")

// Importamos las rutas
const requestsRouter     = require("./routes/requests")
const ordersRouter       = require("./routes/orders")
const menuRouter         = require("./routes/menu")
const musicRouter        = require("./routes/music")

// Importamos la configuración de sockets
const setupSockets = require("./sockets/index")

const app    = express()
const server = http.createServer(app)

// Configuramos Socket.io
const io = new Server(server, {
  cors: { origin: "*" }
})

// Middleware: permite que cualquier ruta acceda a 'io'
// sin tener que importarlo en cada archivo de rutas
app.use((req, res, next) => {
  req.io = io
  next()
})

app.use(cors())
app.use(express.json())

// Registramos las rutas con su prefijo
app.use("/api/requests", requestsRouter)
app.use("/api/orders",   ordersRouter)
app.use("/api/menu",     menuRouter)
app.use("/api/music",    musicRouter)

// Ruta de prueba para verificar que el servidor funciona
app.get("/", (req, res) => {
  res.json({ message: "Servidor restaurante funcionando" })
})

const tablesRouter = require("./routes/tables")
app.use("/api/tables", tablesRouter)

// Inicializamos los sockets
setupSockets(io)

const PORT = process.env.PORT || 4000
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})