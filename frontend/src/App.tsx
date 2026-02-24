import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';

// Un componente temporal para el Dashboard
const DashboardPlaceholder = () => (
  <div className="p-8 text-center">
    <h1 className="text-2xl font-bold">¡Bienvenido al sistema!</h1>
    <p>Has iniciado sesión correctamente.</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardPlaceholder />} />
        
        {/* Si entra a la raíz, lo mandamos al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;