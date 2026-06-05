import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./ClienteDetalle.module.css";
import { fetchAuth } from "../../../core/utils/fetchAuth";

const API = "http://localhost:5000/api/Clientes";

export const ClienteDetalle = () => {
  const { id } = useParams();
  const [cliente, setCliente] = useState(null);

  useEffect(() => {
    let clienteId = id;

    if (!clienteId) {
      const usuarioGuardado = localStorage.getItem("usuario");
      if (usuarioGuardado) {
        const usuarioObj = JSON.parse(usuarioGuardado);
        clienteId = usuarioObj.clienteId || usuarioObj.id;
      }
    }

    if (clienteId) {
      cargarCliente(clienteId);
    }
  }, [id]);

  const cargarCliente = async (clienteId) => {
    try {
      const res = await fetchAuth(`${API}/${clienteId}`);

      // NUEVO: Manejamos el error 404 si el cliente no está en la base de datos
      if (!res.ok) {
        if (res.status === 404) {
          setCliente({ noExiste: true });
        }
        return;
      }

      const data = await res.json();
      setCliente(data);
    } catch (error) {
      console.error("Error al cargar el cliente:", error);
    }
  };

  if (!cliente) {
    return <div className={styles.loading}>Cargando perfil...</div>;
  }

  // NUEVO: Pantalla que se muestra si devolvió el error 404
  if (cliente.noExiste) {
    return (
      <div className={styles.container}>
        <div
          className={styles.card}
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            marginTop: "2rem",
          }}
        >
          <i
            className="bi bi-person-x"
            style={{ fontSize: "4rem", color: "#c9a84c" }}
          ></i>
          <h2
            style={{
              color: "#181f21",
              fontFamily: "'Noto Serif', serif",
              marginTop: "1rem",
            }}
          >
            Perfil Incompleto
          </h2>
          <p style={{ color: "#747879", marginTop: "1rem", lineHeight: "1.6" }}>
            Tu cuenta de usuario está activa, pero aún no tienes datos
            personales ni medidas registradas en el Atelier.
            <br />
            Por favor, acércate a recepción o contáctanos para que podamos crear
            tu expediente de cliente.
          </p>
        </div>
      </div>
    );
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
            <p style={{ color: "#747879" }}>No hay medidas registradas.</p>
          )}
        </div>
      </div>

      {/* PEDIDOS */}
      <div className={styles.ordersSection}>
        <div className={styles.sectionHeader}>
          <h2>Historial de pedidos</h2>
        </div>

        <div className={styles.ordersGrid}>
          {cliente.pedidos?.length > 0 ? (
            cliente.pedidos.map((pedido) => (
              <div key={pedido.id} className={styles.orderCard}>
                <div className={styles.orderTop}>
                  <h3>{pedido.prenda}</h3>
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
            ))
          ) : (
            <p style={{ color: "#747879" }}>
              No tienes pedidos en el historial.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
