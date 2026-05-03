// src/core/layouts/MainLayout.jsx
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./MainLayout.module.css";

export const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = localStorage.getItem("rol");
  const [cartCount, setCartCount] = useState(0);
  const actualizarContador = () => {
    const carrito = JSON.parse(localStorage.getItem("carrito") ?? "[]");
    const totalItems = carrito.reduce((suma, item) => suma + item.cantidad, 0);
    setCartCount(totalItems);
  };

  useEffect(() => {
    actualizarContador();
    window.addEventListener("carritoActualizado", actualizarContador);

    return () =>
      window.removeEventListener("carritoActualizado", actualizarContador);
  }, []);

  const getHomeRoute = () => {
    if (userRole === "Administrador") return "/finanzas";
    if (userRole === "Sastre") return "/sastreria";
    if (userRole === "Recepcionista") return "/recepcion";
    return "/cliente";
  };

  const handleLogout = () => {
    if (window.confirm("¿Desea cerrar su sesión en el Atelier?")) {
      localStorage.clear();
      navigate("/login");
    }
  };

  const isActive = (path) =>
    location.pathname === path ? styles.navLinkActive : "";

  return (
    <div className={styles.wrapper}>
      <nav className={styles.navbar}>
        <div className={styles.brand} onClick={() => navigate(getHomeRoute())}>
          Elegancia y Estilo
        </div>

        <div className={styles.navGroup}>
          {/* CLIENTE */}
          {userRole === "cliente" && (
            <>
              <span
                className={`${styles.navLink} ${isActive("/cliente")}`}
                onClick={() => navigate("/cliente")}
              >
                Mi Perfil
              </span>

              {/* Separador visual */}
              <div className={styles.actionsGroup}>
                <div
                  className={styles.cartContainer}
                  onClick={() => alert("Próximamente: Pantalla de Pagar")}
                  title="Ver carrito de compras"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#181f21"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  {cartCount > 0 && (
                    <span className={styles.cartBadge}>
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </div>
              </div>
            </>
          )}

          {/* RECEPCIONISTA */}
          {(userRole === "Administrador" || userRole === "Recepcionista") && (
            <span
              className={`${styles.navLink} ${isActive("/recepcion")}`}
              onClick={() => navigate("/recepcion")}
            >
              Recepción
            </span>
          )}

          {/* SASTRE */}
          {(userRole === "Administrador" || userRole === "Sastre") && (
            <span
              className={`${styles.navLink} ${isActive("/sastreria")}`}
              onClick={() => navigate("/sastreria")}
            >
              Sastrería
            </span>
          )}

          {/* Administrador */}
          {(userRole === "Administrador" || userRole === "Recepcionista") && (
            <span
              className={`${styles.navLink} ${isActive("/finanzas")}`}
              onClick={() => navigate("/finanzas")}
            >
              Finanzas
            </span>
          )}

          <button
            className={styles.avatarBtn}
            onClick={handleLogout}
            title={`Cerrar Sesión (${userRole})`}
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
