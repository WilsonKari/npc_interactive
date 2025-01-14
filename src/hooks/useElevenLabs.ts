import { useState, useCallback, useRef, useEffect } from 'react';
import { ElevenLabsProvider } from '../services/api/elevenlabs/providers/elevenlabsProvider';
import type { Voice } from '../services/api/elevenlabs/types';
import { useAIConfigStore } from '../store/aiConfigStore';
import { RateLimiter, withRetry, ResponseCache } from '../utils/aiHelpers';

interface UseElevenLabsReturn {
    synthesizeSpeech: (text: string) => Promise<string>;
    getVoices: () => Promise<Voice[]>;
    isProcessing: boolean;
    currentAudio: HTMLAudioElement | null;
    error: Error | null;
    stopAudio: () => void;
    playAudio: (audioUrl: string) => Promise<void>;
}

export const useElevenLabs = (): UseElevenLabsReturn => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    
    const { 
        elevenLabsApiKey,
        customVoiceId,
        selectedVoicePreset
    } = useAIConfigStore();

    const provider = useRef(new ElevenLabsProvider(elevenLabsApiKey)).current;
    const rateLimiter = useRef(new RateLimiter(50)).current; // 50 requests per minute
    const responseCache = useRef(new ResponseCache(5)).current; // 5 minutes TTL

    useEffect(() => {
        provider.updateApiKey(elevenLabsApiKey);
    }, [elevenLabsApiKey, provider]);

    const stopAudio = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }, []);

    const playAudio = useCallback(async (audioUrl: string) => {
        stopAudio();
        audioRef.current = new Audio(audioUrl);
        try {
            await audioRef.current.play();
        } catch (error) {
            setError(error instanceof Error ? error : new Error('Error reproduciendo audio'));
            throw error;
        }
    }, [stopAudio]);

    const synthesizeSpeech = useCallback(async (text: string): Promise<string> => {
        setIsProcessing(true);
        setError(null);
        
        // Verificar caché primero
        const cacheKey = `${text}-${customVoiceId}-${selectedVoicePreset}`;
        const cachedResponse = responseCache.get(cacheKey);
        if (cachedResponse) {
            setIsProcessing(false);
            return cachedResponse;
        }

        try {
            // Usar rate limiter y reintentos
            const audioUrl = await rateLimiter.add(() => 
                withRetry(async () => {
                    return await provider.synthesizeSpeech(
                        text,
                        customVoiceId || undefined,
                        selectedVoicePreset
                    );
                })
            );

            // Guardar en caché
            responseCache.set(cacheKey, audioUrl);
            return audioUrl;
        } catch (error) {
            setError(error instanceof Error ? error : new Error('Error sintetizando voz'));
            throw error;
        } finally {
            setIsProcessing(false);
        }
    }, [provider, customVoiceId, selectedVoicePreset]);

    const getVoices = useCallback(async (): Promise<Voice[]> => {
        const cacheKey = 'voices';
        const cachedVoices = responseCache.get(cacheKey);
        if (cachedVoices) {
            return cachedVoices;
        }

        try {
            const voices = await rateLimiter.add(() => 
                withRetry(async () => {
                    return await provider.getVoices();
                })
            );
            responseCache.set(cacheKey, voices);
            return voices;
        } catch (error) {
            setError(error instanceof Error ? error : new Error('Error obteniendo voces'));
            throw error;
        }
    }, [provider]);

    return {
        synthesizeSpeech,
        getVoices,
        isProcessing,
        currentAudio: audioRef.current,
        error,
        stopAudio,
        playAudio
    };
};

export default useElevenLabs;
