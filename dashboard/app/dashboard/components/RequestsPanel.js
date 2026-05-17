"use client"

import axios from "axios"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"

// Configuración visual de cada tipo de solicitud
const REQUEST_CONFIG = {
  waiter:   { label: "Mesero",   icon: "🔔", cls: "req-card--waiter"   },
  bill:     { label: "Cuenta",   icon: "🧾", cls: "req-card--bill"     },
  cleaning: { label: "Limpieza", icon: "🧹", cls: "req-card--cleaning" },
  other:    { label: "Otro",     icon: "📌", cls: "req-card--other"    },
}

// Configuración visual de cada estado
const STATUS_CONFIG = {
  pending:  { label: "Pendiente", cls: "req-badge--pending"  },
  assigned: { label: "Asignado",  cls: "req-badge--assigned" },
  resolved: { label: "Resuelto",  cls: "req-badge--resolved" },
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
      alert("Error al actualizar solicitud",error)
    }
  }

  // Separamos pendientes de resueltas
  const pending  = requests.filter(r => r.status !== "resolved")
  const resolved = requests.filter(r => r.status === "resolved")

  if (requests.length === 0) return (
    <div className="dash-empty">
      <div className="dash-empty__icon">🔔</div>
      <p className="dash-empty__title">Sin solicitudes por ahora</p>
      <p className="dash-empty__text">Las solicitudes aparecerán aquí en tiempo real</p>
    </div>
  )

  return (
    <div>
      {pending.length > 0 && (
        <div className="mb-4">
          <p className="dash-section-title">
            Pendientes <span>({pending.length})</span>
          </p>
          <div className="dash-grid">
            {pending.map(req => {
              const config = REQUEST_CONFIG[req.type] || REQUEST_CONFIG.other
              const status = STATUS_CONFIG[req.status]
              return (
                <div key={req.id} className={`req-card ${config.cls}`}>
                  <div className="req-card__header">
                    <div className="req-card__type">
                      <span className="req-card__icon">{config.icon}</span>
                      {config.label}
                    </div>
                    <span className={`req-badge ${status.cls}`}>{status.label}</span>
                  </div>
                  <p className="req-card__table">Mesa {req.table_id}</p>
                  <p className="req-card__time">
                    {new Date(req.created_at).toLocaleTimeString()}
                  </p>
                  <div className="req-card__actions">
                    {req.status === "pending" && (
                      <button className="req-btn req-btn--assign"
                        onClick={() => updateRequest(req.id, "assigned")}>
                        Asignar
                      </button>
                    )}
                    <button className="req-btn req-btn--resolve"
                      onClick={() => updateRequest(req.id, "resolved")}>
                      Resolver ✓
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {resolved.length > 0 && (
        <div>
          <p className="dash-section-title">
            Resueltas hoy <span>({resolved.length})</span>
          </p>
          <div className="dash-grid">
            {resolved.map(req => {
              const config = REQUEST_CONFIG[req.type] || REQUEST_CONFIG.other
              return (
                <div key={req.id} className="req-card--resolved-item">
                  <span style={{ fontSize: 20 }}>{config.icon}</span>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>
                      {config.label} — Mesa {req.table_id}
                    </p>
                    <p style={{ margin: 0, fontSize: 12, color: "var(--bl-muted)" }}>
                      {new Date(req.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <span className="req-resolved__check">✓</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}