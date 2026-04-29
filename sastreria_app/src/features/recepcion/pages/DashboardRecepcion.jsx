// src/features/recepcion/pages/DashboardRecepcion.jsx
import styles from './DashboardRecepcion.module.css';

export const DashboardRecepcion = () => {
  return (
    <div className="animate__animated animate__fadeIn">
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>
          Recepción <br /> <span className={styles.titleAccent}>del Atelier</span>
        </h1>
        <p className="text-muted">Gestione cada detalle de la experiencia de sus clientes.</p>
      </header>

      {/* Métricas rápidas */}
      <section className={styles.metricsGrid}>
        <div className={styles.card}>
          <small className={styles.label}>Clientes Hoy</small>
          <h2>24</h2>
        </div>
        <div className={`${styles.card} ${styles.cardDark}`}>
          <small className={styles.label} style={{color: '#aaa'}}>Pedidos Activos</small>
          <h2>156</h2>
        </div>
        <div className={styles.card}>
          <small className={styles.label}>En Sastrería</small>
          <h2>8</h2>
        </div>
      </section>

      {/* Sección de Formularios */}
      <div className={styles.formSection}>
        
        {/* Registro y Medidas */}
        <section>
          <h3 className="font-headline mb-4" style={{ color: '#181f21' }}>Datos Personales</h3>
          <div className="row g-4">
            <div className="col-md-6">
              <label className={styles.label}>Nombre Completo</label>
              <input type="text" className={styles.inputLine} placeholder="Ej: Sebastian Maestre" />
            </div>
            <div className="col-md-6">
              <label className={styles.label}>Teléfono</label>
              <input type="text" className={styles.inputLine} placeholder="+57 300 000 000" />
            </div>
          </div>

          {/* Medidas Superiores */}
          <h4 className={styles.sectionTitle}>Medidas Superiores</h4>
          <div className={styles.measuresCard}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Cuello</label>
              <input type="number" step="0.1" className={styles.inputLine} placeholder="0.0" />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Pecho</label>
              <input type="number" step="0.1" className={styles.inputLine} placeholder="0.0" />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Hombros</label>
              <input type="number" step="0.1" className={styles.inputLine} placeholder="0.0" />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Largo Manga</label>
              <input type="number" step="0.1" className={styles.inputLine} placeholder="0.0" />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Largo Talle</label>
              <input type="number" step="0.1" className={styles.inputLine} placeholder="0.0" />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Largo Total Sup.</label>
              <input type="number" step="0.1" className={styles.inputLine} placeholder="0.0" />
            </div>
          </div>

          {/* Medidas Inferiores */}
          <h4 className={styles.sectionTitle}>Medidas Inferiores</h4>
          <div className={styles.measuresCard}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Cintura</label>
              <input type="number" step="0.1" className={styles.inputLine} placeholder="0.0" />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Cadera</label>
              <input type="number" step="0.1" className={styles.inputLine} placeholder="0.0" />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Alto Cadera</label>
              <input type="number" step="0.1" className={styles.inputLine} placeholder="0.0" />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Entrepierna</label>
              <input type="number" step="0.1" className={styles.inputLine} placeholder="0.0" />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Largo Total Inf.</label>
              <input type="number" step="0.1" className={styles.inputLine} placeholder="0.0" />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Ancho Bajo</label>
              <input type="number" step="0.1" className={styles.inputLine} placeholder="0.0" />
            </div>
          </div>
          <button 
            className={styles.btnDark} 
            onClick={() => alert("Perfil de cliente y medidas guardados en la base de datos.")}
          >
            Guardar Perfil de Cliente
          </button>
        </section>

        {/* Panel de Nuevo Pedido */}
        <aside>
          <div className={styles.orderPanel}>
            <h3 className="font-headline mb-3 text-white">Nuevo Pedido</h3>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Seleccionar Prenda</label>
              <select className={styles.inputLine} style={{ backgroundColor: 'transparent' }}>
                <option value="" disabled selected>Seleccione una opción</option>
                <option value="traje">Traje Lana Merina</option>
                <option value="esmoquin">Esmóquin de Gala</option>
                <option value="camisa">Camisa Popelina</option>
                <option value="pantalon">Pantalón de Vestir</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Sastre Asignado</label>
              <select className={styles.inputLine} style={{ backgroundColor: 'transparent' }}>
                <option value="" disabled selected>Seleccione sastre</option>
                <option value="sastre1">Maestro Alessandro</option>
                <option value="sastre2">Sastre Valentina</option>
                <option value="sastre3">Oficial Roberto</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Fecha de Entrega</label>
              <input type="date" className={styles.inputLine} />
            </div>

            <button 
              className={styles.btnGold} 
              onClick={() => alert("Orden generada y asignada al sastre correctamente.")}
            >
              Generar Orden
            </button>
          </div>
        </aside>

      </div>
    </div>
  );
};