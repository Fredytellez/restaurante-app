"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"

const STATUS_CONFIG = {
  available: { label: "Disponible", cls: "table-badge--available" },
  occupied:  { label: "Ocupada",    cls: "table-badge--occupied"  },
  reserved:  { label: "Reservada",  cls: "table-badge--reserved"  },
  cleaning:  { label: "Limpieza",   cls: "table-badge--cleaning"  },
}

export default function TablesPanel() {

  const [tables,  setTables]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/tables`)
      .then(res => {
        setTables(res.data.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${BACKEND_URL}/api/tables/${id}`, { status })
      setTables(prev =>
        prev.map(t => t.id === id ? { ...t, status } : t)
      )
    } catch (error) {
      alert("Error al actualizar mesa", error)
    }
  }

  if (loading) return (
    <div className="dash-empty">
      <p className="dash-empty__text">Cargando mesas...</p>
    </div>
  )

  if (tables.length === 0) return (
    <div className="dash-empty">
      <div className="dash-empty__icon">🪑</div>
      <p className="dash-empty__title">No hay mesas registradas</p>
    </div>
  )

  return (
    <div>
      <p className="dash-section-title">Estado de mesas</p>
      <div className="tables-grid">
        {tables.map(table => {
          const status = STATUS_CONFIG[table.status]
          return (
            <div key={table.id} className="table-card">
              <div className="table-card__icon">🪑</div>
              <p className="table-card__number">Mesa {table.table_number}</p>
              <p className="table-card__cap">{table.capacity} personas</p>
              <span className={`table-badge ${status.cls}`}>{status.label}</span>
              <select
                className="table-select"
                value={table.status}
                onChange={e => updateStatus(table.id, e.target.value)}
              >
                <option value="available">Disponible</option>
                <option value="occupied">Ocupada</option>
                <option value="reserved">Reservada</option>
                <option value="cleaning">Limpieza</option>
              </select>
            </div>
          )
        })}
      </div>
    </div>
  )
}