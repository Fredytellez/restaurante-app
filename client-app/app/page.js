import { redirect } from "next/navigation"
export default function Home() {
  redirect("/mesa/1")
/* export default function Home() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontFamily: "sans-serif"
    }}>
      <h1 style={{ fontSize: 32, fontWeight: 700 }}>
        <span style={{ color: "#d63af9" }}>Bar</span>
        <span style={{ color: "#00d4ff" }}>Link</span>
      </h1>
      <p style={{ color: "#8888aa", marginTop: 8 }}>
        Escanea el QR de tu mesa para comenzar
      </p>
    </div>
  ) */
}