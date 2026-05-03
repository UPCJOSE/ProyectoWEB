// src/features/auth/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Recepcionista");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!role) {
      setError("Por favor, selecciona un rol.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const credenciales = {
        correo: email,
        password: password,
        rol: role,
      };
      // api resquest to login endpoint
      const respuesta = await fetch("https://localhost:7196/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credenciales),
      });

      if (respuesta.ok) {
        const datosDelUsuario = await respuesta.json();
        localStorage.setItem("rol", datosDelUsuario.rol);
        localStorage.setItem("login", "true");
        if (role === "Administrador") navigate("/finanzas");
        else if (role === "Sastre") navigate("/sastreria");
        else if (role === "Recepcionista") navigate("/recepcion");
        else navigate("/Cliente");
      } else {
        alert(
          "Credenciales incorrectas. Por favor, verifica tu correo y contraseña.",
        );
      }
    } catch (error) {
      console.error("Error al conectar con la API:", error);
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* ── Panel Izquierdo ── */}
      <div className={styles.brandPanel}>
        <div className={styles.cornerTL} />
        <div className={styles.cornerTR} />
        <div className={styles.cornerBL} />
        <div className={styles.cornerBR} />

        <div className={styles.scissorIcon}>✂</div>

        <h1 className={styles.brandTitle}>
          Elegancia
          <br />y Estilo
        </h1>

        <div className={styles.goldLine} />

        <p className={styles.brandTagline}>Sastrería · Valledupar</p>
      </div>

      {/* ── Panel Derecho ── */}
      <div className={styles.formPanel}>
        <div className={styles.formInner}>
          <span className={styles.portalLabel}>Portal de Acceso</span>

          {error && <div className={styles.errorBox}>{error}</div>}

          <form onSubmit={handleLogin}>
            <div className={styles.fieldWrap}>
              <label className={styles.fieldLabel}>Correo Electrónico</label>
              <input
                type="email"
                className={styles.input}
                placeholder="usuario@unicesar.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.fieldWrap}>
              <label className={styles.fieldLabel}>Contraseña</label>
              <input
                type="password"
                className={styles.input}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className={styles.fieldWrapLast}>
              <label className={styles.fieldLabel}>Seleccionar Rol</label>
              <select
                className={styles.select}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Recepcionista">Recepcionista</option>
                <option value="Sastre">Sastre / Modista</option>
                <option value="Administrador">Administrador</option>
                <option value="Cliente">Cliente</option>
              </select>
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? "Verificando..." : "Iniciar Sesión"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
