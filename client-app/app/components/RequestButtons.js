"use client"

import { useState } from "react"
import axios from "axios"

// La URL de tu backend local
/* const BACKEND_URL = "http://localhost:4000" */
// servidor en render 
const BACKEND_URL = "https://barlink-backend.onrender.com" || "http://localhost:4000"

const REQUESTS = [
  { type: "waiter",   label: "Llamar mesero",  icon: "🔔", color: "#e63946" },
  { type: "bill",     label: "Pedir la cuenta", icon: "🧾", color: "#2a9d8f" },
  { type: "cleaning", label: "Limpiar mesa",    icon: "🧹", color: "#457b9d" },
]

export default function RequestButtons({ tableId }) {

  // Guarda qué solicitudes ya fueron enviadas
  const [sent, setSent] = useState({})

  const sendRequest = async (type) => {
    console.log("tableId:", tableId)
    console.log("type:", type)
    try {
      await axios.post(`${BACKEND_URL}/api/requests`, {
        table_id: Number(tableId),
        type
      })
      // Marcamos como enviada y reseteamos después de 5 segundos
      setSent(prev => ({ ...prev, [type]: true }))
      setTimeout(() => {
        setSent(prev => ({ ...prev, [type]: false }))
      }, 5000)
    } catch (error) {
      alert("Error al enviar solicitud")
      console.error(error)
    }
  }

  return (
    <div>
      <h2 className="requests-title">¿En qué te podemos ayudar?</h2>
      {REQUESTS.map(req => (
        <button
          key={req.type}
          className="request-btn"
          onClick={() => sendRequest(req.type)}
          disabled={sent[req.type]}
          style={{ borderColor: sent[req.type] ? "var(--bl-border)" : req.color }}
        >
          <span className="request-btn__icon">{req.icon}</span>
          {sent[req.type] ? "Solicitud enviada" : req.label}
          {sent[req.type] && <span className="request-btn__sent">✓ En camino</span>}
        </button>
      ))}
    </div>
  )
}