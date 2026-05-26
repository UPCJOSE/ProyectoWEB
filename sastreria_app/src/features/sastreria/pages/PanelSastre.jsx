// src/features/sastreria/pages/PanelSastre.jsx
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import styles from "./PanelSastre.module.css";

const API_BASE =
  (import.meta?.env?.VITE_API_URL && String(import.meta.env.VITE_API_URL)) ||
  "http://localhost:5000/api";

const ESTADO = {
  PENDIENTE: "Pendiente",
  EN_PROCESO: "En proceso",
  TERMINADO: "Terminado",
  ENTREGADO: "Entregado",
};

const normalizarEstado = (valor) => {
  const clave = String(valor ?? "")
    .toLowerCase()
    .replace(/\s|_/g, "");

  if (clave === "pendiente") return ESTADO.PENDIENTE;
  if (clave === "enproceso") return ESTADO.EN_PROCESO;
  if (clave === "terminado") return ESTADO.TERMINADO;
  if (clave === "entregado") return ESTADO.ENTREGADO;

  return ESTADO.PENDIENTE;
};

const mapPedido = (raw) => {
  const prenda = raw.prendaCatalogo ?? raw.PrendaCatalogo ?? null;
  const cliente = raw.cliente ?? raw.Cliente ?? null;

  return {
    id: raw.id ?? raw.Id,
    clienteId: raw.clienteId ?? raw.ClienteId,
    prendaCatalogoId: raw.prendaCatalogoId ?? raw.PrendaCatalogoId,
    medidaPrendaId: raw.medidaPrendaId ?? raw.MedidaPrendaId ?? null,
    costoTotal: raw.costoTotal ?? raw.CostoTotal ?? 0,
    saldoPendiente: raw.saldoPendiente ?? raw.SaldoPendiente ?? 0,
    estado: normalizarEstado(raw.estado ?? raw.Estado),
    fechaEntrega: raw.fechaEntrega ?? raw.FechaEntrega ?? null,
    cliente: cliente
      ? {
          id: cliente.id ?? cliente.Id,
          nombre: cliente.nombre ?? cliente.Nombre ?? "Cliente",
        }
      : null,
    nombrePrenda:
      prenda?.nombre ??
      prenda?.Nombre ??
      prenda?.tipoPrenda ??
      prenda?.TipoPrenda ??
      "Prenda sin nombre",
  };
};

