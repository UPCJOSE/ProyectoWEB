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
import { DashboardFacturas } from "./features/facturas/pages/DashboardFacturas";
import { FacturaDetalle } from "./features/facturas/pages/FacturaDetalle";
import { DashboardOrdenes } from "./features/ordenes/pages/DashboardOrdenes";
import { DashboardInventario } from "./features/inventario/pages/DashboardInventario";
import { DashboardUsuarios } from "./features/usuarios/pages/DashboardUsuarios";
import { CatalogoPublico } from "./features/catalogo/pages/CatalogoPublico";
import { RoleRoute } from "./core/components/RoleRoute";

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
        <Route path="/catalogo-publico" element={<CatalogoPublico />} />

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

            {/* Módulos académicos */}
            <Route path="/inventario" element={<DashboardInventario />} />
            <Route path="/ordenes" element={<DashboardOrdenes />} />
            <Route path="/facturas" element={<DashboardFacturas />} />
            <Route path="/facturas/:id" element={<FacturaDetalle />} />
            <Route
              path="/usuarios"
              element={
                <RoleRoute roles={["administrador"]}>
                  <DashboardUsuarios />
                </RoleRoute>
              }
            />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/portal" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
