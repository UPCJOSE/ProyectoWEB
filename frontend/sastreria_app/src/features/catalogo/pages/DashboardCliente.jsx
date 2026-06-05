// Vista cliente — estilos de confección e inventario desde la API
import { useState, useEffect } from "react";
import styles from "./DashboardCliente.module.css";
import { fetchAuth } from "../../../core/utils/fetchAuth";
import { ImagenPrenda } from "../../../core/components/ImagenPrenda";

const API_ESTILOS = "http://localhost:5000/api/prendas/estilos";
const API_CATALOGO = "http://localhost:5000/api/prendas/catalogo";

const formatoMoneda = (valor) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(valor);

export const DashboardCliente = () => {
  const [estilos, setEstilos] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [categoriaInventario, setCategoriaInventario] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [busquedaInv, setBusquedaInv] = useState("");

  const categorias = ["Todos", "Camisa", "Blusa", "Pantalón", "Falda"];

  useEffect(() => {
    const cargar = async () => {
      try {
        const [resEstilos, resInv] = await Promise.all([
          fetchAuth(API_ESTILOS),
          fetch(API_CATALOGO),
        ]);
        if (resEstilos.ok) setEstilos(await resEstilos.json());
        if (resInv.ok) setInventario(await resInv.json());
      } catch {
        /* Sin conexión: se muestran listas vacías sin error en pantalla */
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const estilosFiltrados = estilos.filter((e) => {
    const coincideCategoria =
      categoriaActiva === "Todos" ||
      e.tipoPrenda?.toLowerCase() === categoriaActiva.toLowerCase();
    const coincideBusqueda = e.estilo
      ?.toLowerCase()
      .includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  const inventarioFiltrado = inventario.filter((p) => {
    const coincideCat =
      categoriaInventario === "Todos" ||
      p.tipoPrenda?.toLowerCase() === categoriaInventario.toLowerCase();
    const coincideBusq = p.nombre?.toLowerCase().includes(busquedaInv.toLowerCase());
    return coincideCat && coincideBusq;
  });

  return (
    <div className={`animate__animated animate__fadeIn ${styles.page}`}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Catálogo de <span className={styles.titleGold}>Prendas</span>
          </h1>
          <p className={styles.heroLead}>
            Consulta estilos de confección y prendas disponibles en inventario
            (venta y alquiler) con fotos y precios.
          </p>
        </div>
      </section>

      <section className={styles.catalogSection}>
        <div className={styles.catalogHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Prendas en inventario</h2>
            <p className="text-muted">
              Disponibles para venta o alquiler — talla, color, stock y precios
            </p>
          </div>
          <div className={styles.searchBox}>
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Buscar prenda..."
              value={busquedaInv}
              onChange={(e) => setBusquedaInv(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.filterTabs}>
          {categorias.map((cat) => (
            <button
              key={`inv-${cat}`}
              className={`${styles.tabBtn} ${categoriaInventario === cat ? styles.tabActive : ""}`}
              onClick={() => setCategoriaInventario(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status"></div>
            <p className="mt-2 text-muted fw-bold">Cargando catálogo...</p>
          </div>
        ) : inventarioFiltrado.length === 0 ? (
          <div className="text-center py-5 text-muted">
            No hay prendas con stock en inventario.
          </div>
        ) : (
          <div className={styles.grid}>
            {inventarioFiltrado.map((p) => (
              <div key={p.id} className={styles.card}>
                <div className={styles.imageWrap}>
                  <ImagenPrenda url={p.imagenUrl} alt={p.nombre} tipo={p.tipoPrenda} />
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.type}>{p.tipoPrenda}</span>
                  <h3 className={styles.name}>{p.nombre}</h3>
                  <div className={styles.metaInfo}>
                    <p>
                      <strong>Talla:</strong> {p.talla || "—"}
                    </p>
                    <p>
                      <strong>Color:</strong> {p.color || "—"}
                    </p>
                    <p>
                      <strong>Disponibles:</strong> {p.cantidad}
                    </p>
                    <p>
                      <strong>Venta:</strong> {formatoMoneda(p.precioVenta)}
                    </p>
                    <p>
                      <strong>Alquiler:</strong> {formatoMoneda(p.precioAlquiler)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={styles.catalogSection} style={{ marginTop: "4rem" }}>
        <div className={styles.catalogHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Estilos de confección</h2>
            <p className="text-muted">
              Costo de confección y consumo de tela referencial
            </p>
          </div>
          <div className={styles.searchBox}>
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Buscar estilo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

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

        {loading ? null : estilosFiltrados.length === 0 ? (
          <div className="text-center py-5 text-muted">
            No hay estilos registrados. El administrador puede agregarlos en
            Crear catálogo.
          </div>
        ) : (
          <div className={styles.grid}>
            {estilosFiltrados.map((e) => (
              <div key={e.id} className={styles.card}>
                <div className={styles.imageWrap}>
                  <ImagenPrenda url={e.imagenUrl} alt={e.estilo} tipo={e.tipoPrenda} />
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.type}>{e.tipoPrenda}</span>
                  <h3 className={styles.name}>{e.estilo}</h3>
                  <div className={styles.metaInfo}>
                    <p>
                      <strong>Costo estimado:</strong>{" "}
                      {formatoMoneda(e.costo)}
                    </p>
                    <p>
                      <strong>Tela aprox.:</strong> {e.consumoTelaAprox} m
                    </p>
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
