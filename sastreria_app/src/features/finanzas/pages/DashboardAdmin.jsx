// src/features/finanzas/pages/DashboardAdmin.jsx
import { useState } from 'react';
import styles from './DashboardAdmin.module.css';

export const DashboardAdmin = () => {
  const [pagos, setPagos] = useState([
    { id: 1, pedido: 'ORD-2026-001', tipo: 'Adelanto 50%', monto: 450000 },
    { id: 2, pedido: 'ORD-2026-002', tipo: 'Liquidación', monto: 320000 },
  ]);

  const [egresos, setEgresos] = useState([
    { id: 1, concepto: 'Rollo Lana Merina', proveedor: 'Textiles Bogotá', costo: 150000 },
    { id: 2, concepto: 'Mantenimiento Máquinas', proveedor: 'Servicios Técnicos', costo: 80000 },
  ]);

  const totalIngresos = pagos.reduce((acc, curr) => acc + curr.monto, 0);
  const totalEgresos = egresos.reduce((acc, curr) => acc + curr.costo, 0);
  const saldoFinal = totalIngresos - totalEgresos;

  const registrarPago = () => {
    const monto = prompt("Ingrese el monto del pago recibido (solo números):");
    if (monto && !isNaN(monto)) {
      const nuevoPago = {
        id: Date.now(),
        pedido: 'ORD-2026-NUEVO',
        tipo: 'Abono en Caja',
        monto: parseFloat(monto)
      };
      setPagos([...pagos, nuevoPago]);
    }
  };

  const registrarEgreso = () => {
    const costo = prompt("Ingrese el costo del material o servicio (solo números):");
    if (costo && !isNaN(costo)) {
      const nuevoEgreso = {
        id: Date.now(),
        concepto: 'Compra de Insumos',
        proveedor: 'Caja Menor',
        costo: parseFloat(costo)
      };
      setEgresos([...egresos, nuevoEgreso]);
    }
  };

  const formatoMoneda = (valor) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(valor);
  };

  return (
    <div className="animate__animated animate__fadeIn">
      
      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard Financiero</h1>
        <p className="text-muted">Control general de caja, ingresos por pedidos e inventario.</p>
      </header>

      {/* ── KPIs ── */}
      <section className={styles.metricsGrid}>
        <div className={`${styles.metricCard} ${styles.ingreso}`}>
          <div className={styles.iconBox}><i className="bi bi-arrow-up-right"></i></div>
          <div>
            <p className={styles.metricLabel}>Ingresos Brutos</p>
            <h3 className={styles.metricValue}>{formatoMoneda(totalIngresos)}</h3>
          </div>
        </div>

        <div className={`${styles.metricCard} ${styles.egreso}`}>
          <div className={styles.iconBox} style={{ color: '#e74c3c' }}><i className="bi bi-arrow-down-right"></i></div>
          <div>
            <p className={styles.metricLabel}>Egresos / Gastos</p>
            <h3 className={styles.metricValue}>{formatoMoneda(totalEgresos)}</h3>
          </div>
        </div>

        <div className={`${styles.metricCard} ${styles.saldo}`}>
          <div className={styles.iconBox} style={{ background: '#c9a84c', color: 'white' }}><i className="bi bi-wallet2"></i></div>
          <div>
            <p className={styles.metricLabel}>Saldo Neto en Caja</p>
            <h3 className={styles.metricValue} style={{ color: '#c9a84c' }}>{formatoMoneda(saldoFinal)}</h3>
          </div>
        </div>
      </section>

      {/* ── TABLAS DE MOVIMIENTOS ── */}
      <section className={styles.tablesGrid}>
        
        {/* Tabla Ingresos */}
        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}>
            <h4 className="font-headline m-0">Pagos Recibidos</h4>
            <button className={`${styles.btnAction} ${styles.btnIngreso}`} onClick={registrarPago}>
              + Registrar Pago
            </button>
          </div>
          <table className={styles.atelierTable}>
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Concepto</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              {pagos.map(pago => (
                <tr key={pago.id}>
                  <td style={{ color: '#c9a84c', fontWeight: 'bold' }}>{pago.pedido}</td>
                  <td>{pago.tipo}</td>
                  <td style={{ color: '#27ae60' }}>{formatoMoneda(pago.monto)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tabla Egresos */}
        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}>
            <h4 className="font-headline m-0">Egresos de Inventario</h4>
            <button className={`${styles.btnAction} ${styles.btnEgreso}`} onClick={registrarEgreso}>
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
              {egresos.map(egreso => (
                <tr key={egreso.id}>
                  <td>{egreso.concepto}</td>
                  <td style={{ color: '#747879' }}>{egreso.proveedor}</td>
                  <td style={{ color: '#e74c3c' }}>- {formatoMoneda(egreso.costo)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </section>

      {/* ── GENERADOR DE REPORTES ── */}
      <section className={styles.reportsBox}>
        <h4 className="font-headline m-0 me-4">Exportar Reportes</h4>
        <input type="date" className="form-control w-auto" style={{ border: '1px solid #d4d0c4' }} />
        <span className="text-muted">hasta</span>
        <input type="date" className="form-control w-auto" style={{ border: '1px solid #d4d0c4' }} />
        
        <button className="btn btn-dark ms-auto d-flex align-items-center gap-2" onClick={() => alert("Generando reporte en formato Excel...")}>
          <i className="bi bi-file-earmark-excel"></i> Exportar a Excel
        </button>
        <button className="btn btn-outline-dark d-flex align-items-center gap-2" onClick={() => alert("Generando documento PDF...")}>
          <i className="bi bi-filetype-pdf"></i> Exportar a PDF
        </button>
      </section>

    </div>
  );
};