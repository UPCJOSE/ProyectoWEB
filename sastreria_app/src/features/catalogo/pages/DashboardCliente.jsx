// src/features/catalogo/pages/DashboardCliente.jsx
import { useState, useEffect } from 'react';
import styles from './DashboardCliente.module.css';

export const DashboardCliente = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  // MIGRACIÓN DE FAKE-API.JS A REACT
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const [hombres, mujeres] = await Promise.all([
          fetch("https://fakestoreapi.com/products/category/men's clothing").then(r => r.json()),
          fetch("https://fakestoreapi.com/products/category/women's clothing").then(r => r.json())
        ]);
        setProductos([...hombres, ...mujeres]);
        setLoading(false);
      } catch (error) {
        console.error("Error cargando catálogo:", error);
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  const agregarAlCarrito = (nombre, precio) => {
  const cant = prompt(`¿Cuántas unidades de "${nombre}" desea encargar?`, "1");
  const cantidadAgregada = parseInt(cant);

  if (cantidadAgregada && cantidadAgregada > 0) {
    const carrito = JSON.parse(localStorage.getItem("carrito") ?? "[]");
    
    const index = carrito.findIndex((p) => p.nombre === nombre);
    if (index !== -1) {
      carrito[index].cantidad += cantidadAgregada; 
    } else {
      carrito.push({ nombre, precio, cantidad: cantidadAgregada }); 
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));

    window.dispatchEvent(new Event("carritoActualizado"));

    alert(`Añadido al carrito: ${cantidadAgregada} x ${nombre}`);
  }
};

  return (
    <div className="animate__animated animate__fadeIn">
      
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="row align-items-center">
          <div className="col-md-7">
            <h1 className={styles.title}>
              Tu Estilo, <br /><span className={styles.titleGold}>a Medida</span>
            </h1>
            <p className="lead text-muted mt-3">
              Bienvenido a su atelier personal. Supervise sus pedidos y explore nuestra nueva colección.
            </p>
          </div>
          <div className="col-md-5 text-end d-none d-md-block">
             <div className="p-4 bg-white shadow-sm border-start border-4" style={{borderColor: '#c9a84c'}}>
                <small className="text-uppercase fw-bold text-muted">Próxima Prueba de Ajuste</small>
                <h3 className="mb-0">14 Oct, 17:30</h3>
             </div>
          </div>
        </div>
      </section>

      {/* RASTREADOR (Stepper) */}
      <section className={styles.stepperContainer}>
        <h6 className="text-uppercase fw-bold text-muted mb-4" style={{letterSpacing: '2px'}}>Estado de tu último traje</h6>
        <div className={styles.stepper}>
          <div className={styles.stepperLine}></div>
          
          <div className={styles.step}>
            <div className={`${styles.stepIcon} ${styles.activeIcon}`}><i className="bi bi-pencil"></i></div>
            <small className="fw-bold">Diseño</small>
          </div>
          
          <div className={styles.step}>
            <div className={`${styles.stepIcon} ${styles.activeIcon}`}><i className="bi bi-rulers"></i></div>
            <small className="fw-bold">Medidas</small>
          </div>

          <div className={styles.step}>
            <div className={`${styles.stepIcon} ${styles.activeIcon}`}><i className="bi bi-scissors"></i></div>
            <small className="fw-bold" style={{color: '#c9a84c'}}>Confección</small>
          </div>

          <div className={styles.step}>
            <div className={styles.stepIcon}><i className="bi bi-box-seam"></i></div>
            <small className="fw-bold text-muted">Entrega</small>
          </div>
        </div>
      </section>

      {/* CATÁLOGO DINÁMICO */}
      <section className="mb-5">
        <h2 className="font-headline mb-4">Colección Prêt-à-Porter</h2>
        
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status"></div>
            <p className="mt-2">Cargando colección exclusiva...</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {productos.map(prod => (
              <div key={prod.id} className={styles.productCard}>
                <img src={prod.image} alt={prod.title} className={styles.productImg} />
                <h4 className={styles.productTitle}>{prod.title}</h4>
                <p className={styles.price}>${prod.price}</p>
                <button 
                  className={styles.btnBuy}
                  onClick={() => agregarAlCarrito(prod.title, prod.price)}
                >
                  Agregar al Carrito
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};