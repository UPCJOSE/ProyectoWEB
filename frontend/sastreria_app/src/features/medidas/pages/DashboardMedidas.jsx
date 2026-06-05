import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import styles from "./DashboardMedidas.module.css";
import { fetchAuth } from "../../../core/utils/fetchAuth";

const API_BASE =
  (import.meta?.env?.VITE_API_URL && String(import.meta.env.VITE_API_URL)) ||
  "http://localhost:5000/api";

const FIELD_META = {
  pecho: { label: "Pecho", hint: "cm" },
  cintura: { label: "Cintura", hint: "cm" },
  cadera: { label: "Cadera", hint: "cm" },
  altoCadera: { label: "Alto cadera", hint: "cm" },
  entrepierna: { label: "Entrepierna", hint: "cm" },
  largoTotal: { label: "Largo total", hint: "cm" },
  anchoBajo: { label: "Ancho bajo", hint: "cm" },
  largoBrazo: { label: "Largo brazo", hint: "cm" },
  cuello: { label: "Cuello", hint: "cm" },
  hombros: { label: "Hombros", hint: "cm" },
  largoTalle: { label: "Largo talle", hint: "cm" },
  largoTotalSuperior: { label: "Largo total superior", hint: "cm" },
};

export const DashboardMedidas = () => {
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [medidaId, setMedidaId] = useState(null);
  const [ultimaMedida, setUltimaMedida] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");

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
    } else {
      setLoading(false);
      Swal.fire({
        icon: "warning",
        title: "Cliente no seleccionado",
        text: "Selecciona un cliente antes de registrar medidas.",
        confirmButtonColor: "#c9a84c",
      }).finally(() => navigate(-1));
    }
  }, []);

  const cargarMedidas = async (clienteId) => {
    setLoading(true);
    setLoadError("");
    try {
      let data = null;
      const resByCliente = await fetchAuth(
        `${API_BASE}/Medidas/cliente/${clienteId}`,
      );

      if (resByCliente.ok) {
        data = await resByCliente.json();
      } else {
        const resAll = await fetchAuth(`${API_BASE}/Medidas`);
        if (!resAll.ok) {
          const t = await resAll.text();
          throw new Error(t || "No se pudo obtener medidas");
        }
        const list = await resAll.json();
        if (Array.isArray(list)) {
          data = list.find((m) => Number(m?.clienteId) === Number(clienteId));
        }
      }

      if (!data) {
        setMedidaId(null);
        setUltimaMedida(null);
        setForm((prev) => ({
          ...prev,
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
        }));
        return;
      }

      setMedidaId(data.id ?? data.Id ?? null);
      setUltimaMedida(data.ultimaMedida ?? data.UltimaMedida ?? null);

      setForm({
        pecho: data.pecho ?? data.Pecho ?? "",
        cintura: data.cintura ?? data.Cintura ?? "",
        cadera: data.cadera ?? data.Cadera ?? "",
        altoCadera: data.altoCadera ?? data.AltoCadera ?? "",
        entrepierna: data.entrepierna ?? data.Entrepierna ?? "",
        largoTotal: data.largoTotal ?? data.LargoTotal ?? "",
        anchoBajo: data.anchoBajo ?? data.AnchoBajo ?? "",
        largoBrazo: data.largoBrazo ?? data.LargoBrazo ?? "",
        cuello: data.cuello ?? data.Cuello ?? "",
        hombros: data.hombros ?? data.Hombros ?? "",
        largoTalle: data.largoTalle ?? data.LargoTalle ?? "",
        largoTotalSuperior:
          data.largoTotalSuperior ?? data.LargoTotalSuperior ?? "",
      });
    } catch (error) {
      console.error(error);
      setLoadError(
        "No se pudieron cargar las medidas. Revisa que la API esté levantada y el CORS habilitado.",
      );
    } finally {
      setLoading(false);
    }
  };

  const guardarMedidas = async () => {
    try {
      if (!cliente?.id) return;
      setSaving(true);
      const payload = {
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

      const url = medidaId
        ? `${API_BASE}/Medidas/${medidaId}`
        : `${API_BASE}/Medidas`;
      const method = medidaId ? "PUT" : "POST";

      const res = await fetchAuth(url, {
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
    } finally {
      setSaving(false);
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

        <div className={styles.subheaderRow}>
          <p className={styles.subtitle}>Cliente: {cliente?.nombre}</p>
          <div className={styles.metaRight}>
            <span className={styles.metaPill}>
              API: {API_BASE.replace(/^https?:\/\//, "")}
            </span>
            {ultimaMedida ? (
              <span className={styles.metaPill}>
                Última medida: {String(ultimaMedida)}
              </span>
            ) : (
              <span className={styles.metaPillMuted}>Sin registro previo</span>
            )}
          </div>
        </div>
      </div>

      {loadError ? <div className={styles.errorBanner}>{loadError}</div> : null}

      <div className={styles.measuresCard} aria-busy={loading || saving}>
        {Object.keys(form).map((campo) => {
          const meta = FIELD_META[campo] || { label: campo, hint: "" };
          return (
            <div key={campo} className={styles.inputGroup}>
              <div className={styles.labelRow}>
                <label className={styles.label} htmlFor={`medida-${campo}`}>
                  {meta.label}
                </label>
                {meta.hint ? (
                  <span className={styles.hint}>{meta.hint}</span>
                ) : null}
              </div>

              <input
                id={`medida-${campo}`}
                type="number"
                inputMode="decimal"
                name={campo}
                value={form[campo]}
                onChange={handleChange}
                className={styles.inputLine}
                disabled={loading || saving}
                placeholder="0"
                min="0"
              />
            </div>
          );
        })}
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
          disabled={saving}
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
          disabled={loading || saving || !cliente?.id}
          style={{ padding: "10px 24px", borderRadius: "6px" }}
        >
          {saving
            ? "Guardando..."
            : medidaId
              ? "Actualizar medidas"
              : "Guardar medidas"}
        </button>
      </div>
    </div>
  );
};
