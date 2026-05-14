"use client"

import axios from "axios"
import { useState } from "react"

// La URL de tu backend local
/* const BACKEND_URL = "http://localhost:4000" */
// servidor en render 
const BACKEND_URL = "https://barlink-backend.onrender.com" || "http://localhost:4000"

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
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-panel" onClick={e => e.stopPropagation()}>

        {sent ? (
          <div className="cart-success">
            <div className="cart-success__icon">✅</div>
            <p className="cart-success__title">¡Pedido enviado!</p>
            <p className="cart-success__text">En breve lo estamos preparando</p>
            <button className="cart-success__btn" onClick={onClose}>Cerrar</button>
          </div>
        ) : (
          <>
            <h2 className="cart-panel__title">Tu pedido</h2>

            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <span className="cart-item__name">{item.name}</span>
                <div className="cart-item__controls">
                  <button className="cart-item__qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                  <span className="cart-item__qty">{item.quantity}</span>
                  <button className="cart-item__qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
                </div>
                <span className="cart-item__price">
                  ${(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}

            <div className="cart-total">
              <span>Total</span>
              <span className="cart-total__amount">${total.toLocaleString()}</span>
            </div>

            <button
              className="cart-submit-btn"
              onClick={sendOrder}
              disabled={sending || cart.length === 0}
            >
              {sending ? "Enviando..." : "Enviar pedido"}
            </button>
          </>
        )}
      </div>
    </div>
  )
}