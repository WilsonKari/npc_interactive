import { useState, useCallback } from 'react';
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
}

export const useNPCResponse = (): UseNPCResponseReturn => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const { generateResponse: generateAIResponse } = useAIResponse();
    const { synthesizeSpeech, stopAudio } = useElevenLabs();

    const generateResponse = useCallback(async (input: string): Promise<NPCResponse> => {
        setIsProcessing(true);
        setError(null);
        let audioUrl: string | null = null;

        try {
            // 1. Generar respuesta de texto con OpenAI
            const textResponse = await generateAIResponse(input);

            // 2. Convertir texto a voz con ElevenLabs
            try {
                audioUrl = await synthesizeSpeech(textResponse);
            } catch (voiceError) {
                console.error('Error en la síntesis de voz:', voiceError);
                // Continuamos con la respuesta de texto aunque falle la voz
            }

            return {
                text: textResponse,
                audioUrl
            };
        } catch (error) {
            const e = error instanceof Error ? error : new Error('Error desconocido');
            setError(e);
            throw e;
        } finally {
            setIsProcessing(false);
        }
    }, [generateAIResponse, synthesizeSpeech]);

    return {
        generateResponse,
        isProcessing,
        error,
        stopAudio
    };
};
