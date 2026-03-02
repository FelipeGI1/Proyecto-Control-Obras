import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Button } from '../../components/common/Button';

export const ProtocolReview = () => {
  const { instanceId } = useParams();
  const navigate = useNavigate();

  const [instance, setInstance] = useState<any>(null);
  const [template, setTemplate] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isReviewer = user.role === 'calidad' || user.role === 'admin' || user.role === 'ito';
  
  const canEdit = isReviewer && instance?.status === 'PENDIENTE_REVISION';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const instanceRes = await api.get(`/instances/${instanceId}`);
        const instData = instanceRes.data;
        setInstance(instData);

        const answersObj: Record<string, string> = {};
        instData.answers.forEach((ans: any) => {
          answersObj[ans.itemId] = ans.value;
        });
        setAnswers(answersObj);

        const templateRes = await api.get(`/templates/${instData.templateId}`);
        setTemplate(templateRes.data);

      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (instanceId) fetchData();
  }, [instanceId]);

  const handleAnswerChange = (itemId: string, value: string) => {
    if (!canEdit) return; 
    setAnswers(prev => ({ ...prev, [itemId]: value }));
  };

  const handleApprove = async () => {
    try {
      await api.post('/instances/draft', {
        instanceId,
        templateId: instance.templateId,
        locationData: { proyecto: instance.proyecto, ubicacion: instance.ubicacion, pisoDepto: instance.pisoDepto },
        answers
      });

      await api.patch(`/instances/${instanceId}/status`, { status: 'REVISADO_CALIDAD' });
      
      alert("¡Protocolo Revisado y Aprobado por Calidad!");
      navigate('/dashboard');
    } catch (error) {
      alert("Error al aprobar");
    }
  };

  if (isLoading) return <div className="p-8 text-center">Cargando revisión...</div>;
  if (!template || !instance) return <div className="p-8 text-center text-red-500">Error al cargar</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md border-t-8 border-yellow-500">
        
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 uppercase">REVISIÓN: {template.name}</h1>
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-bold text-sm">
            {instance.status}
          </span>
        </div>

        {/* TABLA DE REVISIÓN */}
        <div className="space-y-8">
          {template.sections.map((section: any, sectionIndex: number) => (
            <div key={section.id} className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-4 py-3 border-b border-gray-300">
                <h2 className="text-lg font-bold text-gray-700">{sectionIndex + 1} - {section.name}</h2>
              </div>
              
              <div className="p-4 space-y-4">
                {section.items.map((item: any, itemIndex: number) => (
                  <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-gray-100">
                    <div className="flex-1 text-gray-700 font-medium">{itemIndex + 1}. {item.name}</div>
                    
                    <div className="w-full md:w-auto flex gap-2">
                      {item.itemType === 'TEXT' ? (
                        <input
                          type="text"
                          disabled={!canEdit} // LÓGICA DE BLOQUEO UI
                          className={`w-full md:w-64 px-3 py-2 border rounded-md text-sm ${!canEdit ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white border-gray-300'}`}
                          value={answers[item.id] || ''}
                          onChange={(e) => handleAnswerChange(item.id, e.target.value)}
                        />
                      ) : (
                        ['SI', 'NO', 'NA'].map((opt) => (
                          <button
                            key={opt}
                            disabled={!canEdit} // LÓGICA DE BLOQUEO UI
                            className={`px-4 py-1.5 rounded-md font-bold text-sm transition-colors border ${
                              answers[item.id] === opt 
                                ? (opt === 'SI' ? 'bg-green-500 text-white' : opt === 'NO' ? 'bg-red-500 text-white' : 'bg-gray-500 text-white')
                                : 'bg-white text-gray-400 border-gray-200'
                            } ${!canEdit ? 'cursor-not-allowed opacity-70' : 'hover:bg-gray-50 cursor-pointer'}`}
                            onClick={() => handleAnswerChange(item.id, opt)}
                          >
                            {opt}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* BOTONES DE ACCIÓN SEGÚN ROL */}
        <div className="mt-8 flex justify-end gap-4">
          <Button onClick={() => navigate('/dashboard')} className="bg-gray-500 hover:bg-gray-600 text-white px-8">
            Volver
          </Button>
          
          {canEdit && (
            <Button onClick={handleApprove} className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 font-bold">
              ✓ Aprobar Revisión (Calidad)
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};