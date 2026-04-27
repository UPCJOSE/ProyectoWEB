import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { LoginPage } from './features/auth/pages/LoginPage';
import { DashboardCliente } from './features/catalogo/pages/DashboardCliente';
import { DashboardRecepcion } from './features/recepcion/pages/DashboardRecepcion';
import { PanelSastre } from './features/sastreria/pages/PanelSastre';
import { DashboardAdmin } from './features/finanzas/pages/DashboardAdmin';

const PrivateRoute = ({ children }) => {
  const isLogged = localStorage.getItem("login") === "true";
  return isLogged ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTA PÚBLICA: Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* RUTAS PROTEGIDAS: Requieren login */}
        <Route 
          path="/cliente" 
          element={<PrivateRoute><DashboardCliente /></PrivateRoute>} 
        />
        <Route 
          path="/recepcion" 
          element={<PrivateRoute><DashboardRecepcion /></PrivateRoute>} 
        />
        <Route 
          path="/sastreria" 
          element={<PrivateRoute><PanelSastre /></PrivateRoute>} 
        />
        <Route 
          path="/finanzas" 
          element={<PrivateRoute><DashboardAdmin /></PrivateRoute>} 
        />

        {/* REDIRECCIÓN POR DEFECTO */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* RUTA 404: Si escriben cualquier cosa mal */}
        <Route path="*" element={<h1 className="text-center mt-5">404 - Atelier No Encontrado</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;