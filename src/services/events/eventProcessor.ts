// src/services/events/eventProcessor.ts
import { EventType, EventFilterManager } from "./eventConditions";
import { ChatEventFilter, ChatEvent } from "./conditions/chatConditions";
import { aiService } from "../api/ai/aiService";
// import { useTikTokNPCResponse } from "../../hooks/useTikTokNPCResponse"; // <- Eliminar esta línea
import { NPCResponseService } from "../types/npc.types"; // Importar la interfaz

// Interfaz base para eventos procesados
export interface ProcessedEvent<T = any> {
    type: EventType;
    data: T;
    timestamp: number;
    priority: number;
    metadata?: {
        contextId?: string;
        processingAttempts?: number;
        previousResponses?: string[];
        relatedEvents?: string[];
    };
}

// Configuración del procesador
interface ProcessorConfig {
    maxQueueSize: number;
    processingInterval: number;
    maxProcessingAttempts: number;
    contextWindowSize: number;
    maxConcurrentProcessing: number;
    errorRetryDelay: number; // tiempo de espera entre reintentos
    maxErrorRate: number; // tasa máxima de errores permitida
}

export class EventProcessor {
    private static instance: EventProcessor;
    private eventQueue: ProcessedEvent[] = [];
    private processingQueue: ProcessedEvent[] = [];
    private eventHistory: Map<EventType, ProcessedEvent[]> = new Map();
    private isProcessing: boolean = false;
    private filterManager: EventFilterManager;
    private npcResponseService?: NPCResponseService; // Campo para el servicio NPC

    private config: ProcessorConfig = {
        maxQueueSize: 100,
        processingInterval: 100, // ms
        maxProcessingAttempts: 3,
        contextWindowSize: 10, // número de eventos a mantener en contexto
        maxConcurrentProcessing: 5,
        errorRetryDelay: 1000, // tiempo de espera entre reintentos
        maxErrorRate: 0.1, // tasa máxima de errores permitida
    };

    // Métricas de rendimiento
    private metrics = {
        totalEventsProcessed: 0,
        successfulEvents: 0,
        failedEvents: 0,
        currentErrorRate: 0,
        lastErrorTimestamp: 0,
        processingTimes: [] as number[],
    };

    private constructor() {
        this.filterManager = EventFilterManager.getInstance();

        // Registrar filtro de chat con configuración por defecto
        import("./conditions/chatConditions").then(({ defaultChatFilter }) => {
            this.filterManager.addFilter(EventType.CHAT, defaultChatFilter);
        });

        this.startProcessingLoop();
    }

    public static getInstance(): EventProcessor {
        if (!EventProcessor.instance) {
            EventProcessor.instance = new EventProcessor();
        }
        return EventProcessor.instance;
    }

    // Método para inicializar el servicio NPC
    public initializeNPCService(service: NPCResponseService) {
        if (!service) {
            throw new Error('NPCResponseService is required');
        }
        this.npcResponseService = service;
        console.log('✅ NPC Response Service initialized');
        // Iniciar el procesamiento de eventos si no estaba corriendo
        if (!this.isProcessing) {
            this.startProcessingLoop();
        }
    }

    // Añade un evento a la cola de procesamiento
    public async addEvent<T>(event: ProcessedEvent<T>): Promise<boolean> {
        console.log("[LOG 3 - EventProcessor] Evento recibido:", event);
        console.log("[LOG 3] Evento recibido en el procesador:", {
            type: event.type,
            userId: (event.data as any)?.userId || "unknown",
            timestamp: Date.now(),
        });
        try {
            // Verificar tamaño de cola
            if (this.eventQueue.length >= this.config.maxQueueSize) {
                // Remover eventos de baja prioridad si es necesario
                this.pruneQueue();
            }

            // Añadir evento a la cola con ordenamiento por prioridad
            const insertIndex = this.eventQueue.findIndex(
                (e) => e.priority < event.priority
            );
            if (insertIndex === -1) {
                this.eventQueue.push(event);
            } else {
                this.eventQueue.splice(insertIndex, 0, event);
            }

            // Actualizar historial de eventos
            this.updateEventHistory(event);
            console.log("✅ EventProcessor - Evento agregado a la cola exitosamente");

            return true;
        } catch (error) {
            console.error(
                "❌ EventProcessor - Error agregando evento a la cola:",
                error
            );
            return false;
        }
    }