export const PanelSastre = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargarPedidos = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/Pedidos`);

      if (!res.ok) {
        const detalle = await res.text();
        throw new Error(detalle || `Error HTTP ${res.status}`);
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error("La API no devolvió una lista de pedidos");
      }

      const activos = data
        .map(mapPedido)
        .filter((p) => p.estado !== ESTADO.ENTREGADO);

      setPedidos(activos);
    } catch (err) {
      console.error("Error cargando pedidos:", err);
      setPedidos([]);
      setError(
        "No se pudieron cargar los pedidos. Verifica que la API esté ejecutándose en http://localhost:5000."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  const moverPedido = async (id, nuevoEstado) => {
    try {
      const pedido = pedidos.find((p) => p.id === id);
      if (!pedido) return;

      const payload = {
        clienteId: pedido.clienteId,
        prendaCatalogoId: pedido.prendaCatalogoId,
        medidaPrendaId: pedido.medidaPrendaId,
        costoTotal: pedido.costoTotal,
        saldoPendiente: pedido.saldoPendiente,
        estado: nuevoEstado,
        fechaEntrega: pedido.fechaEntrega,
      };

      const res = await fetch(`${API_BASE}/Pedidos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const detalle = await res.text();
        throw new Error(detalle || "No se pudo actualizar el pedido");
      }

      if (nuevoEstado === ESTADO.ENTREGADO) {
        setPedidos((prev) => prev.filter((p) => p.id !== id));
        Swal.fire({
          icon: "success",
          title: "Pedido entregado",
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
        return;
      }

      setPedidos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p))
      );
    } catch (err) {
      console.error("Error actualizando pedido:", err);
      Swal.fire("Error", "No se pudo actualizar el estado del pedido.", "error");
    }
  };

  const verMedidas = async (cliente) => {
    if (!cliente?.id) return;

    try {
      const res = await fetch(`${API_BASE}/Clientes/${cliente.id}`);
      if (!res.ok) throw new Error();

      const data = await res.json();
      const lista = data.medidas ?? data.Medidas;
      const medidas = Array.isArray(lista) ? lista[0] : lista;

      if (medidas) {
        Swal.fire({
          title: `Medidas de ${data.nombre ?? data.Nombre}`,
          html: `
            <div style="text-align: left; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <p><strong>Cuello:</strong> ${medidas.cuello ?? medidas.Cuello ?? 0} cm</p>
              <p><strong>Pecho:</strong> ${medidas.pecho ?? medidas.Pecho ?? 0} cm</p>
              <p><strong>Cintura:</strong> ${medidas.cintura ?? medidas.Cintura ?? 0} cm</p>
              <p><strong>Cadera:</strong> ${medidas.cadera ?? medidas.Cadera ?? 0} cm</p>
              <p><strong>Hombros:</strong> ${medidas.hombros ?? medidas.Hombros ?? 0} cm</p>
              <p><strong>Largo total:</strong> ${medidas.largoTotal ?? medidas.LargoTotal ?? 0} cm</p>
            </div>
          `,
          confirmButtonText: "Cerrar",
          confirmButtonColor: "#181f21",
        });
      } else {
        Swal.fire({
          icon: "info",
          title: "Sin medidas",
          text: `El cliente ${data.nombre ?? data.Nombre} aún no tiene medidas registradas.`,
          confirmButtonColor: "#181f21",
        });
      }
    } catch (err) {
      console.error("Error obteniendo medidas:", err);
      Swal.fire("Error", "No se pudieron cargar las medidas del cliente.", "error");
    }
  };

  const pendientes = pedidos.filter((p) => p.estado === ESTADO.PENDIENTE);
  const enProceso = pedidos.filter((p) => p.estado === ESTADO.EN_PROCESO);
  const terminados = pedidos.filter((p) => p.estado === ESTADO.TERMINADO);

  const confirmarEntrega = async (id) => {
    const resultado = await Swal.fire({
      title: "¿Confirmar entrega?",
      text: "¿El pedido ya fue entregado al cliente?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#c5a880",
      cancelButtonColor: "#181f21",
      confirmButtonText: "Sí, entregar",
      cancelButtonText: "Cancelar",
    });

    if (resultado.isConfirmed) {
      moverPedido(id, ESTADO.ENTREGADO);
    }
  };

  const Ticket = ({ pedido }) => (
    <article className={styles.ticket}>
      <div className={styles.ticketId}>Pedido #{pedido.id}</div>
      <h4 className={styles.ticketPrenda}>{pedido.nombrePrenda}</h4>
      <p className={styles.ticketCliente}>
        {pedido.cliente?.nombre ?? "Cliente sin nombre"}
      </p>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.btnAction}
          onClick={() => verMedidas(pedido.cliente)}
        >
          Ver medidas
        </button>

        {pedido.estado === ESTADO.PENDIENTE && (
          <button
            type="button"
            className={`${styles.btnAction} ${styles.btnGold}`}
            onClick={() => moverPedido(pedido.id, ESTADO.EN_PROCESO)}
          >
            Iniciar
          </button>
        )}

        {pedido.estado === ESTADO.EN_PROCESO && (
          <button
            type="button"
            className={`${styles.btnAction} ${styles.btnGold}`}
            onClick={() => moverPedido(pedido.id, ESTADO.TERMINADO)}
          >
            Finalizar
          </button>
        )}

        {pedido.estado === ESTADO.TERMINADO && (
          <button
            type="button"
            className={`${styles.btnAction} ${styles.btnDark}`}
            onClick={() => confirmarEntrega(pedido.id)}
          >
            Entregar
          </button>
        )}
      </div>
    </article>
  );

  const Columna = ({ titulo, items, vacio }) => (
    <section className={styles.kanbanColumn}>
      <div className={styles.columnHeader}>
        <h3 className={styles.columnTitle}>{titulo}</h3>
        <span className={styles.badgeQty}>{items.length}</span>
      </div>

      {loading ? (
        <p className={styles.emptyHint}>Cargando pedidos...</p>
      ) : items.length === 0 ? (
        <p className={styles.emptyHint}>{vacio}</p>
      ) : (
        items.map((p) => <Ticket key={p.id} pedido={p} />)
      )}
    </section>
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Atelier de <span className={styles.titleAccent}>Confección</span>
          </h1>
          <p className={styles.subtitle}>
            Tablero de producción · arrastra el flujo con los botones de cada pedido
          </p>
        </div>
        <button
          type="button"
          className={styles.btnRefresh}
          onClick={cargarPedidos}
          disabled={loading}
        >
          {loading ? "Actualizando..." : "Actualizar"}
        </button>
      </header>

      {error ? <div className={styles.errorBanner}>{error}</div> : null}

      {!loading && !error && pedidos.length === 0 ? (
        <div className={styles.emptyBoard}>
          <p>No hay pedidos activos en el taller.</p>
          <small>
            Crea pedidos desde Recepción con estado &quot;Pendiente&quot; para verlos aquí.
          </small>
        </div>
      ) : null}

      <main className={styles.kanbanBoard}>
        <Columna
          titulo="Pendientes"
          items={pendientes}
          vacio="Sin pedidos pendientes"
        />
        <Columna
          titulo="En proceso"
          items={enProceso}
          vacio="Sin pedidos en confección"
        />
        <Columna
          titulo="Terminados"
          items={terminados}
          vacio="Sin pedidos listos para entrega"
        />
      </main>
    </div>
  );
};
