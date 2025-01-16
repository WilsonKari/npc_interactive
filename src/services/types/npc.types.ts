// src/services/types/npc.types.ts

/**
 * Interfaz que define el contrato para el servicio de respuesta del NPC.
 * Cualquier servicio que implemente esta interfaz debe proporcionar una
 * función `synthesizeAndPlayResponse` para sintetizar y reproducir una respuesta.
 * Opcionalmente, puede proporcionar una función `stopResponse` para detener
 * la reproducción de la respuesta actual.
 */
export type AudioState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

export interface NPCResponseService {
    /**
     * Sintetiza y reproduce la respuesta del NPC.
     * @param text Texto a sintetizar y reproducir.
     * @returns Promesa que se resuelve cuando la respuesta ha sido
     * sintetizada y reproducida.
     */
    synthesizeAndPlayResponse: (text: string) => Promise<void>;

    /**
     * Detiene la reproducción de la respuesta actual.
     * @optional
     */
    stopResponse?: () => void;
    
    /**
     * Notifica al servicio que el procesador de eventos se ha detenido
     * debido a una tasa de errores excedida.
     * @param metrics Objeto con métricas de error
     */
    notifyProcessorStopped: (metrics: {
        errorRate: number;
        lastErrorTimestamp: number;
        totalEvents: number;
        failedEvents: number;
    }) => void;

    /**
     * Obtiene el estado actual de reproducción de audio
     */
    getAudioState: () => AudioState;

    /**
     * Suscribe un callback para cambios de estado de audio
     * @param callback Función que recibe el nuevo estado
     * @returns Función para cancelar la suscripción
     */
    onAudioStateChange: (callback: (state: AudioState) => void) => () => void;

    /**
     * Obtiene la cola actual de reproducción
     */
    getQueue: () => string[];

    /**
     * Limpia la cola de reproducción
     */
    clearQueue: () => void;
}
