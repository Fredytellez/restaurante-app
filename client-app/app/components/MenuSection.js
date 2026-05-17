"use client"

import { useState, useEffect } from "react"
import axios from "axios"

// La URL de tu backend local
/* const BACKEND_URL = "http://localhost:4000" */
// servidor en render 
const BACKEND_URL = "https://barlink-backend.onrender.com"|| "http://localhost:4000"

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
    <div className="menu-loading">Cargando menú...</div>
  )

  if (categories.length === 0) return (
    <div className="menu-loading">No hay items en el menú aún.</div>
  )

  return (
    <div>
      {categories.map(category => (
        <div key={category.category_id} className="menu-category">
          <h2 className="menu-category__title">{category.category_name}</h2>
          {category.items.map(item => (
            <div key={item.id} className="menu-item">
              <div className="flex-grow-1">
                <p className="menu-item__name">{item.name}</p>
                <p className="menu-item__description">{item.description}</p>
                <p className="menu-item__price">${Number(item.price).toLocaleString()}</p>
              </div>
              <button
                className="menu-item__add-btn"
                onClick={() => onAddToCart(item)}
              >+</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}