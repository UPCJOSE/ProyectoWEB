import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./LandingPage.module.css";
import { ImagenPrenda } from "../../../core/components/ImagenPrenda";

const API_ESTILOS = "http://localhost:5000/api/prendas/estilos";

const formatoMoneda = (valor) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(valor);

export const LandingPage = () => {
  const navigate = useNavigate();
  const [estilos, setEstilos] = useState([]);

  useEffect(() => {
    fetch(API_ESTILOS)
      .then((res) => res.json())
      .then((data) => setEstilos(data.slice(0, 3)))
      .catch(() => setEstilos([]));
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={styles.landingContainer}>
      <nav className={styles.navbar}>
        <div className={styles.navLogo} onClick={() => window.scrollTo(0, 0)}>
          Elegancia <span>y Estilo</span>
        </div>
        <ul className={styles.navLinks}>
          <li onClick={() => scrollToSection("inicio")}>Inicio</li>
          <li onClick={() => scrollToSection("servicios")}>Servicios</li>
          <li onClick={() => scrollToSection("proceso")}>Procesos</li>
          <li onClick={() => scrollToSection("catalogo")}>Catálogo</li>
        </ul>
        <div className={styles.navActions}>
          <button className={styles.btnLogin} onClick={() => navigate("/login")}>
            Entrar al Portal
          </button>
        </div>
      </nav>

      <header id="inicio" className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.goldLabel}>Atelier de Confección</span>
          <h1 className={styles.title}>
            Sastrería de <span>Alta Gama</span>
          </h1>
          <p className={styles.subtitle}>
            Confeccionamos tus sueños con la precisión de un maestro sastre.
            Elegancia atemporal para cada ocasión.
          </p>
          <button className={styles.btnPrimary} onClick={() => navigate("/portal")}>
            Comenzar mi experiencia
          </button>
        </div>
      </header>

      <section id="servicios" className={styles.servicesSection}>
        <h2 className={styles.sectionTitle}>Nuestros Servicios</h2>
        <div className={styles.servicesGrid}>
          <div className={styles.serviceCard}>
            <div className={styles.icon}>✂️</div>
            <h3>Sastrería a Medida</h3>
            <p>Trajes y vestidos diseñados exclusivamente para ti, asegurando un talle impecable.</p>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.icon}>👔</div>
            <h3>Alquiler Premium</h3>
            <p>Accede a nuestra colección de prendas de etiqueta listas para tu próximo evento.</p>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.icon}>📏</div>
            <h3>Ajustes y Arreglos</h3>
            <p>Renovamos y ajustamos tus prendas favoritas para que luzcan como nuevas.</p>
          </div>
        </div>
      </section>

      <section id="proceso" className={styles.processSection}>
        <h2 className={styles.sectionTitle}>La Experiencia Atelier</h2>
        <div className={styles.processGrid}>
          <div className={styles.processStep}>
            <div className={styles.stepNumber}>1</div>
            <h3>Asesoría y Diseño</h3>
            <p>Conversamos sobre tu estilo, elegimos las mejores telas y definimos el diseño ideal.</p>
          </div>
          <div className={styles.processStep}>
            <div className={styles.stepNumber}>2</div>
            <h3>Toma de Medidas</h3>
            <p>Registramos tus medidas con precisión milimétrica para garantizar un talle perfecto.</p>
          </div>
          <div className={styles.processStep}>
            <div className={styles.stepNumber}>3</div>
            <h3>Confección Artesanal</h3>
            <p>Nuestros maestros sastres elaboran tu prenda cuidando cada detalle y acabado.</p>
          </div>
          <div className={styles.processStep}>
            <div className={styles.stepNumber}>4</div>
            <h3>Prueba y Entrega</h3>
            <p>Realizamos los ajustes finales para que te lleves una obra hecha para ti.</p>
          </div>
        </div>
      </section>

      <section id="catalogo" className={styles.featuredSection}>
        <div className={styles.featuredHeader}>
          <div>
            <span className={styles.goldLabel}>Exclusividad</span>
            <h2 className={styles.sectionTitle} style={{ marginBottom: 0, textAlign: "left" }}>
              Estilos de Confección
            </h2>
          </div>
          <button className={styles.btnSecondary} onClick={() => navigate("/catalogo-publico")}>
            Ver catálogo completo
          </button>
        </div>

        {estilos.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666", padding: "2rem" }}>
            Próximamente estilos disponibles. Inicia sesión como administrador para registrarlos.
          </p>
        ) : (
          <div className={styles.featuredGrid}>
            {estilos.map((e) => (
              <div key={e.id} className={styles.featuredCard}>
                <div className={styles.featuredImageWrap}>
                  <ImagenPrenda url={e.imagenUrl} alt={e.estilo} tipo={e.tipoPrenda} variant="card" />
                </div>
                <div className={styles.featuredInfo}>
                  <h4>{e.estilo}</h4>
                  <p>{e.tipoPrenda} · {formatoMoneda(e.costo)} · {e.consumoTelaAprox} m tela</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={styles.ctaBanner}>
        <h2>¿Listo para lucir impecable?</h2>
        <p>Crea tu cuenta y consulta costos y tela aproximada de cada estilo antes de confeccionar.</p>
        <button className={styles.btnPrimary} onClick={() => navigate("/login")}>
          Registrarme ahora
        </button>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <h2>Elegancia y Estilo</h2>
          <p>Valledupar, Cesar, Colombia</p>
          <p>© 2026 SastreriApp</p>
        </div>
      </footer>
    </div>
  );
};
