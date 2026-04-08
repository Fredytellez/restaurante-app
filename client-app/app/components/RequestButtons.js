"use client"

import { useState } from "react"
import axios from "axios"

const BACKEND_URL = "http://localhost:4000"

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
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>
        ¿En qué te podemos ayudar?
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {REQUESTS.map(req => (
          <button
            key={req.type}
            onClick={() => sendRequest(req.type)}
            disabled={sent[req.type]}
            style={{
              padding: "18px 20px",
              background: sent[req.type] ? "#eee" : "white",
              border: `2px solid ${sent[req.type] ? "#ddd" : req.color}`,
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              color: sent[req.type] ? "#999" : req.color,
              cursor: sent[req.type] ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 12,
              transition: "all 0.2s"
            }}
          >
            <span style={{ fontSize: 24 }}>{req.icon}</span>
            {sent[req.type] ? "✓ Solicitud enviada" : req.label}
          </button>
        ))}
      </div>
    </div>
  )
}