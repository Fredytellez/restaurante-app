"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const BACKEND_URL = "http://localhost:4000"

const STATUS_CONFIG = {
  available: { label: "Disponible", color: "#2a9d8f", bg: "#2a9d8f22" },
  occupied:  { label: "Ocupada",    color: "#e63946", bg: "#e6394622" },
  reserved:  { label: "Reservada",  color: "#e9c46a", bg: "#e9c46a22" },
  cleaning:  { label: "Limpieza",   color: "#457b9d", bg: "#457b9d22" },
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

  const updateTableStatus = async (id, status) => {
    try {
      await axios.patch(`${BACKEND_URL}/api/tables/${id}`, { status })
      setTables(prev =>
        prev.map(t => t.id === id ? { ...t, status } : t)
      )
    } catch (error) {
      alert("Error al actualizar mesa")
    }
  }

  if (loading) return (
    <div style={{ textAlign: "center", padding: 40, color: "#999" }}>
      Cargando mesas...
    </div>
  )

  if (tables.length === 0) return (
    <div style={{ textAlign: "center", padding: "80px 20px", color: "#999" }}>
      <p style={{ fontSize: 48 }}>🪑</p>
      <p style={{ fontSize: 18, fontWeight: 600 }}>No hay mesas registradas</p>
      <p style={{ fontSize: 14 }}>Agrega mesas desde la base de datos</p>
    </div>
  )

  return (
    <div>
      <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
        Estado de mesas
      </h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 16
      }}>
        {tables.map(table => {
          const status = STATUS_CONFIG[table.status]
          return (
            <div
              key={table.id}
              style={{
                background: "white",
                borderRadius: 12,
                padding: 20,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                textAlign: "center"
              }}
            >
              <p style={{ fontSize: 32, margin: "0 0 8px" }}>🪑</p>
              <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 18 }}>
                Mesa {table.table_number}
              </p>
              <p style={{ margin: "0 0 16px", color: "#999", fontSize: 13 }}>
                {table.capacity} personas
              </p>
              <span style={{
                background: status.bg,
                color: status.color,
                padding: "4px 12px",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600
              }}>
                {status.label}
              </span>

              {/* Cambiar estado */}
              <select
                value={table.status}
                onChange={e => updateTableStatus(table.id, e.target.value)}
                style={{
                  display: "block",
                  width: "100%",
                  marginTop: 12,
                  padding: "8px 10px",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  fontSize: 13,
                  cursor: "pointer"
                }}
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