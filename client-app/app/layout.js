import './styles/globals.css'
import './styles/mesa.css'
import './styles/menu.css'
import './styles/cart.css'
import './styles/requests.css'
import './styles/music.css'

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}