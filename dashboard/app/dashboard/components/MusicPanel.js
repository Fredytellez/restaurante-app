"use client"

import axios from "axios"

const BACKEND_URL = "http://localhost:4000"

export default function MusicPanel({ music, setMusic }) {

  const updateMusic = async (id, status) => {
    try {
      await axios.patch(`${BACKEND_URL}/api/music/${id}`, { status })
      setMusic(prev =>
        prev.map(m => m.id === id ? { ...m, status } : m)
      )
    } catch (error) {
      alert("Error al actualizar solicitud de música", error)
    }
  }

  const pending = music.filter(m => m.status === "pending")
  const done    = music.filter(m => m.status !== "pending")

  if (music.length === 0) return (
    <div style={{ textAlign: "center", padding: "80px 20px", color: "#999" }}>
      <p style={{ fontSize: 48 }}>🎵</p>
      <p style={{ fontSize: 18, fontWeight: 600 }}>Sin solicitudes de música</p>
      <p style={{ fontSize: 14 }}>Las canciones pedidas por los clientes aparecerán aquí</p>
    </div>
  )

  return (
    <div>
      {pending.length > 0 && (
        <div style={{ marginBottom: 33 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
            Pendientes ({pending.length})
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16
          }}>
            {pending.map(item => (
              <div
                key={item.id}
                style={{
                  background: "white",
                  borderRadius: 12,
                  padding: 20,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  borderLeft: "4px solid #e63946"
                }}
              >
                <div style={{ marginBottom: 16 }}>
                  <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 16 }}>
                    🎵 {item.song_name}
                  </p>
                  {item.artist && (
                    <p style={{ margin: "0 0 4px", color: "#666", fontSize: 14 }}>
                      {item.artist}
                    </p>
                  )}
                  <p style={{ margin: 0, color: "#999", fontSize: 13 }}>
                    Mesa {item.table_id} · {new Date(item.created_at).toLocaleTimeString()}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => updateMusic(item.id, "playing")}
                    style={{
                      flex: 1,
                      padding: "8px 0",
                      background: "#2a9d8f",
                      color: "white",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: 13
                    }}
                  >
                    ▶ Poner
                  </button>
                  <button
                    onClick={() => updateMusic(item.id, "rejected")}
                    style={{
                      flex: 1,
                      padding: "8px 0",
                      background: "#eee",
                      color: "#666",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: 13
                    }}
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {done.length > 0 && (
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "#999" }}>
            Historial ({done.length})
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 12
          }}>
            {done.map(item => (
              <div
                key={item.id}
                style={{
                  background: "white",
                  borderRadius: 12,
                  padding: 16,
                  opacity: 0.6,
                  display: "flex",
                  alignItems: "center",
                  gap: 12
                }}
              >
                <span style={{ fontSize: 20 }}>
                  {item.status === "playing" ? "▶" : "✕"}
                </span>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>
                    {item.song_name}
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: "#999" }}>
                    Mesa {item.table_id}
                  </p>
                </div>
                <span style={{
                  marginLeft: "auto",
                  fontSize: 12,
                  fontWeight: 600,
                  color: item.status === "playing" ? "#2a9d8f" : "#e63946"
                }}>
                  {item.status === "playing" ? "Sonando" : "Rechazada"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}