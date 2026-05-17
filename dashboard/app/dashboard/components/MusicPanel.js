"use client"

import axios from "axios"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"

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
    <div className="dash-empty">
      <div className="dash-empty__icon">🎵</div>
      <p className="dash-empty__title">Sin solicitudes de música</p>
      <p className="dash-empty__text">Las canciones pedidas aparecerán aquí</p>
    </div>
  )

  return (
    <div>
      {pending.length > 0 && (
        <div className="mb-4">
          <p className="dash-section-title">
            Pendientes <span>({pending.length})</span>
          </p>
          <div className="dash-grid">
            {pending.map(item => (
              <div key={item.id} className="music-card">
                <p className="music-card__song">🎵 {item.song_name}</p>
                {item.artist && <p className="music-card__artist">{item.artist}</p>}
                <p className="music-card__meta">
                  Mesa {item.table_id} · {new Date(item.created_at).toLocaleTimeString()}
                </p>
                <div className="music-card__actions">
                  <button className="music-btn music-btn--play"
                    onClick={() => updateMusic(item.id, "playing")}>
                    ▶ Poner
                  </button>
                  <button className="music-btn music-btn--reject"
                    onClick={() => updateMusic(item.id, "rejected")}>
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
          <p className="dash-section-title">
            Historial <span>({done.length})</span>
          </p>
          <div className="dash-grid">
            {done.map(item => (
              <div key={item.id} className="music-card--done">
                <span style={{ fontSize: 20 }}>
                  {item.status === "playing" ? "▶" : "✕"}
                </span>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{item.song_name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "var(--bl-muted)" }}>
                    Mesa {item.table_id}
                  </p>
                </div>
                <span className={item.status === "playing"
                  ? "music-status--playing"
                  : "music-status--rejected"}>
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