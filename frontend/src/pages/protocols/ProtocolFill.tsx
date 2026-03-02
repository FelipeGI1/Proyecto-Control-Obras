import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Button } from '../../components/common/Button';

export const ProtocolFill = () => {
    const { templateId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const locationData = location.state?.locationData || {};

    const [template, setTemplate] = useState<any>(null);

    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);

    const [instanceId, setInstanceId] = useState<string | null>(null);

    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                const response = await api.get(`/templates/${templateId}`);
                setTemplate(response.data);
            } catch (error) {
                console.error("Error al cargar la plantilla:", error);
                alert("Error al cargar la plantilla");
                navigate('/dashboard');
            } finally {
                setIsLoading(false);
            }
        };
        if (templateId) fetchTemplate();
    }, [templateId, navigate]);

    const handleAnswerChange = (itemId: string, value: string) => {
        setAnswers(prev => ({
            ...prev,
            [itemId]: value
        }));
    };

    const handleSave = async () => {
        try {
            const payload = {
                instanceId, // Será null la primera vez, y un UUID las siguientes
                templateId,
                locationData,
                answers
            };

            // Enviamos al backend
            const response = await api.post('/instances/draft', payload);

            // El backend nos devuelve el borrador guardado. Guardamos su ID.
            setInstanceId(response.data.id);

            alert("¡Borrador guardado exitosamente!");
        } catch (error) {
            console.error("Error al guardar el borrador:", error);
            alert("Hubo un error al guardar");
        }
    };

    const handleSubmitForReview = async () => {
        try {
            const payload = { instanceId, templateId, locationData, answers };
            const draftResponse = await api.post('/instances/draft', payload);
            const currentInstanceId = draftResponse.data.id;

            await api.patch(`/instances/${currentInstanceId}/status`, {
                status: 'PENDIENTE_REVISION'
            });

            alert("¡Protocolo enviado a revisión exitosamente!");
            navigate('/dashboard');

        } catch (error) {
            console.error("Error al enviar a revisión:", error);
            alert("Hubo un error al enviar el protocolo.");
        }
    };

    if (isLoading) return <div className="p-8 text-center text-gray-600">Cargando protocolo...</div>;
    if (!template) return <div className="p-8 text-center text-red-600">Plantilla no encontrada</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md border-t-8 border-blue-600">

                {/* ENCABEZADO: Información de Ubicación */}
                <div className="mb-8 pb-6 border-b-2 border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-800 uppercase mb-2">{template.name}</h1>
                    <p className="text-gray-600 mb-4">{template.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-md text-sm border border-gray-200">
                        <div><span className="font-bold text-gray-700">Proyecto:</span> <br />{locationData.proyecto || 'N/A'}</div>
                        <div><span className="font-bold text-gray-700">Ubicación:</span> <br />{locationData.ubicacion || 'N/A'}</div>
                        <div><span className="font-bold text-gray-700">Depto/Piso:</span> <br />{locationData.pisoDepto || 'N/A'}</div>
                        <div><span className="font-bold text-gray-700">Fecha:</span> <br />{new Date().toLocaleDateString()}</div>
                    </div>
                </div>

                {/* TABLA DE LLENADO */}
                <div className="space-y-8">
                    {template.sections.map((section: any, sectionIndex: number) => (
                        <div key={section.id} className="border border-gray-300 rounded-lg overflow-hidden">
                            <div className="bg-blue-50 px-4 py-3 border-b border-gray-300">
                                <h2 className="text-lg font-bold text-blue-800">{sectionIndex + 1} - {section.name}</h2>
                            </div>

                            <div className="p-4 space-y-4">
                                {section.items.map((item: any, itemIndex: number) => (
                                    <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-gray-100 last:border-0">
                                        <div className="flex-1 text-gray-700 font-medium">
                                            {itemIndex + 1}. {item.name}
                                        </div>

                                        {/* LÓGICA DE RENDERIZADO SEGÚN TIPO (CHECK vs TEXT) */}
                                        <div className="w-full md:w-auto">
                                            {item.itemType === 'TEXT' ? (
                                                <input
                                                    type="text"
                                                    placeholder="Ingresar detalle..."
                                                    className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                    value={answers[item.id] || ''}
                                                    onChange={(e) => handleAnswerChange(item.id, e.target.value)}
                                                />
                                            ) : (
                                                <div className="flex gap-2">
                                                    <button
                                                        className={`px-4 py-1.5 rounded-md font-bold text-sm transition-colors border ${answers[item.id] === 'SI' ? 'bg-green-500 text-white border-green-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                                                            }`}
                                                        onClick={() => handleAnswerChange(item.id, 'SI')}
                                                    >
                                                        SI
                                                    </button>
                                                    <button
                                                        className={`px-4 py-1.5 rounded-md font-bold text-sm transition-colors border ${answers[item.id] === 'NO' ? 'bg-red-500 text-white border-red-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                                                            }`}
                                                        onClick={() => handleAnswerChange(item.id, 'NO')}
                                                    >
                                                        NO
                                                    </button>
                                                    <button
                                                        className={`px-4 py-1.5 rounded-md font-bold text-sm transition-colors border ${answers[item.id] === 'NA' ? 'bg-gray-500 text-white border-gray-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                                                            }`}
                                                        onClick={() => handleAnswerChange(item.id, 'NA')}
                                                    >
                                                        N/A
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex justify-end gap-4">
                    <Button onClick={handleSave} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                        Guardar Borrador
                    </Button>

                    <Button onClick={handleSubmitForReview} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                        Finalizar y Enviar a Revisión
                    </Button>
                </div>
            </div>
        </div>
    );
};