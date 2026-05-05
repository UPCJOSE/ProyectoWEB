<<<<<<< HEAD
// src/features/finanzas/pages/DashboardAdmin.jsx
=======
>>>>>>> 6127e3ab5d77dca0edb660e616103a801bd8adde
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import styles from "./DashboardAdmin.module.css";

export const DashboardAdmin = () => {
  const [pagos, setPagos] = useState([]);
  const [egresos, setEgresos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const API = "https://localhost:7196/api";

<<<<<<< HEAD
=======
  // =========================
  // CARGAR DATOS
  // =========================
>>>>>>> 6127e3ab5d77dca0edb660e616103a801bd8adde
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

<<<<<<< HEAD
=======
  // =========================
  // TOTALES
  // =========================
>>>>>>> 6127e3ab5d77dca0edb660e616103a801bd8adde
  const totalIngresos = pagos.reduce(
    (acc, curr) => acc + Number(curr.monto),
    0,
  );

  const totalEgresos = egresos.reduce(
    (acc, curr) => acc + Number(curr.costo),
    0,
  );

  const saldoFinal = totalIngresos - totalEgresos;

<<<<<<< HEAD
=======
  // =========================
  // FORMATO MONEDA
  // =========================
>>>>>>> 6127e3ab5d77dca0edb660e616103a801bd8adde
  const formatoMoneda = (valor) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(valor);
  };

<<<<<<< HEAD
=======
  // =========================
  // REGISTRAR PAGO
  // =========================
>>>>>>> 6127e3ab5d77dca0edb660e616103a801bd8adde
  const registrarPago = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Registrar Pago",
      html: `
        <input id="pedido" class="swal2-input" placeholder="ID Pedido">
<<<<<<< HEAD
        
        <select id="metodo" class="swal2-select" style="display: flex; margin: 1em auto; width: 73%; color: #545454;">
          <option value="" disabled selected>Seleccione el método</option>
=======
        <select id="metodo" class="swal2-input">
>>>>>>> 6127e3ab5d77dca0edb660e616103a801bd8adde
          <option value="Efectivo">Efectivo</option>
          <option value="Transferencia">Transferencia</option>
          <option value="Tarjeta">Tarjeta</option>
        </select>
<<<<<<< HEAD

        <input id="monto" type="number" class="swal2-input" placeholder="Monto">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      confirmButtonColor: "#c5a880",
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#181f21",
      preConfirm: () => {
        const pedidoId = document.getElementById("pedido").value;
        const metodoPago = document.getElementById("metodo").value;
        const monto = document.getElementById("monto").value;

        if (!pedidoId || !metodoPago || !monto) {
          Swal.showValidationMessage("Por favor, complete todos los campos");
          return false;
        }

        return { pedidoId, metodoPago, monto };
=======
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
>>>>>>> 6127e3ab5d77dca0edb660e616103a801bd8adde
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

<<<<<<< HEAD
=======
  // =========================
  // REGISTRAR EGRESO
  // =========================
>>>>>>> 6127e3ab5d77dca0edb660e616103a801bd8adde
  const registrarEgreso = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Registrar Egreso",
      html: `
        <input id="concepto" class="swal2-input" placeholder="Concepto">
        <input id="proveedor" class="swal2-input" placeholder="Proveedor">
        <input id="costo" type="number" class="swal2-input" placeholder="Costo">
      `,
      focusConfirm: false,
<<<<<<< HEAD
      showCancelButton: true,
      confirmButtonText: "Guardar",
      confirmButtonColor: "#c5a880",
      cancelButtonColor: "#181f21",
      cancelButtonText: "Cancelar",
=======
      confirmButtonText: "Guardar",
      confirmButtonColor: "#181f21",
>>>>>>> 6127e3ab5d77dca0edb660e616103a801bd8adde
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
<<<<<<< HEAD
      <section className={styles.tablesGrid}>
=======
            <section className={styles.tablesGrid}>
>>>>>>> 6127e3ab5d77dca0edb660e616103a801bd8adde
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

<<<<<<< HEAD
                    <td style={{ color: "#747879" }}>{egreso.proveedor}</td>
=======
                    <td style={{ color: "#747879" }}>
                      {egreso.proveedor}
                    </td>
>>>>>>> 6127e3ab5d77dca0edb660e616103a801bd8adde

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
<<<<<<< HEAD
        <h4 className="font-headline m-0 me-4">Exportar Reportes</h4>
=======
        <h4 className="font-headline m-0 me-4">
          Exportar Reportes
        </h4>
>>>>>>> 6127e3ab5d77dca0edb660e616103a801bd8adde

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
<<<<<<< HEAD
            Swal.fire("Próximamente", "Exportación a PDF en desarrollo", "info")
=======
            Swal.fire(
              "Próximamente",
              "Exportación a PDF en desarrollo",
              "info",
            )
>>>>>>> 6127e3ab5d77dca0edb660e616103a801bd8adde
          }
        >
          <i className="bi bi-filetype-pdf"></i>
          Exportar a PDF
        </button>
      </section>
    </div>
  );
};