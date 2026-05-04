// src/features/recepcion/pages/DashboardRecepcion.jsx
import { useState, useEffect } from "react";
import styles from "./DashboardRecepcion.module.css";
import Swal from "sweetalert2";

const API = "https://localhost:7196/api";

export const DashboardRecepcion = () => {
  const [vistaAct, setVistaAct] = useState("formulario");
  const [clienteEdit, setClienteEdit] = useState(null);
  const [mostrarMedidas, setMostrarMedidas] = useState(false);

  const [clienteAsignado, setClienteAsignado] = useState("");
  const [prendaSeleccionada, setPrendaSeleccionada] = useState("");
  const [sastreAsignado, setSastreAsignado] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");

  const [medidas, setMedidas] = useState({
    pecho: "",
    cintura: "",
    cadera: "",
    largoBrazo: "",
  });

  const [clientes, setClientes] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  const [busquedaDirectorio, setDirectorio] = useState("");
  const [busquedaPedido, setBusqueda] = useState("");

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
      console.error(error);
    }
  };

  const cargarPedidos = async () => {
    try {
      const res = await fetch(`${API}/Pedidos`);
      const data = await res.json();
      setPedidos(data);
    } catch (error) {
      console.error(error);
    }
  };

  const clientesEnDirectorio = clientes.filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(busquedaDirectorio.toLowerCase()) ||
      cliente.telefono.includes(busquedaDirectorio)
  );

  const clientesEnPedido = clientes.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(busquedaPedido.toLowerCase())
  );

  const NuevoCliente = () => {
    setClienteEdit(null);
    setNombre("");
    setTelefono("");
    setMostrarMedidas(false);

    setMedidas({
      pecho: "",
      cintura: "",
      cadera: "",
      largoBrazo: "",
    });

    setVistaAct("formulario");
  };

  const CambioMedida = (e) => {
    const { name, value } = e.target;

    setMedidas((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const solicitarMedidas = async (e) => {
    e.preventDefault();

    const resultado = await Swal.fire({
      title: "¿Añadir medidas?",
      text: "¿Desea registrar medidas ahora?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#c5a880",
      cancelButtonColor: "#181f21",
      confirmButtonText: "Sí",
      cancelButtonText: "Después",
    });

    if (resultado.isConfirmed) setMostrarMedidas(true);
  };

  const guardarCliente = async () => {
    if (!nombre || !telefono) {
      Swal.fire("Error", "Nombre y teléfono son obligatorios", "error");
      return;
    }

    try {
      let clienteId = clienteEdit;

      const clientePayload = {
        id: clienteEdit || 0,
        nombre,
        telefono,
        correo: "",
        direccion: "",
      };

      if (clienteEdit) {
        await fetch(`${API}/Clientes/${clienteEdit}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(clientePayload),
        });
      } else {
        const res = await fetch(`${API}/Clientes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(clientePayload),
        });

        const nuevo = await res.json();
        clienteId = nuevo.id;
      }

      if (mostrarMedidas) {
        await fetch(`${API}/Medidas`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pecho: Number(medidas.pecho || 0),
            cintura: Number(medidas.cintura || 0),
            cadera: Number(medidas.cadera || 0),
            largoBrazo: Number(medidas.largoBrazo || 0),
            fechaRegistro: new Date(),
            clienteId,
          }),
        });
      }

      await cargarClientes();

      Swal.fire({
        icon: "success",
        title: "Cliente guardado",
        toast: true,
        position: "top-end",
        timer: 2500,
        showConfirmButton: false,
      });

      NuevoCliente();
      setVistaAct("tabla");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo guardar", "error");
    }
  };

  const Eliminacion = async (id) => {
    const resultado = await Swal.fire({
      title: "¿Eliminar cliente?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
    });

    if (!resultado.isConfirmed) return;

    await fetch(`${API}/Clientes/${id}`, {
      method: "DELETE",
    });

    cargarClientes();
  };

  const Edicion = (cliente) => {
    setClienteEdit(cliente.id);
    setNombre(cliente.nombre);
    setTelefono(cliente.telefono);
    setVistaAct("formulario");
  };

  const generarOrden = async () => {
    if (
      !clienteAsignado ||
      !prendaSeleccionada ||
      !sastreAsignado ||
      !fechaEntrega
    ) {
      Swal.fire("Error", "Completa todos los campos", "error");
      return;
    }

    try {
      await fetch(`${API}/Pedidos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipoPrenda: prendaSeleccionada,
          costoTotal: 0,
          saldoPendiente: 0,
          estado: "Pendiente",
          fechaEntrega,
          clienteId: Number(clienteAsignado),
        }),
      });

      await cargarPedidos();

      Swal.fire({
        icon: "success",
        title: "Orden generada",
        toast: true,
        position: "top-end",
        timer: 2500,
        showConfirmButton: false,
      });

      setClienteAsignado("");
      setPrendaSeleccionada("");
      setSastreAsignado("");
      setFechaEntrega("");
      setBusqueda("");
    } catch (error) {
      Swal.fire("Error", "No se pudo crear pedido", "error");
    }
  };

  return (
  <div className="animate__animated animate__fadeIn">
    {/* Header */}
    <header className={styles.header}>
      <h1 className={styles.title}>
        Recepción <br />
        <span className={styles.titleAccent}>del Atelier</span>
      </h1>
      <p className="text-muted">
        Gestione cada detalle de la experiencia de sus clientes.
      </p>
    </header>

    {/* Métricas reales */}
    <section className={styles.metricsGrid}>
      <div className={styles.card}>
        <small className={styles.label}>Clientes</small>
        <h2>{clientes.length}</h2>
      </div>

      <div className={`${styles.card} ${styles.cardDark}`}>
        <small className={styles.label} style={{ color: "#aaa" }}>
          Pedidos Activos
        </small>
        <h2>{pedidos.length}</h2>
      </div>

      <div className={styles.card}>
        <small className={styles.label}>En Sastrería</small>
        <h2>{pedidos.filter((p) => p.estado === "Pendiente").length}</h2>
      </div>
    </section>

    {/* Sección de Formularios */}
    <div className={styles.formSection}>
      {/* Registro / Directorio */}
      <div style={{ flex: 1, padding: "2rem" }}>
        <div className={styles.tabContainer}>
          <button
            onClick={NuevoCliente}
            className={
              vistaAct === "formulario" ? styles.btnTabActive : styles.btnTab
            }
          >
            + Nuevo Cliente
          </button>

          <button
            onClick={() => setVistaAct("tabla")}
            className={
              vistaAct === "tabla" ? styles.btnTabActive : styles.btnTab
            }
          >
            Ver Directorio
          </button>
        </div>

        {vistaAct === "tabla" ? (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2>Directorio de Clientes</h2>

              <input
                type="text"
                placeholder="Buscar por nombre o teléfono..."
                className={styles.inputLine}
                style={{ width: "300px", marginBottom: "1rem" }}
                value={busquedaDirectorio}
                onChange={(e) => setDirectorio(e.target.value)}
              />
            </div>

            <table
              style={{ width: "100%", textAlign: "left", marginTop: "1rem" }}
            >
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Teléfono</th>
                  <th>Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {clientesEnDirectorio.length > 0 ? (
                  clientesEnDirectorio.map((cliente) => (
                    <tr
                      key={cliente.id}
                      style={{ borderBottom: "1px solid #ccc" }}
                    >
                      <td style={{ padding: "1rem 0" }}>{cliente.nombre}</td>
                      <td>{cliente.telefono}</td>
                      <td>{new Date().toLocaleDateString()}</td>

                      <td>
                        <button
                          onClick={() => Edicion(cliente)}
                          style={{ marginRight: "10px" }}
                        >
                          Editar
                        </button>

                        <button onClick={() => Eliminacion(cliente.id)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      style={{ textAlign: "center", padding: "2rem" }}
                    >
                      No se encontraron clientes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            <h2>{clienteEdit ? "Editar Cliente" : "Datos Personales"}</h2>

            <div className={styles.personalDataGrid}>
              <div className={styles.fieldWrap}>
                <label className={styles.fieldLabel}>Nombre Completo</label>
                <input
                  type="text"
                  className={styles.inputLine}
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>

              <div className={styles.fieldWrap}>
                <label className={styles.fieldLabel}>Teléfono</label>
                <input
                  type="text"
                  className={styles.inputLine}
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </div>
            </div>

            {!mostrarMedidas && (
              <button
                className={styles.btnOutline}
                style={{ marginBottom: "2rem", width: "100%" }}
                onClick={solicitarMedidas}
              >
                + Añadir medidas del cliente
              </button>
            )}

            {mostrarMedidas && (
              <div className="animate__animated animate__fadeIn">
                <h3 style={{ marginTop: "2rem", marginBottom: "1rem" }}>
                  Medidas (cm)
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "1rem",
                  }}
                >
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Pecho</label>
                    <input
                      type="number"
                      className={styles.inputLine}
                      name="pecho"
                      value={medidas.pecho}
                      onChange={CambioMedida}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Cintura</label>
                    <input
                      type="number"
                      className={styles.inputLine}
                      name="cintura"
                      value={medidas.cintura}
                      onChange={CambioMedida}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Cadera</label>
                    <input
                      type="number"
                      className={styles.inputLine}
                      name="cadera"
                      value={medidas.cadera}
                      onChange={CambioMedida}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Largo Brazo</label>
                    <input
                      type="number"
                      className={styles.inputLine}
                      name="largoBrazo"
                      value={medidas.largoBrazo}
                      onChange={CambioMedida}
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              className={styles.btnDark}
              onClick={guardarCliente}
              style={{ width: "100%", marginTop: "2rem" }}
            >
              {clienteEdit ? "ACTUALIZAR PERFIL" : "GUARDAR PERFIL DE CLIENTE"}
            </button>
          </div>
        )}
      </div>

      {/* Nuevo Pedido */}
      <aside>
        <div className={styles.orderPanel}>
          <h3 className="font-headline mb-3 text-white">Nuevo Pedido</h3>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Cliente Asignado</label>

            <input
              type="text"
              placeholder="Filtrar cliente..."
              className={styles.inputLine}
              style={{
                backgroundColor: "transparent",
                color: "white",
                marginBottom: "0.5rem",
                borderColor: "rgba(255,255,255,0.2)",
              }}
              value={busquedaPedido}
              onChange={(e) => setBusqueda(e.target.value)}
            />

            <select
              className={styles.inputLine}
              value={clienteAsignado}
              onChange={(e) => setClienteAsignado(e.target.value)}
            >
              <option value="">Seleccione un cliente</option>

              {clientesEnPedido.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Seleccionar Prenda</label>

            <select
              className={styles.inputLine}
              value={prendaSeleccionada}
              onChange={(e) => setPrendaSeleccionada(e.target.value)}
            >
              <option value="">Seleccione una opción</option>
              <option value="Traje">Traje</option>
              <option value="Esmoquin">Esmóquin</option>
              <option value="Camisa">Camisa</option>
              <option value="Pantalón">Chaqueta</option>
              <option value="Pantalón">Bolso</option>
              <option value="Pantalón">Otro</option>

            </select>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Sastre Asignado</label>

            <select
              className={styles.inputLine}
              value={sastreAsignado}
              onChange={(e) => setSastreAsignado(e.target.value)}
            >
              <option value="">Seleccione sastre</option>
              <option value="Alessandro">Maestro Alessandro</option>
              <option value="Valentina">Sastre Valentina</option>
              <option value="Roberto">Oficial Roberto</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Fecha de Entrega</label>

            <input
              type="date"
              className={styles.inputLine}
              value={fechaEntrega}
              onChange={(e) => setFechaEntrega(e.target.value)}
            />
          </div>

          <button className={styles.btnGold} onClick={generarOrden}>
            Generar Orden
          </button>
        </div>
      </aside>
    </div>
  </div>
);
};