import { useState } from 'react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import type { ProtocolSection } from '../../utils/types';

export const TemplateCreator = () => {
  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [sections, setSections] = useState<ProtocolSection[]>([]);

  const addSection = () => {
    const newSection: ProtocolSection = {
      id: crypto.randomUUID(),
      name: '',
      items: [],
    };
    setSections([...sections, newSection]);
  };

  const updateSectionName = (sectionId: string, newName: string) => {
    setSections(sections.map(sec => 
      sec.id === sectionId ? { ...sec, name: newName } : sec
    ));
  };

  // ACTUALIZADO: Ahora los ítems nacen con type 'CHECK' por defecto
  const addItemToSection = (sectionId: string) => {
    setSections(sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          items: [...sec.items, { id: crypto.randomUUID(), name: '', type: 'CHECK' }]
        };
      }
      return sec;
    }));
  };

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

  // NUEVO: Función para cambiar entre CHECK y TEXT
  const updateItemType = (sectionId: string, itemId: string, newType: 'CHECK' | 'TEXT') => {
    setSections(sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          items: sec.items.map(item => 
            item.id === itemId ? { ...item, type: newType } : item
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
    console.log("JSON final armado:", finalTemplate);
    alert("Revisa la consola (F12) para ver la estructura actualizada.");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Crear Nueva Plantilla</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <Input 
          label="Nombre del Protocolo (Ej: Protocolo Eléctrico Capri)" 
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
        />
        <Input 
          label="Descripción o especialidad" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {sections.map((section, index) => (
        <div key={section.id} className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h3 className="font-bold text-lg mb-4 text-blue-700">Sección {index + 1}</h3>
          
          <Input 
            label="Nombre de la Sección (Ej: Características Generales)"
            value={section.name}
            onChange={(e) => updateSectionName(section.id, e.target.value)}
          />

          <div className="pl-6 mt-4 border-l-2 border-blue-200">
            <h4 className="font-semibold text-gray-600 mb-2">Ítems requeridos:</h4>
            
            {section.items.map((item, itemIndex) => (
              <div key={item.id} className="flex gap-2 mb-2 items-center">
                {/* Input para el nombre del ítem */}
                <input
                  type="text"
                  placeholder={`Ej: ${itemIndex + 1}. Tipo de Departamento`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={item.name}
                  onChange={(e) => updateItemName(section.id, item.id, e.target.value)}
                />
                
                {/* NUEVO: Select para elegir el tipo de respuesta esperada */}
                <select
                  value={item.type}
                  onChange={(e) => updateItemType(section.id, item.id, e.target.value as 'CHECK' | 'TEXT')}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-sm text-gray-700"
                >
                  <option value="CHECK">✓ Opciones (SI/NO/NA)</option>
                  <option value="TEXT">✎ Campo de Texto Libre</option>
                </select>
              </div>
            ))}
            
            <Button 
              onClick={() => addItemToSection(section.id)}
              className="text-sm text-blue-600 font-semibold hover:text-blue-800 mt-2"
            >
              + Agregar Ítem
            </Button>
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