import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { fetchAuth } from "../../../core/utils/fetchAuth";
import styles from "../../shared/ModulePage.module.css";

const API = "https://localhost:7196/api";

const formatoMoneda = (valor) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(valor);

export const DashboardFacturas = () => {
  const navigate = useNavigate();
  const [facturas, setFacturas] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [cargando, setCargando] = useState(true);

  const cargarFacturas = async () => {
    try {
      const params = new URLSearchParams();
      if (filtroTipo) params.append("tipo", filtroTipo);
      if (filtroEstado) params.append("estado", filtroEstado);

      const res = await fetchAuth(`${API}/Facturas?${params}`);
      const data = await res.json();
      setFacturas(data);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudieron cargar las facturas.", "error");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarFacturas();
  }, [filtroTipo, filtroEstado]);

  const badgeEstado = (estado) => {
    const map = {
      pagada: styles.badgeSuccess,
      pendiente: styles.badgeWarning,
      cancelada: styles.badgeDanger,
    };
    return `${styles.badge} ${map[estado] || styles.badgeInfo}`;
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Facturas</h1>
          <p className={styles.subtitle}>
            Comprobantes generados automáticamente en ventas y alquileres
          </p>
        </div>
      </header>

      <div className={`${styles.filters} noPrint`}>
        <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
          <option value="">Todos los tipos</option>
          <option value="venta">Venta</option>
          <option value="alquiler">Alquiler</option>
          <option value="compra">Compra</option>
        </select>
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="pagada">Pagada</option>
          <option value="pendiente">Pendiente</option>
          <option value="cancelada">Cancelada</option>
        </select>
      </div>

      <div className={styles.card}>
        {cargando ? (
          <p className={styles.loading}>Cargando facturas...</p>
        ) : facturas.length === 0 ? (
          <p className={styles.empty}>No hay facturas registradas.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>N° Factura</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Tipo</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Registró</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {facturas.map((f) => (
                <tr key={f.id}>
                  <td>FAC-{String(f.numeroFactura).padStart(4, "0")}</td>
                  <td>{new Date(f.fecha).toLocaleString("es-CO")}</td>
                  <td>{f.cliente?.nombre || "—"}</td>
                  <td style={{ textTransform: "capitalize" }}>{f.tipoOperacion}</td>
                  <td>{formatoMoneda(f.total)}</td>
                  <td>
                    <span className={badgeEstado(f.estado)}>{f.estado}</span>
                  </td>
                  <td>{f.usuario?.nombre || "—"}</td>
                  <td>
                    <button
                      className={styles.btnSecondary}
                      onClick={() => navigate(`/facturas/${f.id}`)}
                    >
                      Ver detalle
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