    // Procesa el siguiente evento en la cola
    private async processNextEvent(): Promise<void> {
        const startTime = Date.now();
        
        if (
            this.eventQueue.length === 0 ||
            this.processingQueue.length >= this.config.maxConcurrentProcessing
        ) {
            console.log(
                "🔄 EventProcessor - No hay eventos para procesar o límite concurrente alcanzado"
            );
            return;
        }

        const event = this.eventQueue.shift();
        if (!event) {
            console.log("⚠️ EventProcessor - No se pudo obtener evento de la cola");
            return;
        }

        console.log("🚀 EventProcessor - Iniciando procesamiento de evento:", {
            type: event.type,
            userId: (event.data as any)?.userId || "unknown",
            timestamp: Date.now(),
        });

        try {
            // Añadir a cola de procesamiento
            this.processingQueue.push(event);

            // Obtener contexto relevante
            const context = this.getEventContext(event);

            // Aquí iría la lógica de procesamiento específica según el tipo de evento
            switch (event.type) {
                case EventType.CHAT:
                    await this.processChatEvent(event, context);
                    break;
                case EventType.GIFT:
                    await this.processGiftEvent(event, context);
                    break;
                // ... otros tipos de eventos
            }

            // Actualizar métricas de éxito
            this.metrics.totalEventsProcessed++;
            this.metrics.successfulEvents++;
            this.metrics.processingTimes.push(Date.now() - startTime);
            
            // Calcular tasa de errores
            this.metrics.currentErrorRate = this.metrics.failedEvents / this.metrics.totalEventsProcessed;

            // Verificar si se excede la tasa máxima de errores
            if (this.metrics.currentErrorRate > this.config.maxErrorRate) {
                console.error('❌ Tasa de errores excedida:', this.metrics.currentErrorRate);
                this.stop();
                throw new Error(`Tasa de errores excedida: ${this.metrics.currentErrorRate}`);
            }

        } catch (error) {
            console.error("Error processing event:", error);
            
            // Actualizar métricas de error
            this.metrics.totalEventsProcessed++;
            this.metrics.failedEvents++;
            this.metrics.lastErrorTimestamp = Date.now();
            this.metrics.currentErrorRate = this.metrics.failedEvents / this.metrics.totalEventsProcessed;

            // Verificar si se excede la tasa máxima de errores
            if (this.metrics.currentErrorRate > this.config.maxErrorRate) {
                console.error('❌ Tasa de errores excedida:', this.metrics.currentErrorRate);
                this.stop();
                throw new Error(`Tasa de errores excedida: ${this.metrics.currentErrorRate}`);
            }

            // Reintentar si no excede máximo de intentos
            if (!event.metadata) event.metadata = {};
            event.metadata.processingAttempts =
                (event.metadata.processingAttempts || 0) + 1;

            if (event.metadata.processingAttempts < this.config.maxProcessingAttempts) {
                this.eventQueue.push(event); // Reintentar más tarde
            }
        } finally {
            // Remover de la cola de procesamiento
            this.processingQueue = this.processingQueue.filter((e) => e !== event);
        }
    }

    // Método para obtener métricas de rendimiento
    public getMetrics() {
        return {
            ...this.metrics,
            averageProcessingTime: this.metrics.processingTimes.length > 0 ?
                this.metrics.processingTimes.reduce((a, b) => a + b, 0) / this.metrics.processingTimes.length :
                0
        };
    }

    // Loop principal de procesamiento
    private async startProcessingLoop(): Promise<void> {
      if (this.isProcessing) return;
  
      this.isProcessing = true;
      while (this.isProcessing) {
        console.log('[LOG 8 - EventProcessor] Inside processing loop');
        await this.processNextEvent();
        await new Promise((resolve) =>
          setTimeout(resolve, this.config.processingInterval)
        );
      }
    }

    // Obtiene contexto relevante para un evento
    private getEventContext(event: ProcessedEvent): ProcessedEvent[] {
        const typeHistory = this.eventHistory.get(event.type) || [];
        return typeHistory
            .slice(-this.config.contextWindowSize)
            .filter((e) => e !== event);
    }

    // Actualiza el historial de eventos
    private updateEventHistory(event: ProcessedEvent): void {
        if (!this.eventHistory.has(event.type)) {
            this.eventHistory.set(event.type, []);
        }

        const typeHistory = this.eventHistory.get(event.type)!;
        typeHistory.push(event);

        // Mantener tamaño del historial
        if (typeHistory.length > this.config.contextWindowSize) {
            typeHistory.shift();
        }
    }

