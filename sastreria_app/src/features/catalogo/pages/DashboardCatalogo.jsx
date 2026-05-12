import { useEffect, useState } from "react";
import styles from "./DashboardCatalogo.module.css";

const API = "https://localhost:7196/api/PrendasCatalogo";

export const DashboardCatalogo = () => {
  const [prendas, setPrendas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarPrendas();
  }, []);

  const cargarPrendas = async () => {
    try {
      const res = await fetch(API);

      if (!res.ok) throw new Error();

      const data = await res.json();

      const activas = data.filter((p) => p.activa);

      setPrendas(activas);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <span className={styles.label}>Atelier Collection</span>

        <h1 className={styles.title}>
          Catálogo <span>Premium</span>
        </h1>

        <p className={styles.subtitle}>
          Descubre prendas exclusivas diseñadas para elegancia, presencia y
          confección personalizada.
        </p>
      </div>

      {loading ? (
        <div className={styles.loader}>Cargando catálogo...</div>
      ) : (
        <div className={styles.grid}>
          {prendas.map((prenda) => (
            <div key={prenda.id} className={styles.card}>
              <div className={styles.imageWrap}>
                <img
                  src={
                    prenda.imagenUrl
                      ? `https://localhost:7196${prenda.imagenUrl}`
                      : "https://placehold.co/600x800?text=Atelier"
                  }
                  alt={prenda.nombre}
                  className={styles.image}
                />
              </div>

              <div className={styles.cardBody}>
                <span className={styles.type}>{prenda.tipoPrenda}</span>

                <h3 className={styles.name}>{prenda.nombre}</h3>

                <div className={styles.footer}>
                  <strong className={styles.price}>${prenda.precioBase}</strong>

                  <button className={styles.btnGold}>Solicitar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
