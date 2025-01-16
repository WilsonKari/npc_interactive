import { useState, useCallback, useEffect } from 'react';
import { eventProcessor, ProcessedEvent } from '../services/events/eventProcessor';
import { EventType } from '../services/events/eventConditions';
import { useElevenLabs } from './useElevenLabs';
import { aiService } from '../services/api/ai/aiService';

interface EventProcessorHookReturn {
    isProcessing: boolean;
    error: Error | null;
    processEvent: <T>(event: ProcessedEvent<T>) => Promise<void>;
    clearError: () => void;
}

export const useEventProcessor = (): EventProcessorHookReturn => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const { synthesizeSpeech } = useElevenLabs();

    const handleAIResponse = useCallback(async (response: string) => {
        try {
            // Sintetizar voz con la respuesta
            const audioUrl = await synthesizeSpeech(response);
            
            // Reproducir audio
            const audio = new Audio(audioUrl);
            await audio.play();
        } catch (error) {
            console.error('Error procesando respuesta de IA:', error);
            setError(error instanceof Error ? error : new Error('Error desconocido'));
        }
    }, [synthesizeSpeech]);

    const processEvent = useCallback(async <T>(event: ProcessedEvent<T>) => {
        setIsProcessing(true);
        setError(null);

        try {
            // Procesar el evento con el EventProcessor
            const success = await eventProcessor.addEvent(event);
            
            if (!success) {
                throw new Error('No se pudo procesar el evento');
            }

            // Si es un evento de chat, procesar con IA y sintetizar voz
            if (event.type === EventType.CHAT) {
                const response = await aiService.processEvent(
                    event.type,
                    event.data,
                    undefined, // onStream callback si quieres streaming
                    handleAIResponse // onComplete callback
                );
            }

        } catch (error) {
            console.error('Error en el procesamiento del evento:', error);
            setError(error instanceof Error ? error : new Error('Error desconocido'));
        } finally {
            setIsProcessing(false);
        }
    }, [handleAIResponse]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Limpiar estado al desmontar
    useEffect(() => {
        return () => {
            setIsProcessing(false);
            setError(null);
        };
    }, []);

    return {
        isProcessing,
        error,
        processEvent,
        clearError
    };
};