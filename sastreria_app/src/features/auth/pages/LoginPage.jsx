import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import styles from "./LoginPage.module.css";

export const LoginPage = () => {
  const navigate = useNavigate();
<<<<<<< HEAD

  // Estados del formulario
  const [isRegister, setIsRegister] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const API_LOGIN = "https://localhost:7196/api/Auth/login";
  const API_REGISTRO = "https://localhost:7196/api/Usuarios";

  const handleSubmit = async (e) => {
    e.preventDefault();
=======

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

>>>>>>> 89d739b301be40d6dd46aa36e9084238f7b9f3c0
    setLoading(true);

    try {
<<<<<<< HEAD
      if (isRegister) {
        // register
        const response = await fetch(API_REGISTRO, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: nombre,
            correo: email,
            password: password,
            rol: 3, // Asignar rol de cliente por defecto
          }),
        });

        if (!response.ok) {
          throw new Error("No se pudo crear la cuenta. Verifica los datos.");
        }

        Swal.fire({
          icon: "success",
          title: "¡Cuenta creada!",
          text: "Ahora puedes iniciar sesión con tu nuevo correo.",
          confirmButtonColor: "#c9a84c",
        });

        setNombre("");
        setPassword("");
        setIsRegister(false);
      } else {
        // login
        const response = await fetch(API_LOGIN, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) throw new Error("Credenciales incorrectas");

        const usuario = await response.json();
        localStorage.setItem("usuario", JSON.stringify(usuario));

        const nombreRol =
          usuario.rol?.nombre?.toLowerCase() || usuario.rol?.toLowerCase();

        // Redirección inteligente
        if (nombreRol === "administrador" || nombreRol === "admin") {
          navigate("/finanzas");
        } else if (nombreRol === "sastre") {
          navigate("/sastreria");
        } else if (nombreRol === "recepcionista" || nombreRol === "recepcion") {
          navigate("/recepcion");
        } else {
          navigate("/cliente");
        }
=======
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
>>>>>>> 89d739b301be40d6dd46aa36e9084238f7b9f3c0
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
<<<<<<< HEAD
      console.error(error);
      Swal.fire({
        icon: "error",
        title: isRegister ? "Error al registrar" : "Error de acceso",
        text: error.message || "Verifica tus datos de conexión.",
=======
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
>>>>>>> 89d739b301be40d6dd46aa36e9084238f7b9f3c0
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
<<<<<<< HEAD
            {isRegister ? "Crear Nueva Cuenta" : "Portal de Acceso"}
=======
            {esRegistro ? "Crear Cuenta" : "Portal de Acceso"}
>>>>>>> 89d739b301be40d6dd46aa36e9084238f7b9f3c0
          </span>

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div className={styles.fieldWrap}>
                <label className={styles.fieldLabel}>Nombre Completo</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Ej: Juan Pérez"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required={isRegister}
                />
              </div>
            )}

<<<<<<< HEAD
=======
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

>>>>>>> 89d739b301be40d6dd46aa36e9084238f7b9f3c0
            <div className={styles.fieldWrap}>
              <label className={styles.fieldLabel}>Correo Electrónico</label>
              <input
                type="email"
                className={styles.input}
<<<<<<< HEAD
                placeholder="usuario@atelier.com"
=======
                placeholder="usuario@correo.com"
>>>>>>> 89d739b301be40d6dd46aa36e9084238f7b9f3c0
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

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading
<<<<<<< HEAD
                ? isRegister
                  ? "Registrando..."
                  : "Verificando..."
                : isRegister
                  ? "Crear Cuenta"
=======
                ? "Procesando..."
                : esRegistro
                  ? "Registrarse"
>>>>>>> 89d739b301be40d6dd46aa36e9084238f7b9f3c0
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

          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setNombre("");
                setPassword("");
              }}
              style={{
                background: "none",
                border: "none",
                color: "#c9a84c",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "0.9rem",
              }}
            >
              {isRegister
                ? "¿Ya tienes una cuenta? Inicia sesión aquí"
                : "¿Eres nuevo? Regístrate aquí"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
