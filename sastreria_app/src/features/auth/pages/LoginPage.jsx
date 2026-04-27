// src/features/auth/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css'; // <-- Importamos los estilos encapsulados

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('recepcionista');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (email === "admin@unicesar.com" && password === "1234") {
        localStorage.setItem("login", "true");
        localStorage.setItem("rol", role);
        localStorage.setItem("usuario", email);

        if (role === "administrador") navigate('/finanzas');
        else if (role === "sastre") navigate('/sastreria');
        else if (role === "recepcionista") navigate('/recepcion');
        else navigate('/cliente');
      } else {
        setError("Credenciales incorrectas. Verifica tu correo y contraseña.");
      }
      setLoading(false);
    }, 600);
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
          Elegancia<br />y Estilo
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
                <option value="recepcionista">Recepcionista</option>
                <option value="sastre">Sastre / Modista</option>
                <option value="administrador">Administrador</option>
                <option value="cliente">Cliente</option>
              </select>
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'Verificando...' : 'Iniciar Sesión'}
            </button>

          </form>
        </div>
      </div>

    </div>
  );
};