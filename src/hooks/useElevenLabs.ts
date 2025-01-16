import { useState, useCallback, useRef, useEffect } from 'react';
import { ElevenLabsProvider } from '../services/api/elevenlabs/providers/elevenlabsProvider';
import type { Voice } from '../services/api/elevenlabs/types';
import { useAIConfigStore } from '../store/aiConfigStore';
import { RateLimiter, withRetry, ResponseCache } from '../utils/aiHelpers';
import { AudioState } from '../services/types/npc.types';

interface UseElevenLabsReturn {
    synthesizeSpeech: (text: string) => Promise<string>;
    getVoices: () => Promise<Voice[]>;
    isProcessing: boolean;
    currentAudio: HTMLAudioElement | null;
    error: Error | null;
    stopAudio: () => void;
    playAudio: (audioUrl: string) => Promise<void>;
    getAudioState: () => AudioState;
    onAudioStateChange: (callback: (state: AudioState) => void) => () => void;
    getQueue: () => string[];
    clearQueue: () => void;
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
        // Detener cualquier AudioContext activo
        if (window.AudioContext) {
            const contexts = (window as any).audioContexts || [];
            contexts.forEach((ctx: AudioContext) => {
                try {
                    ctx.close();
                } catch (error) {
                    console.error('Error closing AudioContext:', error);
                }
            });
        }
    }, []);

    const playAudio = useCallback(async (audioUrl: string) => {
        console.log('[LOG 50] useElevenLabs - Reproduciendo audio', {
            audioUrlPreview: audioUrl.slice(0, 50) + (audioUrl.length > 50 ? '...' : '')
        });
        
        stopAudio();
        
        // Crear AudioContext con compatibilidad TypeScript
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContext();
        const source = audioContext.createBufferSource();
        
        try {
            console.log('[LOG 51] useElevenLabs - Cargando y decodificando audio');
            
            // Obtener el archivo de audio
            const response = await fetch(audioUrl);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            
            // Configurar el source
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
            
            // Manejar la suspensión del contexto
            if (audioContext.state === 'suspended') {
                console.log('[LOG 53] useElevenLabs - Reactivando contexto de audio');
                await audioContext.resume();
            }
            
            console.log('[LOG 52] useElevenLabs - Iniciando reproducción');
            source.start(0);
            console.log('[LOG 54] useElevenLabs - Reproducción iniciada correctamente');
            
            // Limpiar cuando termine
            source.onended = () => {
                console.log('[LOG 55] useElevenLabs - Audio terminado');
                audioContext.close();
            };
        } catch (error) {
            console.error('[ERROR] useElevenLabs - Error reproduciendo audio:', {
                error: error instanceof Error ? error.message : 'Error desconocido',
                stack: error instanceof Error ? error.stack : undefined,
                audioUrlPreview: audioUrl.slice(0, 50) + (audioUrl.length > 50 ? '...' : '')
            });
            
            setError(error instanceof Error ? error : new Error('Error reproduciendo audio'));
            throw error;
        }
    }, [stopAudio]);

    const synthesizeSpeech = useCallback(async (text: string): Promise<string> => {
        console.log('[LOG 30] useElevenLabs - Iniciando síntesis de voz', {
            textLength: text.length,
            customVoiceId,
            selectedVoicePreset
        });
        
        setIsProcessing(true);
        setError(null);
        
        // Verificar caché primero
        const cacheKey = `${text}-${customVoiceId}-${selectedVoicePreset}`;
        console.log('[LOG 31] useElevenLabs - Cache key:', cacheKey);
        
        const cachedResponse = responseCache.get(cacheKey);
        if (cachedResponse) {
            console.log('[LOG 32] useElevenLabs - Respuesta encontrada en caché');
            setIsProcessing(false);
            return cachedResponse;
        }

        try {
            console.log('[LOG 33] useElevenLabs - No hay caché, iniciando solicitud');
            
            // Usar rate limiter y reintentos
            const audioUrl = await rateLimiter.add(() => 
                withRetry(async () => {
                    console.log('[LOG 34] useElevenLabs - Ejecutando síntesis con rate limiter');
                    return await provider.synthesizeSpeech(
                        text,
                        customVoiceId || undefined,
                        selectedVoicePreset
                    );
                })
            );

            console.log('[LOG 35] useElevenLabs - Audio generado, guardando en caché');
            responseCache.set(cacheKey, audioUrl);
            
            return audioUrl;
        } catch (error) {
            console.error('[ERROR] useElevenLabs - Error sintetizando voz:', {
                error: error instanceof Error ? error.message : 'Error desconocido',
                stack: error instanceof Error ? error.stack : undefined,
                textPreview: text.slice(0, 50) + (text.length > 50 ? '...' : ''),
                customVoiceId,
                selectedVoicePreset
            });
            
            setError(error instanceof Error ? error : new Error('Error sintetizando voz'));
            throw error;
        } finally {
            console.log('[LOG 36] useElevenLabs - Finalizando procesamiento');
            setIsProcessing(false);
        }
    }, [provider, customVoiceId, selectedVoicePreset]);

    const getVoices = useCallback(async (): Promise<Voice[]> => {
        console.log('[LOG 40] useElevenLabs - Obteniendo lista de voces');
        
        const cacheKey = 'voices';
        console.log('[LOG 41] useElevenLabs - Cache key:', cacheKey);
        
        const cachedVoices = responseCache.get(cacheKey);
        if (cachedVoices) {
            console.log('[LOG 42] useElevenLabs - Voces encontradas en caché');
            return cachedVoices;
        }

        try {
            console.log('[LOG 43] useElevenLabs - No hay caché, iniciando solicitud');
            
            const voices = await rateLimiter.add(() => 
                withRetry(async () => {
                    console.log('[LOG 44] useElevenLabs - Ejecutando solicitud con rate limiter');
                    return await provider.getVoices();
                })
            );
            
            console.log('[LOG 45] useElevenLabs - Voces obtenidas, guardando en caché', {
                count: voices.length
            });
            responseCache.set(cacheKey, voices);
            
            return voices;
        } catch (error) {
            console.error('[ERROR] useElevenLabs - Error obteniendo voces:', {
                error: error instanceof Error ? error.message : 'Error desconocido',
                stack: error instanceof Error ? error.stack : undefined
            });
            
            setError(error instanceof Error ? error : new Error('Error obteniendo voces'));
            throw error;
        }
    }, [provider]);

    const getAudioState = useCallback(() => {
        if (error) return 'error';
        if (isProcessing) return 'loading';
        if (!audioRef.current) return 'idle';
        if (audioRef.current.paused) return 'paused';
        if (audioRef.current.ended) return 'idle';
        return 'playing';
    }, [error, isProcessing]);

    const onAudioStateChange = useCallback((callback: (state: AudioState) => void) => {
        const handleStateChange = () => {
            callback(getAudioState());
        };

        if (audioRef.current) {
            audioRef.current.addEventListener('play', handleStateChange);
            audioRef.current.addEventListener('pause', handleStateChange);
            audioRef.current.addEventListener('ended', handleStateChange);
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('play', handleStateChange);
                audioRef.current.removeEventListener('pause', handleStateChange);
                audioRef.current.removeEventListener('ended', handleStateChange);
            }
        };
    }, [getAudioState]);

    const [audioQueue, setAudioQueue] = useState<string[]>([]);

    const getQueue = useCallback(() => {
        return audioQueue;
    }, [audioQueue]);

    const clearQueue = useCallback(() => {
        setAudioQueue([]);
    }, []);

    return {
        synthesizeSpeech,
        getVoices,
        isProcessing,
        currentAudio: audioRef.current,
        error,
        stopAudio,
        playAudio,
        getAudioState,
        onAudioStateChange,
        getQueue,
        clearQueue
    };
};

export default useElevenLabs;
