import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import styles from "./DashboardAdmin.module.css";

export const DashboardAdmin = () => {
  const [pagos, setPagos] = useState([]);
  const [egresos, setEgresos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const API = "https://localhost:7196/api";

  // =========================
  // CARGAR DATOS
  // =========================
  const cargarDatos = async () => {
    try {
      const [respPagos, respEgresos] = await Promise.all([
        fetch(`${API}/Pagos`),
        fetch(`${API}/Egresos`),
      ]);

      const pagosData = await respPagos.json();
      const egresosData = await respEgresos.json();

      setPagos(pagosData);
      setEgresos(egresosData);
    } catch (error) {
      console.error("Error cargando datos:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los datos financieros.",
        confirmButtonColor: "#181f21",
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // =========================
  // TOTALES
  // =========================
  const totalIngresos = pagos.reduce(
    (acc, curr) => acc + Number(curr.monto),
    0,
  );

  const totalEgresos = egresos.reduce(
    (acc, curr) => acc + Number(curr.costo),
    0,
  );

  const saldoFinal = totalIngresos - totalEgresos;

  // =========================
  // FORMATO MONEDA
  // =========================
  const formatoMoneda = (valor) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(valor);
  };

  // =========================
  // REGISTRAR PAGO
  // =========================
  const registrarPago = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Registrar Pago",
      html: `
        <input id="pedido" class="swal2-input" placeholder="ID Pedido">
        <select id="metodo" class="swal2-input">
          <option value="Efectivo">Efectivo</option>
          <option value="Transferencia">Transferencia</option>
          <option value="Tarjeta">Tarjeta</option>
        </select>
        <input id="monto" type="number" class="swal2-input" placeholder="Monto">
      `,
      focusConfirm: false,
      confirmButtonText: "Guardar",
      confirmButtonColor: "#181f21",
      preConfirm: () => {
        return {
          pedidoId: document.getElementById("pedido").value,
          metodoPago: document.getElementById("metodo").value,
          monto: document.getElementById("monto").value,
        };
      },
    });

    if (!formValues) return;

    try {
      const nuevoPago = {
        pedidoId: Number(formValues.pedidoId),
        metodoPago: formValues.metodoPago,
        monto: Number(formValues.monto),
        fechaPago: new Date().toISOString(),
      };

      const respuesta = await fetch(`${API}/Pagos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoPago),
      });

      if (!respuesta.ok) throw new Error();

      await cargarDatos();

      Swal.fire({
        icon: "success",
        title: "Pago registrado",
        toast: true,
        position: "top-end",
        timer: 2500,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo registrar el pago.",
      });
    }
  };

  // =========================
  // REGISTRAR EGRESO
  // =========================
  const registrarEgreso = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Registrar Egreso",
      html: `
        <input id="concepto" class="swal2-input" placeholder="Concepto">
        <input id="proveedor" class="swal2-input" placeholder="Proveedor">
        <input id="costo" type="number" class="swal2-input" placeholder="Costo">
      `,
      focusConfirm: false,
      confirmButtonText: "Guardar",
      confirmButtonColor: "#181f21",
      preConfirm: () => {
        return {
          concepto: document.getElementById("concepto").value,
          proveedor: document.getElementById("proveedor").value,
          costo: document.getElementById("costo").value,
        };
      },
    });

    if (!formValues) return;

    try {
      const nuevoEgreso = {
        concepto: formValues.concepto,
        proveedor: formValues.proveedor,
        costo: Number(formValues.costo),
        fecha: new Date().toISOString(),
      };

      const respuesta = await fetch(`${API}/Egresos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoEgreso),
      });

      if (!respuesta.ok) throw new Error();

      await cargarDatos();

      Swal.fire({
        icon: "success",
        title: "Egreso registrado",
        toast: true,
        position: "top-end",
        timer: 2500,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo registrar el egreso.",
      });
    }
  };

  if (cargando) return <h2>Cargando dashboard...</h2>;

  return (
    <div className="animate__animated animate__fadeIn">
      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard Financiero</h1>
        <p className="text-muted">
          Control general de caja, ingresos por pedidos e inventario.
        </p>
      </header>

      <section className={styles.metricsGrid}>
        <div className={`${styles.metricCard} ${styles.ingreso}`}>
          <div className={styles.iconBox}>
            <i className="bi bi-arrow-up-right"></i>
          </div>
          <div>
            <p className={styles.metricLabel}>Ingresos Brutos</p>
            <h3 className={styles.metricValue}>
              {formatoMoneda(totalIngresos)}
            </h3>
          </div>
        </div>

        <div className={`${styles.metricCard} ${styles.egreso}`}>
          <div className={styles.iconBox} style={{ color: "#e74c3c" }}>
            <i className="bi bi-arrow-down-right"></i>
          </div>
          <div>
            <p className={styles.metricLabel}>Egresos / Gastos</p>
            <h3 className={styles.metricValue}>
              {formatoMoneda(totalEgresos)}
            </h3>
          </div>
        </div>

        <div className={`${styles.metricCard} ${styles.saldo}`}>
          <div
            className={styles.iconBox}
            style={{ background: "#c9a84c", color: "white" }}
          >
            <i className="bi bi-wallet2"></i>
          </div>
          <div>
            <p className={styles.metricLabel}>Saldo Neto en Caja</p>
            <h3
              className={styles.metricValue}
              style={{ color: "#c9a84c" }}
            >
              {formatoMoneda(saldoFinal)}
            </h3>
          </div>
        </div>
      </section>
            <section className={styles.tablesGrid}>
        {/* TABLA PAGOS */}
        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}>
            <h4 className="font-headline m-0">Pagos Recibidos</h4>

            <button
              className={`${styles.btnAction} ${styles.btnIngreso}`}
              onClick={registrarPago}
            >
              + Registrar Pago
            </button>
          </div>

          <table className={styles.atelierTable}>
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Método</th>
                <th>Monto</th>
              </tr>
            </thead>

            <tbody>
              {pagos.length > 0 ? (
                pagos.map((pago) => (
                  <tr key={pago.id}>
                    <td
                      style={{
                        color: "#c9a84c",
                        fontWeight: "bold",
                      }}
                    >
                      ORD-{pago.pedidoId}
                    </td>

                    <td>{pago.metodoPago}</td>

                    <td style={{ color: "#27ae60" }}>
                      {formatoMoneda(pago.monto)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                    }}
                  >
                    No hay pagos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* TABLA EGRESOS */}
        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}>
            <h4 className="font-headline m-0">Egresos de Inventario</h4>

            <button
              className={`${styles.btnAction} ${styles.btnEgreso}`}
              onClick={registrarEgreso}
            >
              + Registrar Egreso
            </button>
          </div>

          <table className={styles.atelierTable}>
            <thead>
              <tr>
                <th>Concepto</th>
                <th>Proveedor</th>
                <th>Costo</th>
              </tr>
            </thead>

            <tbody>
              {egresos.length > 0 ? (
                egresos.map((egreso) => (
                  <tr key={egreso.id}>
                    <td>{egreso.concepto}</td>

                    <td style={{ color: "#747879" }}>
                      {egreso.proveedor}
                    </td>

                    <td style={{ color: "#e74c3c" }}>
                      - {formatoMoneda(egreso.costo)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                    }}
                  >
                    No hay egresos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* REPORTES */}
      <section className={styles.reportsBox}>
        <h4 className="font-headline m-0 me-4">
          Exportar Reportes
        </h4>

        <input
          type="date"
          className="form-control w-auto"
          style={{ border: "1px solid #d4d0c4" }}
        />

        <span className="text-muted">hasta</span>

        <input
          type="date"
          className="form-control w-auto"
          style={{ border: "1px solid #d4d0c4" }}
        />

        <button
          className="btn btn-dark ms-auto d-flex align-items-center gap-2"
          onClick={() =>
            Swal.fire(
              "Próximamente",
              "Exportación a Excel en desarrollo",
              "info",
            )
          }
        >
          <i className="bi bi-file-earmark-excel"></i>
          Exportar a Excel
        </button>

        <button
          className="btn btn-outline-dark d-flex align-items-center gap-2"
          onClick={() =>
            Swal.fire(
              "Próximamente",
              "Exportación a PDF en desarrollo",
              "info",
            )
          }
        >
          <i className="bi bi-filetype-pdf"></i>
          Exportar a PDF
        </button>
      </section>
    </div>
  );
};