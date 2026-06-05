import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { fetchAuth } from "../../../core/utils/fetchAuth";
import { BuscarCliente } from "../../../core/components/BuscarCliente";
import styles from "../../shared/ModulePage.module.css";

const API = "http://localhost:5000/api";

const ESTADOS = ["pendiente", "en proceso", "terminada", "entregada"];
const TIPOS_BOTON = ["Ninguno", "Plástico", "Metálico", "Nácar", "Jeans", "Madera"];

const formatoMoneda = (valor) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(valor);

const formInicial = {
  clienteId: "",
  estiloId: "",
  tipoPrenda: "",
  costoEstimado: 0,
  metrosTela: "",
  consumoTela: "",
  cantidadBotones: "",
  tipoBoton: "",
  observaciones: "",
  sastreId: "",
  estado: "pendiente",
};

export const DashboardOrdenes = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [sastres, setSastres] = useState([]);
  const [estilos, setEstilos] = useState([]);
  const [form, setForm] = useState(formInicial);
  const [editId, setEditId] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroSastre, setFiltroSastre] = useState("");
  const [cargando, setCargando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [clienteTieneMedidas, setClienteTieneMedidas] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const esSastre = usuario?.rol?.nombre?.toLowerCase() === "sastre";

  const cargarDatos = async () => {
    try {
      const params = new URLSearchParams();
      if (filtroEstado) params.append("estado", filtroEstado);
      if (filtroSastre) params.append("sastreId", filtroSastre);
      else if (esSastre) params.append("sastreId", usuario.id);

      const [resOrdenes, resSastres, resEstilos] = await Promise.all([
        fetchAuth(`${API}/ordenes?${params}`),
        fetchAuth(`${API}/Usuarios/sastres`),
        fetchAuth(`${API}/prendas/estilos`),
      ]);

      setOrdenes(await resOrdenes.json());
      setSastres(await resSastres.json());
      setEstilos(await resEstilos.json());
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [filtroEstado, filtroSastre]);

  const verificarMedidasCliente = async (clienteId) => {
    if (!clienteId) {
      setClienteTieneMedidas(false);
      return false;
    }
    try {
      const res = await fetchAuth(`${API}/Medidas/cliente/${clienteId}`);
      const tiene = res.ok;
      setClienteTieneMedidas(tiene);
      return tiene;
    } catch {
      setClienteTieneMedidas(false);
      return false;
    }
  };

  const estadosPermitidos = clienteTieneMedidas
    ? ESTADOS
    : ["pendiente"];

  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === "clienteId") {
      await verificarMedidasCliente(value);
      setForm((prev) => ({ ...prev, [name]: value }));
      return;
    }

    if (name === "estiloId") {
      const estilo = estilos.find((s) => s.id === Number(value));
      if (estilo) {
        setForm((prev) => ({
          ...prev,
          estiloId: value,
          tipoPrenda: estilo.tipoPrenda,
          consumoTela: estilo.consumoTelaAprox,
          costoEstimado: estilo.costo,
        }));
        return;
      }
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const guardarOrden = async (e) => {
    e.preventDefault();

    if (!form.clienteId || !form.estiloId) {
      Swal.fire("Error", "Cliente y estilo de prenda son obligatorios.", "error");
      return;
    }

    const tieneMedidas = await verificarMedidasCliente(form.clienteId);
    if (!tieneMedidas) {
      Swal.fire(
        "Sin medidas",
        "El cliente no tiene medidas registradas. Regístrelas en Recepción → Medidas antes de crear o avanzar la orden.",
        "warning"
      );
      return;
    }

    if (form.estado !== "pendiente" && !tieneMedidas) {
      Swal.fire("Error", "No puede aprobar ni finalizar una orden sin medidas del cliente.", "error");
      return;
    }

    const metros = Number(form.metrosTela) || 0;
    const consumo = Number(form.consumoTela) || 0;
    if (["en proceso", "entregada"].includes(form.estado) && (consumo <= 0 || metros < consumo)) {
      Swal.fire(
        "Falta tela",
        consumo <= 0
          ? "Defina el consumo de tela de la orden."
          : `El cliente trajo ${metros} m y se requieren ${consumo} m para este estado.`,
        "warning"
      );
      return;
    }

    const payload = {
      clienteId: Number(form.clienteId),
      prendaCatalogoId: Number(form.estiloId),
      tipoPrenda: form.tipoPrenda,
      metrosTela: Number(form.metrosTela) || 0,
      consumoTela: Number(form.consumoTela) || 0,
      cantidadBotones: Number(form.cantidadBotones) || 0,
      tipoBoton: form.tipoBoton,
      observaciones: form.observaciones,
      sastreId: form.sastreId ? Number(form.sastreId) : null,
      estado: editId ? form.estado : "pendiente",
    };

    try {
      const url = editId ? `${API}/ordenes/${editId}` : `${API}/ordenes`;
      const res = await fetchAuth(url, {
        method: editId ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Error al guardar");
      }

      Swal.fire("Éxito", editId ? "Orden actualizada." : "Orden registrada.", "success");
      setForm(formInicial);
      setEditId(null);
      setMostrarForm(false);
      cargarDatos();
    } catch (err) {
      Swal.fire("Error", err.message || "No se pudo guardar la orden.", "error");
    }
  };

  const editarOrden = async (orden) => {
    setEditId(orden.id);
    setForm({
      clienteId: orden.clienteId,
      estiloId: orden.prendaCatalogoId || "",
      tipoPrenda: orden.tipoPrenda,
      costoEstimado: orden.costoTotal || orden.precioUnitario || 0,
      metrosTela: orden.metrosTela,
      consumoTela: orden.consumoTela,
      cantidadBotones: orden.cantidadBotones,
      tipoBoton: orden.tipoBoton || "",
      observaciones: orden.observaciones || "",
      sastreId: orden.sastreId || "",
      estado: orden.estado,
    });
    await verificarMedidasCliente(orden.clienteId);
    setClienteSeleccionado(
      orden.cliente ? { id: orden.clienteId, nombre: orden.cliente.nombre } : null
    );
    setMostrarForm(true);
  };

  const badgeEstado = (estado) => {
    const map = {
      pendiente: styles.badgeWarning,
      "en proceso": styles.badgeInfo,
      terminada: styles.badgeSuccess,
      entregada: styles.badgeSuccess,
    };
    return `${styles.badge} ${map[estado] || styles.badgeInfo}`;
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Órdenes de confección</h1>
          <p className={styles.subtitle}>Gestión de telas traídas por el cliente</p>
        </div>
        {!esSastre && (
          <button
            className={styles.btnPrimary}
            onClick={() => {
              setEditId(null);
              setForm(formInicial);
              setClienteSeleccionado(null);
              setMostrarForm(!mostrarForm);
            }}
          >
            {mostrarForm ? "Cancelar" : "Nueva orden"}
          </button>
        )}
      </header>

      {mostrarForm && (
        <form className={styles.cardForm} onSubmit={guardarOrden}>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Cliente *</label>
              <BuscarCliente
                value={clienteSeleccionado}
                onChange={(id) => setForm((prev) => ({ ...prev, clienteId: id }))}
                onSelect={async (c) => {
                  setClienteSeleccionado(c);
                  if (c?.id) await verificarMedidasCliente(c.id);
                  else setClienteTieneMedidas(false);
                }}
              />
              {form.clienteId && !clienteTieneMedidas && (
                <small style={{ color: "#c0392b", fontWeight: 600 }}>
                  Este cliente no tiene medidas. No se puede registrar ni avanzar la orden.
                </small>
              )}
            </div>

            <div className={styles.field}>
              <label>Estilo de la prenda *</label>
              <select name="estiloId" value={form.estiloId} onChange={handleChange} required>
                <option value="">Seleccionar estilo...</option>
                {estilos.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.estilo} — {formatoMoneda(e.costo)} — {e.consumoTelaAprox} m
                  </option>
                ))}
              </select>
            </div>

            {form.estiloId && (
              <div className={styles.field} style={{ gridColumn: "1 / -1" }}>
                <div style={{ background: "#f8f6ee", padding: "0.85rem 1rem", borderRadius: "8px" }}>
                  <strong>Tipo:</strong> {form.tipoPrenda} ·{" "}
                  <strong>Costo estimado:</strong> {formatoMoneda(form.costoEstimado)} ·{" "}
                  <strong>Tela aprox.:</strong> {form.consumoTela} m
                </div>
              </div>
            )}

            <div className={styles.field}>
              <label>Metros de tela traídos por el cliente</label>
              <input type="number" step="0.1" name="metrosTela" value={form.metrosTela} onChange={handleChange} />
            </div>
            <div className={styles.field}>
              <label>Consumo de tela (m)</label>
              <input type="number" step="0.1" name="consumoTela" value={form.consumoTela} onChange={handleChange} />
            </div>
            <div className={styles.field}>
              <label>Cantidad de botones</label>
              <input type="number" name="cantidadBotones" value={form.cantidadBotones} onChange={handleChange} />
            </div>
            <div className={styles.field}>
              <label>Tipo de botón</label>
              <select name="tipoBoton" value={form.tipoBoton} onChange={handleChange}>
                <option value="">Seleccionar...</option>
                {TIPOS_BOTON.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label>Sastre asignado</label>
              <select name="sastreId" value={form.sastreId} onChange={handleChange}>
                <option value="">Sin asignar</option>
                {sastres.map((s) => (
                  <option key={s.id} value={s.id}>{s.nombre}</option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label>Estado</label>
              {editId ? (
                <>
                  <select name="estado" value={form.estado} onChange={handleChange}>
                    {estadosPermitidos.map((e) => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                  {!clienteTieneMedidas && (
                    <small style={{ color: "#747879" }}>
                      Solo pendiente hasta registrar medidas del cliente.
                    </small>
                  )}
                </>
              ) : (
                <>
                  <input type="text" value="pendiente" readOnly disabled />
                  <small style={{ color: "#747879" }}>
                    Las órdenes nuevas siempre inician en pendiente.
                  </small>
                </>
              )}
            </div>
            <div className={styles.field} style={{ gridColumn: "1 / -1" }}>
              <label>Observaciones</label>
              <textarea name="observaciones" value={form.observaciones} onChange={handleChange} />
            </div>
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.btnPrimary}>
              {editId ? "Actualizar orden" : "Registrar orden"}
            </button>
          </div>
        </form>
      )}

      <div className={styles.filters} style={{ marginTop: "1.5rem" }}>
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          {ESTADOS.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
        {!esSastre && (
          <select value={filtroSastre} onChange={(e) => setFiltroSastre(e.target.value)}>
            <option value="">Todos los sastres</option>
            {sastres.map((s) => (
              <option key={s.id} value={s.id}>{s.nombre}</option>
            ))}
          </select>
        )}
      </div>

      <div className={styles.card}>
        {cargando ? (
          <p className={styles.loading}>Cargando órdenes...</p>
        ) : ordenes.length === 0 ? (
          <p className={styles.empty}>No hay órdenes registradas.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Cliente</th>
                <th>Estilo</th>
                <th>Costo</th>
                <th>Tela (m)</th>
                <th>Sastre</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.cliente?.nombre}</td>
                  <td>{o.prendaCatalogo?.nombre || o.tipoPrenda}</td>
                  <td>{formatoMoneda(o.costoTotal || o.precioUnitario)}</td>
                  <td>{o.metrosTela} / {o.consumoTela}</td>
                  <td>{o.sastre?.nombre || "Sin asignar"}</td>
                  <td><span className={badgeEstado(o.estado)}>{o.estado}</span></td>
                  <td>
                    <button className={styles.btnSecondary} onClick={() => editarOrden(o)}>
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
