"use client"

import { useState, useEffect } from "react"
import { io } from "socket.io-client"
import { useParams } from "next/navigation"
import MenuSection from "../../components/MenuSection"
import CartDrawer from "../../components/CartDrawer"
import RequestButtons from "../../components/RequestButtons"
import MusicRequest from "../../components/MusicRequest"

// La URL de tu backend local
/* const BACKEND_URL = "http://localhost:4000" */
// servidor en render 
const BACKEND_URL = "https://barlink-backend.onrender.com" || "http://localhost:4000"

export default function MesaPage() {

  const {id: tableId} = useParams()

  // Estado del carrito: lista de productos seleccionados
  const [cart, setCart] = useState([])

  // Controla si el carrito está abierto o cerrado
  const [cartOpen, setCartOpen] = useState(false)

  // Controla qué sección está activa (menu, music, requests)
  const [activeTab, setActiveTab] = useState("menu")

  // Conexión al socket para tiempo real
  useEffect(() => {
    const socket = io(BACKEND_URL)

    // Le avisamos al servidor a qué mesa pertenece este cliente
    socket.emit("join-table", tableId)

    return () => socket.disconnect()
  }, [tableId])

  // Función para agregar un producto al carrito
  const addToCart = (item) => {
    setCart(prev => {
      // Si el producto ya está, aumentamos la cantidad
      const exists = prev.find(i => i.id === item.id)
      if (exists) {
        return prev.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      // Si no está, lo agregamos con cantidad 1
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  // Cantidad total de items en el carrito (para el badge)
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <div>
      <header className="mesa-header">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <p className="mesa-header__subtitle">Bienvenido a</p>
            <h1 className="mesa-header__brand">
              <span>Bar</span><span>Link</span>
            </h1>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="mesa-header__badge">Mesa {tableId}</span>
            <button
              className="mesa-header__cart-btn"
              onClick={() => setCartOpen(true)}
            >
              🛒 {cartCount > 0 ? cartCount : ""}
            </button>
          </div>
        </div>
      </header>

      <nav className="mesa-nav">
        {[
          { key: "menu",     label: "🍽️ Menú"       },
          { key: "requests", label: "🔔 Solicitudes" },
          { key: "music",    label: "🎵 Música"      },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`mesa-nav__tab ${activeTab === tab.key ? "mesa-nav__tab--active" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="mesa-main">
        {activeTab === "menu"     && <MenuSection    tableId={tableId} onAddToCart={addToCart} />}
        {activeTab === "requests" && <RequestButtons tableId={tableId} />}
        {activeTab === "music"    && <MusicRequest   tableId={tableId} />}
      </main>

      {cartOpen && (
        <CartDrawer
          cart={cart}
          setCart={setCart}
          tableId={tableId}
          onClose={() => setCartOpen(false)}
        />
      )}
    </div>
  )
}