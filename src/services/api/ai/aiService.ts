import OpenAI from 'openai';
import { 
    OpenAIConfigType
} from './config/openai/types';
import {
    getCurrentConfig,
    getCurrentPrompt,
    createOpenAIClient,
    updateOpenAIConfig
} from './config/openai/config';

// Tipos para el streaming
type StreamCallback = (chunk: string) => void;
type CompletionCallback = (fullText: string) => void;

class AIService {
    private static instance: AIService;
    private openai!: OpenAI;
    private messageHistory: Array<{ role: 'user' | 'assistant' | 'system', content: string }> = [];
    private maxHistoryLength: number = 10;
    private responseCache: Map<string, { text: string, timestamp: number }> = new Map();
    private cacheTTL: number = 5 * 60 * 1000; // 5 minutos

    private constructor() {
        this.initializeHistory();
    }

    private ensureOpenAIClient() {
        if (!this.openai) {
            console.log('[LOG 2] AIService - Creando cliente OpenAI');
            this.openai = createOpenAIClient();
            console.log('[LOG 3] AIService - Cliente OpenAI creado exitosamente');
        }
    }

    public static getInstance(): AIService {
        if (!AIService.instance) {
            AIService.instance = new AIService();
        }
        return AIService.instance;
    }

    private initializeHistory(): void {
        const systemPrompt = getCurrentPrompt();
        this.messageHistory = [{
            role: 'system',
            content: systemPrompt
        }];
    }

    public async processEvent(
        eventType: string, 
        eventData: any, 
        onStream?: StreamCallback,
        onComplete?: CompletionCallback
    ): Promise<string> {
        console.log('[LOG 4] AIService - Iniciando procesamiento de evento:', { 
            eventType, 
            eventData: {
                ...eventData,
                user: eventData.user ? { name: eventData.user.name } : null
            } 
        });
        try {
            this.ensureOpenAIClient();
            console.log('✅ AIService - Cliente OpenAI inicializado');

            // Verificar caché
            const cacheKey = this.generateCacheKey(eventType, eventData);
            console.log('[LOG 5] AIService - Cache key generada:', cacheKey);
            
            const cachedResponse = this.getCachedResponse(cacheKey);
            if (cachedResponse) {
                console.log('[LOG 6] AIService - Respuesta encontrada en caché');
                onComplete?.(cachedResponse);
                return cachedResponse;
            }
            console.log('[LOG 7] AIService - No se encontró respuesta en caché');

            // Preparar el mensaje para la IA
            const message = this.formatEventForAI(eventType, eventData);
            console.log('[LOG 8] AIService - Mensaje formateado para IA:', message);
            
            // Añadir el mensaje al historial
            this.addToHistory('user', message);
            console.log('[LOG 9] AIService - Mensaje añadido al historial');

            // Obtener la configuración actual
            const config = getCurrentConfig();
            console.log('[LOG 10] AIService - Configuración actual:', {
                model: config.models.chat,
                temperature: config.defaultParams.temperature,
                max_tokens: config.defaultParams.max_tokens
            });

            // Generar la respuesta
            console.log('[LOG 11] AIService - Iniciando generación de respuesta');
            const response = await this.generateStreamingResponse(config, onStream);
            console.log('[LOG 12] AIService - Respuesta generada:', {
                length: response.length,
                first50Chars: response.slice(0, 50)
            });

            // Añadir la respuesta al historial
            this.addToHistory('assistant', response);
            console.log('[LOG 13] AIService - Respuesta añadida al historial');

            // Cachear la respuesta
            this.cacheResponse(cacheKey, response);
            console.log('[LOG 14] AIService - Respuesta almacenada en caché');

            // Notificar completación
            onComplete?.(response);
            console.log('[LOG 15] AIService - Procesamiento completado exitosamente');

            return response;

        } catch (error) {
            if (error instanceof Error) {
                console.error('[ERROR] AIService - Error procesando evento:', {
                    error: error.message,
                    stack: error.stack
                });
            } else {
                console.error('[ERROR] AIService - Error desconocido procesando evento:', error);
            }
            throw error;
        }
    }

    private formatEventForAI(eventType: string, eventData: any): string {
        switch (eventType) {
            case 'CHAT':
                return `User "${eventData.user.name}" says: ${eventData.message}`;
            case 'GIFT':
                return `User "${eventData.user.name}" sent a gift: ${eventData.giftName}`;
            case 'FOLLOW':
                return `User "${eventData.user.name}" started following`;
            default:
                return `Event ${eventType} received with data: ${JSON.stringify(eventData)}`;
        }
    }

    private async generateStreamingResponse(
        config: OpenAIConfigType, 
        onStream?: StreamCallback
    ): Promise<string> {
        try {
            let fullResponse = '';
            console.log('[LOG 16] AIService - Creando stream de respuesta');
            
            const stream = await this.openai.chat.completions.create({
                model: config.models.chat,
                messages: this.messageHistory,
                temperature: config.defaultParams.temperature,
                max_tokens: config.defaultParams.max_tokens,
                top_p: config.defaultParams.top_p,
                frequency_penalty: config.defaultParams.frequency_penalty,
                presence_penalty: config.defaultParams.presence_penalty,
                stream: true
            });

            let chunkCount = 0;
            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content || '';
                if (content) {
                    fullResponse += content;
                    onStream?.(content);
                    chunkCount++;
                }
            }

            console.log('[LOG 17] AIService - Stream completado', {
                totalChunks: chunkCount,
                totalLength: fullResponse.length
            });

            return fullResponse || 'No response generated';

        } catch (error) {
            if (error instanceof Error) {
                console.error('[ERROR] AIService - Error generando respuesta:', {
                    error: error.message,
                    stack: error.stack
                });
            } else {
                console.error('[ERROR] AIService - Error desconocido generando respuesta:', error);
            }
            throw error;
        }
    }

    private generateCacheKey(eventType: string, eventData: any): string {
        return `${eventType}-${JSON.stringify(eventData)}`;
    }

    private getCachedResponse(key: string): string | null {
        const cached = this.responseCache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
            return cached.text;
        }
        return null;
    }

    private cacheResponse(key: string, text: string): void {
        this.responseCache.set(key, {
            text,
            timestamp: Date.now()
        });

        // Limpiar caché antiguo
        this.cleanCache();
    }

    private cleanCache(): void {
        const now = Date.now();
        for (const [key, value] of this.responseCache.entries()) {
            if (now - value.timestamp > this.cacheTTL) {
                this.responseCache.delete(key);
            }
        }
    }

    private addToHistory(role: 'user' | 'assistant' | 'system', content: string): void {
        this.messageHistory.push({ role, content });
        
        if (this.messageHistory.length > this.maxHistoryLength + 1) {
            this.messageHistory = [
                this.messageHistory[0],
                ...this.messageHistory.slice(-this.maxHistoryLength)
            ];
        }
    }

    public updateConfig(newConfig: Partial<OpenAIConfigType>): void {
        console.log('[LOG 18] AIService - Actualizando configuración:', newConfig);
        updateOpenAIConfig(newConfig);
        this.initializeHistory();
        console.log('[LOG 19] AIService - Configuración actualizada e historial reiniciado');
    }

    public clearHistory(): void {
        this.initializeHistory();
    }

    public getMessageHistory(): Array<{ role: 'user' | 'assistant' | 'system', content: string }> {
        return [...this.messageHistory];
    }
}

export const aiService = AIService.getInstance();
