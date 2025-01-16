import { useState, useCallback, useRef } from 'react';
import { useAIResponse } from './useAIResponse';
import { useElevenLabs } from './useElevenLabs';

interface NPCResponse {
    text: string;
    audioUrl: string | null;
}

interface UseNPCResponseReturn {
    generateResponse: (input: string) => Promise<NPCResponse>;
    isProcessing: boolean;
    error: Error | null;
    stopAudio: () => void;
    currentText: string;
}

export const useNPCResponse = (): UseNPCResponseReturn => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [currentText, setCurrentText] = useState<string>('');
    const accumulatedTextRef = useRef<string>('');
    const voiceProcessingTimeout = useRef<NodeJS.Timeout>();

    const { generateResponse: generateAIResponse } = useAIResponse();
    const { synthesizeSpeech, stopAudio } = useElevenLabs();

    const generateResponse = useCallback(async (input: string): Promise<NPCResponse> => {
        setIsProcessing(true);
        setError(null);
        setCurrentText('');
        accumulatedTextRef.current = '';
        let audioUrl: string | null = null;

        try {
            // Procesar el texto con streaming
            const response = await generateAIResponse(
                input,
                // Callback de streaming
                (chunk) => {
                    accumulatedTextRef.current += chunk;
                    setCurrentText(accumulatedTextRef.current);

                    // Programar síntesis de voz si hay suficiente texto
                    if (voiceProcessingTimeout.current) {
                        clearTimeout(voiceProcessingTimeout.current);
                    }

                    if (accumulatedTextRef.current.length > 50) {
                        voiceProcessingTimeout.current = setTimeout(async () => {
                            try {
                                audioUrl = await synthesizeSpeech(accumulatedTextRef.current);
                            } catch (error) {
                                console.error('Error en síntesis de voz:', error);
                            }
                        }, 500);
                    }
                },
                // Callback de completación
                async (fullText) => {
                    if (!audioUrl) {
                        try {
                            audioUrl = await synthesizeSpeech(fullText);
                        } catch (error) {
                            console.error('Error en síntesis de voz final:', error);
                        }
                    }
                }
            );

            return {
                text: response,
                audioUrl
            };
        } catch (error) {
            const e = error instanceof Error ? error : new Error('Error desconocido');
            setError(e);
            throw e;
        } finally {
            setIsProcessing(false);
            if (voiceProcessingTimeout.current) {
                clearTimeout(voiceProcessingTimeout.current);
            }
        }
    }, [generateAIResponse, synthesizeSpeech]);

    return {
        generateResponse,
        isProcessing,
        error,
        stopAudio,
        currentText
    };
};
