import { useEffect, useState } from 'react';
import styles from './PanelSastre.module.css';

const API_URL = "https://localhost:7196/api/pedidos";

export const PanelSastre = () => {
  const [pedidos, setPedidos] = useState([]);

  // 🔄 CARGAR DESDE API
  const cargarPedidos = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setPedidos(data);
    } catch (error) {
      console.error("Error cargando pedidos:", error);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  // 🔁 ACTUALIZAR ESTADO EN BACKEND
  const moverPedido = async (id, nuevoEstado) => {
    try {
      const pedido = pedidos.find(p => p.id === id);
      if (!pedido) return;

      const actualizado = {
        ...pedido,
        estado: nuevoEstado
      };

      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(actualizado)
      });

      // actualizar UI local
      setPedidos(prev =>
        prev.map(p =>
          p.id === id ? { ...p, estado: nuevoEstado } : p
        )
      );

    } catch (error) {
      console.error("Error actualizando pedido:", error);
    }
  };

  const verMedidas = (cliente) => {
    alert(`📐 Cliente: ${cliente?.nombre}`);
  };

  // 📌 FILTROS CORRECTOS
  const pendientes = pedidos.filter(p => p.estado === 'Pendiente');
  const enProceso = pedidos.filter(p => p.estado === 'EnProceso');
  const terminados = pedidos.filter(p => p.estado === 'Terminado');

  const Ticket = ({ pedido }) => (
    <div className={styles.ticket}>
      <div className={styles.ticketId}>#{pedido.id}</div>

      <h4 className={styles.ticketPrenda}>
        {pedido.tipoPrenda}
      </h4>

      <p className={styles.ticketCliente}>
        <i className="bi bi-person"></i> {pedido.cliente?.nombre}
      </p>

      <div className={styles.actions}>
        <button
          className={styles.btnAction}
          onClick={() => verMedidas(pedido.cliente)}
        >
          Ver Cliente
        </button>

        {pedido.estado === "Pendiente" && (
          <button
            className={styles.btnGold}
            onClick={() => moverPedido(pedido.id, "EnProceso")}
          >
            Iniciar
          </button>
        )}

        {pedido.estado === "EnProceso" && (
          <button
            className={styles.btnGold}
            onClick={() => moverPedido(pedido.id, "Terminado")}
          >
            Finalizar
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div>

      <header className={styles.header}>
        <h1 className={styles.title}>Atelier de Confección</h1>
      </header>

      <main className={styles.kanbanBoard}>

        {/* PENDIENTES */}
        <section className={styles.kanbanColumn}>
          <h3>Pendientes ({pendientes.length})</h3>
          {pendientes.map(p => <Ticket key={p.id} pedido={p} />)}
        </section>

        {/* EN PROCESO */}
        <section className={styles.kanbanColumn}>
          <h3>En Proceso ({enProceso.length})</h3>
          {enProceso.map(p => <Ticket key={p.id} pedido={p} />)}
        </section>

        {/* TERMINADOS */}
        <section className={styles.kanbanColumn}>
          <h3>Terminados ({terminados.length})</h3>
          {terminados.map(p => <Ticket key={p.id} pedido={p} />)}
        </section>

      </main>
    </div>
  );
};