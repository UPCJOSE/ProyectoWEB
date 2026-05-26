import { useNavigate } from "react-router-dom";
import styles from "./PortalCliente.module.css";

export const PortalCliente = () => {
  const navigate = useNavigate();

  const irA = (ruta) => (e) => {
    e.preventDefault();
    navigate(ruta);
  };

  const onCardKeyDown = (ruta) => (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(ruta);
    }
  };

  return (
    <div className={styles.page}>
      <aside className={styles.brandPanel}>
        <div className={styles.brandOverlay} />
        <div className={styles.brandGlow} />
        <div className={styles.cornerTL} />
        <div className={styles.cornerTR} />
        <div className={styles.cornerBL} />
        <div className={styles.cornerBR} />

        <div className={styles.brandContent}>
          <div className={styles.scissorIcon} aria-hidden>
            ✂
          </div>

          <h1 className={styles.brandTitle}>
            Elegancia
            <br />
            <span className={styles.brandTitleAccent}>y Estilo</span>
          </h1>
          <div className={styles.goldLine} />
          <p className={styles.brandTagline}>Sastrería · Valledupar</p>
        </div>

        <p className={styles.brandFooter}>Atelier premium · 2026</p>
      </aside>

      <main className={styles.contentPanel}>
        <div className={styles.contentInner}>
          <header className={styles.header}>
            <span className={styles.portalLabel}>Bienvenido</span>
            <h2 className={styles.title}>
              ¿Qué deseas hacer{" "}
              <span className={styles.titleAccent}>hoy?</span>
            </h2>
            <p className={styles.subtitle}>
              Selecciona una opción para continuar en tu atelier personal.
            </p>
          </header>

          <div className={styles.grid}>
            <article
              className={styles.card}
              role="button"
              tabIndex={0}
              onClick={irA("/login")}
              onKeyDown={onCardKeyDown("/login")}
            >
              <div className={styles.cardIconWrap}>
                <span className={styles.cardIcon} aria-hidden>
                  ✂
                </span>
              </div>
              <span className={styles.cardTag}>A medida</span>
              <h3 className={styles.cardTitle}>Registrar Confección</h3>
              <p className={styles.cardText}>
                Solicita una prenda hecha a medida, agenda toma de medidas y
                comienza tu proceso de confección.
              </p>
              <button
                type="button"
                className={styles.cardBtn}
                onClick={irA("/login")}
              >
                Entrar
                <span className={styles.cardBtnArrow} aria-hidden>
                  →
                </span>
              </button>
            </article>

            <article
              className={styles.card}
              role="button"
              tabIndex={0}
              onClick={irA("/home")}
              onKeyDown={onCardKeyDown("/home")}
            >
              <div className={`${styles.cardIconWrap} ${styles.cardIconWrapAlt}`}>
                <span className={`${styles.cardIcon} ${styles.cardIconEmoji}`} aria-hidden>
                  🤵
                </span>
              </div>
              <span className={styles.cardTag}>Colección</span>
              <h3 className={styles.cardTitle}>Alquilar</h3>
              <p className={styles.cardText}>
                Explora nuestra colección premium disponible para alquiler
                inmediato.
              </p>
              <button
                type="button"
                className={styles.cardBtn}
                onClick={irA("/home")}
              >
                Entrar
                <span className={styles.cardBtnArrow} aria-hidden>
                  →
                </span>
              </button>
            </article>
          </div>
        </div>
      </main>
    </div>
  );
};
