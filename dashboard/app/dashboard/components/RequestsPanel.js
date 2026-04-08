"use client"

import axios from "axios"

const BACKEND_URL = "http://localhost:4000"

// Configuración visual de cada tipo de solicitud
const REQUEST_CONFIG = {
  waiter:   { label: "Mesero",  icon: "🔔", color: "#e63946" },
  bill:     { label: "Cuenta",  icon: "🧾", color: "#2a9d8f" },
  cleaning: { label: "Limpieza",icon: "🧹", color: "#457b9d" },
  other:    { label: "Otro",    icon: "📌", color: "#888"    },
}

// Configuración visual de cada estado
const STATUS_CONFIG = {
  pending:  { label: "Pendiente", color: "#f4a261" },
  assigned: { label: "Asignado",  color: "#457b9d" },
  resolved: { label: "Resuelto",  color: "#2a9d8f" },
}

export default function RequestsPanel({ requests, setRequests }) {

  // Cambiar el estado de una solicitud
  const updateRequest = async (id, status) => {
    try {
      await axios.patch(`${BACKEND_URL}/api/requests/${id}`, { status })
      setRequests(prev =>
        prev.map(r => r.id === id ? { ...r, status } : r)
      )
    } catch (error) {
      alert("Error al actualizar solicitud")
    }
  }

  // Separamos pendientes de resueltas
  const pending  = requests.filter(r => r.status !== "resolved")
  const resolved = requests.filter(r => r.status === "resolved")

  if (requests.length === 0) return (
    <div style={{
      textAlign: "center",
      padding: "80px 20px",
      color: "#999"
    }}>
      <p style={{ fontSize: 48 }}>🔔</p>
      <p style={{ fontSize: 18, fontWeight: 600 }}>
        Sin solicitudes por ahora
      </p>
      <p style={{ fontSize: 14 }}>
        Aquí aparecerán las solicitudes de los clientes en tiempo real
      </p>
    </div>
  )

  return (
    <div>
      {/* Solicitudes pendientes */}
      {pending.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "#333" }}>
            Pendientes ({pending.length})
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16
          }}>
            {pending.map(req => {
              const config = REQUEST_CONFIG[req.type] || REQUEST_CONFIG.other
              const status = STATUS_CONFIG[req.status]
              return (
                <div
                  key={req.id}
                  style={{
                    background: "white",
                    borderRadius: 12,
                    padding: 20,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    borderLeft: `4px solid ${config.color}`
                  }}
                >
                  {/* Encabezado de la tarjeta */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 24 }}>{config.icon}</span>
                      <span style={{ fontWeight: 700, fontSize: 16 }}>
                        {config.label}
                      </span>
                    </div>
                    {/* Badge de estado */}
                    <span style={{
                      background: status.color + "22",
                      color: status.color,
                      padding: "4px 10px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600
                    }}>
                      {status.label}
                    </span>
                  </div>

                  {/* Info de la mesa */}
                  <p style={{ margin: "0 0 4px", color: "#333", fontWeight: 600 }}>
                    Mesa {req.table_id}
                  </p>
                  <p style={{ margin: "0 0 16px", color: "#999", fontSize: 13 }}>
                    {new Date(req.created_at).toLocaleTimeString()}
                  </p>

                  {/* Botones de acción */}
                  <div style={{ display: "flex", gap: 8 }}>
                    {req.status === "pending" && (
                      <button
                        onClick={() => updateRequest(req.id, "assigned")}
                        style={{
                          flex: 1,
                          padding: "8px 0",
                          background: "#457b9d",
                          color: "white",
                          border: "none",
                          borderRadius: 8,
                          cursor: "pointer",
                          fontWeight: 600,
                          fontSize: 13
                        }}
                      >
                        Asignar
                      </button>
                    )}
                    <button
                      onClick={() => updateRequest(req.id, "resolved")}
                      style={{
                        flex: 1,
                        padding: "8px 0",
                        background: "#2a9d8f",
                        color: "white",
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: 13
                      }}
                    >
                      Resolver ✓
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Solicitudes resueltas */}
      {resolved.length > 0 && (
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "#999" }}>
            Resueltas hoy ({resolved.length})
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 12
          }}>
            {resolved.map(req => {
              const config = REQUEST_CONFIG[req.type] || REQUEST_CONFIG.other
              return (
                <div
                  key={req.id}
                  style={{
                    background: "white",
                    borderRadius: 12,
                    padding: 16,
                    opacity: 0.6,
                    display: "flex",
                    alignItems: "center",
                    gap: 12
                  }}
                >
                  <span style={{ fontSize: 20 }}>{config.icon}</span>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>
                      {config.label} — Mesa {req.table_id}
                    </p>
                    <p style={{ margin: 0, fontSize: 12, color: "#999" }}>
                      {new Date(req.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <span style={{ marginLeft: "auto", color: "#2a9d8f", fontWeight: 700 }}>✓</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}