import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import styles from "./ClienteDetalle.module.css";

const API = "https://localhost:7196/api/Clientes";

export const ClienteDetalle = () => {
  const { id } = useParams();

  const [cliente, setCliente] = useState(null);

  useEffect(() => {
    cargarCliente();
  }, []);

  const cargarCliente = async () => {
    try {
      const res = await fetch(`${API}/${id}`);

      const data = await res.json();

      setCliente(data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!cliente) {
    return <div className={styles.loading}>Cargando perfil...</div>;
  }

  const ultimaMedida = cliente.medidas?.[cliente.medidas.length - 1];

  return (
    <div className={styles.container}>
      {/* HERO */}

      <div className={styles.hero}>
        <div>
          <span className={styles.label}>Perfil Cliente</span>

          <h1 className={styles.title}>{cliente.nombre}</h1>

          <p className={styles.subtitle}>{cliente.correo}</p>
        </div>

        <div className={styles.heroBadge}>
          {cliente.pedidos?.length || 0} pedidos
        </div>
      </div>

      {/* GRID */}

      <div className={styles.grid}>
        {/* INFO */}

        <div className={styles.card}>
          <h2>Información personal</h2>

          <div className={styles.infoBlock}>
            <label>Teléfono</label>

            <strong>{cliente.telefono}</strong>
          </div>

          <div className={styles.infoBlock}>
            <label>Dirección</label>

            <strong>{cliente.direccion}</strong>
          </div>
        </div>

        {/* MEDIDAS */}

        <div className={styles.card}>
          <h2>Últimas medidas</h2>

          {ultimaMedida ? (
            <div className={styles.measuresGrid}>
              <div>
                <label>Pecho</label>
                <strong>{ultimaMedida.pecho}</strong>
              </div>

              <div>
                <label>Cintura</label>
                <strong>{ultimaMedida.cintura}</strong>
              </div>

              <div>
                <label>Cadera</label>
                <strong>{ultimaMedida.cadera}</strong>
              </div>

              <div>
                <label>Hombros</label>
                <strong>{ultimaMedida.hombros}</strong>
              </div>
            </div>
          ) : (
            <p>No hay medidas registradas.</p>
          )}
        </div>
      </div>

      {/* PEDIDOS */}

      <div className={styles.ordersSection}>
        <div className={styles.sectionHeader}>
          <h2>Historial de pedidos</h2>
        </div>

        <div className={styles.ordersGrid}>
          {cliente.pedidos?.map((pedido) => (
            <div key={pedido.id} className={styles.orderCard}>
              <div className={styles.orderTop}>
                <h3>{pedido.prendaCatalogo?.nombre}</h3>

                <span className={styles.status}>{pedido.estado}</span>
              </div>

              <div className={styles.orderInfo}>
                <div>
                  <label>Total</label>

                  <strong>${pedido.costoTotal}</strong>
                </div>

                <div>
                  <label>Saldo</label>

                  <strong>${pedido.saldoPendiente}</strong>
                </div>

                <div>
                  <label>Entrega</label>

                  <strong>
                    {pedido.fechaEntrega
                      ? new Date(pedido.fechaEntrega).toLocaleDateString()
                      : "Pendiente"}
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
