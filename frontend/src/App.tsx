import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { TemplateCreator } from './pages/admin/TemplateCreator';
import { Dashboard } from './pages/Dashboard';
import { ProtocolStart } from './pages/protocols/ProtocolStart';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/templates/new" element={<TemplateCreator />} />
        <Route path="/protocols/start" element={<ProtocolStart />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;