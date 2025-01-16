// src/App.tsx
import { useState, useEffect } from 'react';
import { EventContainer } from './components/EventContainer/EventContainer';
import { NPCContainer, NPCWindow } from './App.styles';
import { TemplateSelector } from './components/TemplateSelector/TemplateSelector';
import OpenAI from 'openai';
import { getCurrentPrompt } from './services/api/ai/config/openai/config';
import { NPCTemplateType } from './services/api/ai/config/openai/templates';
import { applyTemplate } from './services/api/ai/config/openai/config';
import { useElevenLabs } from './hooks/useElevenLabs';
import { tiktokService } from './services/api/tiktok/tiktokService';
// import { useTikTokNPCResponse } from './hooks/useTikTokNPCResponse'; // Ya no se necesita aquí
// import { EventProcessor } from './services/events/eventProcessor'; // Ya no se necesita aquí
import { NPCEventHandler } from './components/NPCEventHandler'; // Importar el nuevo componente

// Inicializar OpenAI
const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

function App() {
    const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState<NPCTemplateType>(NPCTemplateType.ENTERTAINER);
    const { synthesizeSpeech, isProcessing, playAudio } = useElevenLabs();

    // Inicialización y manejo de TikTok Service
    useEffect(() => {
        console.log('Inicializando servicio TikTok...');
        
        // Si no está conectado, reconectar
        if (!tiktokService.isConnected()) {
            tiktokService.reconnect();
        }
        
        return () => {
            // Solo desconectar si estamos navegando fuera de la aplicación
            if (window.location.pathname === '/') {
                tiktokService.disconnect();
            }
        };
    }, []);

    const handleTemplateSelect = async (template: NPCTemplateType) => {
        setCurrentTemplate(template);
        setIsTemplateSelectorOpen(false);
        applyTemplate(template);
        
        // Aquí puedes agregar la lógica para procesar el mensaje
        const userMessage = prompt('Ingresa tu mensaje:');
        if (userMessage) {
            await processMessage(userMessage);
        }
    };

    const startInteraction = () => {
        setIsTemplateSelectorOpen(true);
    };

    const processMessage = async (userMessage: string) => {
        try {
            const prompt = getCurrentPrompt();
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: prompt
                    },
                    {
                        role: "user",
                        content: userMessage
                    }
                ],
                model: "gpt-3.5-turbo",
            });

            const response = completion.choices[0]?.message?.content;
            if (response) {
                console.log('Respuesta del NPC:', response);
                
                // Sintetizar la respuesta usando ElevenLabs
                try {
                    const audioUrl = await synthesizeSpeech(response);
                    console.log('Audio generado:', audioUrl);
                    
                    // Reproducir el audio usando la función del hook
                    await playAudio(audioUrl);
                } catch (error) {
                    console.error('Error al sintetizar voz:', error);
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <NPCContainer>
            <NPCWindow>
                <NPCEventHandler /> {/* Renderizar el nuevo componente */}
                <EventContainer />
                <button
                    onClick={startInteraction}
                    disabled={isProcessing}
                >
                    {isProcessing ? 'Procesando...' : `Iniciar Interacción con ${currentTemplate}`}
                </button>
            </NPCWindow>
            
            <TemplateSelector
                isOpen={isTemplateSelectorOpen}
                onSelect={handleTemplateSelect}
                onClose={() => setIsTemplateSelectorOpen(false)}
            />
        </NPCContainer>
    );
}

export default App;