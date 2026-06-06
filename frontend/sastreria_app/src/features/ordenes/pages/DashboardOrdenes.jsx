import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { fetchAuth } from "../../../core/utils/fetchAuth";
import styles from "../../shared/ModulePage.module.css";

const API = "https://localhost:7196/api";

const ESTADOS = ["pendiente", "en proceso", "terminada", "entregada"];
const TIPOS_BOTON = ["Plástico", "Metálico", "Nácar", "Jeans", "Madera"];

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
  const [clientes, setClientes] = useState([]);
  const [sastres, setSastres] = useState([]);
  const [estilos, setEstilos] = useState([]);
  const [form, setForm] = useState(formInicial);
  const [editId, setEditId] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroSastre, setFiltroSastre] = useState("");
  const [cargando, setCargando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);

  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const esSastre = usuario?.rol?.nombre?.toLowerCase() === "sastre";

  const cargarDatos = async () => {
    try {
      const params = new URLSearchParams();
      if (filtroEstado) params.append("estado", filtroEstado);
      if (filtroSastre) params.append("sastreId", filtroSastre);
      else if (esSastre) params.append("sastreId", usuario.id);

      const [resOrdenes, resClientes, resSastres, resEstilos] = await Promise.all([
        fetchAuth(`${API}/ordenes?${params}`),
        fetchAuth(`${API}/Clientes`),
        fetchAuth(`${API}/Usuarios/sastres`),
        fetchAuth(`${API}/prendas/estilos`),
      ]);

      setOrdenes(await resOrdenes.json());
      setClientes(await resClientes.json());
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

  const handleChange = (e) => {
    const { name, value } = e.target;

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
      estado: form.estado,
    };

    try {
      const url = editId ? `${API}/ordenes/${editId}` : `${API}/ordenes`;
      const res = await fetchAuth(url, {
        method: editId ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      Swal.fire("Éxito", editId ? "Orden actualizada." : "Orden registrada.", "success");
      setForm(formInicial);
      setEditId(null);
      setMostrarForm(false);
      cargarDatos();
    } catch {
      Swal.fire("Error", "No se pudo guardar la orden.", "error");
    }
  };

  const editarOrden = (orden) => {
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
              <select name="clienteId" value={form.clienteId} onChange={handleChange} required>
                <option value="">Seleccionar...</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
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
              <select name="estado" value={form.estado} onChange={handleChange}>
                {ESTADOS.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
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
