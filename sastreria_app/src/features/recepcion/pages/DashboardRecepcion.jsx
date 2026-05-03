// src/features/recepcion/pages/DashboardRecepcion.jsx
import { useState } from "react";
import styles from "./DashboardRecepcion.module.css";
import Swal from "sweetalert2";

export const DashboardRecepcion = () => {
  const [vistaAct, setVistaAct] = useState("formulario");
  const [clienteEdit, setClienteEdit] = useState(null);
  const [mostrarMedidas, setMostrarMedidas] = useState(false);
  const [clienteAsignado, setClienteAsignado] = useState("");
  const [prendaSeleccionada, setPrendaSeleccionada] = useState("");
  const [sastreAsignado, setSastreAsignado] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");

  // Estados del formulario principal
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");

  // Estado unificado para las medidas
  const [medidas, setMedidas] = useState({
    cuello: "",
    pecho: "",
    hombros: "",
    largoManga: "",
    largoTalle: "",
    largoTotalSup: "",
    cintura: "",
    cadera: "",
    altoCadera: "",
    entrepierna: "",
    largoTotalInf: "",
    anchoBajo: "",
  });

  // Simulamos una base de datos más real
  const [clientes, setClientes] = useState([
    {
      id: 1,
      nombre: "Sebastián Maestre",
      telefono: "+57 300 000 000",
      medidas: { cuello: 40, pecho: 100, hombros: 45 /* ... */ },
    },
    {
      id: 2,
      nombre: "María González",
      telefono: "+57 301 111 111",
      medidas: { cuello: 36, pecho: 90, hombros: 40 },
    },
  ]);

  const [busquedaDirectorio, setDirectorio] = useState("");
  const [busquedaPedido, setBusqueda] = useState("");

  const clientesEnDirectorio = clientes.filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(busquedaDirectorio.toLowerCase()) ||
      cliente.telefono.includes(busquedaDirectorio),
  );

  const clientesEnPedido = clientes.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(busquedaPedido.toLowerCase()),
  );

  // Carga los datos de un cliente existente
  const Edicion = (cliente) => {
    setClienteEdit(cliente.id);
    setNombre(cliente.nombre);
    setTelefono(cliente.telefono);

    // Llenamos el objeto de medidas con los datos del cliente
    setMedidas({
      cuello: cliente.medidas?.cuello || "",
      pecho: cliente.medidas?.pecho || "",
      hombros: cliente.medidas?.hombros || "",
      largoManga: cliente.medidas?.largoManga || "",
      largoTalle: cliente.medidas?.largoTalle || "",
      largoTotalSup: cliente.medidas?.largoTotalSup || "",
      cintura: cliente.medidas?.cintura || "",
      cadera: cliente.medidas?.cadera || "",
      altoCadera: cliente.medidas?.altoCadera || "",
      entrepierna: cliente.medidas?.entrepierna || "",
      largoTotalInf: cliente.medidas?.largoTotalInf || "",
      anchoBajo: cliente.medidas?.anchoBajo || "",
    });

    setMostrarMedidas(true);
    setVistaAct("formulario");
  };

  const Eliminacion = async (id) => {
    const resultado = await Swal.fire({
      title: "¿Eliminar cliente?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#181f21",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (resultado.isConfirmed) {
      setClientes(clientes.filter((c) => c.id !== id));
      Swal.fire({
        icon: "success",
        title: "Eliminado!",
        text: "El cliente ha sido eliminado del directorio.",
        confirmButtonColor: "#181f21",
      });
    }
  };

  const NuevoCliente = () => {
    setClienteEdit(null);
    setNombre("");
    setTelefono("");
    setMostrarMedidas(false);

    setMedidas({
      cuello: "",
      pecho: "",
      hombros: "",
      largoManga: "",
      largoTalle: "",
      largoTotalSup: "",
      cintura: "",
      cadera: "",
      altoCadera: "",
      entrepierna: "",
      largoTotalInf: "",
      anchoBajo: "",
    });

    setVistaAct("formulario");
  };

  // Función universal para actualizar cualquier input de medidas
  const CambioMedida = (e) => {
    const { name, value } = e.target;
    setMedidas((medidasPrev) => ({
      ...medidasPrev,
      [name]: value,
    }));
  };

  const solicitarMedidas = async (e) => {
    e.preventDefault();
    const resultado = await Swal.fire({
      title: "¿Añadir medidas?",
      text: "¿Desea registrar las medidas del cliente en este momento?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#c5a880",
      cancelButtonColor: "#181f21",
      confirmButtonText: "Sí, registrar ahora",
      cancelButtonText: "Quizás después",
    });

    if (resultado.isConfirmed) {
      setMostrarMedidas(true);
    }
  };

  const guardarCliente = () => {
    if (nombre.trim() === "" || telefono.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Faltan datos",
        text: "Por favor, ingresa el nombre y el teléfono del cliente.",
        confirmButtonColor: "#181f21",
      });
      return;
    }

    if (clienteEdit) {
      setClientes(
        clientes.map((c) =>
          c.id === clienteEdit
            ? { ...c, nombre, telefono, medidas: { ...medidas } }
            : c,
        ),
      );
      Swal.fire({
        icon: "success",
        title: "Cliente actualizado",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } else {
      const nuevoCliente = {
        id: Date.now(),
        nombre,
        telefono,
        medidas: { ...medidas },
      };
      setClientes([...clientes, nuevoCliente]);
      Swal.fire({
        icon: "success",
        title: "Cliente guardado",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }

    NuevoCliente();
    setVistaAct("tabla");
  };

  const generarOrden = () => {
    if (
      !clienteAsignado ||
      !prendaSeleccionada ||
      !sastreAsignado ||
      !fechaEntrega
    ) {
      alert(
        "Por favor, completa todos los campos requeridos antes de generar la orden.",
      );
      return;
    }

    alert("Orden generada y asignada al sastre correctamente.");

    setClienteAsignado("");
    setPrendaSeleccionada("");
    setSastreAsignado("");
    setFechaEntrega("");
    setBusqueda("");
  };

  return (
    <div className="animate__animated animate__fadeIn">
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>
          Recepción <br />{" "}
          <span className={styles.titleAccent}>del Atelier</span>
        </h1>
        <p className="text-muted">
          Gestione cada detalle de la experiencia de sus clientes.
        </p>
      </header>

      {/* Métricas rápidas */}
      <section className={styles.metricsGrid}>
        <div className={styles.card}>
          <small className={styles.label}>Clientes Hoy</small>
          <h2>24</h2>
        </div>
        <div className={`${styles.card} ${styles.cardDark}`}>
          <small className={styles.label} style={{ color: "#aaa" }}>
            Pedidos Activos
          </small>
          <h2>156</h2>
        </div>
        <div className={styles.card}>
          <small className={styles.label}>En Sastrería</small>
          <h2>8</h2>
        </div>
      </section>

      {/* Sección de Formularios */}
      <div className={styles.formSection}>
        {/* Registro, Medidas y Directorio */}
        <div style={{ flex: 1, padding: "2rem" }}>
          <div className={styles.tabContainer}>
            <button
              onClick={NuevoCliente}
              className={
                vistaAct === "formulario" && !clienteEdit
                  ? styles.btnTabActive
                  : styles.btnTab
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

                {/* Buscador del Directorio */}
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
                    <th>Ultima Medida</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Usamos la lista filtrada  */}
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
                        No se encontraron clientes con esa búsqueda.
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
                    placeholder="Ej: Sebastián Maestre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>

                <div className={styles.fieldWrap}>
                  <label className={styles.fieldLabel}>Teléfono</label>
                  <input
                    type="text"
                    className={styles.inputLine}
                    placeholder="+57 300 000 000"
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
                  + Añadir medidas del cliente (Opcional)
                </button>
              )}

              {mostrarMedidas && (
                <div className="animate__animated animate__fadeIn">
                  <h3 style={{ marginTop: "2rem", marginBottom: "1rem" }}>
                    Medidas Superiores (cm)
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "1rem",
                    }}
                  >
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Cuello</label>
                      <input
                        type="number"
                        step="0.1"
                        className={styles.inputLine}
                        placeholder="0.0"
                        name="cuello"
                        value={medidas.cuello}
                        onChange={CambioMedida}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Pecho</label>
                      <input
                        type="number"
                        step="0.1"
                        className={styles.inputLine}
                        placeholder="0.0"
                        name="pecho"
                        value={medidas.pecho}
                        onChange={CambioMedida}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Hombros</label>
                      <input
                        type="number"
                        step="0.1"
                        className={styles.inputLine}
                        placeholder="0.0"
                        name="hombros"
                        value={medidas.hombros}
                        onChange={CambioMedida}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Largo Manga</label>
                      <input
                        type="number"
                        step="0.1"
                        className={styles.inputLine}
                        placeholder="0.0"
                        name="largoManga"
                        value={medidas.largoManga}
                        onChange={CambioMedida}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Largo Talle</label>
                      <input
                        type="number"
                        step="0.1"
                        className={styles.inputLine}
                        placeholder="0.0"
                        name="largoTalle"
                        value={medidas.largoTalle}
                        onChange={CambioMedida}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Largo Total</label>
                      <input
                        type="number"
                        step="0.1"
                        className={styles.inputLine}
                        placeholder="0.0"
                        name="largoTotalSup"
                        value={medidas.largoTotalSup}
                        onChange={CambioMedida}
                      />
                    </div>
                  </div>
                  <h3 style={{ marginTop: "2rem", marginBottom: "1rem" }}>
                    Medidas Inferiores (cm)
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "1rem",
                    }}
                  >
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Cintura</label>
                      <input
                        type="number"
                        step="0.1"
                        className={styles.inputLine}
                        placeholder="0.0"
                        name="cintura"
                        value={medidas.cintura}
                        onChange={CambioMedida}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Cadera</label>
                      <input
                        type="number"
                        step="0.1"
                        className={styles.inputLine}
                        placeholder="0.0"
                        name="cadera"
                        value={medidas.cadera}
                        onChange={CambioMedida}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Alto Cadera</label>
                      <input
                        type="number"
                        step="0.1"
                        className={styles.inputLine}
                        placeholder="0.0"
                        name="altoCadera"
                        value={medidas.altoCadera}
                        onChange={CambioMedida}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Entrepierna</label>
                      <input
                        type="number"
                        step="0.1"
                        className={styles.inputLine}
                        placeholder="0.0"
                        name="entrepierna"
                        value={medidas.entrepierna}
                        onChange={CambioMedida}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Ancho bajo</label>
                      <input
                        type="number"
                        step="0.1"
                        className={styles.inputLine}
                        placeholder="0.0"
                        name="anchoBajo"
                        value={medidas.anchoBajo}
                        onChange={CambioMedida}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Largo Total</label>
                      <input
                        type="number"
                        step="0.1"
                        className={styles.inputLine}
                        placeholder="0.0"
                        name="largoTotalInf"
                        value={medidas.largoTotalInf}
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
                {clienteEdit
                  ? "ACTUALIZAR PERFIL"
                  : "GUARDAR PERFIL DE CLIENTE"}
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

              {/* Buscador menu de seleccion */}
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
                style={{ backgroundColor: "transparent", color: "gray" }}
                value={clienteAsignado}
                onChange={(e) => setClienteAsignado(e.target.value)}
              >
                <option value="" disabled>
                  Seleccione un cliente de la lista
                </option>
                {/* lista filtrada para el pedido */}
                {clientesEnPedido.map((cliente) => (
                  <option
                    key={cliente.id}
                    value={cliente.id}
                    style={{ color: "black" }}
                  >
                    {cliente.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Seleccionar Prenda</label>
              <select
                className={styles.inputLine}
                style={{ backgroundColor: "transparent", color: "gray" }}
                value={prendaSeleccionada}
                onChange={(e) => setPrendaSeleccionada(e.target.value)}
              >
                <option value="" disabled>
                  Seleccione una opción
                </option>
                <option value="traje" style={{ color: "black" }}>
                  Traje Lana Merina
                </option>
                <option value="esmoquin" style={{ color: "black" }}>
                  Esmóquin de Gala
                </option>
                <option value="camisa" style={{ color: "black" }}>
                  Camisa Popelina
                </option>
                <option value="pantalon" style={{ color: "black" }}>
                  Pantalón de Vestir
                </option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Sastre Asignado</label>
              <select
                className={styles.inputLine}
                style={{ backgroundColor: "transparent", color: "gray" }}
                value={sastreAsignado}
                onChange={(e) => setSastreAsignado(e.target.value)}
              >
                <option value="" disabled>
                  Seleccione sastre
                </option>
                <option value="sastre1" style={{ color: "black" }}>
                  Maestro Alessandro
                </option>
                <option value="sastre2" style={{ color: "black" }}>
                  Sastre Valentina
                </option>
                <option value="sastre3" style={{ color: "black" }}>
                  Oficial Roberto
                </option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Fecha de Entrega</label>
              <input
                type="date"
                className={styles.inputLine}
                style={{ color: "gray" }}
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
