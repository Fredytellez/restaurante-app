"use client"

import axios from "axios"
import { useState } from "react"

const BACKEND_URL = "http://localhost:4000"

export default function CartDrawer({ cart, setCart, tableId, onClose }) {

  const [sending, setSending] = useState(false)
  const [sent, setSent]       = useState(false)

  // Total del carrito
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)

  // Cambiar cantidad de un item
  const updateQty = (id, delta) => {
    setCart(prev => prev
      .map(i => i.id === id ? { ...i, quantity: i.quantity + delta } : i)
      .filter(i => i.quantity > 0) // elimina si llega a 0
    )
  }

  // Enviar el pedido al backend
  const sendOrder = async () => {
    setSending(true)
    try {
      await axios.post(`${BACKEND_URL}/api/orders`, {
        table_id: tableId,
        items: cart.map(i => ({
          menu_item_id: i.id,
          quantity:     i.quantity,
          notes:        ""
        }))
      })
      setSent(true)
      setCart([]) // vaciamos el carrito
    } catch (error) {
      alert("Error al enviar el pedido, intenta de nuevo")
      console.error(error)
    } finally {
      setSending(false)
    }
  }

  return (
    // Fondo oscuro detrás del carrito
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 200,
        display: "flex",
        alignItems: "flex-end"
      }}
    >
      {/* Panel del carrito */}
      <div
        onClick={e => e.stopPropagation()} // evita cerrar al tocar dentro
        style={{
          background: "white",
          width: "100%",
          maxHeight: "80vh",
          borderRadius: "20px 20px 0 0",
          padding: 24,
          overflowY: "auto"
        }}
      >
        <h2 style={{ margin: "0 0 20px", fontSize: 20 }}>Tu pedido</h2>

        {sent ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p style={{ fontSize: 48 }}>✅</p>
            <p style={{ fontWeight: 600, fontSize: 18 }}>
              ¡Pedido enviado!
            </p>
            <p style={{ color: "#888" }}>
              En breve lo estamos preparando
            </p>
            <button
              onClick={onClose}
              style={{
                marginTop: 16,
                background: "#e63946",
                color: "white",
                border: "none",
                borderRadius: 8,
                padding: "12px 32px",
                fontSize: 16,
                cursor: "pointer"
              }}
            >
              Cerrar
            </button>
          </div>
        ) : (
          <>
            {cart.map(item => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom: "1px solid #eee"
                }}
              >
                <span style={{ flex: 1, fontWeight: 500 }}>{item.name}</span>

                {/* Controles de cantidad */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button
                    onClick={() => updateQty(item.id, -1)}
                    style={{
                      width: 28, height: 28,
                      borderRadius: "50%",
                      border: "1px solid #ddd",
                      background: "white",
                      cursor: "pointer",
                      fontSize: 16
                    }}
                  >−</button>
                  <span style={{ minWidth: 20, textAlign: "center" }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQty(item.id, 1)}
                    style={{
                      width: 28, height: 28,
                      borderRadius: "50%",
                      border: "1px solid #ddd",
                      background: "white",
                      cursor: "pointer",
                      fontSize: 16
                    }}
                  >+</button>
                </div>

                <span style={{
                  minWidth: 70,
                  textAlign: "right",
                  fontWeight: 600,
                  color: "#e63946"
                }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            {/* Total y botón de enviar */}
            <div style={{ marginTop: 20 }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: 700,
                fontSize: 18,
                marginBottom: 16
              }}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button
                onClick={sendOrder}
                disabled={sending || cart.length === 0}
                style={{
                  width: "100%",
                  padding: 16,
                  background: cart.length === 0 ? "#ccc" : "#e63946",
                  color: "white",
                  border: "none",
                  borderRadius: 12,
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: cart.length === 0 ? "not-allowed" : "pointer"
                }}
              >
                {sending ? "Enviando..." : "Enviar pedido"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}