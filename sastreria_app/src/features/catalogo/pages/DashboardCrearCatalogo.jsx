import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import styles from "./DashboardCatalogo.module.css";

const API = "https://localhost:7196/api/PrendasCatalogo";

export const DashboardCatalogo = () => {
  const [prendas, setPrendas] = useState([]);

  const [form, setForm] = useState({
    nombre: "",
    tipoPrenda: "",
    precioBase: "",
    activa: true,
  });

  const [imagen, setImagen] = useState(null);

  useEffect(() => {
    cargarPrendas();
  }, []);

  const cargarPrendas = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();

      setPrendas(data);
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

  const handleImagen = (e) => {
    setImagen(e.target.files[0]);
  };

  const guardarPrenda = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("nombre", form.nombre);
      formData.append("tipoPrenda", form.tipoPrenda);
      formData.append("precioBase", form.precioBase);
      formData.append("activa", form.activa);

      if (imagen) {
        formData.append("imagen", imagen);
      }

      const res = await fetch(API, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error();

      Swal.fire(
        "Prenda creada",
        "La prenda fue registrada correctamente",
        "success",
      );

      setForm({
        nombre: "",
        tipoPrenda: "",
        precioBase: "",
        activa: true,
      });

      setImagen(null);

      cargarPrendas();
    } catch (error) {
      console.error(error);

      Swal.fire("Error", "No se pudo guardar la prenda", "error");
    }
  };

  const eliminarPrenda = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      Swal.fire("Eliminada", "La prenda fue eliminada", "success");

      cargarPrendas();
    } catch (error) {
      console.error(error);

      Swal.fire("Error", "No se pudo eliminar", "error");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Catálogo <span>Atelier</span>
        </h1>

        <p className={styles.subtitle}>Administración de prendas y diseños</p>
      </div>

      {/* FORMULARIO */}

      <form className={styles.formCard} onSubmit={guardarPrenda}>
        <div className={styles.inputGroup}>
          <label>Nombre</label>

          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Tipo de prenda</label>

          <input
            type="text"
            name="tipoPrenda"
            value={form.tipoPrenda}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Precio base</label>

          <input
            type="number"
            name="precioBase"
            value={form.precioBase}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Imagen</label>

          <input type="file" onChange={handleImagen} />
        </div>

        <div className={styles.checkboxRow}>
          <input
            type="checkbox"
            name="activa"
            checked={form.activa}
            onChange={handleChange}
          />

          <span>Prenda activa</span>
        </div>

        <button type="submit" className={styles.btnGold}>
          Guardar prenda
        </button>
      </form>

      {/* GRID */}

      <div className={styles.grid}>
        {prendas.map((prenda) => (
          <div key={prenda.id} className={styles.card}>
            <img
              src={`https://localhost:7196${prenda.imagenUrl}`}
              alt={prenda.nombre}
              className={styles.image}
            />

            <div className={styles.cardBody}>
              <h3>{prenda.nombre}</h3>

              <p>{prenda.tipoPrenda}</p>

              <strong>${prenda.precioBase}</strong>

              <button
                className={styles.btnDelete}
                onClick={() => eliminarPrenda(prenda.id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
