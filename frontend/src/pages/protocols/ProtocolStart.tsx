import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

// Interfaz temporal para leer la lista de plantillas
interface TemplateOption {
  id: number;
  name: string;
}

export const ProtocolStart = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<TemplateOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados para la Ubicación (Lo que nos pide la Bitácora 12)
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [proyecto, setProyecto] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [pisoDepto, setPisoDepto] = useState('');

  // 1. Cargar las plantillas disponibles desde el Backend al abrir la pantalla
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await api.get('/templates');
        setTemplates(response.data);
      } catch (error) {
        console.error("Error al cargar plantillas:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  // 2. Función para iniciar el chequeo
  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTemplateId) {
      alert("Debes seleccionar una plantilla");
      return;
    }

    const locationData = {
      proyecto,
      ubicacion,
      pisoDepto
    };

    console.log("Iniciando instancia con datos:", { templateId: selectedTemplateId, locationData });
    
    // Aquí redirigimos a la pantalla de llenado (Bitácora 13) 
    // y le pasamos los datos de ubicación a través de React Router
    navigate(`/protocols/fill/${selectedTemplateId}`, { 
      state: { locationData } 
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Iniciar Nuevo Control</h1>
        <p className="text-gray-600 mb-8">Define la ubicación y la partida que vas a inspeccionar.</p>

        <form onSubmit={handleStart}>
          {/* Selección de Plantilla */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              1. Selecciona la Partida / Protocolo
            </label>
            {isLoading ? (
              <p className="text-sm text-gray-500">Cargando plantillas...</p>
            ) : (
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                required
              >
                <option value="" disabled>-- Elige una plantilla --</option>
                {templates.map(tpl => (
                  <option key={tpl.id} value={tpl.id}>{tpl.name}</option>
                ))}
              </select>
            )}
          </div>

          <hr className="my-6 border-gray-200" />

          {/* Lógica de Ubicación (Bitácora 12) */}
          <h3 className="text-lg font-bold text-gray-700 mb-4">2. Datos de Ubicación</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Input 
              label="Proyecto / Edificio" 
              placeholder="Ej: Edificio Capri"
              value={proyecto}
              onChange={(e) => setProyecto(e.target.value)}
              required
            />
            <Input 
              label="Ubicación / Ciudad" 
              placeholder="Ej: Los Ángeles"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              required
            />
          </div>

          <div className="mb-8">
            <Input 
              label="Departamento / Piso a inspeccionar" 
              placeholder="Ej: Depto 402, Piso 4"
              value={pisoDepto}
              onChange={(e) => setPisoDepto(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 text-lg">
            Comenzar inspección
          </Button>
        </form>
      </div>
    </div>
  );
};