"use client"

import axios from "axios"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"

const STATUS_CONFIG = {
  pending:   { label: "Pendiente",  cls: "order-badge--pending",   btnColor: "#f4a261", next: "confirmed", nextLabel: "Confirmar"  },
  confirmed: { label: "Confirmado", cls: "order-badge--confirmed",  btnColor: "#457b9d", next: "preparing", nextLabel: "Preparando" },
  preparing: { label: "Preparando", cls: "order-badge--preparing",  btnColor: "#e9c46a", next: "ready",     nextLabel: "Listo ✓"   },
  ready:     { label: "Listo",      cls: "order-badge--ready",      btnColor: "#2a9d8f", next: "delivered", nextLabel: "Entregado"  },
  delivered: { label: "Entregado",  cls: "order-badge--delivered",  btnColor: null,      next: null,        nextLabel: null         },
}

export default function OrdersPanel({ orders, setOrders }) {

  const updateOrder = async (id, status) => {
    try {
      await axios.patch(`${BACKEND_URL}/api/orders/${id}`, { status })
      setOrders(prev =>
        prev.map(o => o.id === id ? { ...o, status } : o)
      )
    } catch (error) {
      alert("Error al actualizar orden", error)
    }
  }

  const active   = orders.filter(o => o.status !== "delivered")
  const delivered = orders.filter(o => o.status === "delivered")

  if (orders.length === 0) return (
     <div className="dash-empty">
      <div className="dash-empty__icon">🛒</div>
      <p className="dash-empty__title">Sin órdenes por ahora</p>
      <p className="dash-empty__text">Las órdenes de los clientes aparecerán aquí</p>
    </div>
  )

  return (
     <div>
      {active.length > 0 && (
        <div className="mb-4">
          <p className="dash-section-title">
            Órdenes activas <span>({active.length})</span>
          </p>
          <div className="dash-grid">
            {active.map(order => {
              const status = STATUS_CONFIG[order.status]
              return (
                <div key={order.id} className={`order-card order-card--${order.status}`}>
                  <div className="order-card__header">
                    <div>
                      <p className="order-card__table">Mesa {order.table_id}</p>
                      <p className="order-card__time">
                        {new Date(order.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <span className={`order-badge ${status.cls}`}>{status.label}</span>
                  </div>
                  <div className="order-items">
                    {order.items && order.items.map((item, i) => (
                      <div key={i} className="order-item">
                        <span>{item.quantity}x {item.name}</span>
                        <span className="order-item__price">
                          ${(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                    <div className="order-total">
                      <span>Total</span>
                      <span className="order-total__amount">
                        ${Number(order.total).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {status.next && (
                    <button
                      className="order-btn"
                      style={{ background: status.btnColor }}
                      onClick={() => updateOrder(order.id, status.next)}
                    >
                      {status.nextLabel} →
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {delivered.length > 0 && (
        <div>
          <p className="dash-section-title">
            Entregadas hoy <span>({delivered.length})</span>
          </p>
          <div className="dash-grid">
            {delivered.map(order => (
              <div key={order.id} className="order-card--done">
                <div>
                  <p style={{ margin: 0, fontWeight: 600 }}>Mesa {order.table_id}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "var(--bl-muted)" }}>
                    {new Date(order.created_at).toLocaleTimeString()}
                  </p>
                </div>
                <div style={{ textAlign: "right", marginLeft: "auto" }}>
                  <p style={{ margin: 0, fontWeight: 700, color: "var(--bl-purple)" }}>
                    ${Number(order.total).toLocaleString()}
                  </p>
                  <span style={{ fontSize: 12, color: "var(--bl-success)" }}>Entregado ✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}