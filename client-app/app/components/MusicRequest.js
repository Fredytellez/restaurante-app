"use client"

import { useState } from "react"
import axios from "axios"

// La URL de tu backend local
/* const BACKEND_URL = "http://localhost:4000" */
// servidor en render 
const BACKEND_URL = "https://barlink-backend.onrender.com"

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
      <h2 className="music-title">🎵 Solicitar canción</h2>
      <p className="music-subtitle">Pídele al DJ tu canción favorita</p>

      {sent ? (
        <div className="music-success">
          <div className="music-success__icon">🎶</div>
          <p className="music-success__title">¡Solicitud enviada!</p>
          <p className="music-success__text">Haremos lo posible por poner tu canción</p>
        </div>
      ) : (
        <div className="music-form">
          <label className="music-form__label">Nombre de la canción *</label>
          <input
            className="music-form__input"
            value={songName}
            onChange={e => setSongName(e.target.value)}
            placeholder="Ej: Bohemian Rhapsody"
          />
          <label className="music-form__label">Artista (opcional)</label>
          <input
            className="music-form__input"
            value={artist}
            onChange={e => setArtist(e.target.value)}
            placeholder="Ej: Queen"
          />
          <button
            className="music-form__btn"
            onClick={sendMusic}
            disabled={sending || !songName.trim()}
          >
            {sending ? "Enviando..." : "Solicitar canción"}
          </button>
        </div>
      )}
    </div>
  )
}