"use client"

import { useState, useEffect } from "react"
import { io } from "socket.io-client"
import RequestsPanel from "./components/RequestsPanel"
import OrdersPanel from "./components/OrdersPanel"
import MusicPanel from "./components/MusicPanel"
import TablesPanel from "./components/TablesPanel"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"

export default function DashboardPage() {

  // Guardamos todas las solicitudes, órdenes y música
  const [requests, setRequests] = useState([])
  const [orders,   setOrders]   = useState([])
  const [music,    setMusic]    = useState([])

  // Tab activo del dashboard
  const [activeTab, setActiveTab] = useState("requests")
  const [connected, setConnected] = useState(false)

  // Contadores para los badges de notificación
  const pendingRequests = requests.filter(r => r.status === "pending").length
  const pendingOrders   = orders.filter(o => o.status === "pending").length
  const pendingMusic    = music.filter(m => m.status === "pending").length

  useEffect(() => {
    const socket = io(BACKEND_URL)

    socket.on("connect",    () => setConnected(true))
    socket.on("disconnect", () => setConnected(false))

    // El dashboard se une a su sala
    socket.emit("join-dashboard")

  
    socket.on("new-request",      data => setRequests(prev => [data, ...prev]))
    socket.on("request-updated",  data => setRequests(prev => prev.map(r => r.id === data.id ? data : r)))
    socket.on("new-order",        data => setOrders(prev => [data, ...prev]))
    socket.on("order-updated",    data => setOrders(prev => prev.map(o => o.id === data.id ? data : o)))
    socket.on("new-music-request",data => setMusic(prev => [data, ...prev]))

    return () => socket.disconnect()
  }, [])

  const tabs = [
    { key: "requests", label: "Solicitudes", count: pendingRequests, icon: "🔔" },
    { key: "orders",   label: "Órdenes",     count: pendingOrders,   icon: "🛒" },
    { key: "music",    label: "Música",       count: pendingMusic,    icon: "🎵" },
    { key: "tables",   label: "Mesas",        count: 0,               icon: "🪑" },
  ]


  return (
    <div>
      {/* Header */}
      <header className="dash-header">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="dash-header__brand">
              <span>Bar</span><span>Link</span>
            </h1>
            <p className="dash-header__subtitle">Dashboard en tiempo real</p>
          </div>
          <div className="dash-connection">
            <div className="dash-connection__dot"
              style={{ background: connected ? "#2ecc71" : "#e63946" }}
            />
            <span>{connected ? "Conectado" : "Desconectado"}</span>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="dash-nav">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`dash-nav__tab ${activeTab === tab.key ? "dash-nav__tab--active" : ""}`}
          >
            {tab.icon} {tab.label}
            {tab.count > 0 && (
              <span className="dash-nav__badge">{tab.count}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Contenido */}
      <main className="dash-main">
        {activeTab === "requests" && <RequestsPanel requests={requests} setRequests={setRequests} />}
        {activeTab === "orders"   && <OrdersPanel   orders={orders}     setOrders={setOrders}     />}
        {activeTab === "music"    && <MusicPanel     music={music}       setMusic={setMusic}       />}
        {activeTab === "tables"   && <TablesPanel />}
      </main>
    </div>
  )
}