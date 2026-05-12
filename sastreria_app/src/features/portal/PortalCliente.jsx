import { useNavigate } from "react-router-dom";
import styles from "./PortalCliente.module.css";
import { PortalCliente } from "./features/portal/pages/PortalCliente";

export const PortalCliente = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.overlay} />

      <div className={styles.container}>
        <span className={styles.label}>Bienvenido</span>

        <h1 className={styles.title}>
          ¿Qué deseas hacer <span>hoy?</span>
        </h1>

        <p className={styles.subtitle}>
          Selecciona una opción para continuar en tu atelier personal.
        </p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.icon}>✂</div>

            <h2>Registrar Confección</h2>

            <p>
              Solicita una prenda hecha a medida, agenda toma de medidas y
              comienza tu proceso de confección.
            </p>

            <button onClick={() => navigate("/recepcion")}>Entrar</button>
          </div>

          <div className={styles.card}>
            <div className={styles.icon}>🤵</div>

            <h2>Alquilar</h2>

            <p>
              Explora nuestra colección premium disponible para alquiler
              inmediato.
            </p>

            <button onClick={() => navigate("/catalogo-publico")}>
              Entrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
