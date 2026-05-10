import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { DashboardCliente } from "./features/catalogo/pages/DashboardCliente";
import { DashboardRecepcion } from "./features/recepcion/pages/DashboardRecepcion";
import { PanelSastre } from "./features/sastreria/pages/PanelSastre";
import { DashboardAdmin } from "./features/finanzas/pages/DashboardAdmin";
import { MainLayout } from "./core/layouts/MainLayout";
import { PortalCliente } from "./features/portal/PortalCliente";
import { DashboardMedidas } from "./features/medidas/DashboardMedidas";

const PrivateRoute = ({ children }) => {
  const isLogged = localStorage.getItem("login") === "true";
  return isLogged ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTA PÚBLICA */}
        <Route path="/login" element={<LoginPage />} />

        {/* RUTAS PROTEGIDAS */}
        <Route
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route path="/cliente" element={<DashboardCliente />} />
          <Route path="/recepcion" element={<DashboardRecepcion />} />
          <Route path="/sastreria" element={<PanelSastre />} />
          <Route path="/finanzas" element={<DashboardAdmin />} />
          <Route path="/portal" element={<PortalCliente />} />
          <Route path="/medidas" element={<DashboardMedidas />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="*"
          element={
            <h1 className="text-center mt-5">404 - Atelier No Encontrado</h1>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
