import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { fetchAuth } from "../../../core/utils/fetchAuth";
import styles from "../../shared/ModulePage.module.css";

const API = "http://localhost:5000/api";

const formatoMoneda = (valor) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(valor);

export const DashboardFacturas = () => {
  const navigate = useNavigate();
  const [facturas, setFacturas] = useState([]);
  const [ordenesCuentas, setOrdenesCuentas] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroCuenta, setFiltroCuenta] = useState("");
  const [cargando, setCargando] = useState(true);

  const cargarDatos = async () => {
    try {
      const params = new URLSearchParams();
      if (filtroTipo) params.append("tipo", filtroTipo);
      if (filtroEstado) params.append("estado", filtroEstado);

      const [resFacturas, resOrdenes] = await Promise.all([
        fetchAuth(`${API}/Facturas?${params}`),
        fetchAuth(`${API}/Facturas/ordenes-cuentas`),
      ]);

      setFacturas(await resFacturas.json());
      if (resOrdenes.ok) setOrdenesCuentas(await resOrdenes.json());
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudieron cargar las facturas.", "error");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [filtroTipo, filtroEstado]);

  const badgeEstado = (estado) => {
    const map = {
      pagada: styles.badgeSuccess,
      pendiente: styles.badgeWarning,
      cancelada: styles.badgeDanger,
      pagado: styles.badgeSuccess,
      abono: styles.badgeInfo,
    };
    return `${styles.badge} ${map[estado] || styles.badgeInfo}`;
  };

  const ordenesFiltradas = ordenesCuentas.filter((o) => {
    if (!filtroCuenta) return true;
    if (filtroCuenta === "sin-tela") return o.sinTela;
    return o.estadoCuenta === filtroCuenta;
  });

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Facturas y cuentas</h1>
          <p className={styles.subtitle}>
            Facturas de venta/alquiler vinculadas a ingresos, y órdenes de confección con estado de pago y tela
          </p>
        </div>
      </header>

      <h2 className={styles.title} style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
        Órdenes de confección
      </h2>

      <div className={styles.filters}>
        <select value={filtroCuenta} onChange={(e) => setFiltroCuenta(e.target.value)}>
          <option value="">Todas las cuentas</option>
          <option value="pagado">Pagadas</option>
          <option value="pendiente">Pendientes de pago</option>
          <option value="abono">Con abono parcial</option>
          <option value="sin-tela">Sin tela / con observación</option>
        </select>
      </div>

      <div className={styles.card} style={{ marginBottom: "2rem" }}>
        {cargando ? (
          <p className={styles.loading}>Cargando...</p>
        ) : ordenesFiltradas.length === 0 ? (
          <p className={styles.empty}>No hay órdenes con ese filtro.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Orden</th>
                <th>Cliente</th>
                <th>Estilo</th>
                <th>Total</th>
                <th>Pagado</th>
                <th>Saldo</th>
                <th>Cuenta</th>
                <th>Tela (m)</th>
                <th>Observación / alerta</th>
              </tr>
            </thead>
            <tbody>
              {ordenesFiltradas.map((o) => (
                <tr key={o.id}>
                  <td>ORD-{o.id}</td>
                  <td>{o.cliente?.nombre || "—"}</td>
                  <td>{o.estilo || "—"}</td>
                  <td>{formatoMoneda(o.costoTotal)}</td>
                  <td>{formatoMoneda(o.totalPagado)}</td>
                  <td>{formatoMoneda(o.saldoPendiente)}</td>
                  <td>
                    <span className={badgeEstado(o.estadoCuenta)}>{o.estadoCuenta}</span>
                  </td>
                  <td>{o.metrosTela > 0 ? o.metrosTela : "—"}</td>
                  <td>{o.alerta || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <h2 className={styles.title} style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
        Facturas venta / alquiler
      </h2>

      <div className={`${styles.filters} noPrint`}>
        <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
          <option value="">Todos los tipos</option>
          <option value="venta">Venta</option>
          <option value="alquiler">Alquiler</option>
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
                <th>Ingreso en finanzas</th>
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
                  <td>
                    {f.ingresoRegistrado ? (
                      <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                        Sí — {formatoMoneda(f.totalPagado || f.total)}
                      </span>
                    ) : (
                      <span className={`${styles.badge} ${styles.badgeWarning}`}>Pendiente</span>
                    )}
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
