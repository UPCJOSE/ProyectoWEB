// src/features/sastreria/pages/PanelSastre.jsx
import { useState } from 'react';
import styles from './PanelSastre.module.css';

export const PanelSastre = () => {
  const [pedidos, setPedidos] = useState([
    { id: 'ORD-2026-001', cliente: 'Julian Casablancas', prenda: 'Traje Lana Merina', estado: 'pendiente' },
    { id: 'ORD-2026-002', cliente: 'Roberto Gómez', prenda: 'Esmóquin de Gala', estado: 'pendiente' },
    { id: 'ORD-2026-003', cliente: 'Ana Silva', prenda: 'Blusa de Seda', estado: 'proceso' },
    { id: 'ORD-2026-004', cliente: 'Carlos Ruiz', prenda: 'Pantalón de Lino', estado: 'terminado' },
  ]);

  const moverPedido = (id, nuevoEstado) => {
    const nuevosPedidos = pedidos.map(pedido => 
      pedido.id === id ? { ...pedido, estado: nuevoEstado } : pedido
    );
    setPedidos(nuevosPedidos);
  };

  const verMedidas = (cliente) => {
    alert(`📐 Abriendo ficha de medidas para: ${cliente}\n(Aquí se mostraría el modal con Busto, Cintura, etc.)`);
  };

  const pendientes = pedidos.filter(p => p.estado === 'pendiente');
  const enProceso = pedidos.filter(p => p.estado === 'proceso');
  const terminados = pedidos.filter(p => p.estado === 'terminado');

  const Ticket = ({ pedido }) => (
    <div className={styles.ticket}>
      <div className={styles.ticketId}>{pedido.id}</div>
      <h4 className={styles.ticketPrenda}>{pedido.prenda}</h4>
      <p className={styles.ticketCliente}><i className="bi bi-person"></i> {pedido.cliente}</p>
      
      <div className={styles.actions}>
        <button className={styles.btnAction} onClick={() => verMedidas(pedido.cliente)}>
          Ver Medidas
        </button>
        
        {pedido.estado === 'pendiente' && (
          <button className={`${styles.btnAction} ${styles.btnGold}`} onClick={() => moverPedido(pedido.id, 'proceso')}>
            Iniciar
          </button>
        )}
        {pedido.estado === 'proceso' && (
          <button className={`${styles.btnAction} ${styles.btnGold}`} onClick={() => moverPedido(pedido.id, 'terminado')}>
            Finalizar
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="animate__animated animate__fadeIn">
      
      <header className={styles.header}>
        <h1 className={styles.title}>Atelier de Confección</h1>
        <p className="text-muted">Panel de producción Kanban. Maestro Sastre asignado.</p>
      </header>

      <main className={styles.kanbanBoard}>
        
        {/* PENDIENTES */}
        <section className={styles.kanbanColumn}>
          <div className={styles.columnHeader}>
            <h3 className={styles.columnTitle}>Pendientes</h3>
            <span className={styles.badgeQty}>{pendientes.length}</span>
          </div>
          {pendientes.map(pedido => <Ticket key={pedido.id} pedido={pedido} />)}
        </section>

        {/* EN PROCESO */}
        <section className={styles.kanbanColumn} style={{ backgroundColor: '#e8ecea' }}>
          <div className={styles.columnHeader}>
            <h3 className={styles.columnTitle}>En Proceso</h3>
            <span className={styles.badgeQty}>{enProceso.length}</span>
          </div>
          {enProceso.map(pedido => <Ticket key={pedido.id} pedido={pedido} />)}
        </section>

        {/* TERMINADOS */}
        <section className={styles.kanbanColumn}>
          <div className={styles.columnHeader}>
            <h3 className={styles.columnTitle}>Terminados</h3>
            <span className={styles.badgeQty}>{terminados.length}</span>
          </div>
          {terminados.map(pedido => <Ticket key={pedido.id} pedido={pedido} />)}
        </section>

      </main>

    </div>
  );
};