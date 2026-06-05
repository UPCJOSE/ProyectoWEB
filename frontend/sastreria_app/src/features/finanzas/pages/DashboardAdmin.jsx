import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import styles from "./DashboardAdmin.module.css";
import { fetchAuth } from "../../../core/utils/fetchAuth";
import { BuscarCliente } from "../../../core/components/BuscarCliente";

const API = "http://localhost:5000/api";

export const DashboardAdmin = () => {
  const [pagos, setPagos] = useState([]);
  const [egresos, setEgresos] = useState([]);
  const [clientePago, setClientePago] = useState(null);
  const [pedidosCliente, setPedidosCliente] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalPago, setModalPago] = useState(false);
  const [pagoForm, setPagoForm] = useState({
    clienteId: "",
    pedidoId: "",
    metodoPago: "",
    monto: "",
  });

  const cargarDatos = async () => {
    try {
      const [respPagos, respEgresos] = await Promise.all([
        fetchAuth(`${API}/Pagos`),
        fetchAuth(`${API}/Egresos`),
      ]);

      setPagos(await respPagos.json());
      setEgresos(await respEgresos.json());
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

  const cargarPedidosCliente = async (clienteId) => {
    if (!clienteId) {
      setPedidosCliente([]);
      return;
    }
    try {
      const res = await fetchAuth(`${API}/Finanzas/pedidos-cliente/${clienteId}`);
      if (res.ok) setPedidosCliente(await res.json());
      else setPedidosCliente([]);
    } catch {
      setPedidosCliente([]);
    }
  };

  const abrirModalPago = () => {
    setPagoForm({ clienteId: "", pedidoId: "", metodoPago: "", monto: "" });
    setClientePago(null);
    setPedidosCliente([]);
    setModalPago(true);
  };

  const onClientePagoSelect = async (cliente) => {
    setClientePago(cliente);
    const clienteId = cliente?.id || "";
    setPagoForm((f) => ({ ...f, clienteId, pedidoId: "", monto: "" }));
    await cargarPedidosCliente(clienteId);
  };

  const onPedidoPagoChange = (pedidoId) => {
    const pedido = pedidosCliente.find((p) => String(p.id) === String(pedidoId));
    setPagoForm((f) => ({
      ...f,
      pedidoId,
      monto: pedido ? String(pedido.saldoPendiente) : "",
    }));
  };

  const confirmarPago = async () => {
    if (!pagoForm.clienteId || !pagoForm.pedidoId || !pagoForm.metodoPago || !pagoForm.monto) {
      Swal.fire("Error", "Complete cliente, pedido, método y monto.", "error");
      return;
    }

    try {
      const respuesta = await fetchAuth(`${API}/Pagos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pedidoId: Number(pagoForm.pedidoId),
          metodoPago: pagoForm.metodoPago,
          monto: Number(pagoForm.monto),
          fechaPago: new Date().toISOString(),
        }),
      });

      if (!respuesta.ok) {
        const msg = await respuesta.text();
        throw new Error(msg || "Error al registrar");
      }

      setModalPago(false);
      await cargarDatos();

      Swal.fire({
        icon: "success",
        title: "Pago registrado",
        toast: true,
        position: "top-end",
        timer: 2500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire("Error", err.message || "No se pudo registrar el pago.", "error");
    }
  };

  const totalIngresos = pagos.reduce((acc, curr) => acc + Number(curr.monto), 0);
  const totalEgresos = egresos.reduce((acc, curr) => acc + Number(curr.costo), 0);
  const saldoFinal = totalIngresos - totalEgresos;

  const formatoMoneda = (valor) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(valor);

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
        return { concepto, proveedor, costo };
      },
    });

    if (!formValues) return;

    try {
      const respuesta = await fetchAuth(`${API}/Egresos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          concepto: formValues.concepto,
          proveedor: formValues.proveedor,
          costo: Number(formValues.costo),
          fecha: new Date().toISOString(),
        }),
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
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo registrar el egreso." });
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
            <span className={styles.headerBadgeValue}>{formatoMoneda(saldoFinal)}</span>
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
            <h3 className={styles.metricValue}>{formatoMoneda(totalIngresos)}</h3>
          </div>
        </div>
        <div className={`${styles.metricCard} ${styles.egreso}`}>
          <div className={`${styles.iconBox} ${styles.iconEgreso}`}>
            <i className="bi bi-arrow-down-right" />
          </div>
          <div>
            <p className={styles.metricLabel}>Egresos / Gastos</p>
            <h3 className={styles.metricValue}>{formatoMoneda(totalEgresos)}</h3>
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
              Ingresos (pagos y facturas)
              <span className={styles.tableCount}>{pagos.length}</span>
            </h4>
            <button
              type="button"
              className={`${styles.btnAction} ${styles.btnIngreso}`}
              onClick={abrirModalPago}
            >
              + Registrar Pago
            </button>
          </div>
          <div className={styles.tableScroll}>
            <table className={styles.atelierTable}>
              <thead>
                <tr>
                  <th>Referencia</th>
                  <th>Cliente</th>
                  <th>Método</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                {pagos.length > 0 ? (
                  pagos.map((pago) => (
                    <tr key={pago.id}>
                      <td className={styles.orderId}>
                        {pago.referenciaTexto || pago.referencia || (pago.pedidoId ? `ORD-${pago.pedidoId}` : `FAC-${pago.facturaId}`)}
                      </td>
                      <td>{pago.clienteNombre || "—"}</td>
                      <td>
                        <span className={styles.methodBadge}>{pago.metodoPago}</span>
                      </td>
                      <td className={styles.amountPositive}>{formatoMoneda(pago.monto)}</td>
                    </tr>
                  ))
                ) : (
                  <tr className={styles.emptyRow}>
                    <td colSpan="4">No hay ingresos registrados.</td>
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
                      <td className={styles.amountNegative}>- {formatoMoneda(egreso.costo)}</td>
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

      {modalPago && (
        <div className={styles.modalOverlay} onClick={() => setModalPago(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Registrar pago de pedido</h3>
            <p className={styles.modalHint}>Busque por cliente y seleccione el pedido correspondiente.</p>

            <label className={styles.modalLabel}>Cliente</label>
            <BuscarCliente
              value={clientePago}
              onChange={(id) => setPagoForm((f) => ({ ...f, clienteId: id }))}
              onSelect={onClientePagoSelect}
            />

            <label className={styles.modalLabel}>Pedido / Orden</label>
            <select
              className={styles.modalInput}
              value={pagoForm.pedidoId}
              onChange={(e) => onPedidoPagoChange(e.target.value)}
              disabled={!pagoForm.clienteId}
            >
              <option value="">Seleccione pedido...</option>
              {pedidosCliente.map((p) => (
                <option key={p.id} value={p.id}>
                  ORD-{p.id} — {p.estilo} — Saldo: {formatoMoneda(p.saldoPendiente)} — {p.estado}
                </option>
              ))}
            </select>

            <label className={styles.modalLabel}>Método de pago</label>
            <select
              className={styles.modalInput}
              value={pagoForm.metodoPago}
              onChange={(e) => setPagoForm((f) => ({ ...f, metodoPago: e.target.value }))}
            >
              <option value="">Seleccione...</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Tarjeta">Tarjeta</option>
            </select>

            <label className={styles.modalLabel}>Monto</label>
            <input
              type="number"
              className={styles.modalInput}
              value={pagoForm.monto}
              onChange={(e) => setPagoForm((f) => ({ ...f, monto: e.target.value }))}
              placeholder="Monto en COP"
            />

            <div className={styles.modalActions}>
              <button type="button" className={styles.btnModalCancel} onClick={() => setModalPago(false)}>
                Cancelar
              </button>
              <button type="button" className={styles.btnModalSave} onClick={confirmarPago}>
                Guardar pago
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
