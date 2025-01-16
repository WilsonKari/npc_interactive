// src/components/NPCEventHandler.tsx
import React, { useEffect, useRef } from 'react';
import { useTikTokNPCResponse } from '../hooks/useTikTokNPCResponse';
import { EventProcessor } from '../services/events/eventProcessor';

/**
 * Componente que actúa como puente entre los hooks de React y la clase EventProcessor.
 * Se encarga de inicializar el EventProcessor con el servicio de respuesta del NPC
 * obtenido del hook useTikTokNPCResponse.
 */
export const NPCEventHandler: React.FC = () => {
  const { 
    synthesizeAndPlayResponse, 
    stopResponse,
    getAudioState,
    onAudioStateChange,
    getQueue,
    clearQueue
  } = useTikTokNPCResponse();
  const processorRef = useRef<EventProcessor>(EventProcessor.getInstance());

  useEffect(() => {
    try {
      // Verificar que las funciones requeridas estén disponibles
      if (!synthesizeAndPlayResponse || !stopResponse) {
        throw new Error('NPC response functions are not available');
      }

      console.log("✅ NPCEventHandler - Inicializando EventProcessor con servicio NPC");
      processorRef.current.initializeNPCService({
        synthesizeAndPlayResponse,
        stopResponse,
        getAudioState,
        onAudioStateChange, 
        getQueue,
        clearQueue,
        notifyProcessorStopped: (metrics) => {
          console.error('❌ NPCEventHandler - Procesador detenido por alta tasa de errores:', {
            errorRate: metrics.errorRate,
            failedEvents: metrics.failedEvents,
            totalEvents: metrics.totalEvents,
            lastError: new Date(metrics.lastErrorTimestamp).toISOString()
          });
        }
      });

      console.log("✅ NPCEventHandler - EventProcessor inicializado correctamente");
    } catch (error) {
      console.error('❌ NPCEventHandler - Error inicializando EventProcessor:', error);
      // Detener el procesador si hay errores
      if (processorRef.current.stop) {
        processorRef.current.stop();
      }
    }

    return () => {
      console.log("🛑 NPCEventHandler - Desmontando componente");
      // Limpiar cuando el componente se desmonte, deteniendo el procesador si es necesario
      if (processorRef.current.stop) {
        processorRef.current.stop();
      }
    };
  }, [synthesizeAndPlayResponse, stopResponse]);

  return null; // Este componente no renderiza nada
};
