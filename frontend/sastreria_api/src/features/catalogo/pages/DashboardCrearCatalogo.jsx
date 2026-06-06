import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import styles from "./DashboardCrearCatalogo.module.css";
import { fetchAuth } from "../../../core/utils/fetchAuth";
import { ImagenPrenda } from "../../../core/components/ImagenPrenda";

const API = "https://localhost:7196/api/PrendasCatalogo";

const TIPOS = ["Camisa", "Blusa", "Pantalón", "Falda"];

export const DashboardCrearCatalogo = () => {
  const [estilos, setEstilos] = useState([]);

  const [form, setForm] = useState({
    nombre: "",
    tipoPrenda: "",
    precioBase: "",
    consumoTelaAprox: "",
    activa: true,
  });

  const [imagen, setImagen] = useState(null);
  const [imagenUrl, setImagenUrl] = useState("");

  useEffect(() => {
    cargarEstilos();
  }, []);

  const cargarEstilos = async () => {
    try {
      const res = await fetchAuth(API);
      setEstilos(await res.json());
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const guardarEstilo = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("nombre", form.nombre);
      formData.append("tipoPrenda", form.tipoPrenda);
      formData.append("precioBase", form.precioBase);
      formData.append("consumoTelaAprox", form.consumoTelaAprox);
      formData.append("activa", form.activa);

      if (imagenUrl.trim()) formData.append("imagenUrl", imagenUrl.trim());
      else if (imagen) formData.append("imagen", imagen);

      const res = await fetchAuth(API, { method: "POST", body: formData });
      if (!res.ok) throw new Error();

      Swal.fire("Estilo registrado", "El estilo fue guardado correctamente", "success");

      setForm({ nombre: "", tipoPrenda: "", precioBase: "", consumoTelaAprox: "", activa: true });
      setImagen(null);
      setImagenUrl("");
      cargarEstilos();
    } catch {
      Swal.fire("Error", "No se pudo guardar el estilo", "error");
    }
  };

  const eliminarEstilo = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar estilo?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
    });
    if (!result.isConfirmed) return;

    try {
      const res = await fetchAuth(`${API}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      Swal.fire("Eliminado", "Estilo eliminado", "success");
      cargarEstilos();
    } catch {
      Swal.fire("Error", "No se pudo eliminar", "error");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Estilos de <span>Prenda</span>
        </h1>
        <p className={styles.subtitle}>
          Registra el estilo, costo de confección y tela aproximada
        </p>
      </div>

      <form className={styles.formCard} onSubmit={guardarEstilo}>
        <div className={styles.inputGroup}>
          <label>Estilo de la prenda *</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ej: Camisa slim ejecutiva"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Tipo de prenda *</label>
          <select name="tipoPrenda" value={form.tipoPrenda} onChange={handleChange} required>
            <option value="">Seleccionar...</option>
            {TIPOS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label>Costo de confección (COP) *</label>
          <input
            type="number"
            name="precioBase"
            value={form.precioBase}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Tela aproximada (metros) *</label>
          <input
            type="number"
            step="0.1"
            name="consumoTelaAprox"
            value={form.consumoTelaAprox}
            onChange={handleChange}
            placeholder="Ej: 1.8"
            required
          />
        </div>

        <div className={`${styles.inputGroup} ${styles.inputGroupFull}`}>
          <label>URL de imagen (recomendado)</label>
          <input
            type="url"
            value={imagenUrl}
            onChange={(e) => setImagenUrl(e.target.value)}
            placeholder="https://ejemplo.com/foto-prenda.jpg"
          />
          <div className={styles.imageWrap}>
            <ImagenPrenda url={imagenUrl} alt="Vista previa" tipo={form.tipoPrenda} variant="card" />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>O subir archivo (opcional)</label>
          <input type="file" onChange={(e) => setImagen(e.target.files[0])} disabled={!!imagenUrl.trim()} />
        </div>

        <div className={`${styles.checkboxRow} ${styles.inputGroupFull}`}>
          <input type="checkbox" name="activa" checked={form.activa} onChange={handleChange} />
          <span>Estilo activo en catálogo</span>
        </div>

        <button type="submit" className={`${styles.btnGold} ${styles.inputGroupFull}`}>
          Guardar estilo
        </button>
      </form>

      <div className={styles.grid}>
        {estilos.map((e) => (
          <div key={e.id} className={styles.card}>
            <div className={styles.imageWrap}>
              <ImagenPrenda url={e.imagenUrl} alt={e.nombre} tipo={e.tipoPrenda} variant="card" />
            </div>
            <div className={styles.cardBody}>
              <h3>{e.nombre}</h3>
              <p>{e.tipoPrenda}</p>
              <p><strong>Costo:</strong> ${Number(e.precioBase).toLocaleString("es-CO")}</p>
              <p><strong>Tela aprox.:</strong> {e.consumoTelaAprox} m</p>
              <button className={styles.btnDelete} onClick={() => eliminarEstilo(e.id)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
