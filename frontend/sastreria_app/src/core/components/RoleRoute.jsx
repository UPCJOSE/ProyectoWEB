import { Navigate } from "react-router-dom";

export const RoleRoute = ({ children, roles = [] }) => {
  const usuarioGuardado = localStorage.getItem("usuario");
  if (!usuarioGuardado) return <Navigate to="/login" />;

  const usuario = JSON.parse(usuarioGuardado);
  const nombreRol = usuario?.rol?.nombre?.toLowerCase() || "";

  const permitido = roles.some((r) => r.toLowerCase() === nombreRol);
  if (!permitido) return <Navigate to="/portal" />;

  return children;
};
