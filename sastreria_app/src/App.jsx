<<<<<<< HEAD
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
=======
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
>>>>>>> 89d739b301be40d6dd46aa36e9084238f7b9f3c0
import { LoginPage } from "./features/auth/pages/LoginPage";
import { DashboardCliente } from "./features/catalogo/pages/DashboardCliente";
import { DashboardRecepcion } from "./features/recepcion/pages/DashboardRecepcion";
import { PanelSastre } from "./features/sastreria/pages/PanelSastre";
import { DashboardAdmin } from "./features/finanzas/pages/DashboardAdmin";
import { MainLayout } from "./core/layouts/MainLayout";
<<<<<<< HEAD
import { PortalCliente } from "./features/portal/pages/PortalCliente";
import { DashboardMedidas } from "./features/medidas/pages/DashboardMedidas";
=======
import { PortalCliente } from "./features/portal/PortalCliente";
import { DashboardMedidas } from "./features/medidas/DashboardMedidas";
>>>>>>> 89d739b301be40d6dd46aa36e9084238f7b9f3c0

const PrivateRoute = () => {
  const isLogged = localStorage.getItem("usuario") !== null;

  return isLogged ? <Outlet /> : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTA PÚBLICA */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/portal" element={<PortalCliente />} />

        {/* RUTAS PROTEGIDAS */}
<<<<<<< HEAD
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/cliente" element={<DashboardCliente />} />
            <Route path="/recepcion" element={<DashboardRecepcion />} />
            <Route path="/sastreria" element={<PanelSastre />} />
            <Route path="/finanzas" element={<DashboardAdmin />} />
            <Route path="/medidas" element={<DashboardMedidas />} />
          </Route>
=======
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
>>>>>>> 89d739b301be40d6dd46aa36e9084238f7b9f3c0
        </Route>

        {/* RUTAS DE FALLBACK */}
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
