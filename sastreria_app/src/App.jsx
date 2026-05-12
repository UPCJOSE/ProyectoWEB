import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { DashboardCatalogo } from "./features/catalogo/pages/DashboardCrearCatalogo";
import { DashboardRecepcion } from "./features/recepcion/pages/DashboardRecepcion";
import { PanelSastre } from "./features/sastreria/pages/PanelSastre";
import { DashboardAdmin } from "./features/finanzas/pages/DashboardAdmin";
import { MainLayout } from "./core/layouts/MainLayout";
import { PortalCliente } from "./features/portal/pages/PortalCliente";
import { DashboardMedidas } from "./features/medidas/pages/DashboardMedidas";
import { DashboardCatalogoPublico } from "./features/catalogo/pages/DashboardCatalogo";

const PrivateRoute = () => {
  const isLogged = localStorage.getItem("usuario") !== null;

  return isLogged ? <Outlet /> : <Navigate to="/portal" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTA PÚBLICA */}
        <Route path="/portal" element={<PortalCliente />} />
        <Route path="/login" element={<LoginPage />} />

        {/* RUTAS PROTEGIDAS */}
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}></Route>
          <Route path="/catalogo" element={<DashboardCatalogo />} />
          <Route path="/recepcion" element={<DashboardRecepcion />} />
          <Route path="/sastreria" element={<PanelSastre />} />
          <Route path="/finanzas" element={<DashboardAdmin />} />
          <Route path="/medidas" element={<DashboardMedidas />} />
          <Route path="/catalogo-publico" element={<DashboardCatalogo />} />
        </Route>

        {/* RUTAS DE FALLBACK */}
        <Route path="/" element={<Navigate to="/portal" />} />
        <Route
          path="*"
          element={
            <h1 className="text-center mt-5">404 - Pagina no encontrada</h1>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
