import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { DashboardCliente } from "./features/catalogo/pages/DashboardCliente";
import { DashboardRecepcion } from "./features/recepcion/pages/DashboardRecepcion";
import { PanelSastre } from "./features/sastreria/pages/PanelSastre";
import { DashboardAdmin } from "./features/finanzas/pages/DashboardAdmin";
import { MainLayout } from "./core/layouts/MainLayout";
import { PortalCliente } from "./features/portal/pages/PortalCliente";
import { DashboardMedidas } from "./features/medidas/pages/DashboardMedidas";

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
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/cliente" element={<DashboardCliente />} />
            <Route path="/recepcion" element={<DashboardRecepcion />} />
            <Route path="/sastreria" element={<PanelSastre />} />
            <Route path="/finanzas" element={<DashboardAdmin />} />
            <Route path="/medidas" element={<DashboardMedidas />} />
          </Route>
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
