import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import { LoginPage } from "./features/auth/pages/LoginPage";
import { DashboardCrearCatalogo } from "./features/catalogo/pages/DashboardCrearCatalogo";
import { DashboardCliente } from "./features/catalogo/pages/DashboardCliente";
import { DashboardRecepcion } from "./features/recepcion/pages/DashboardRecepcion";
import { PanelSastre } from "./features/sastreria/pages/PanelSastre";
import { DashboardAdmin } from "./features/finanzas/pages/DashboardAdmin";
import { MainLayout } from "./core/components/layouts/MainLayout";
import { PortalCliente } from "./features/portal/pages/PortalCliente";
import { DashboardMedidas } from "./features/medidas/pages/DashboardMedidas";
import { DashboardClientes } from "./features/clientes/pages/DashboardClientes";
import { ClienteDetalle } from "./features/clientes/pages/ClienteDetalle";
import { LandingPage } from "./features/portal/pages/LandingPage";
import { NotFoundPage } from "./features/portal/pages/NotFoundPage";

const PrivateRoute = () => {
  const isLogged = localStorage.getItem("usuario") !== null;

  return isLogged ? <Outlet /> : <Navigate to="/portal" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/portal" element={<PortalCliente />} />

        <Route path="/login" element={<LoginPage />} />
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route
              path="/crear-catalogo"
              element={<DashboardCrearCatalogo />}
            />
            <Route path="/principal" element={<DashboardCliente />} />
            <Route path="/recepcion" element={<DashboardRecepcion />} />

            <Route path="/sastreria" element={<PanelSastre />} />

            <Route path="/finanzas" element={<DashboardAdmin />} />

            <Route path="/medidas" element={<DashboardMedidas />} />

            <Route path="/clientes" element={<DashboardClientes />} />

            <Route path="/cliente" element={<ClienteDetalle />} />

            <Route path="/clientes/:id" element={<ClienteDetalle />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/portal" />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
