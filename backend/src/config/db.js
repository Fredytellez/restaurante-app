// Importamos la librería 'pg' que instalamos antes
// 'Pool' es un manejador de conexiones, permite múltiples
// consultas al mismo tiempo sin abrir y cerrar la BD cada vez
const { Pool } = require("pg")

// Cargamos las variables del archivo .env
require("dotenv").config()

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})

// Probamos la conexión al iniciar
pool.connect((err, client, release) => {
  if (err) {
    console.error("Error conectando a PostgreSQL:", err.message)
  } else {
    console.log("Conectado a PostgreSQL correctamente")
    release()
  }
})

// Exportamos 'pool' para usarlo en otros archivos
module.exports = pool