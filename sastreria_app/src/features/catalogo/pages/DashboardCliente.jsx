// src/features/catalogo/pages/DashboardCliente.jsx
import { useState, useEffect } from "react";
import styles from "./DashboardCliente.module.css";
import { fetchAuth } from "../../../core/utils/fetchAuth";

const API = "https://localhost:7196/api/PrendasCatalogo";

export const DashboardCliente = () => {
  const [prendas, setPrendas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");

  const categorias = [
    "Todos",
    "Traje",
    "Saco",
    "Pantalón",
    "Camisa",
    "Accesorio",
  ];

  useEffect(() => {
    const cargarPrendas = async () => {
      try {
        const res = await fetchAuth(API);
        if (!res.ok) throw new Error("Error en la respuesta del servidor");
        const data = await res.json();
        const activas = data.filter((p) => p.activa);
        setPrendas(activas);
      } catch (error) {
        console.error("Error cargando catálogo real:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarPrendas();
  }, []);

  const agregarAlCarrito = (nombre, precio) => {
    const cant = prompt(
      `¿Cuántas unidades de "${nombre}" desea encargar?`,
      "1",
    );
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

  const prendasFiltradas = prendas.filter((prenda) => {
    const coincideCategoria =
      categoriaActiva === "Todos" ||
      prenda.tipoPrenda.toLowerCase().includes(categoriaActiva.toLowerCase());
    const coincideBusqueda = prenda.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  return (
    <div className={`animate__animated animate__fadeIn ${styles.page}`}>
      {/* ── HERO SECTION ── */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Tu Estilo, <br />
            <span className={styles.titleGold}>a Medida</span>
          </h1>
          <p className={styles.heroLead}>
            Bienvenido a su atelier personal. Supervise sus pedidos y explore
            nuestra nueva colección premium.
          </p>
        </div>

        <div className={styles.heroWidget}>
          <div className={styles.appointmentCard}>
            <small className={styles.kicker}>Próxima Prueba</small>
            <h3 className={styles.appointmentValue}>14 Oct, 17:30</h3>
          </div>
        </div>
      </section>

      {/* ── RASTREADOR (Stepper) ── */}
      <section className={styles.stepperContainer}>
        <h6 className={styles.sectionKicker}>Estado de tu último pedido</h6>
        <div className={styles.stepper}>
          <div className={styles.stepperLine}></div>

          <div className={styles.step}>
            <div className={`${styles.stepIcon} ${styles.activeIcon}`}>
              <i className="bi bi-pencil"></i>
            </div>
            <small className={styles.stepLabelActive}>Diseño</small>
          </div>

          <div className={styles.step}>
            <div className={`${styles.stepIcon} ${styles.activeIcon}`}>
              <i className="bi bi-rulers"></i>
            </div>
            <small className={styles.stepLabelActive}>Medidas</small>
          </div>

          <div className={styles.step}>
            <div className={`${styles.stepIcon} ${styles.activeIcon}`}>
              <i className="bi bi-scissors"></i>
            </div>
            <small className={styles.stepLabelActive}>Confección</small>
          </div>

          <div className={styles.step}>
            <div className={styles.stepIcon}>
              <i className="bi bi-box-seam"></i>
            </div>
            <small className={styles.stepLabel}>Entrega</small>
          </div>
        </div>
      </section>

      {/* ── CATÁLOGO CON FILTROS Y BÚSQUEDA ── */}
      <section className={styles.catalogSection}>
        <div className={styles.catalogHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Colección Premium</h2>
            <p className="text-muted">
              Encuentra la pieza perfecta para tu próximo evento.
            </p>
          </div>

          {/* BUSCADOR */}
          <div className={styles.searchBox}>
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Buscar prenda..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        {/* PESTAÑAS DE CATEGORÍA */}
        <div className={styles.filterTabs}>
          {categorias.map((cat) => (
            <button
              key={cat}
              className={`${styles.tabBtn} ${categoriaActiva === cat ? styles.tabActive : ""}`}
              onClick={() => setCategoriaActiva(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status"></div>
            <p className="mt-2 text-muted fw-bold">
              Cargando catálogo del Atelier...
            </p>
          </div>
        ) : prendasFiltradas.length === 0 ? (
          <div className="text-center py-5 text-muted">
            No encontramos prendas que coincidan con tu búsqueda.
          </div>
        ) : (
          <div className={styles.grid}>
            {prendasFiltradas.map((prenda) => (
              <div key={prenda.id} className={styles.card}>
                <div className={styles.imageWrap}>
                  <img
                    src={
                      prenda.imagenUrl
                        ? `https://localhost:7196${prenda.imagenUrl}`
                        : "https://placehold.co/600x800?text=Atelier"
                    }
                    alt={prenda.nombre}
                    className={styles.image}
                  />
                </div>

                <div className={styles.cardBody}>
                  <span className={styles.type}>{prenda.tipoPrenda}</span>
                  <h3 className={styles.name}>{prenda.nombre}</h3>

                  <div className={styles.footer}>
                    <strong className={styles.price}>
                      ${prenda.precioBase}
                    </strong>
                    <button
                      className={styles.btnGold}
                      onClick={() =>
                        agregarAlCarrito(prenda.nombre, prenda.precioBase)
                      }
                    >
                      Añadir <i className="bi bi-cart-plus ms-1"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
