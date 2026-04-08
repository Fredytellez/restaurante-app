"use client"

import { useState } from "react"
import axios from "axios"

const BACKEND_URL = "http://localhost:4000"

export default function MusicRequest({ tableId }) {

  const [songName, setSongName] = useState("")
  const [artist,   setArtist]   = useState("")
  const [sent,     setSent]     = useState(false)
  const [sending,  setSending]  = useState(false)

  const sendMusic = async () => {
    if (!songName.trim()) return
    setSending(true)
    try {
      await axios.post(`${BACKEND_URL}/api/music`, {
        table_id:  Number(tableId),
        song_name: songName,
        artist
      })
      setSent(true)
      setSongName("")
      setArtist("")
      // Reseteamos después de 4 segundos
      setTimeout(() => setSent(false), 4000)
    } catch (error) {
      alert("Error al enviar solicitud de música")
      console.error(error)
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
        🎵 Solicitar canción
      </h2>
      <p style={{ color: "#888", fontSize: 14, marginBottom: 24 }}>
        Pídele al DJ o al bar que ponga tu canción favorita
      </p>

      {sent ? (
        <div style={{
          textAlign: "center",
          padding: "40px 20px",
          background: "white",
          borderRadius: 12
        }}>
          <p style={{ fontSize: 40 }}>🎶</p>
          <p style={{ fontWeight: 600 }}>¡Solicitud enviada!</p>
          <p style={{ color: "#888", fontSize: 14 }}>
            Haremos lo posible por poner tu canción
          </p>
        </div>
      ) : (
        <div style={{
          background: "white",
          borderRadius: 12,
          padding: 20,
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
        }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 6 }}>
              Nombre de la canción *
            </label>
            <input
              value={songName}
              onChange={e => setSongName(e.target.value)}
              placeholder="Ej: Bohemian Rhapsody"
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1px solid #ddd",
                borderRadius: 8,
                fontSize: 15,
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 6 }}>
              Artista (opcional)
            </label>
            <input
              value={artist}
              onChange={e => setArtist(e.target.value)}
              placeholder="Ej: Queen"
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1px solid #ddd",
                borderRadius: 8,
                fontSize: 15,
                boxSizing: "border-box"
              }}
            />
          </div>

          <button
            onClick={sendMusic}
            disabled={sending || !songName.trim()}
            style={{
              width: "100%",
              padding: 14,
              background: !songName.trim() ? "#ccc" : "#e63946",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              cursor: !songName.trim() ? "not-allowed" : "pointer"
            }}
          >
            {sending ? "Enviando..." : "Solicitar canción"}
          </button>
        </div>
      )}
    </div>
  )
}