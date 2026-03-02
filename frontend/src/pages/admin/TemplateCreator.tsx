import { useState } from 'react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import type { ProtocolSection } from '../../utils/types';

export const TemplateCreator = () => {
    const [templateName, setTemplateName] = useState('');
    const [description, setDescription] = useState('');
    const [sections, setSections] = useState<ProtocolSection[]>([]);

    // Función para agregar una nueva sección vacía
    const addSection = () => {
        const newSection: ProtocolSection = {
            id: crypto.randomUUID(), // Genera un ID único temporal
            name: '',
            items: [],
        };
        setSections([...sections, newSection]);
    };

    // Función para actualizar el nombre de una sección
    const updateSectionName = (sectionId: string, newName: string) => {
        setSections(sections.map(sec =>
            sec.id === sectionId ? { ...sec, name: newName } : sec
        ));
    };

    // Función para agregar un ítem a una sección específica
    const addItemToSection = (sectionId: string) => {
        setSections(sections.map(sec => {
            if (sec.id === sectionId) {
                return {
                    ...sec,
                    items: [...sec.items, { id: crypto.randomUUID(), name: '' }]
                };
            }
            return sec;
        }));
    };

    // Función para actualizar el texto de un ítem
    const updateItemName = (sectionId: string, itemId: string, newName: string) => {
        setSections(sections.map(sec => {
            if (sec.id === sectionId) {
                return {
                    ...sec,
                    items: sec.items.map(item =>
                        item.id === itemId ? { ...item, name: newName } : item
                    )
                };
            }
            return sec;
        }));
    };

    const handleSave = async () => {
        const finalTemplate = {
            name: templateName,
            description,
            sections
        };
        console.log("Datos listos para enviar al Backend:", finalTemplate);
        alert("Revisa la consola (F12) para ver la estructura JSON armada.");
        // Aquí luego llamaremos a api.post('/templates', finalTemplate)
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Crear Nueva Plantilla de Protocolo</h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <Input
                    label="Nombre del Protocolo (Ej: Protocolo Alfombras)"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                />
                <Input
                    label="Descripción o especialidad"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            {/* Renderizado dinámico de Secciones e Ítems */}
            {sections.map((section, index) => (
                <div key={section.id} className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 mb-6 relative">
                    <h3 className="font-bold text-lg mb-4 text-blue-700">Sección {index + 1}</h3>

                    <Input
                        label="Nombre de la Sección (Ej: Actividades Previas)"
                        value={section.name}
                        onChange={(e) => updateSectionName(section.id, e.target.value)}
                    />

                    <div className="pl-6 mt-4 border-l-2 border-blue-200">
                        <h4 className="font-semibold text-gray-600 mb-2">Ítems a chequear:</h4>
                        {section.items.map((item, itemIndex) => (
                            <div key={item.id} className="mb-2">
                                <input
                                    type="text"
                                    placeholder={`Ej: 1.${itemIndex + 1} Superficie limpia y seca`}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    value={item.name}
                                    onChange={(e) => updateItemName(section.id, item.id, e.target.value)}
                                />
                            </div>
                        ))}

                        <button
                            onClick={() => addItemToSection(section.id)}
                            className="text-sm text-blue-600 font-semibold hover:text-blue-800 mt-2"
                        >
                            + Agregar Ítem de chequeo
                        </button>
                    </div>
                </div>
            ))}

            <div className="flex gap-4">
                <Button onClick={addSection} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                    + Agregar Sección
                </Button>
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                    Guardar Plantilla
                </Button>
            </div>
        </div>
    );
};