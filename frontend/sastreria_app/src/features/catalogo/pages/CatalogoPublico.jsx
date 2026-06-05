// Catálogo público de estilos — datos reales desde la API (sin fake API)
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DashboardCliente.module.css";
import { ImagenPrenda } from "../../../core/components/ImagenPrenda";

const API_ESTILOS = "http://localhost:5000/api/prendas/estilos";
const API_CATALOGO = "http://localhost:5000/api/prendas/catalogo";

const formatoMoneda = (valor) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(valor);

export const CatalogoPublico = () => {
  const navigate = useNavigate();
  const [estilos, setEstilos] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [busquedaInv, setBusquedaInv] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [categoriaInventario, setCategoriaInventario] = useState("Todos");

  const categorias = ["Todos", "Camisa", "Blusa", "Pantalón", "Falda"];

  useEffect(() => {
    Promise.all([fetch(API_ESTILOS), fetch(API_CATALOGO)])
      .then(async ([r1, r2]) => {
        if (r1.ok) setEstilos(await r1.json());
        if (r2.ok) setInventario(await r2.json());
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const estilosFiltrados = estilos.filter((e) => {
    const coincideCat =
      categoriaActiva === "Todos" ||
      e.tipoPrenda?.toLowerCase() === categoriaActiva.toLowerCase();
    const coincideBusq = e.estilo?.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCat && coincideBusq;
  });

  const inventarioFiltrado = inventario.filter((p) => {
    const coincideCat =
      categoriaInventario === "Todos" ||
      p.tipoPrenda?.toLowerCase() === categoriaInventario.toLowerCase();
    const coincideBusq = p.nombre?.toLowerCase().includes(busquedaInv.toLowerCase());
    return coincideCat && coincideBusq;
  });

  return (
    <div className={styles.page}>
      <header className={styles.hero} style={{ minHeight: "auto", padding: "3rem 2rem" }}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Estilos de <span className={styles.titleGold}>Confección</span>
          </h1>
          <p className={styles.heroLead}>
            Consulta el costo estimado y la cantidad de tela aproximada para cada estilo.
          </p>
          <button className={styles.btnGold} onClick={() => navigate("/login")}>
            Solicitar confección
          </button>
        </div>
      </header>

      <section className={styles.catalogSection}>
        <div className={styles.catalogHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Prendas en inventario</h2>
            <p className="text-muted">Venta, alquiler, tallas y stock disponible</p>
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
          <p className="text-center py-5 text-muted">Cargando...</p>
        ) : inventarioFiltrado.length === 0 ? (
          <p className="text-center py-5 text-muted">No hay prendas con stock.</p>
        ) : (
          <div className={styles.grid}>
            {inventarioFiltrado.map((p) => (
              <div key={p.id} className={styles.card}>
                <div className={styles.imageWrap}>
                  <ImagenPrenda url={p.imagenUrl} alt={p.nombre} tipo={p.tipoPrenda} variant="card" />
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.type}>{p.tipoPrenda}</span>
                  <h3 className={styles.name}>{p.nombre}</h3>
                  <div className={styles.metaInfo}>
                    <p><strong>Talla:</strong> {p.talla || "—"}</p>
                    <p><strong>Color:</strong> {p.color || "—"}</p>
                    <p><strong>Stock:</strong> {p.cantidad}</p>
                    <p><strong>Venta:</strong> {formatoMoneda(p.precioVenta)}</p>
                    <p><strong>Alquiler:</strong> {formatoMoneda(p.precioAlquiler)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={styles.catalogSection} style={{ marginTop: "3rem" }}>
        <div className={styles.catalogHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Catálogo de estilos</h2>
            <p className="text-muted">Precios y consumo de tela referenciales</p>
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

        {loading ? (
          <p className="text-center py-5 text-muted">Cargando estilos...</p>
        ) : estilosFiltrados.length === 0 ? (
          <p className="text-center py-5 text-muted">No hay estilos registrados aún.</p>
        ) : (
          <div className={styles.grid}>
            {estilosFiltrados.map((e) => (
              <div key={e.id} className={styles.card}>
                <div className={styles.imageWrap}>
                  <ImagenPrenda url={e.imagenUrl} alt={e.estilo} tipo={e.tipoPrenda} variant="card" />
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.type}>{e.tipoPrenda}</span>
                  <h3 className={styles.name}>{e.estilo}</h3>
                  <div className={styles.metaInfo}>
                    <p><strong>Costo estimado:</strong> {formatoMoneda(e.costo)}</p>
                    <p><strong>Tela aprox.:</strong> {e.consumoTelaAprox} m</p>
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