    // Elimina eventos de baja prioridad si la cola está llena
    private pruneQueue(): void {
        if (this.eventQueue.length <= this.config.maxQueueSize) return;

        // Ordenar por prioridad y mantener solo los más prioritarios
        this.eventQueue.sort((a, b) => b.priority - a.priority);
        this.eventQueue = this.eventQueue.slice(0, this.config.maxQueueSize);
    }

    // Procesamiento específico para cada tipo de evento
    private async processChatEvent(
        event: ProcessedEvent<ChatEvent>,
        context: ProcessedEvent[]
    ): Promise<void> {
        console.log("🎯 EventProcessor - Procesando evento de chat:", {
            type: event.type,
            message: event.data,
            contextSize: context.length,
            timestamp: Date.now(),
        });

        // Verificar que el servicio NPC esté inicializado
        if (!this.npcResponseService) {
            console.error('❌ NPCResponseService no está inicializado');
            throw new Error('NPCResponseService no está inicializado');
        }

        // Usar el filterManager para validar el evento
        const filter = this.filterManager.getFilter(event.type);
        if (!filter) {
            console.log(
                "⚠️ EventProcessor - No hay filtro configurado para este evento"
            );
            return;
        }

        try {
            // Aplicar filtros específicos del chat
            const chatFilter = filter as unknown as ChatEventFilter;

            // Procesar el mensaje según el contexto y filtros
            const response = await this.generateResponse(event, context, chatFilter);

            // Aquí iría la lógica para emitir la respuesta
            console.log("Procesando chat:", {
                message: event.data,
                response,
                context: context.length,
            });

            // Sintetizar y reproducir la respuesta de la IA
            // const { synthesizeAndPlayResponse } = useTikTokNPCResponse(); // <- Eliminar esta línea
            // synthesizeAndPlayResponse(response); // <- Reemplazar por la siguiente línea
            if (!this.npcResponseService) {
                throw new Error("NPCResponseService is not initialized.");
            }
            await this.npcResponseService.synthesizeAndPlayResponse(response);

        } catch (error) {
            console.error("Error processing chat event:", error);
            throw error;
        }
    }

    private async processGiftEvent(
        event: ProcessedEvent,
        context: ProcessedEvent[]
    ): Promise<void> {
        try {
            // Obtener el filtro específico para regalos
            const filter = this.filterManager.getFilter(event.type);
            if (!filter) return;

            // Procesar el regalo
            console.log("Procesando regalo:", {
                gift: event.data,
                contextSize: context.length,
            });

            // Aquí iría la lógica específica para regalos
            // Por ejemplo: actualizar contadores, generar agradecimientos, etc.
        } catch (error) {
            console.error("Error processing gift event:", error);
            throw error;
        }
    }

    private async generateResponse(
        event: ProcessedEvent,
        context: ProcessedEvent[],
        filter: ChatEventFilter
    ): Promise<string> {
        console.log("🧠 EventProcessor - Generando respuesta con IA para evento:", {
            type: event.type,
            userId: (event.data as any)?.userId || "unknown",
            timestamp: Date.now(),
        });
        try {
            // Preparar el contexto para la IA
            const contextData = context.map((ctx) => ({
                type: ctx.type,
                data: ctx.data,
                timestamp: ctx.timestamp,
            }));

            // Procesar el evento con la IA
            const response = await aiService.processEvent(event.type, {
                ...event.data,
                context: contextData,
                filter: filter,
            });

            return response;
        } catch (error) {
            console.error("Error generating AI response:", error);
            return "Lo siento, no pude procesar tu mensaje en este momento.";
        }
    }

    // Métodos públicos de utilidad
    public getQueueLength(): number {
        return this.eventQueue.length;
    }

    public getProcessingQueueLength(): number {
        return this.processingQueue.length;
    }

    public clearQueue(): void {
        this.eventQueue = [];
    }

    public updateConfig(config: Partial<ProcessorConfig>): void {
        this.config = { ...this.config, ...config };
    }

    public stop(): void {
        if (!this.isProcessing) return;
        
        this.isProcessing = false;
        console.log('⛔ EventProcessor stopped');
        
        // Notificar a los observadores
        if (this.npcResponseService) {
            this.npcResponseService.notifyProcessorStopped({
                errorRate: this.metrics.currentErrorRate,
                lastErrorTimestamp: this.metrics.lastErrorTimestamp,
                totalEvents: this.metrics.totalEventsProcessed,
                failedEvents: this.metrics.failedEvents
            });
        }
    }
}

// No se debe inicializar EventProcessor aquí, eso se hace en NPCEventHandler
// export const eventProcessor = EventProcessor.getInstance();
