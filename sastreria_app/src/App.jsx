import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import { LoginPage } from "./features/auth/pages/LoginPage";
import { DashboardCrearCatalogo } from "./features/catalogo/pages/DashboardCrearCatalogo";
import { DashboardCatalogo } from "./features/catalogo/pages/DashboardCatalogo";
import { DashboardRecepcion } from "./features/recepcion/pages/DashboardRecepcion";
import { PanelSastre } from "./features/sastreria/pages/PanelSastre";
import { DashboardAdmin } from "./features/finanzas/pages/DashboardAdmin";
import { MainLayout } from "./core/layouts/MainLayout";
import { PortalCliente } from "./features/portal/pages/PortalCliente";
import { DashboardMedidas } from "./features/medidas/pages/DashboardMedidas";
import { DashboardClientes } from "./features/clientes/pages/DashboardClientes";
import { ClienteDetalle } from "./features/clientes/pages/ClienteDetalle";

const PrivateRoute = () => {
  const isLogged = localStorage.getItem("usuario") !== null;

  return isLogged ? <Outlet /> : <Navigate to="/portal" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/portal" element={<PortalCliente />} />

        <Route path="/login" element={<LoginPage />} />
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route
              path="/crear-catalogo"
              element={<DashboardCrearCatalogo />}
            />

            <Route path="/catalogo-publico" element={<DashboardCatalogo />} />
            <Route
              path="/crear-catalogo"
              element={<DashboardCrearCatalogo />}
            />

            <Route path="/recepcion" element={<DashboardRecepcion />} />

            <Route path="/sastreria" element={<PanelSastre />} />

            <Route path="/finanzas" element={<DashboardAdmin />} />

            <Route path="/medidas" element={<DashboardMedidas />} />

            <Route path="/clientes" element={<DashboardClientes />} />

            <Route path="/clientes/:id" element={<ClienteDetalle />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/portal" />} />

        <Route
          path="*"
          element={
            <h1 className="text-center mt-5">404 - Página no encontrada</h1>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
