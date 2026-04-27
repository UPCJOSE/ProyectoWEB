// src/core/layouts/MainLayout.jsx
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import styles from './MainLayout.module.css';

export const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm("¿Desea cerrar su sesión?")) {
      localStorage.clear();
      navigate('/login');
    }
  };

  const isActive = (path) => location.pathname === path ? styles.navLinkActive : '';

  return (
    <div className={styles.wrapper}>
      
      {/* BARRA DE NAVEGACIÓN */}
      <nav className={styles.navbar}>
        <div className={styles.brand} onClick={() => navigate('/cliente')}>
          Elegancia y Estilo
        </div>

        <div className={styles.navGroup}>
          <span 
            className={`${styles.navLink} ${isActive('/cliente')}`} 
            onClick={() => navigate('/cliente')}
          >
            Dashboard
          </span>
          <span 
            className={`${styles.navLink} ${isActive('/recepcion')}`} 
            onClick={() => navigate('/recepcion')}
          >
            Recepción
          </span>
          <span 
            className={`${styles.navLink} ${isActive('/sastreria')}`} 
            onClick={() => navigate('/sastreria')}
          >
            Sastrería
          </span>
          <span 
            className={`${styles.navLink} ${isActive('/finanzas')}`} 
            onClick={() => navigate('/finanzas')}
          >
            Finanzas
          </span>

          <button 
            className={styles.avatarBtn} 
            onClick={handleLogout}
            title="Cerrar Sesión"
          >
            CV
          </button>
        </div>
      </nav>

      {/* CONTENIDO DINÁMICO */}
      <main className={styles.mainContent}>
        <Outlet />
      </main>

    </div>
  );
};