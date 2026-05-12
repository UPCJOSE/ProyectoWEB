import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import styles from "./DashboardMedidas.module.css";

const API = "https://localhost:7196/api";

export const DashboardMedidas = () => {
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [medidaId, setMedidaId] = useState(null);

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

      setMedidaId(data.id);

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

  const guardarMedidas = async () => {
    try {
      const payload = {
        id: medidaId || 0,
        clienteId: cliente.id,
        pecho: Number(form.pecho) || 0,
        cintura: Number(form.cintura) || 0,
        cadera: Number(form.cadera) || 0,
        altoCadera: Number(form.altoCadera) || 0,
        entrepierna: Number(form.entrepierna) || 0,
        largoTotal: Number(form.largoTotal) || 0,
        anchoBajo: Number(form.anchoBajo) || 0,
        largoBrazo: Number(form.largoBrazo) || 0,
        cuello: Number(form.cuello) || 0,
        hombros: Number(form.hombros) || 0,
        largoTalle: Number(form.largoTalle) || 0,
        largoTotalSuperior: Number(form.largoTotalSuperior) || 0,
        ultimaMedida: new Date().toISOString().split("T")[0],
      };

      const url = medidaId ? `${API}/Medidas/${medidaId}` : `${API}/Medidas`;
      const method = medidaId ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorMsg = await res.text();
        console.error("Error del backend:", errorMsg);
        throw new Error("Rechazado por el servidor");
      }

      await Swal.fire({
        icon: "success",
        title: medidaId ? "Actualizado" : "Guardado",
        text: "Las medidas fueron registradas correctamente.",
        confirmButtonColor: "#c9a84c",
      });

      navigate(-1);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error al guardar",
        text: "Hubo un problema al procesar las medidas.",
        confirmButtonColor: "#181f21",
      });
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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

      <div
        className={styles.actions}
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          marginTop: "2rem",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "10px 24px",
            background: "transparent",
            border: "1px solid #181f21",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Volver
        </button>

        <button
          onClick={guardarMedidas}
          className={styles.btnGold}
          style={{ padding: "10px 24px", borderRadius: "6px" }}
        >
          Guardar medidas
        </button>
      </div>
    </div>
  );
};
