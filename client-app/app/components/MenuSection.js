"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const BACKEND_URL = "http://localhost:4000"

// Por ahora usamos restaurant_id = 1
// Más adelante esto vendrá del QR
const RESTAURANT_ID = 1

export default function MenuSection({ onAddToCart }) {

  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/menu/${RESTAURANT_ID}`)
      .then(res => {
        setCategories(res.data.data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error cargando menú:", err)
        setLoading(false)
      })
  }, [])

  if (loading) return (
    <div style={{ textAlign: "center", padding: 40, color: "#999" }}>
      Cargando menú...
    </div>
  )

  if (categories.length === 0) return (
    <div style={{ textAlign: "center", padding: 40, color: "#999" }}>
      No hay items en el menú aún.
    </div>
  )

  return (
    <div>
      {categories.map(category => (
        <div key={category.category_id} style={{ marginBottom: 32 }}>

          {/* Nombre de la categoría */}
          <h2 style={{
            fontSize: 18,
            fontWeight: 700,
            margin: "0 0 16px",
            padding: "8px 0",
            borderBottom: "2px solid #e63946",
            color: "#1a1a1a"
          }}>
            {category.category_name}
          </h2>

          {/* Productos de la categoría */}
          {category.items.map(item => (
            <div
              key={item.id}
              style={{
                background: "white",
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
              }}
            >
              <div style={{ flex: 1 }}>
                <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: 15 }}>
                  {item.name}
                </p>
                <p style={{ margin: "0 0 8px", color: "#888", fontSize: 13 }}>
                  {item.description}
                </p>
                <p style={{ margin: 0, fontWeight: 700, color: "#e63946" }}>
                  ${Number(item.price).toFixed(2)}
                </p>
              </div>

              <button
                onClick={() => onAddToCart(item)}
                style={{
                  background: "#e63946",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  width: 36,
                  height: 36,
                  fontSize: 22,
                  cursor: "pointer",
                  marginLeft: 12,
                  flexShrink: 0
                }}
              >
                +
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}