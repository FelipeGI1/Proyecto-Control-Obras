import { Link } from 'react-router-dom';

export const Dashboard = () => {
  // Leemos el usuario que guardamos en el localStorage al iniciar sesión
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          ¡Bienvenido al sistema, {user?.fullName || 'Usuario'}!
        </h1>
        <p className="text-gray-600 mb-6">Rol actual: <span className="font-semibold uppercase">{user?.role}</span></p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tarjeta para ir a Crear Plantillas */}
          <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow bg-blue-50">
            <h2 className="text-xl font-bold text-blue-800 mb-2">Plantillas de Protocolo</h2>
            <p className="text-gray-600 mb-4">Crea y administra las estructuras de chequeo para las partidas.</p>
            
            {/* Usamos Link en lugar de <a> para no recargar toda la página */}
            <Link 
              to="/admin/templates/new" 
              className="inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700"
            >
              + Crear Nueva Plantilla
            </Link>
          </div>
          
          {/* Aquí irán más tarjetas en el futuro (ej. Llenar Protocolo) */}
        </div>
      </div>
    </div>
  );
};