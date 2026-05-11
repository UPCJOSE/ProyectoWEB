import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import styles from "./DashboardMedidas.module.css";

const API = "https://localhost:7196/api";

export const DashboardMedidas = () => {
  const [cliente, setCliente] = useState(null);

  const [form, setForm] = useState({
    pecho: "",
    cintura: "",
    cadera: "",
    altoCadera: "",
    entrepierna: "",
    largoTotal: "",
    anchoBajo: "",
    largoBrazo: "",
    cuello: "",
    hombros: "",
    largoTalle: "",
    largoTotalSuperior: "",
  });

  useEffect(() => {
    const clienteStorage = localStorage.getItem("clienteMedidas");

    if (clienteStorage) {
      const clienteParse = JSON.parse(clienteStorage);

      setCliente(clienteParse);

      cargarMedidas(clienteParse.id);
    }
  }, []);

  const cargarMedidas = async (clienteId) => {
    try {
      const res = await fetch(`${API}/Medidas/cliente/${clienteId}`);

      if (!res.ok) return;

      const data = await res.json();

      setForm({
        pecho: data.pecho || "",
        cintura: data.cintura || "",
        cadera: data.cadera || "",
        altoCadera: data.altoCadera || "",
        entrepierna: data.entrepierna || "",
        largoTotal: data.largoTotal || "",
        anchoBajo: data.anchoBajo || "",
        largoBrazo: data.largoBrazo || "",
        cuello: data.cuello || "",
        hombros: data.hombros || "",
        largoTalle: data.largoTalle || "",
        largoTotalSuperior: data.largoTotalSuperior || "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const guardarMedidas = async () => {
    try {
      const payload = {
        ...form,
        clienteId: cliente.id,
        fechaRegistro: new Date(),
      };

      const res = await fetch(`${API}/Medidas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      Swal.fire("Guardado", "Medidas registradas", "success");
    } catch (error) {
      console.error(error);

      Swal.fire("Error", "No se pudieron guardar", "error");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Panel de <span className={styles.titleAccent}>Medidas</span>
        </h1>

        <p className={styles.subtitle}>Cliente: {cliente?.nombre}</p>
      </div>

      <div className={styles.measuresCard}>
        {Object.keys(form).map((campo) => (
          <div key={campo} className={styles.inputGroup}>
            <label className={styles.label}>{campo}</label>

            <input
              type="number"
              name={campo}
              value={form[campo]}
              onChange={handleChange}
              className={styles.inputLine}
            />
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <button onClick={guardarMedidas} className={styles.btnGold}>
          Guardar medidas
        </button>
      </div>
    </div>
  );
};
