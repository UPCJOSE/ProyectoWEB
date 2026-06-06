import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import styles from "./DashboardAdmin.module.css";
import { fetchAuth } from "../../../core/utils/fetchAuth";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const DashboardAdmin = () => {
  const [pagos, setPagos] = useState([]);
  const [egresos, setEgresos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const API = "https://localhost:7196/api";

  const cargarDatos = async () => {
    try {
      const [respPagos, respEgresos] = await Promise.all([
        fetchAuth(`${API}/Pagos`),
        fetchAuth(`${API}/Egresos`),
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

  const totalIngresos = pagos.reduce(
    (acc, curr) => acc + Number(curr.monto),
    0,
  );

  const totalEgresos = egresos.reduce(
    (acc, curr) => acc + Number(curr.costo),
    0,
  );

  const saldoFinal = totalIngresos - totalEgresos;

  const formatoMoneda = (valor) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(valor);
  };

  const registrarPago = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Registrar Pago",
      html: `
        <input id="pedido" class="swal2-input" placeholder="ID Pedido">

        <select
          id="metodo"
          class="swal2-select"
          style="display:flex; margin:1em auto; width:73%; color:#545454;"
        >
          <option value="" disabled selected>Seleccione el método</option>
          <option value="Efectivo">Efectivo</option>
          <option value="Transferencia">Transferencia</option>
          <option value="Tarjeta">Tarjeta</option>
        </select>

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
          Swal.showValidationMessage("Por favor complete todos los campos");
          return false;
        }

        return {
          pedidoId,
          metodoPago,
          monto,
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

      const respuesta = await fetchAuth(`${API}/Pagos`, {
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

  const registrarEgreso = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Registrar Egreso",
      html: `
        <input id="concepto" class="swal2-input" placeholder="Concepto">
        <input id="proveedor" class="swal2-input" placeholder="Proveedor">
        <input id="costo" type="number" class="swal2-input" placeholder="Costo">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      confirmButtonColor: "#c5a880",
      cancelButtonColor: "#181f21",
      cancelButtonText: "Cancelar",

      preConfirm: () => {
        const concepto = document.getElementById("concepto").value;
        const proveedor = document.getElementById("proveedor").value;
        const costo = document.getElementById("costo").value;

        if (!concepto || !proveedor || !costo) {
          Swal.showValidationMessage("Por favor complete todos los campos");
          return false;
        }

        return {
          concepto,
          proveedor,
          costo,
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

      const respuesta = await fetchAuth(`${API}/Egresos`, {
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

  if (cargando) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingWrap}>
          <div className="spinner-border text-warning" role="status" />
          <p className={styles.loadingText}>Cargando panel financiero...</p>
        </div>
      </div>
    );
  }

  const exportarExcel = async () => {
    if (pagos.length === 0 && egresos.length === 0) {
      Swal.fire("Sin datos", "No hay registros para exportar.", "info");
      return;
    }

    const confirmacion = await Swal.fire({
      title: "¿Generar reporte en Excel?",
      text: "Se descargará un archivo .xlsx con los ingresos y egresos actuales.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#107c41", 
      cancelButtonColor: "#181f21",
      confirmButtonText: "Sí, generar Excel",
      cancelButtonText: "Cancelar"
    });

    if (!confirmacion.isConfirmed) return;

    const datosIngresos = pagos.map((p) => ({
      "ID Pedido": `ORD-${p.pedidoId}`,
      "Método de Pago": p.metodoPago,
      "Monto Ingresado": p.monto,
    }));

    const datosEgresos = egresos.map((e) => ({
      "Concepto": e.concepto,
      "Proveedor": e.proveedor,
      "Costo": e.costo,
    }));

    const libro = XLSX.utils.book_new();
    const hojaIngresos = XLSX.utils.json_to_sheet(datosIngresos);
    const hojaEgresos = XLSX.utils.json_to_sheet(datosEgresos);

    XLSX.utils.book_append_sheet(libro, hojaIngresos, "Ingresos");
    XLSX.utils.book_append_sheet(libro, hojaEgresos, "Egresos");

    XLSX.writeFile(libro, "Reporte_Financiero.xlsx");

    Swal.fire({
      icon: "success",
      title: "¡Descarga completada!",
      text: "Tu archivo Excel se ha generado correctamente.",
      timer: 2500,
      showConfirmButton: false
    });
  };

  const exportarPDF = async () => {
    if (pagos.length === 0 && egresos.length === 0) {
      Swal.fire("Sin datos", "No hay registros para exportar.", "info");
      return;
    }

    const confirmacion = await Swal.fire({
      title: "¿Generar reporte en PDF?",
      text: "Se descargará un documento PDF con las tablas financieras.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#c9a84c", 
      cancelButtonColor: "#181f21",
      confirmButtonText: "Sí, generar PDF",
      cancelButtonText: "Cancelar"
    });

    if (!confirmacion.isConfirmed) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Reporte Financiero - Atelier", 14, 20);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 28);

    let posicionY = 40; 

    if (pagos.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text("Ingresos (Pagos Recibidos)", 14, posicionY);

      const filasPagos = pagos.map(p => [
        `ORD-${p.pedidoId}`, 
        p.metodoPago, 
        formatoMoneda(p.monto)
      ]);

      autoTable(doc, {
        startY: posicionY + 5,
        head: [['ID Pedido', 'Método', 'Monto']],
        body: filasPagos,
        headStyles: { fillColor: [201, 168, 76] }, 
      });

      posicionY = doc.lastAutoTable.finalY + 15; 
    }

    if (egresos.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text("Egresos (Gastos de Inventario)", 14, posicionY);

      const filasEgresos = egresos.map(e => [
        e.concepto, 
        e.proveedor, 
        formatoMoneda(e.costo)
      ]);

      autoTable(doc, {
        startY: posicionY + 5,
        head: [['Concepto', 'Proveedor', 'Costo']],
        body: filasEgresos,
        headStyles: { fillColor: [24, 31, 33] }, 
      });
    }

    doc.save("Reporte_Financiero.pdf");

    Swal.fire({
      icon: "success",
      title: "¡Descarga completada!",
      text: "Tu documento PDF se ha generado correctamente.",
      timer: 2500,
      showConfirmButton: false
    });
  };

  return (
    <div className={`${styles.page} animate__animated animate__fadeIn`}>
      <header className={styles.header}>
        <div className={styles.headerMain}>
          <p className={styles.kicker}>Panel administrativo</p>
          <h1 className={styles.title}>
            Dashboard <span className={styles.titleGold}>Financiero</span>
          </h1>
        </div>

        <div className={styles.headerBadge}>
          <div className={styles.headerBadgeIcon}>
            <i className="bi bi-wallet2" />
          </div>
          <div>
            <span className={styles.headerBadgeLabel}>Saldo en caja</span>
            <span className={styles.headerBadgeValue}>
              {formatoMoneda(saldoFinal)}
            </span>
          </div>
        </div>
      </header>

      <section className={styles.metricsGrid}>
        <div className={`${styles.metricCard} ${styles.ingreso}`}>
          <div className={`${styles.iconBox} ${styles.iconIngreso}`}>
            <i className="bi bi-arrow-up-right" />
          </div>
          <div>
            <p className={styles.metricLabel}>Ingresos Brutos</p>
            <h3 className={styles.metricValue}>
              {formatoMoneda(totalIngresos)}
            </h3>
          </div>
        </div>

        <div className={`${styles.metricCard} ${styles.egreso}`}>
          <div className={`${styles.iconBox} ${styles.iconEgreso}`}>
            <i className="bi bi-arrow-down-right" />
          </div>
          <div>
            <p className={styles.metricLabel}>Egresos / Gastos</p>
            <h3 className={styles.metricValue}>
              {formatoMoneda(totalEgresos)}
            </h3>
          </div>
        </div>

        <div className={`${styles.metricCard} ${styles.saldo}`}>
          <div className={`${styles.iconBox} ${styles.iconSaldo}`}>
            <i className="bi bi-piggy-bank" />
          </div>
          <div>
            <p className={styles.metricLabel}>Saldo Neto en Caja</p>
            <h3 className={`${styles.metricValue} ${styles.metricValueSaldo}`}>
              {formatoMoneda(saldoFinal)}
            </h3>
          </div>
        </div>
      </section>

      <section className={styles.tablesGrid}>
        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}>
            <h4 className={styles.tableTitle}>
              Pagos Recibidos
              <span className={styles.tableCount}>{pagos.length}</span>
            </h4>

            <button
              type="button"
              className={`${styles.btnAction} ${styles.btnIngreso}`}
              onClick={registrarPago}
            >
              + Registrar Pago
            </button>
          </div>

          <div className={styles.tableScroll}>
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
                      <td className={styles.orderId}>ORD-{pago.pedidoId}</td>
                      <td>
                        <span className={styles.methodBadge}>
                          {pago.metodoPago}
                        </span>
                      </td>
                      <td className={styles.amountPositive}>
                        {formatoMoneda(pago.monto)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className={styles.emptyRow}>
                    <td colSpan="3">No hay pagos registrados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}>
            <h4 className={styles.tableTitle}>
              Egresos de Inventario
              <span className={styles.tableCount}>{egresos.length}</span>
            </h4>

            <button
              type="button"
              className={`${styles.btnAction} ${styles.btnEgreso}`}
              onClick={registrarEgreso}
            >
              + Registrar Egreso
            </button>
          </div>

          <div className={styles.tableScroll}>
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
                      <td className={styles.provider}>{egreso.proveedor}</td>
                      <td className={styles.amountNegative}>
                        - {formatoMoneda(egreso.costo)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className={styles.emptyRow}>
                    <td colSpan="3">No hay egresos registrados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className={styles.reportsBox}>
        <h4 className={styles.reportsTitle}>Exportar Reportes</h4>

        <input type="date" className={styles.dateInput} />

        <span className={styles.reportsDivider}>hasta</span>

        <input type="date" className={styles.dateInput} />

        <div className={styles.reportsActions}>
          <button
            type="button"
            className={styles.btnExportPrimary}
            onClick={exportarExcel} 
          >
            <i className="bi bi-file-earmark-excel" />
            Exportar a Excel
          </button>

          <button
            type="button"
            className={styles.btnExportSecondary}
            onClick={exportarPDF}
          >
            <i className="bi bi-filetype-pdf" />
            Exportar a PDF
          </button>
        </div>
      </section>
    </div>
  );
};
