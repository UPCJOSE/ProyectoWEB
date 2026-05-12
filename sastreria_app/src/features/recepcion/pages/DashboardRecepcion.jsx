// src/features/recepcion/pages/DashboardRecepcion.jsx
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import styles from "./DashboardRecepcion.module.css";
import { useNavigate } from "react-router-dom";

const API = "https://localhost:7196/api";

export const DashboardRecepcion = () => {
  const navigate = useNavigate();
  const [vistaAct, setVistaAct] = useState("clientes");
  const [clienteEdit, setClienteEdit] = useState(null);

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");

  const [clientes, setClientes] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [busquedaDirectorio, setBusquedaDirectorio] = useState("");

  useEffect(() => {
    cargarClientes();
    cargarPedidos();
  }, []);

  const cargarClientes = async () => {
    try {
      const res = await fetch(`${API}/Clientes`);
      const data = await res.json();
      setClientes(data);
    } catch (error) {
      console.error("Error cargando clientes:", error);
    }
  };

  const cargarPedidos = async () => {
    try {
      const res = await fetch(`${API}/Pedidos`);
      const data = await res.json();
      setPedidos(data);
    } catch (error) {
      console.error("Error cargando pedidos:", error);
    }
  };

  const limpiarFormulario = () => {
    setClienteEdit(null);
    setNombre("");
    setTelefono("");
    setCorreo("");
    setDireccion("");
  };

  const nuevoCliente = () => {
    limpiarFormulario();
    setVistaAct("clientes");
  };

  const guardarCliente = async () => {
    if (!nombre || !telefono || !correo || !direccion) {
      Swal.fire("Error", "Por favor complete todos los datos", "error");
      return;
    }

    const payload = {
      id: clienteEdit || 0,
      nombre,
      telefono,
      correo,
      direccion,
    };

    try {
      const url = clienteEdit
        ? `${API}/Clientes/${clienteEdit}`
        : `${API}/Clientes`;
      const method = clienteEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      await cargarClientes();

      Swal.fire({
        icon: "success",
        title: clienteEdit ? "Cliente actualizado" : "Cliente registrado",
        toast: true,
        position: "top-end",
        timer: 2200,
        showConfirmButton: false,
      });

      limpiarFormulario();
      setVistaAct("directorio");
    } catch {
      Swal.fire("Error", "No se pudo guardar el cliente", "error");
    }
  };

  const editarCliente = (cliente) => {
    setClienteEdit(cliente.id);
    setNombre(cliente.nombre);
    setTelefono(cliente.telefono);
    setCorreo(cliente.correo || "");
    setDireccion(cliente.direccion || "");
    setVistaAct("clientes");
  };

  const eliminarCliente = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar cliente?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#c5a880",
      cancelButtonColor: "#181f21",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      await fetch(`${API}/Clientes/${id}`, { method: "DELETE" });
      await cargarClientes();
      Swal.fire({
        icon: "success",
        title: "Cliente eliminado",
        toast: true,
        position: "top-end",
        timer: 2200,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire("Error", "No se pudo eliminar", "error");
    }
  };

  const crearPedido = async () => {
    if (!clientes.length) {
      Swal.fire("Sin clientes", "Primero registra un cliente", "warning");
      return;
    }

    const optionsClientes = clientes
      .map((c) => `<option value="${c.id}">${c.nombre}</option>`)
      .join("");

    const { value: formValues } = await Swal.fire({
      title: "Nuevo Pedido",
      html: `
        <select id="cliente" class="swal2-select" style="display:flex;margin:1em auto;width:73%">
          <option value="">Selecciona cliente</option>
          ${optionsClientes}
        </select>
        <select id="prenda" class="swal2-select" style="display:flex;margin:1em auto;width:73%">
          <option value="">Selecciona prenda</option>
          <option value="Traje">Traje</option>
          <option value="Esmoquin">Esmóquin</option>
          <option value="Camisa">Camisa</option>
          <option value="Chaqueta">Chaqueta</option>
          <option value="Pantalón">Pantalón</option>
          <option value="Otro">Otro</option>
        </select>
        <input id="fecha" type="date" class="swal2-input" style="width: 73%;">
      `,
      showCancelButton: true,
      confirmButtonText: "Crear",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#c5a880",
      cancelButtonColor: "#181f21",
      preConfirm: () => {
        const clienteId = document.getElementById("cliente").value;
        const tipoPrenda = document.getElementById("prenda").value;
        const fechaEntrega = document.getElementById("fecha").value;
        if (!clienteId || !tipoPrenda || !fechaEntrega) {
          Swal.showValidationMessage("Completa todos los campos");
          return false;
        }
        return { clienteId, tipoPrenda, fechaEntrega };
      },
    });

    if (!formValues) return;

    try {
      const payload = {
        tipoPrenda: formValues.tipoPrenda,
        costoTotal: 0,
        saldoPendiente: 0,
        estado: "Pendiente",
        fechaEntrega: formValues.fechaEntrega,
        clienteId: Number(formValues.clienteId),
      };

      const res = await fetch(`${API}/Pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();
      await cargarPedidos();
      Swal.fire({
        icon: "success",
        title: "Pedido creado",
        toast: true,
        position: "top-end",
        timer: 2200,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire("Error", "No se pudo crear pedido", "error");
    }
  };

  const cambiarEstado = async (pedido) => {
    const { value: nuevoEstado } = await Swal.fire({
      title: `Pedido #${pedido.id}`,
      input: "select",
      inputOptions: {
        Pendiente: "Pendiente",
        "En proceso": "En proceso",
        Terminado: "Terminado",
        Entregado: "Entregado",
      },
      inputValue: pedido.estado,
      showCancelButton: true,
      confirmButtonText: "Actualizar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#c5a880",
      cancelButtonColor: "#181f21",
    });

    if (!nuevoEstado || nuevoEstado === pedido.estado) return;

    try {
      const payload = {
        id: pedido.id,
        tipoPrenda: pedido.tipoPrenda,
        costoTotal: pedido.costoTotal,
        saldoPendiente: pedido.saldoPendiente,
        estado: nuevoEstado,
        fechaEntrega: pedido.fechaEntrega,
        clienteId: pedido.clienteId,
      };

      const res = await fetch(`${API}/Pedidos/${pedido.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();
      await cargarPedidos();
      Swal.fire({
        icon: "success",
        title: "Estado actualizado",
        toast: true,
        position: "top-end",
        timer: 2200,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire("Error", "No se pudo actualizar", "error");
    }
  };

  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(busquedaDirectorio.toLowerCase()) ||
      c.telefono.includes(busquedaDirectorio),
  );

  const pedidosPorEstado = (estado) =>
    pedidos.filter((p) => p.estado === estado);

  return (
    <div className="animate__animated animate__fadeIn">
      <header className={styles.header}>
        <h1 className={styles.title}>
          Recepción <br />
          <span className={styles.titleAccent}>del Atelier</span>
        </h1>
      </header>

      {/* METRICAS */}
      <section className={styles.metricsGrid}>
        <div className={styles.card}>
          <small className={styles.label}>Clientes</small>
          <h2>{clientes.length}</h2>
        </div>
        <div className={`${styles.card} ${styles.cardDark}`}>
          <small className={styles.label} style={{ color: "#aaa" }}>
            Pedidos activos
          </small>
          <h2>{pedidos.length}</h2>
        </div>
        <div className={styles.card}>
          <small className={styles.label}>Pendientes</small>
          <h2>{pedidos.filter((p) => p.estado === "Pendiente").length}</h2>
        </div>
      </section>

      {/* TABS */}
      <div className={styles.tabContainer}>
        <button
          onClick={() => setVistaAct("clientes")}
          className={
            vistaAct === "clientes" ? styles.btnTabActive : styles.btnTab
          }
        >
          Clientes
        </button>
        <button
          onClick={() => setVistaAct("directorio")}
          className={
            vistaAct === "directorio" ? styles.btnTabActive : styles.btnTab
          }
        >
          Directorio
        </button>
        <button
          onClick={() => setVistaAct("pedidos")}
          className={
            vistaAct === "pedidos" ? styles.btnTabActive : styles.btnTab
          }
        >
          Pedidos
        </button>
      </div>

      {/* CLIENTES - BLOQUE CENTRADO */}
      {vistaAct === "clientes" && (
        <section className={styles.formSection}>
          <div className={styles.formContainer}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "2rem",
              }}
            >
              <h2>{clienteEdit ? "Editar Cliente" : "Registrar Cliente"}</h2>
              {clienteEdit && (
                <button className={styles.btnActionGold} onClick={nuevoCliente}>
                  + Nuevo Cliente
                </button>
              )}
            </div>

            <div className={styles.personalDataGrid}>
              <div className={styles.fieldWrap}>
                <label className={styles.fieldLabel}>Nombre</label>
                <input
                  className={styles.inputElegant}
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div className={styles.fieldWrap}>
                <label className={styles.fieldLabel}>Teléfono</label>
                <input
                  className={styles.inputElegant}
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </div>
              <div className={styles.fieldWrap}>
                <label className={styles.fieldLabel}>Correo</label>
                <input
                  className={styles.inputElegant}
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>
              <div className={styles.fieldWrap}>
                <label className={styles.fieldLabel}>Dirección</label>
                <input
                  className={styles.inputElegant}
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "2rem",
              }}
            >
              <button
                className={styles.btnDark}
                style={{ padding: "12px 48px", borderRadius: "6px" }}
                onClick={guardarCliente}
              >
                {clienteEdit ? "ACTUALIZAR CLIENTE" : "GUARDAR CLIENTE"}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* DIRECTORIO */}
      {vistaAct === "directorio" && (
        <section className={styles.formSection}>
          <div style={{ flex: 1, padding: "2rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
                alignItems: "center",
              }}
            >
              <h2>Directorio</h2>
              <input
                className={styles.inputElegant}
                style={{ width: "300px" }}
                placeholder="Buscar por nombre o teléfono..."
                value={busquedaDirectorio}
                onChange={(e) => setBusquedaDirectorio(e.target.value)}
              />
            </div>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Teléfono</th>
                    <th>Correo</th>
                    <th style={{ textAlign: "right" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clientesFiltrados.map((cliente) => (
                    <tr key={cliente.id}>
                      <td>{cliente.nombre}</td>
                      <td>{cliente.telefono}</td>
                      <td>{cliente.correo}</td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          className={styles.btnAction}
                          onClick={() => editarCliente(cliente)}
                        >
                          Editar
                        </button>
                        <button
                          className={styles.btnAction}
                          onClick={() => eliminarCliente(cliente.id)}
                        >
                          Eliminar
                        </button>
                        <button
                          className={styles.btnActionGold}
                          onClick={() => {
                            localStorage.setItem(
                              "clienteMedidas",
                              JSON.stringify(cliente),
                            );
                            navigate("/medidas");
                          }}
                        >
                          Medidas
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* PEDIDOS */}
      {vistaAct === "pedidos" && (
        <section style={{ marginTop: "2rem" }}>
          <button
            className={styles.btnGold}
            onClick={crearPedido}
            style={{ marginBottom: "2rem" }}
          >
            + Crear Pedido
          </button>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1.5rem",
            }}
          >
            {["Pendiente", "En proceso", "Terminado", "Entregado"].map(
              (estado) => (
                <div
                  key={estado}
                  className={styles.card}
                  style={{ minHeight: "450px", padding: "1rem" }}
                >
                  <h4>{estado}</h4>
                  {pedidosPorEstado(estado).map((pedido) => (
                    <div
                      key={pedido.id}
                      style={{
                        background: "white",
                        padding: "1rem",
                        borderRadius: "12px",
                        marginBottom: "1rem",
                        boxShadow: "0 5px 20px rgba(0,0,0,.08)",
                      }}
                    >
                      <strong>Pedido #{pedido.id}</strong>
                      <p className="mb-1 mt-2">
                        Cliente: {pedido.cliente?.nombre}
                      </p>
                      <p className="mb-1">Prenda: {pedido.tipoPrenda}</p>
                      <p className="mb-3">
                        Entrega:{" "}
                        {new Date(pedido.fechaEntrega).toLocaleDateString()}
                      </p>
                      {pedido.estado !== "Entregado" && (
                        <button
                          className={styles.btnOutline}
                          onClick={() => cambiarEstado(pedido)}
                        >
                          Cambiar estado
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ),
            )}
          </div>
        </section>
      )}
    </div>
  );
};
