import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import styles from "./LoginPage.module.css";

export const LoginPage = () => {
  const navigate = useNavigate();

  const API = "https://localhost:7196/api";

  // modo
  const [esRegistro, setEsRegistro] = useState(false);

  // campos
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Recepcionista");

  // ui
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // convertir rol string -> numero
  const obtenerRolNumero = (rolTexto) => {
    const roles = {
      Cliente: 1,
      Sastre: 2,
      Recepcionista: 3,
      Administrador: 4,
    };

    return roles[rolTexto];
  };

  // navegar segun rol
  const redirigirSegunRol = (rol) => {
    if (rol === "Administrador") navigate("/finanzas");
    else if (rol === "Sastre") navigate("/sastreria");
    else if (rol === "Recepcionista") navigate("/portal");
    else navigate("/cliente");
  };

  // ============================
  // LOGIN
  // ============================
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!role) {
      setError("Selecciona un rol.");
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

      const respuesta = await fetch(`${API}/Auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credenciales),
      });

      if (!respuesta.ok) {
        throw new Error("Credenciales incorrectas");
      }

      const datosUsuario = await respuesta.json();

      localStorage.setItem("login", "true");
      localStorage.setItem("rol", datosUsuario.rol);
      localStorage.setItem("nombre", datosUsuario.nombre);

      Swal.fire({
        icon: "success",
        title: "Bienvenido",
        text: `Hola ${datosUsuario.nombre}`,
        timer: 1800,
        showConfirmButton: false,
      });

      setTimeout(() => {
        redirigirSegunRol(datosUsuario.rol);
      }, 1800);
    } catch (error) {
      setError("Correo, contraseña o rol incorrectos.");

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Credenciales incorrectas.",
        confirmButtonColor: "#181f21",
      });
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // REGISTRO
  // ============================
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!nombre || !email || !password || !role) {
      setError("Completa todos los campos.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const nuevoUsuario = {
        nombre,
        correo: email,
        password,
        rol: obtenerRolNumero(role),
      };

      const respuesta = await fetch(`${API}/Usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoUsuario),
      });

      if (!respuesta.ok) {
        throw new Error("No se pudo registrar");
      }

      Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: "Ahora puedes iniciar sesión.",
        confirmButtonColor: "#181f21",
      });

      setEsRegistro(false);
      setNombre("");
      setEmail("");
      setPassword("");
      setRole("Recepcionista");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo registrar el usuario.",
        confirmButtonColor: "#181f21",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* IZQUIERDA */}
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

      {/* DERECHA */}
      <div className={styles.formPanel}>
        <div className={styles.formInner}>
          <span className={styles.portalLabel}>
            {esRegistro ? "Crear Cuenta" : "Portal de Acceso"}
          </span>

          {error && <div className={styles.errorBox}>{error}</div>}

          <form onSubmit={esRegistro ? handleRegister : handleLogin}>
            {esRegistro && (
              <div className={styles.fieldWrap}>
                <label className={styles.fieldLabel}>Nombre Completo</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Tu nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
            )}

            <div className={styles.fieldWrap}>
              <label className={styles.fieldLabel}>Correo Electrónico</label>
              <input
                type="email"
                className={styles.input}
                placeholder="usuario@correo.com"
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
              {loading
                ? "Procesando..."
                : esRegistro
                  ? "Registrarse"
                  : "Iniciar Sesión"}
            </button>

            <div
              style={{
                marginTop: "1rem",
                textAlign: "center",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setEsRegistro(!esRegistro);
                  setError("");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#c9a84c",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                {esRegistro
                  ? "¿Ya tienes cuenta? Inicia sesión"
                  : "¿No tienes cuenta? Regístrate"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
