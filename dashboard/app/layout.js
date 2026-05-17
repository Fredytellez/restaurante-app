
import "./styles/globals.css"
import "./styles/dashboard.css"
import "./styles/requests.css"
import "./styles/orders.css"
import "./styles/music.css"
import "./styles/tables.css"

export const metadata = {
  title: "BarLink — Dashboard",
  description: "Panel de gestión en tiempo real",
}

export default function RootLayout({
  children,
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}