// src/features/recepcion/pages/DashboardRecepcion.jsx
import { useState } from 'react';
import styles from './DashboardRecepcion.module.css';

export const DashboardRecepcion = () => {
  const [vistaAct, setVistaAct] = useState('formulario'); 
  const [clienteEdit, setClienteEdit] = useState(null);

  const [clientes, setClientes] = useState([
    { id: 1, nombre: 'Sebastián Maestre', telefono: '+57 300 000 000', cuello: 40, pecho: 100 },
    { id: 2, nombre: 'María González', telefono: '+57 301 111 111', cuello: 36, pecho: 90 },
    { id: 3, nombre: 'Carlos Vives', telefono: '+57 302 222 222', cuello: 42, pecho: 105 },
  ]);
  
  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [cuello, setCuello] = useState('');
  const [pecho, setPecho] = useState('');

  const [busquedaDirectorio, setDirectorio] = useState('');
  const [busquedaPedido, setBusqueda] = useState('');

  const clientesEnDirectorio = clientes.filter(cliente => 
    cliente.nombre.toLowerCase().includes(busquedaDirectorio.toLowerCase()) ||
    cliente.telefono.includes(busquedaDirectorio)
  );

  const clientesEnPedido = clientes.filter(cliente => 
    cliente.nombre.toLowerCase().includes(busquedaPedido.toLowerCase())
  );

  const Edicion = (cliente) => {
    setClienteEdit(cliente.id);
    setNombre(cliente.nombre);
    setTelefono(cliente.telefono);
    setCuello(cliente.cuello || '');
    setPecho(cliente.pecho || '');
    setVistaAct('formulario'); 
  };

  const Eliminacion = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      setClientes(clientes.filter(c => c.id !== id));
    }
  };

  const NuevoCliente = () => {
    setClienteEdit(null);
    setNombre('');
    setTelefono('');
    setCuello('');
    setPecho('');
    setVistaAct('formulario');
  };

  const [medidas, setMedidas] = useState({
    cuello: '',
    pecho: '',
    hombros: '',
    largoManga: '',
    largoTalle: '',
    largoTotalSup: '',
    cintura: '',
    cadera: '',
    altoCadera: '',
    entrepierna: '',
    largoTotalInf: '',
    anchoBajo: ''
  });

  const guardarCliente = () => {
    const cuelloNum = parseFloat(cuello) || 0;
    const pechoNum = parseFloat(pecho) || 0;

    if (clienteEdit) {
      setClientes(clientes.map(c => 
        c.id === clienteEdit ? { ...c, nombre, telefono, cuello: cuelloNum, pecho: pechoNum } : c
      ));
      alert('Cliente actualizado correctamente');
    } else {
      const nuevoCliente = { 
        id: Date.now(), 
        nombre, 
        telefono, 
        cuello: cuelloNum, 
        pecho: pechoNum 
      };
      setClientes([...clientes, nuevoCliente]);
      alert('Nuevo cliente guardado');
    }
    NuevoCliente(); 
    setVistaAct('tabla'); 
  };

  const CambioMedida = (e) => {
    const { name, value } = e.target;
    
    setMedidas((medidasPrev) => ({
      ...medidasPrev, 
      [name]: value      
    }));
  };

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
        
        {/* Registro, Medidas y Directorio */}
        <div style={{ flex: 1, padding: '2rem' }}>
        
        <div className={styles.tabContainer}>
          <button 
            onClick={NuevoCliente}
            className={vistaAct === 'formulario' && !clienteEdit ? styles.btnTabActive : styles.btnTab}
          >
            + Nuevo Cliente
          </button>
          <button 
            onClick={() => setVistaAct('tabla')}
            className={vistaAct === 'tabla' ? styles.btnTabActive : styles.btnTab}
          >
            Ver Directorio
          </button>
        </div>

        {vistaAct === 'tabla' ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Directorio de Clientes</h2>
              
              {/* Buscador del Directorio */}
              <input 
                type="text" 
                placeholder="Buscar por nombre o teléfono..." 
                className={styles.inputLine}
                style={{ width: '300px', marginBottom: '1rem' }}
                value={busquedaDirectorio}
                onChange={(e) => setDirectorio(e.target.value)}
              />
            </div>

            <table style={{ width: '100%', textAlign: 'left', marginTop: '1rem' }}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Teléfono</th>
                  <th>Medidas (C/P)</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {/* Usamos la lista filtrada  */}
                {clientesEnDirectorio.length > 0 ? (
                  clientesEnDirectorio.map(cliente => (
                    <tr key={cliente.id} style={{ borderBottom: '1px solid #ccc' }}>
                      <td style={{ padding: '1rem 0' }}>{cliente.nombre}</td>
                      <td>{cliente.telefono}</td>
                      <td>{cliente.cuello} / {cliente.pecho}</td>
                      <td>
                        <button onClick={() => Edicion(cliente)} style={{ marginRight: '10px' }}>Editar</button>
                        <button onClick={() => Eliminacion(cliente.id)}>Eliminar</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                      No se encontraron clientes con esa búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            <h2>{clienteEdit ? 'Editar Cliente' : 'Datos Personales'}</h2>
            
            <div className={styles.fieldWrap}>
              <label className={styles.fieldLabel}>NOMBRE COMPLETO</label>
              <input 
                type="text" 
                className={styles.inputLine} 
                placeholder="Ej: Sebastian Maestre" 
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div className={styles.fieldWrap}>
              <label className={styles.fieldLabel}>TELÉFONO</label>
              <input 
                type="text" 
                className={styles.inputLine} 
                placeholder="+57 300 000 000" 
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </div>

            <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Medidas Superiores (cm)</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {/* Sección de Medidas */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>Cuello</label>
                <input 
                  type="number" 
                  step="0.1" 
                  className={styles.inputLine} 
                  placeholder="0.0" 
                  name="cuello" 
                  value={medidas.cuello} 
                  onChange={CambioMedida} 
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Pecho</label>
                <input 
                  type="number" 
                  step="0.1" 
                  className={styles.inputLine} 
                  placeholder="0.0" 
                  name="pecho" 
                  value={medidas.pecho} 
                  onChange={CambioMedida} 
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Hombros</label>
                <input 
                  type="number" 
                  step="0.1" 
                  className={styles.inputLine} 
                  placeholder="0.0" 
                  name="hombros" 
                  value={medidas.hombros} 
                  onChange={CambioMedida} 
                />
              </div>

              {/* terminar medidas superioes e inferiores */}
            </div>

            <button className={styles.btnDark} onClick={guardarCliente} style={{ marginTop: '2rem' }}>
              {clienteEdit ? 'ACTUALIZAR PERFIL' : 'GUARDAR PERFIL DE CLIENTE'}
            </button>
          </div>
        )}
        </div>

        {/* Nuevo Pedido */}
        <aside>
          <div className={styles.orderPanel}>
            <h3 className="font-headline mb-3 text-white">Nuevo Pedido</h3>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Cliente Asignado</label>
              
              {/* Buscador menu de seleccion */}
              <input 
                type="text" 
                placeholder="Filtrar cliente..." 
                className={styles.inputLine}
                style={{ backgroundColor: 'transparent', color: 'white', marginBottom: '0.5rem', borderColor: 'rgba(255,255,255,0.2)' }}
                value={busquedaPedido}
                onChange={(e) => setBusqueda(e.target.value)}
              />

              <select className={styles.inputLine} style={{ backgroundColor: 'transparent', color: 'gray' }} defaultValue="">
                <option value="" disabled>Seleccione un cliente de la lista</option>
                {/* lista filtrada para el pedido */}
                {clientesEnPedido.map(cliente => (
                  <option key={cliente.id} value={cliente.id} style={{ color: 'black' }}>
                    {cliente.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Seleccionar Prenda</label>
              <select className={styles.inputLine} style={{ backgroundColor: 'transparent', color: 'gray' }} defaultValue="">
                <option value="" disabled>Seleccione una opción</option>
                <option value="traje" style={{ color: 'black' }}>Traje Lana Merina</option>
                <option value="esmoquin" style={{ color: 'black' }}>Esmóquin de Gala</option>
                <option value="camisa" style={{ color: 'black' }}>Camisa Popelina</option>
                <option value="pantalon" style={{ color: 'black' }}>Pantalón de Vestir</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Sastre Asignado</label>
              <select className={styles.inputLine} style={{ backgroundColor: 'transparent', color: 'gray' }} defaultValue="">
                <option value="" disabled>Seleccione sastre</option>
                <option value="sastre1" style={{ color: 'black' }}>Maestro Alessandro</option>
                <option value="sastre2" style={{ color: 'black' }}>Sastre Valentina</option>
                <option value="sastre3" style={{ color: 'black' }}>Oficial Roberto</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Fecha de Entrega</label>
              <input type="date" className={styles.inputLine} style={{ color: 'gray' }} />
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