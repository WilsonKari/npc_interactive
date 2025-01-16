import { useState, useCallback } from 'react';
import { aiService } from '../services/api/ai/aiService';

interface UseAIResponseReturn {
    generateResponse: (
        input: string,
        onStream?: (chunk: string) => void,
        onComplete?: (text: string) => void
    ) => Promise<string>;
    isProcessing: boolean;
    error: Error | null;
}

export const useAIResponse = (): UseAIResponseReturn => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const generateResponse = useCallback(async (
        input: string,
        onStream?: (chunk: string) => void,
        onComplete?: (text: string) => void
    ): Promise<string> => {
        setIsProcessing(true);
        setError(null);

        try {
            const response = await aiService.processEvent(
                'CHAT',
                { message: input, user: { name: 'User' } },
                onStream,
                onComplete
            );
            return response;
        } catch (error) {
            const e = error instanceof Error ? error : new Error('Error desconocido');
            setError(e);
            throw e;
        } finally {
            setIsProcessing(false);
        }
    }, []);

    return {
        generateResponse,
        isProcessing,
        error
    };
};