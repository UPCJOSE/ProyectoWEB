// src/core/layouts/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("usuario");

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};
