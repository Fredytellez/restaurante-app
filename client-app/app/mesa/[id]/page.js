"use client"

import { useState, useEffect } from "react"
import { io } from "socket.io-client"
import { useParams } from "next/navigation"
import MenuSection from "../../components/MenuSection"
import CartDrawer from "../../components/CartDrawer"
import RequestButtons from "../../components/RequestButtons"
import MusicRequest from "../../components/MusicRequest"

// La URL de tu backend
const BACKEND_URL = "http://localhost:4000"

export default function MesaPage({ params }) {

  const {id: tableId} = useParams(params)

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
    <div style={{ minHeight: "100vh", background: "#f9f9f9" }}>

      {/* Encabezado */}
      <header style={{
        background: "#1a1a1a",
        color: "white",
        padding: "16px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <div>
          <p style={{ margin: 0, fontSize: 12, opacity: 0.6 }}>Bienvenido a</p>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
            Mi Restaurante
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{
            background: "#333",
            padding: "4px 12px",
            borderRadius: 20,
            fontSize: 14
          }}>
            Mesa {tableId}
          </span>
          {/* Botón del carrito con badge */}
          <button
            onClick={() => setCartOpen(true)}
            style={{
              background: "#e63946",
              border: "none",
              borderRadius: 20,
              padding: "8px 16px",
              color: "white",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 14
            }}
          >
            🛒 {cartCount > 0 ? cartCount : ""}
          </button>
        </div>
      </header>

      {/* Tabs de navegación */}
      <nav style={{
        display: "flex",
        background: "white",
        borderBottom: "1px solid #eee",
        position: "sticky",
        top: 60,
        zIndex: 99
      }}>
        {[
          { key: "menu",     label: "🍽️ Menú"      },
          { key: "requests", label: "🔔 Solicitudes" },
          { key: "music",    label: "🎵 Música"     },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1,
              padding: "14px 8px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: activeTab === tab.key ? 600 : 400,
              color: activeTab === tab.key ? "#e63946" : "#666",
              borderBottom: activeTab === tab.key
                ? "2px solid #e63946"
                : "2px solid transparent"
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Contenido según el tab activo */}
      <main style={{ padding: "16px", maxWidth: 600, margin: "0 auto" }}>
        {activeTab === "menu" && (
          <MenuSection
            tableId={tableId}
            onAddToCart={addToCart}
          />
        )}
        {activeTab === "requests" && (
          <RequestButtons tableId={tableId} />
        )}
        {activeTab === "music" && (
          <MusicRequest tableId={tableId} />
        )}
      </main>

      {/* Carrito (se desliza desde abajo) */}
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