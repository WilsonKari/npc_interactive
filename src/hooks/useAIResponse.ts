import { useState, useCallback } from 'react';
import OpenAIProvider from '../services/api/ai/providers/openai/openaiProvider';

interface UseAIResponseReturn {
    generateResponse: (input: string) => Promise<string>;
    isProcessing: boolean;
    error: Error | null;
}

export const useAIResponse = (): UseAIResponseReturn => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    
    const provider = new OpenAIProvider();

    const generateResponse = useCallback(async (input: string): Promise<string> => {
        setIsProcessing(true);
        setError(null);

        try {
            const response = await provider.generateResponse(input);
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