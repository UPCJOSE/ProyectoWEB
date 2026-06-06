import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

export const FacturaDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [factura, setFactura] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetchAuth(`${API}/Facturas/${id}`);
        if (!res.ok) throw new Error();
        setFactura(await res.json());
      } catch {
        Swal.fire("Error", "Factura no encontrada.", "error");
        navigate("/facturas");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [id, navigate]);

  if (cargando) return <p className={styles.loading}>Cargando factura...</p>;
  if (!factura) return null;

  return (
    <div className={styles.page}>
      <header className={`${styles.header} noPrint`}>
        <div>
          <h1 className={styles.title}>
            Factura FAC-{String(factura.numeroFactura).padStart(4, "0")}
          </h1>
          <p className={styles.subtitle}>
            {new Date(factura.fecha).toLocaleString("es-CO")} ·{" "}
            {factura.tipoOperacion}
          </p>
        </div>
        <div className={styles.actions}>
          <button className={styles.btnSecondary} onClick={() => navigate("/facturas")}>
            Volver
          </button>
          <button className={styles.btnPrimary} onClick={() => window.print()}>
            Imprimir
          </button>
        </div>
      </header>

      <div className={styles.card} style={{ padding: "1.5rem" }}>
        <p><strong>Cliente:</strong> {factura.cliente?.nombre}</p>
        <p><strong>Correo:</strong> {factura.cliente?.correo || "—"}</p>
        <p><strong>Registrado por:</strong> {factura.usuario?.nombre}</p>
        <p><strong>Estado:</strong> {factura.estado}</p>

        <table className={styles.table} style={{ marginTop: "1.5rem" }}>
          <thead>
            <tr>
              <th>Prenda</th>
              <th>Cantidad</th>
              <th>Precio unit.</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {(factura.detalles || []).map((d) => (
              <tr key={d.id}>
                <td>{d.prenda?.nombre || `Prenda #${d.prendaId}`}</td>
                <td>{d.cantidad}</td>
                <td>{formatoMoneda(d.precioUnitario)}</td>
                <td>{formatoMoneda(d.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: "1.5rem", textAlign: "right" }}>
          <p>Subtotal: {formatoMoneda(factura.subtotal)}</p>
          <p>IVA (19%): {formatoMoneda(factura.iva)}</p>
          <p><strong>Total: {formatoMoneda(factura.total)}</strong></p>
        </div>
      </div>
    </div>
  );
};
