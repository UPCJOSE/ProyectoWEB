import { useNavigate } from "react-router-dom";
import styles from "./LandingPage.module.css";

export const LandingPage = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
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
          <button
            className={styles.btnLogin}
            onClick={() => navigate("/login")}
          >
            Entrar al Portal
          </button>
        </div>
      </nav>

      {/* SECCIÓN HERO */}
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
          <button
            className={styles.btnPrimary}
            onClick={() => navigate("/portal")}
          >
            Comenzar mi experiencia
          </button>
        </div>
      </header>

      {/* SECCIÓN 2: SERVICIOS */}
      <section id="servicios" className={styles.servicesSection}>
        <h2 className={styles.sectionTitle}>Nuestros Servicios</h2>
        <div className={styles.servicesGrid}>
          <div className={styles.serviceCard}>
            <div className={styles.icon}>✂️</div>
            <h3>Sastrería a Medida</h3>
            <p>
              Trajes y vestidos diseñados exclusivamente para ti, asegurando un
              talle impecable.
            </p>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.icon}>👔</div>
            <h3>Alquiler Premium</h3>
            <p>
              Accede a nuestra colección de prendas de etiqueta listas para tu
              próximo evento especial.
            </p>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.icon}>📏</div>
            <h3>Ajustes y Arreglos</h3>
            <p>
              Renovamos y ajustamos tus prendas favoritas para que luzcan como
              nuevas.
            </p>
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: PROCESO */}
      <section id="proceso" className={styles.processSection}>
        <h2 className={styles.sectionTitle}>La Experiencia Atelier</h2>
        <div className={styles.processGrid}>
          <div className={styles.processStep}>
            <div className={styles.stepNumber}>1</div>
            <h3>Asesoría y Diseño</h3>
            <p>
              Conversamos sobre tu estilo, elegimos las mejores telas y
              definimos el diseño ideal para tu evento.
            </p>
          </div>
          <div className={styles.processStep}>
            <div className={styles.stepNumber}>2</div>
            <h3>Toma de Medidas</h3>
            <p>
              Registramos tus medidas con precisión milimétrica para garantizar
              un talle absolutamente perfecto.
            </p>
          </div>
          <div className={styles.processStep}>
            <div className={styles.stepNumber}>3</div>
            <h3>Confección Artesanal</h3>
            <p>
              Nuestros maestros sastres elaboran tu prenda cuidando cada
              detalle, costura y acabado.
            </p>
          </div>
          <div className={styles.processStep}>
            <div className={styles.stepNumber}>4</div>
            <h3>Prueba y Entrega</h3>
            <p>
              Realizamos los ajustes finales para que te lleves una obra de arte
              hecha exclusivamente para ti.
            </p>
          </div>
        </div>
      </section>

      {/* SECCIÓN 4: COLECCIÓN DESTACADA */}
      <section id="catalogo" className={styles.featuredSection}>
        <div className={styles.featuredHeader}>
          <div>
            <span className={styles.goldLabel}>Exclusividad</span>
            <h2
              className={styles.sectionTitle}
              style={{ marginBottom: 0, textAlign: "left" }}
            >
              Colección Destacada
            </h2>
          </div>
          <button
            className={styles.btnSecondary}
            onClick={() => navigate("/catalogo-publico")}
          >
            Ver todo el catálogo
          </button>
        </div>
        <div className={styles.featuredGrid}>
          {/* Tarjeta 1 */}
          <div className={styles.featuredCard}>
            <img
              src="https://pngimg.com/uploads/suit/suit_PNG8122.png"
              alt="Traje"
            />
            <div className={styles.featuredInfo}>
              <h4>Smoking Clásico Midnight Blue</h4>
              <p>Alquiler y Confección</p>
            </div>
          </div>
          {/* Tarjeta 2 */}
          <div className={styles.featuredCard}>
            <img
              src="https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Traje 2"
            />
            <div className={styles.featuredInfo}>
              <h4>Traje Ejecutivo Oxford</h4>
              <p>Confección a Medida</p>
            </div>
          </div>
          {/* Tarjeta 3 */}
          <div className={styles.featuredCard}>
            <img
              src="https://images.unsplash.com/photo-1598808503746-f34c53b9323e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Traje 3"
            />
            <div className={styles.featuredInfo}>
              <h4>Traje de Lino para Verano</h4>
              <p>Ideal para eventos de día</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 5: TESTIMONIOS */}
      <section className={styles.testimonialsSection}>
        <h2 className={styles.sectionTitle}>Lo que dicen nuestros clientes</h2>
        <div className={styles.testimonialsGrid}>
          <div className={styles.testimonialCard}>
            <div className={styles.stars}>★★★★★</div>
            <p>
              "El traje que me confeccionaron para mi boda fue espectacular. El
              ajuste, la tela y la atención superaron mis expectativas."
            </p>
            <strong>— Carlos Mendoza</strong>
          </div>
          <div className={styles.testimonialCard}>
            <div className={styles.stars}>★★★★★</div>
            <p>
              "Alquilé un smoking para una gala y parecía hecho a mi medida.
              Definitivamente volveré a confiar en ellos."
            </p>
            <strong>— Andrés Felipe R.</strong>
          </div>
          <div className={styles.testimonialCard}>
            <div className={styles.stars}>★★★★★</div>
            <p>
              "Excelente servicio. Lleve unos trajes antiguos para ajustar y les
              dieron una segunda vida. Muy profesionales."
            </p>
            <strong>— Luis Fernando T.</strong>
          </div>
        </div>
      </section>

      {/* SECCIÓN 6: BANNER CTA FINAL */}
      <section className={styles.ctaBanner}>
        <h2>¿Listo para lucir impecable?</h2>
        <p>
          Crea tu cuenta hoy mismo y agenda tu primera cita de toma de medidas o
          explora nuestro catálogo completo.
        </p>
        <button
          className={styles.btnPrimary}
          onClick={() => navigate("/login")}
        >
          Registrarme ahora
        </button>
      </section>

      {/* SECCIÓN 3: PIE DE PÁGINA */}
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
