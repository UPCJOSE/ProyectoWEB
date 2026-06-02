import { useNavigate } from "react-router-dom";
import styles from "./NotFoundPage.module.css";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  const opciones = [
    {
      titulo: "Volver al Inicio",
      descripcion: "Regresa a nuestra página principal.",
      icono: "bi-house-door",
      ruta: "/",
      color: "gold",
    },
    {
      titulo: "Explorar Catálogo",
      descripcion: "Descubre nuestras colecciones premium.",
      icono: "bi-journal-richtext",
      ruta: "/catalogo-publico",
      color: "dark",
    },
    {
      titulo: "Portal de Acceso",
      descripcion: "Inicia sesión en tu cuenta del Atelier.",
      icono: "bi-person",
      ruta: "/login",
      color: "light",
    },
  ];

  return (
    <div className={styles.pageContainer}>
      {/* Opcional: Un logo en la parte superior, similar al de Sakai */}
      <div className={styles.brandLogo} onClick={() => navigate("/")}>
        Elegancia <span>y Estilo</span>
      </div>

      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.errorCode}>Error 404</span>
          <h1 className={styles.title}>Página no encontrada</h1>
          <p className={styles.subtitle}>
            Parece que hemos perdido el hilo. El recurso que buscas no está
            disponible o ha sido movido.
          </p>
        </div>

        <div className={styles.optionsList}>
          {opciones.map((opcion, index) => (
            <div
              key={index}
              className={styles.optionItem}
              onClick={() => navigate(opcion.ruta)}
            >
              <div className={`${styles.iconWrapper} ${styles[opcion.color]}`}>
                <i className={`bi ${opcion.icono}`}></i>
              </div>
              <div className={styles.optionText}>
                <h3>{opcion.titulo}</h3>
                <p>{opcion.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
