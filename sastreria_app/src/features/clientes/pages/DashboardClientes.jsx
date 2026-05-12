import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DashboardClientes.module.css";

const API = "https://localhost:7196/api/Clientes";

export const DashboardClientes = () => {
  const [clientes, setClientes] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const res = await fetch(API);

      const data = await res.json();

      setClientes(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.label}>CRM Atelier</span>

        <h1 className={styles.title}>
          Historial de <span>Clientes</span>
        </h1>

        <p className={styles.subtitle}>
          Gestiona pedidos, medidas e historial completo.
        </p>
      </div>

      <div className={styles.grid}>
        {clientes.map((cliente) => {
          const totalPedidos = cliente.pedidos?.length || 0;

          const saldoPendiente =
            cliente.pedidos?.reduce(
              (acc, pedido) => acc + pedido.saldoPendiente,
              0,
            ) || 0;

          return (
            <div key={cliente.id} className={styles.card}>
              <div className={styles.cardTop}>
                <div>
                  <h2>{cliente.nombre}</h2>

                  <span>{cliente.correo}</span>
                </div>

                <div className={styles.badge}>{totalPedidos} pedidos</div>
              </div>

              <div className={styles.info}>
                <div>
                  <label>Teléfono</label>

                  <strong>{cliente.telefono}</strong>
                </div>

                <div>
                  <label>Saldo pendiente</label>

                  <strong>${saldoPendiente}</strong>
                </div>
              </div>

              <button
                className={styles.btnGold}
                onClick={() => navigate(`/clientes/${cliente.id}`)}
              >
                Ver perfil
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
