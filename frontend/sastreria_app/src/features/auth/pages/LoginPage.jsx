// src/features/auth/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import styles from "./LoginPage.module.css";

export const LoginPage = () => {
  const navigate = useNavigate();

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
    setLoading(true);

    try {
      if (isRegister) {
        // register
        const response = await fetch(API_REGISTRO, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: nombre,
            correo: email,
            password: password,
            rol: 1,
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

        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data));

        const nombreRol =
          data.rol?.nombre?.toLowerCase() || data.rol?.toLowerCase();

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
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: isRegister ? "Error al registrar" : "Error de acceso",
        text: error.message || "Verifica tus datos de conexión.",
        confirmButtonColor: "#181f21",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* ── Panel Izquierdo ── */}
      <div className={styles.brandPanel}>
        <div className={styles.brandOverlay} />
        <div className={styles.brandGlow} />
        <div className={styles.cornerTL} />
        <div className={styles.cornerTR} />
        <div className={styles.cornerBL} />
        <div className={styles.cornerBR} />

        <div className={styles.brandContent}>
          <div className={styles.scissorIcon}>✂</div>

          <h1 className={styles.brandTitle}>
            Elegancia
            <br />
            <span className={styles.brandTitleAccent}>y Estilo</span>
          </h1>
          <div className={styles.goldLine} />
          <p className={styles.brandTagline}>Sastrería · Valledupar</p>
        </div>

        <p className={styles.brandFooter}>Atelier premium · 2026</p>
      </div>

      {/* ── Panel Derecho ── */}
      <div className={styles.formPanel}>
        <div className={styles.formCard}>
          <header className={styles.formHeader}>
            <span className={styles.portalLabel}>
              {isRegister ? "Registro" : "Acceso"}
            </span>
            <h2 className={styles.formTitle}>
              {isRegister ? "Crear cuenta" : "Bienvenido"}
            </h2>
            <p className={styles.formSubtitle}>
              {isRegister
                ? "Completa tus datos para unirte al atelier."
                : "Ingresa tus credenciales para continuar."}
            </p>
          </header>

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

            <div className={styles.fieldWrap}>
              <label className={styles.fieldLabel}>Correo Electrónico</label>
              <input
                type="email"
                className={styles.input}
                placeholder="usuario@atelier.com"
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
              className={`${styles.submitBtn} ${loading ? styles.submitBtnLoading : ""}`}
              disabled={loading}
            >
              {loading
                ? isRegister
                  ? "Registrando..."
                  : "Verificando..."
                : isRegister
                  ? "Crear Cuenta"
                  : "Iniciar Sesión"}
            </button>
          </form>

          <div className={styles.toggleSection}>
            <button
              type="button"
              className={styles.toggleBtn}
              onClick={() => {
                setIsRegister(!isRegister);
                setNombre("");
                setPassword("");
              }}
            >
              {isRegister ? (
                <>
                  ¿Ya tienes cuenta? <span>Inicia sesión</span>
                </>
              ) : (
                <>
                  ¿Eres nuevo? <span>Regístrate aquí</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
