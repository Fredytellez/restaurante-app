// Esta función recibe el objeto 'io' de Socket.io
// y registra todos los eventos posibles
const setupSockets = (io) => {

  io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id)

    // El cliente se une a una "sala" por número de mesa
    // Así los mensajes llegan solo a quien corresponde
    socket.on("join-table", (tableId) => {
      socket.join(`table-${tableId}`)
      console.log(`Socket ${socket.id} unido a mesa ${tableId}`)
    })

    // El dashboard del restaurante se une a su propia sala
    socket.on("join-dashboard", () => {
      socket.join("dashboard")
      console.log("Dashboard conectado")
    })

    socket.on("disconnect", () => {
      console.log("Cliente desconectado:", socket.id)
    })
  })

}

module.exports = setupSockets