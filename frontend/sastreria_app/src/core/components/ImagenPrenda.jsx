import { useState, useEffect } from "react";
import { resolverImagenUrl } from "../utils/imagenUrl";
import styles from "./ImagenPrenda.module.css";

/**
 * Muestra imagen de prenda; si falla la carga o no hay URL, muestra "Imagen no disponible".
 */
export const ImagenPrenda = ({
  url,
  alt = "Prenda",
  tipo = "",
  variant = "card",
  className = "",
}) => {
  const [fallo, setFallo] = useState(false);
  const src = resolverImagenUrl(url);

  useEffect(() => {
    setFallo(false);
  }, [url]);

  const placeholder = (
    <div
      className={`${styles.placeholder} ${styles[variant] || ""} ${className}`}
      role="img"
      aria-label="Imagen no disponible"
    >
      {tipo ? <span className={styles.letra}>{tipo.charAt(0)}</span> : null}
      <span className={styles.mensaje}>Imagen no disponible</span>
    </div>
  );

  if (!src || fallo) return placeholder;

  return (
    <div className={`${styles.wrap} ${styles[variant] || ""} ${className}`}>
      <img
        src={src}
        alt={alt}
        className={styles.img}
        loading="lazy"
        decoding="async"
        onError={() => setFallo(true)}
      />
    </div>
  );
};
