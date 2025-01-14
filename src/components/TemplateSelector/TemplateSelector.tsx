import React from 'react';
import { NPCTemplateType } from '../../services/api/ai/config/openai/templates';

interface TemplateSelectorProps {
    isOpen: boolean;
    onSelect: (template: NPCTemplateType) => void;
    onClose: () => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
    isOpen,
    onSelect,
    onClose
}) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                maxWidth: '500px',
                width: '90%'
            }}>
                <h2>Selecciona una plantilla</h2>
                <div style={{
                    display: 'grid',
                    gap: '10px',
                    marginTop: '20px'
                }}>
                    {Object.values(NPCTemplateType).map((template) => (
                        <button
                            key={template}
                            onClick={() => onSelect(template)}
                            style={{
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                backgroundColor: '#f8f8f8'
                            }}
                        >
                            {template.replace('_', ' ').toUpperCase()}
                        </button>
                    ))}
                </div>
                <button
                    onClick={onClose}
                    style={{
                        marginTop: '20px',
                        padding: '10px',
                        backgroundColor: '#ff4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
};
