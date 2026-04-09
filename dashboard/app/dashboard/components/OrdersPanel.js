"use client"

import axios from "axios"

const BACKEND_URL = "http://localhost:4000"

const STATUS_CONFIG = {
  pending:    { label: "Pendiente",   color: "#f4a261", next: "confirmed",  nextLabel: "Confirmar"   },
  confirmed:  { label: "Confirmado",  color: "#457b9d", next: "preparing",  nextLabel: "Preparando"  },
  preparing:  { label: "Preparando",  color: "#e9c46a", next: "ready",      nextLabel: "Listo"       },
  ready:      { label: "Listo",       color: "#2a9d8f", next: "delivered",  nextLabel: "Entregado"   },
  delivered:  { label: "Entregado",   color: "#888",    next: null,         nextLabel: null          },
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
    <div style={{ textAlign: "center", padding: "80px 20px", color: "#999" }}>
      <p style={{ fontSize: 48 }}>🛒</p>
      <p style={{ fontSize: 18, fontWeight: 600 }}>Sin órdenes por ahora</p>
      <p style={{ fontSize: 14 }}>Las órdenes de los clientes aparecerán aquí</p>
    </div>
  )

  return (
    <div>
      {active.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
            Órdenes activas ({active.length})
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 16
          }}>
            {active.map(order => {
              const status = STATUS_CONFIG[order.status]
              return (
                <div
                  key={order.id}
                  style={{
                    background: "white",
                    borderRadius: 12,
                    padding: 20,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    borderLeft: `4px solid ${status.color}`
                  }}
                >
                  {/* Encabezado */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 12
                  }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>
                        Mesa {order.table_id}
                      </p>
                      <p style={{ margin: 0, fontSize: 12, color: "#999" }}>
                        {new Date(order.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <span style={{
                      background: status.color + "22",
                      color: status.color,
                      padding: "4px 10px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      alignSelf: "flex-start"
                    }}>
                      {status.label}
                    </span>
                  </div>

                  {/* Items de la orden */}
                  <div style={{
                    background: "#f9f9f9",
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 16
                  }}>
                    {order.items && order.items.map((item, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: 14,
                          padding: "4px 0",
                          borderBottom: i < order.items.length - 1
                            ? "1px solid #eee" : "none"
                        }}
                      >
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span style={{ color: "#666" }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: 700,
                      marginTop: 8,
                      paddingTop: 8,
                      borderTop: "1px solid #ddd"
                    }}>
                      <span>Total</span>
                      <span>${Number(order.total).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Botón para avanzar estado */}
                  {status.next && (
                    <button
                      onClick={() => updateOrder(order.id, status.next)}
                      style={{
                        width: "100%",
                        padding: 10,
                        background: status.color,
                        color: "white",
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: 14
                      }}
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

      {/* Órdenes entregadas */}
      {delivered.length > 0 && (
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "#999" }}>
            Entregadas hoy ({delivered.length})
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 12
          }}>
            {delivered.map(order => (
              <div
                key={order.id}
                style={{
                  background: "white",
                  borderRadius: 12,
                  padding: 16,
                  opacity: 0.6,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <p style={{ margin: 0, fontWeight: 600 }}>
                    Mesa {order.table_id}
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: "#999" }}>
                    {new Date(order.created_at).toLocaleTimeString()}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: 0, fontWeight: 700 }}>
                    ${Number(order.total).toFixed(2)}
                  </p>
                  <span style={{ color: "#2a9d8f", fontSize: 12, fontWeight: 600 }}>
                    Entregado ✓
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}