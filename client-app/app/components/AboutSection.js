"use client"

export default function AboutSection() {
  return (
    <div className="about-container">

      {/* Hero */}
      <div className="about-hero">
        <div className="about-hero__logo">🍸</div>
        <h1 className="about-hero__brand">
          <span>Bar</span><span>Link</span>
        </h1>
        <p className="about-hero__tagline">
          Conecta tu mesa, vive el momento.
        </p>
      </div>

      {/* Quiénes somos */}
      <div className="about-section">
        <h2 className="about-section__title">👥 Quiénes Somos</h2>
        <p className="about-section__text">
          Somos estudiantes de Administración de Empresas en la Fundación
          Universitaria del Área Andina, apasionados por el emprendimiento
          digital y la creación de soluciones tecnológicas con impacto real.
        </p>
        <p className="about-section__text">
          BarLink es un emprendimiento digital creado con el objetivo de
          modernizar la experiencia en bares y discotecas mediante tecnología
          QR, eliminando fricciones en el servicio y mejorando la rentabilidad
          de los establecimientos.
        </p>
      </div>

      {/* Qué es BarLink */}
      <div className="about-section">
        <h2 className="about-section__title">📖 ¿Qué es BarLink?</h2>
        <p className="about-section__text">
          BarLink es una plataforma digital que transforma la experiencia en
          bares y discotecas, eliminando tiempos de espera y modernizando cada
          punto de contacto entre el cliente y el establecimiento.
        </p>
        <p className="about-section__text">
          Con solo escanear un código QR desde su mesa, el cliente puede:
        </p>
        <ul className="about-features">
          <li>📱 Ver el menú digital completo con categorías, precios y descripciones</li>
          <li>🍹 Pedir bebidas y entradas directamente desde su celular</li>
          <li>💳 Pagar desde el celular sin necesidad de buscar al mesero</li>
          <li>🎵 Seleccionar música y enviar solicitudes al DJ</li>
          <li>🔥 Acceder a promociones y combos exclusivos del establecimiento</li>
          <li>🔔 Llamar al mesero o solicitar la cuenta con un solo toque</li>
        </ul>
        <p className="about-section__text" style={{ marginTop: 12 }}>
          BarLink automatiza la experiencia completa: sin filas, sin esperas,
          sin fricción. Todo desde el celular del cliente.
        </p>
      </div>

      {/* Producto principal */}
      <div className="about-section">
        <h2 className="about-section__title">🍾 Producto Principal</h2>
        <p className="about-section__text">
          BarLink está enfocado en bares, discotecas y establecimientos de
          licores. El menú digital está estructurado en las siguientes categorías:
        </p>
        <table className="about-table">
          <thead>
            <tr>
              <th>Categoría</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["🍹 Cócteles",              "Preparaciones clásicas y de autor"],
              ["🍺 Cervezas",              "Nacionales e importadas"],
              ["🥃 Licores",               "Whiskies, rones, vodkas, tequilas"],
              ["🍾 Botellas Premium",      "Servicio de botella completa para grupos"],
              ["🎟️ Entradas a Eventos",    "Acceso a eventos especiales del establecimiento"],
              ["🎧 Recomendaciones del DJ","Solicitudes musicales directas al DJ"],
              ["🔥 Combos Promocionales",  "Paquetes y promociones exclusivas"],
            ].map(([cat, desc]) => (
              <tr key={cat}>
                <td>{cat}</td>
                <td>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Funcionalidades */}
      <div className="about-section">
        <h2 className="about-section__title">✨ Funcionalidades</h2>

        <p style={{ fontSize: 13, fontWeight: 700, color: "var(--bl-white)", marginBottom: 8 }}>
          📱 App del Cliente
        </p>
        <ul className="about-features" style={{ marginBottom: 16 }}>
          <li>📲 Acceso mediante código QR único por mesa</li>
          <li>🍹 Menú digital por categorías con precios</li>
          <li>🛒 Carrito de pedidos con control de cantidades</li>
          <li>🔔 Solicitud de mesero, cuenta y limpieza de mesa</li>
          <li>🎵 Solicitud de canciones al DJ</li>
          <li>⚡ Notificaciones en tiempo real</li>
        </ul>

        <p style={{ fontSize: 13, fontWeight: 700, color: "var(--bl-white)", marginBottom: 8 }}>
          📊 Dashboard del Restaurante
        </p>
        <ul className="about-features">
          <li>🔔 Panel de solicitudes en tiempo real</li>
          <li>🛒 Gestión de órdenes con ciclo completo de estados</li>
          <li>🎵 Panel de música con aprobación o rechazo de canciones</li>
          <li>🪑 Estado visual de cada mesa del establecimiento</li>
          <li>🟢 Indicador de conexión en tiempo real</li>
          <li>⏱️ Contador de tiempo por mesa</li>
        </ul>
      </div>

      {/* Equipo */}
      <div className="about-section">
        <h2 className="about-section__title">🧑‍💻 Integrantes del Proyecto</h2>
        <div className="about-team">
          <div className="about-member">
            <div className="about-member__avatar">FP</div>
            <p className="about-member__name">Fredy Alberto Peña Téllez</p>
            <p className="about-member__role">Co-fundador & Desarrollador</p>
          </div>
          <div className="about-member">
            <div className="about-member__avatar">JJ</div>
            <p className="about-member__name">Jhojan Alexander Jiménez Melo</p>
            <p className="about-member__role">Co-fundador & Desarrollador</p>
          </div>
        </div>
      </div>

      {/* Contacto */}
      <div className="about-section">
        <h2 className="about-section__title">📬 Contacto</h2>
        <div className="about-contact">
          <div className="about-contact__item">
            <span className="about-contact__icon">📧</span>
            <div>
              <p className="about-contact__label">Correo</p>
              <p className="about-contact__value">contacto@barlink.com</p>
            </div>
          </div>
          <div className="about-contact__item">
            <span className="about-contact__icon">📸</span>
            <div>
              <p className="about-contact__label">Instagram</p>
              <p className="about-contact__value">@barlinkapp</p>
            </div>
          </div>
          <div className="about-contact__item">
            <span className="about-contact__icon">💼</span>
            <div>
              <p className="about-contact__label">GitHub</p>
              <p className="about-contact__value">Fredytellez/BarLink</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="about-footer">
        <div className="about-footer__tagline">
          <span>Bar</span><span>Link</span>
        </div>
        <p className="about-footer__license">
          © 2026 BarLink. Todos los derechos reservados.{"\n"}
          Este software es propiedad exclusiva de BarLink. Queda prohibida su
          reproducción, distribución o uso sin autorización expresa de sus creadores.
        </p>
        <p className="about-footer__made">Hecho con ❤️ en Colombia 🇨🇴</p>
      </div>

    </div>
  )
}