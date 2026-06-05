import { useEffect, useState, useMemo } from "react";
import Swal from "sweetalert2";
import { fetchAuth } from "../../../core/utils/fetchAuth";
import { ImagenPrenda } from "../../../core/components/ImagenPrenda";
import { BuscarCliente } from "../../../core/components/BuscarCliente";
import styles from "../../shared/ModulePage.module.css";
import invStyles from "./DashboardInventario.module.css";

const API = "http://localhost:5000/api";

const TIPOS = ["Camisa", "Blusa", "Pantalón", "Falda"];
const ESTADOS = ["disponible", "en alquiler", "en confección"];
const TALLAS = ["XS", "S", "M", "L", "XL", "XXL"];

const formInicial = {
  nombre: "",
  tipoPrenda: "",
  talla: "",
  color: "",
  cantidad: 0,
  estado: "disponible",
  precioVenta: "",
  precioAlquiler: "",
  imagenUrl: "",
};

export const DashboardInventario = () => {
  const [prendas, setPrendas] = useState([]);
  const [clienteTx, setClienteTx] = useState(null);
  const [form, setForm] = useState(formInicial);
  const [editId, setEditId] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroTalla, setFiltroTalla] = useState("");
  const [cargando, setCargando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [modalTx, setModalTx] = useState(null);
  const [txForm, setTxForm] = useState({ clienteId: "", prendaId: "", cantidad: 1 });

  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const esAdmin = usuario?.rol?.nombre?.toLowerCase() === "administrador";

  const prendaSeleccionadaTx = useMemo(
    () => prendas.find((p) => String(p.id) === String(txForm.prendaId)),
    [prendas, txForm.prendaId]
  );

  const cargarPrendas = async () => {
    try {
      const params = new URLSearchParams();
      if (filtroTipo) params.append("tipo", filtroTipo);
      if (filtroEstado) params.append("estado", filtroEstado);
      if (filtroTalla) params.append("talla", filtroTalla);

      const res = await fetchAuth(`${API}/prendas?${params}`);
      setPrendas(await res.json());
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPrendas();
  }, [filtroTipo, filtroEstado, filtroTalla]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const guardarPrenda = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.tipoPrenda) {
      Swal.fire("Error", "Nombre y tipo son obligatorios.", "error");
      return;
    }

    const payload = {
      ...form,
      cantidad: Number(form.cantidad),
      precioVenta: Number(form.precioVenta),
      precioAlquiler: Number(form.precioAlquiler),
      imagenUrl: form.imagenUrl?.trim() || null,
    };

    try {
      const url = editId ? `${API}/prendas/${editId}` : `${API}/prendas`;
      const res = await fetchAuth(url, {
        method: editId ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();

      Swal.fire("Éxito", editId ? "Prenda actualizada." : "Prenda registrada.", "success");
      setForm(formInicial);
      setEditId(null);
      setMostrarForm(false);
      cargarPrendas();
    } catch {
      Swal.fire("Error", "No se pudo guardar la prenda.", "error");
    }
  };

  const editarPrenda = (p) => {
    setEditId(p.id);
    setForm({
      nombre: p.nombre,
      tipoPrenda: p.tipoPrenda,
      talla: p.talla || "",
      color: p.color || "",
      cantidad: p.cantidad,
      estado: p.estado || "disponible",
      precioVenta: p.precioBase,
      precioAlquiler: p.precioAlquiler,
      imagenUrl: p.imagenUrl || "",
    });
    setMostrarForm(true);
  };

  const eliminarPrenda = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar prenda?",
      text: "Solo el administrador puede realizar esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
    });
    if (!result.isConfirmed) return;

    try {
      const res = await fetchAuth(`${API}/prendas/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      Swal.fire("Eliminada", "Prenda eliminada del inventario.", "success");
      cargarPrendas();
    } catch {
      Swal.fire("Error", "No tienes permiso o hubo un error.", "error");
    }
  };

  const abrirTransaccion = (tipo) => {
    setModalTx(tipo);
    setTxForm({ clienteId: "", prendaId: "", cantidad: 1 });
    setClienteTx(null);
  };

  const confirmarTransaccion = async () => {
    if (!txForm.clienteId || !txForm.prendaId || !txForm.cantidad) {
      Swal.fire("Error", "Complete cliente, prenda y cantidad.", "error");
      return;
    }

    try {
      const endpoint = modalTx === "venta" ? "Ventas" : "Alquileres";
      const res = await fetchAuth(`${API}/${endpoint}`, {
        method: "POST",
        body: JSON.stringify({
          clienteId: Number(txForm.clienteId),
          items: [{ prendaId: Number(txForm.prendaId), cantidad: Number(txForm.cantidad) }],
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      const factura = await res.json();
      Swal.fire(
        "Factura generada",
        `Se creó la factura FAC-${String(factura.numeroFactura).padStart(4, "0")} automáticamente.`,
        "success"
      );
      setModalTx(null);
      cargarPrendas();
    } catch (error) {
      Swal.fire("Error", error.message || "No se pudo completar la operación.", "error");
    }
  };

  const prendasConStock = prendas.filter((p) => p.cantidad > 0);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Inventario de prendas</h1>
          <p className={styles.subtitle}>
            Camisas, blusas, pantalones y faldas — con imagen de catálogo (URL)
          </p>
        </div>
        <div className={styles.actions}>
          <button className={styles.btnSecondary} onClick={() => abrirTransaccion("alquiler")}>
            Alquiler
          </button>
          <button className={styles.btnSecondary} onClick={() => abrirTransaccion("venta")}>
            Venta
          </button>
          <button
            className={styles.btnPrimary}
            onClick={() => {
              setEditId(null);
              setForm(formInicial);
              setMostrarForm(!mostrarForm);
            }}
          >
            {mostrarForm ? "Cancelar" : "Agregar prenda"}
          </button>
        </div>
      </header>

      {mostrarForm && (
        <form className={styles.cardForm} onSubmit={guardarPrenda}>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Nombre / Referencia *</label>
              <input name="nombre" value={form.nombre} onChange={handleChange} required />
            </div>
            <div className={styles.field}>
              <label>Tipo *</label>
              <select name="tipoPrenda" value={form.tipoPrenda} onChange={handleChange} required>
                <option value="">Seleccionar...</option>
                {TIPOS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label>Talla</label>
              <select name="talla" value={form.talla} onChange={handleChange}>
                <option value="">—</option>
                {TALLAS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label>Color</label>
              <input name="color" value={form.color} onChange={handleChange} />
            </div>
            <div className={styles.field}>
              <label>Cantidad</label>
              <input type="number" min="0" name="cantidad" value={form.cantidad} onChange={handleChange} />
            </div>
            <div className={styles.field}>
              <label>Estado</label>
              <select name="estado" value={form.estado} onChange={handleChange}>
                {ESTADOS.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label>Precio venta</label>
              <input type="number" name="precioVenta" value={form.precioVenta} onChange={handleChange} />
            </div>
            <div className={styles.field}>
              <label>Precio alquiler</label>
              <input type="number" name="precioAlquiler" value={form.precioAlquiler} onChange={handleChange} />
            </div>
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label>URL de imagen (internet)</label>
              <input
                type="url"
                name="imagenUrl"
                value={form.imagenUrl}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              <p className={invStyles.hint}>
                Enlace público de la foto. El cliente verá la misma imagen en el catálogo.
              </p>
              <div className={invStyles.previewBox}>
                <ImagenPrenda
                  url={form.imagenUrl}
                  alt="Vista previa"
                  tipo={form.tipoPrenda}
                  variant="preview"
                />
              </div>
            </div>
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.btnPrimary}>
              {editId ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      )}

      <div className={styles.filters} style={{ marginTop: "1.5rem" }}>
        <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
          <option value="">Todos los tipos</option>
          {TIPOS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          {ESTADOS.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
        <select value={filtroTalla} onChange={(e) => setFiltroTalla(e.target.value)}>
          <option value="">Todas las tallas</option>
          {TALLAS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.card}>
        {cargando ? (
          <p className={styles.loading}>Cargando inventario...</p>
        ) : prendas.length === 0 ? (
          <p className={styles.empty}>No hay prendas en inventario.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Foto</th>
                <th>Referencia</th>
                <th>Tipo</th>
                <th>Talla</th>
                <th>Color</th>
                <th>Cantidad</th>
                <th>Estado</th>
                <th>P. Venta</th>
                <th>P. Alquiler</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {prendas.map((p) => (
                <tr key={p.id}>
                  <td>
                    <ImagenPrenda
                      url={p.imagenUrl}
                      alt={p.nombre}
                      tipo={p.tipoPrenda}
                      variant="thumb"
                    />
                  </td>
                  <td>{p.nombre}</td>
                  <td>{p.tipoPrenda}</td>
                  <td>{p.talla || "—"}</td>
                  <td>{p.color || "—"}</td>
                  <td>{p.cantidad}</td>
                  <td>{p.estado}</td>
                  <td>${Number(p.precioBase).toLocaleString("es-CO")}</td>
                  <td>${Number(p.precioAlquiler).toLocaleString("es-CO")}</td>
                  <td className={styles.actions}>
                    <button className={styles.btnSecondary} onClick={() => editarPrenda(p)}>
                      Editar
                    </button>
                    {esAdmin && (
                      <button className={styles.btnDanger} onClick={() => eliminarPrenda(p.id)}>
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalTx && (
        <div className={invStyles.modalOverlay} onClick={() => setModalTx(null)}>
          <div className={invStyles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={invStyles.modalTitle}>
              {modalTx === "venta" ? "Registrar venta" : "Registrar alquiler"}
            </h2>

            <div className={invStyles.modalField}>
              <label>Cliente</label>
              <BuscarCliente
                value={clienteTx}
                onChange={(id) => setTxForm((f) => ({ ...f, clienteId: id }))}
                onSelect={(c) => {
                  setClienteTx(c);
                  setTxForm((f) => ({ ...f, clienteId: c?.id || "" }));
                }}
              />
            </div>

            <div className={invStyles.modalField}>
              <label>Prenda</label>
              <select
                value={txForm.prendaId}
                onChange={(e) => setTxForm((f) => ({ ...f, prendaId: e.target.value }))}
              >
                <option value="">Seleccione prenda</option>
                {prendasConStock.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} ({p.talla || "sin talla"}) — Stock: {p.cantidad}
                  </option>
                ))}
              </select>
            </div>

            <div className={invStyles.modalPreview}>
              <ImagenPrenda
                url={prendaSeleccionadaTx?.imagenUrl}
                alt={prendaSeleccionadaTx?.nombre || "Prenda"}
                tipo={prendaSeleccionadaTx?.tipoPrenda}
                variant="modal"
              />
            </div>

            {prendaSeleccionadaTx && (
              <p className={invStyles.hint}>
                {prendaSeleccionadaTx.tipoPrenda}
                {prendaSeleccionadaTx.color ? ` · ${prendaSeleccionadaTx.color}` : ""}
                {" · "}
                {modalTx === "venta"
                  ? `$${Number(prendaSeleccionadaTx.precioBase).toLocaleString("es-CO")}`
                  : `$${Number(prendaSeleccionadaTx.precioAlquiler).toLocaleString("es-CO")} / alquiler`}
              </p>
            )}

            <div className={invStyles.modalField}>
              <label>Cantidad</label>
              <input
                type="number"
                min="1"
                value={txForm.cantidad}
                onChange={(e) => setTxForm((f) => ({ ...f, cantidad: e.target.value }))}
              />
            </div>

            <div className={invStyles.modalActions}>
              <button type="button" className={styles.btnSecondary} onClick={() => setModalTx(null)}>
                Cancelar
              </button>
              <button type="button" className={styles.btnPrimary} onClick={confirmarTransaccion}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
