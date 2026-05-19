"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const BACKEND_URL   = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
const RESTAURANT_ID = 1

// Emojis por categoría
const CATEGORY_EMOJIS = {
  "🍹 Cócteles":               "🍸",
  "🍺 Cervezas":               "🍺",
  "🥃 Licores":                "🥃",
  "🍾 Botellas Premium":       "🍾",
  "🔥 Combos Promocionales":   "🔥",
  "🎧 Recomendaciones del DJ": "🎵",
  "🎟️ Entradas a Eventos":     "🎟️",
}

// Badges por producto
const BADGES = {
  "Mojito":        { label: "Popular", cls: "menu-badge--hot"  },
  "Aperol Spritz": { label: "Popular", cls: "menu-badge--hot"  },
  "Blue Lagoon":   { label: "Nuevo",   cls: "menu-badge--new"  },
  "IPA Artesanal": { label: "Artesanal",cls: "menu-badge--new" },
  "Combo VIP":     { label: "VIP",     cls: "menu-badge--vip"  },
  "Combo Noche":   { label: "2x1",     cls: "menu-badge--hot"  },
  "Olmeca Tequila":{ label: "Popular", cls: "menu-badge--hot"  },
  "Solicitar canción": { label: "Gratis", cls: "menu-badge--free" },
  "Dedicatoria":       { label: "Gratis", cls: "menu-badge--free" },
}

export default function MenuSection({ onAddToCart }) {

  const [categories,   setCategories]   = useState([])
  const [activeFilter, setActiveFilter] = useState(null)
  const [loading,      setLoading]      = useState(true)

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/menu/${RESTAURANT_ID}`)
      .then(res => {
        setCategories(res.data.data)
        if (res.data.data.length > 0) {
          setActiveFilter(res.data.data[0].category_name)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="menu-loading">Cargando carta...</div>
  )

  if (categories.length === 0) return (
    <div className="menu-loading">No hay productos disponibles.</div>
  )

  // Categoría activa
  const activeCategory = categories.find(
    c => c.category_name === activeFilter
  )

  return (
    <div>
      {/* Filtros de categoría */}
      <div className="menu-filters">
        {categories.map(cat => (
          <button
            key={cat.category_id}
            className={`menu-filter-btn ${activeFilter === cat.category_name
              ? "menu-filter-btn--active" : ""}`}
            onClick={() => setActiveFilter(cat.category_name)}
          >
            {cat.category_name}
          </button>
        ))}
      </div>

      {/* Grid de productos de la categoría activa */}
      {activeCategory && (
        <div>
          <h2 className="menu-category__title">
            {activeCategory.category_name}
          </h2>
          <div className="menu-grid">
            {activeCategory.items.map(item => {
              const badge  = BADGES[item.name]
              const emoji  = CATEGORY_EMOJIS[activeCategory.category_name] || "🍹"
              const isFree = item.price === 0

              return (
                <div key={item.id} className="menu-card">
                  {/* Badge */}
                  {badge && (
                    <span className={`menu-badge ${badge.cls}`}>
                      {badge.label}
                    </span>
                  )}

                  {/* Emoji */}
                  <div className="menu-card__emoji">{emoji}</div>

                  {/* Info */}
                  <p className="menu-card__name">{item.name}</p>
                  <p className="menu-card__desc">{item.description}</p>

                  {/* Footer */}
                  <div className="menu-card__footer">
                    <span className="menu-card__price">
                      {isFree ? "Gratis" : `$${Number(item.price).toLocaleString()}`}
                    </span>
                    <button
                      className="menu-card__add-btn"
                      onClick={() => onAddToCart(item)}
                    >
                      +
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}