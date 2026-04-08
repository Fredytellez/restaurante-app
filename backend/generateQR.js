const QRCode = require("qrcode")

const url = "http://localhost:3000/mesa/1"

QRCode.toFile("mesa1.png", url)