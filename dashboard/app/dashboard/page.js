"use client"

import { useState, useEffect } from "react"
import { io } from "socket.io-client"
import RequestsPanel from "./components/RequestsPanel"
import OrdersPanel from "./components/OrdersPanel"
import MusicPanel from "./components/MusicPanel"
import TablesPanel from "./components/TablesPanel"

const BACKEND_URL = "http://localhost:4000"

export default function DashboardPage() {

  // Guardamos todas las solicitudes, órdenes y música
  const [requests, setRequests] = useState([])
  const [orders,   setOrders]   = useState([])
  const [music,    setMusic]    = useState([])

  // Tab activo del dashboard
  const [activeTab, setActiveTab] = useState("requests")

  // Contadores para los badges de notificación
  const pendingRequests = requests.filter(r => r.status === "pending").length
  const pendingOrders   = orders.filter(o => o.status === "pending").length
  const pendingMusic    = music.filter(m => m.status === "pending").length

  useEffect(() => {
    const socket = io(BACKEND_URL)

    // El dashboard se une a su sala
    socket.emit("join-dashboard")

    // Escuchamos eventos en tiempo real
    // Cuando llega una nueva solicitud la agregamos al estado
    socket.on("new-request", (data) => {
      setRequests(prev => [data, ...prev])
    })

    // Cuando se actualiza una solicitud la reemplazamos
    socket.on("request-updated", (data) => {
      setRequests(prev =>
        prev.map(r => r.id === data.id ? data : r)
      )
    })

    // Nuevas órdenes
    socket.on("new-order", (data) => {
      setOrders(prev => [data, ...prev])
    })

    // Órdenes actualizadas
    socket.on("order-updated", (data) => {
      setOrders(prev =>
        prev.map(o => o.id === data.id ? data : o)
      )
    })

    // Solicitudes de música
    socket.on("new-music-request", (data) => {
      setMusic(prev => [data, ...prev])
    })

    return () => socket.disconnect()
  }, [])

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5" }}>

      {/* Encabezado */}
      <header style={{
        background: "#1a1a1a",
        color: "white",
        padding: "16px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
            🍽️ Panel del Restaurante
          </h1>
          <p style={{ margin: 0, fontSize: 13, opacity: 0.5 }}>
            Dashboard en tiempo real
          </p>
        </div>

        {/* Indicador de conexión */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "#2a2a2a",
          padding: "8px 16px",
          borderRadius: 20
        }}>
          <div style={{
            width: 8, height: 8,
            borderRadius: "50%",
            background: "#2ecc71"
          }}/>
          <span style={{ fontSize: 13 }}>Conectado</span>
        </div>
      </header>

      {/* Tabs de navegación */}
      <nav style={{
        background: "white",
        borderBottom: "1px solid #e0e0e0",
        display: "flex",
        paddingLeft: 24,
        gap: 4
      }}>
        {[
          { key: "requests", label: "Solicitudes", count: pendingRequests, icon: "🔔" },
          { key: "orders",   label: "Órdenes",     count: pendingOrders,   icon: "🛒" },
          { key: "music",    label: "Música",       count: pendingMusic,    icon: "🎵" },
          { key: "tables",   label: "Mesas",        count: 0,               icon: "🪑" },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "14px 20px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: activeTab === tab.key ? 600 : 400,
              color: activeTab === tab.key ? "#e63946" : "#666",
              borderBottom: activeTab === tab.key
                ? "2px solid #e63946"
                : "2px solid transparent",
              display: "flex",
              alignItems: "center",
              gap: 8
            }}
          >
            {tab.icon} {tab.label}
            {/* Badge con contador */}
            {tab.count > 0 && (
              <span style={{
                background: "#e63946",
                color: "white",
                borderRadius: 20,
                padding: "2px 8px",
                fontSize: 12,
                fontWeight: 700
              }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Contenido */}
      <main style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
        {activeTab === "requests" && (
          <RequestsPanel
            requests={requests}
            setRequests={setRequests}
          />
        )}
        {activeTab === "orders" && (
          <OrdersPanel
            orders={orders}
            setOrders={setOrders}
          />
        )}
        {activeTab === "music" && (
          <MusicPanel
            music={music}
            setMusic={setMusic}
          />
        )}
        {activeTab === "tables" && (
          <TablesPanel />
        )}
      </main>

    </div>
  )
}