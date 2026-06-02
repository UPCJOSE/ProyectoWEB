// src/core/layouts/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("usuario");

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
