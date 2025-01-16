// src/hooks/useTikTokNPCResponse.ts
import { useCallback } from 'react';
import { useElevenLabs } from './useElevenLabs';
import { AudioState } from '../services/types/npc.types';

interface UseTikTokNPCResponseReturn {
    synthesizeAndPlayResponse: (text: string) => Promise<void>;
    stopResponse: () => void;
    getAudioState: () => AudioState;
    onAudioStateChange: (callback: (state: AudioState) => void) => () => void;
    getQueue: () => string[];
    clearQueue: () => void;
}

export const useTikTokNPCResponse = (): UseTikTokNPCResponseReturn => {
    const { 
        synthesizeSpeech, 
        playAudio, 
        stopAudio,
        getAudioState: getElevenLabsAudioState,
        onAudioStateChange: onElevenLabsAudioStateChange,
        getQueue: getElevenLabsQueue,
        clearQueue: clearElevenLabsQueue
    } = useElevenLabs();

    const synthesizeAndPlayResponse = useCallback(async (text: string) => {
        try {
            console.log('[LOG 60] useTikTokNPCResponse - Sintetizando respuesta:', text);
            const audioUrl = await synthesizeSpeech(text);
            console.log('[LOG 61] useTikTokNPCResponse - Reproduciendo audio:', audioUrl);
            await playAudio(audioUrl);
            console.log('[LOG 62] useTikTokNPCResponse - Audio reproducido correctamente');
        } catch (error) {
            console.error('[ERROR] useTikTokNPCResponse - Error al sintetizar o reproducir audio:', error);
        }
    }, [synthesizeSpeech, playAudio]);

    const stopResponse = useCallback(() => {
        console.log('[LOG 70] useTikTokNPCResponse - Deteniendo respuesta actual');
        stopAudio();
    }, [stopAudio]);

    const getAudioState = useCallback(() => {
        return getElevenLabsAudioState();
    }, [getElevenLabsAudioState]);

    const onAudioStateChange = useCallback((callback: (state: AudioState) => void) => {
        return onElevenLabsAudioStateChange(callback);
    }, [onElevenLabsAudioStateChange]);

    const getQueue = useCallback(() => {
        return getElevenLabsQueue();
    }, [getElevenLabsQueue]);

    const clearQueue = useCallback(() => {
        clearElevenLabsQueue();
    }, [clearElevenLabsQueue]);

    return {
        synthesizeAndPlayResponse,
        stopResponse,
        getAudioState,
        onAudioStateChange,
        getQueue,
        clearQueue
    };
};

export default useTikTokNPCResponse;
