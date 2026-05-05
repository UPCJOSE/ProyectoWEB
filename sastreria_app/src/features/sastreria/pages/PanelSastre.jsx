// src/features/sastreria/pages/PanelSastre.jsx
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import styles from "./PanelSastre.module.css";

export const PanelSastre = () => {
  const [pedidos, setPedidos] = useState([]);

  const API_PEDIDOS = "https://localhost:7196/api/Pedidos";
  const API_CLIENTES = "https://localhost:7196/api/Clientes";

  const cargarPedidos = async () => {
    try {
      const res = await fetch(API_PEDIDOS);
      const data = await res.json();
      setPedidos(data);
    } catch (error) {
      console.error("Error cargando pedidos:", error);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  const moverPedido = async (id, nuevoEstado) => {
    try {
      const pedido = pedidos.find((p) => p.id === id);
      if (!pedido) return;

      const actualizado = {
        ...pedido,
        estado: nuevoEstado,
      };

      await fetch(`${API_PEDIDOS}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(actualizado),
      });

      setPedidos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p)),
      );

      if (nuevoEstado === "Entregado") {
        Swal.fire({
          icon: "success",
          title: "Pedido archivado/entregado",
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error actualizando pedido:", error);
    }
  };

  const verMedidas = async (cliente) => {
    if (!cliente || !cliente.id) return;

    try {
      const res = await fetch(`${API_CLIENTES}/${cliente.id}`);
      const data = await res.json();

      const medidas = data.medidas;

      if (medidas) {
        Swal.fire({
          title: `📏 Medidas de ${data.nombre}`,
          html: `
            <div style="text-align: left; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <p><strong>Cuello:</strong> ${medidas.cuello || 0} cm</p>
              <p><strong>Pecho:</strong> ${medidas.pecho || 0} cm</p>
              <p><strong>Cintura:</strong> ${medidas.cintura || 0} cm</p>
              <p><strong>Cadera:</strong> ${medidas.cadera || 0} cm</p>
              <p><strong>Hombros:</strong> ${medidas.hombros || 0} cm</p>
              <p><strong>Largo Total:</strong> ${medidas.largoTotal || 0} cm</p>
            </div>
          `,
          confirmButtonText: "Cerrar",
          confirmButtonColor: "#181f21",
        });
      } else {
        Swal.fire({
          icon: "info",
          title: "Sin medidas",
          text: `El cliente ${data.nombre} aún no tiene medidas registradas.`,
          confirmButtonColor: "#181f21",
        });
      }
    } catch (error) {
      console.error("Error obteniendo medidas:", error);
      Swal.fire(
        "Error",
        "No se pudieron cargar las medidas de la base de datos.",
        "error",
      );
    }
  };

  const pendientes = pedidos.filter((p) => p.estado === "Pendiente");
  const enProceso = pedidos.filter((p) => p.estado === "EnProceso");
  const terminados = pedidos.filter((p) => p.estado === "Terminado");

  const confirmarEntrega = async (id) => {
    const resultado = await Swal.fire({
      title: "¿Confirmar Entrega?",
      text: "¿El pedido ya ha sido entregado al cliente?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#c5a880",
      cancelButtonColor: "#181f21",
      confirmButtonText: "Sí, entregar",
      cancelButtonText: "No, cancelar",
    });

    if (resultado.isConfirmed) {
      moverPedido(id, "Entregado");
    }
  };

  const Ticket = ({ pedido }) => (
    <div className={styles.ticket}>
      <div className={styles.ticketId}>#{pedido.id}</div>

      <h4 className={styles.ticketPrenda}>{pedido.tipoPrenda}</h4>

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
            className={`${styles.btnAction} ${styles.btnGold}`}
            onClick={() => moverPedido(pedido.id, "EnProceso")}
          >
            Iniciar
          </button>
        )}

        {pedido.estado === "EnProceso" && (
          <button
            className={`${styles.btnAction} ${styles.btnGold}`}
            onClick={() => moverPedido(pedido.id, "Terminado")}
          >
            Finalizar
          </button>
        )}

        {pedido.estado === "Terminado" && (
          <button
            className={`${styles.btnAction}`}
            style={{
              backgroundColor: "#181f21",
              color: "white",
              borderColor: "#181f21",
            }}
            onClick={() => confirmarEntrega(pedido.id)}
          >
            Entregar
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="animate__animated animate__fadeIn">
      <header className={styles.header}>
        <h1 className={styles.title}>Atelier de Confección</h1>
      </header>

      <main className={styles.kanbanBoard}>
        <section className={styles.kanbanColumn}>
          <h3>Pendientes ({pendientes.length})</h3>
          {pendientes.map((p) => (
            <Ticket key={p.id} pedido={p} />
          ))}
        </section>

        <section className={styles.kanbanColumn}>
          <h3>En Proceso ({enProceso.length})</h3>
          {enProceso.map((p) => (
            <Ticket key={p.id} pedido={p} />
          ))}
        </section>

        <section className={styles.kanbanColumn}>
          <h3>Terminados ({terminados.length})</h3>
          {terminados.map((p) => (
            <Ticket key={p.id} pedido={p} />
          ))}
        </section>
      </main>
    </div>
  );
};
