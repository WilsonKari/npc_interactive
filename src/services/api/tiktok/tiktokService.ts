// src/services/api/tiktok/tiktokService.ts
import { io, Socket } from 'socket.io-client';
import { TIKTOK_SOCKET_CONFIG } from './tiktokConfig';
import { EventFilterManager, EventType } from '../../../services/events/eventConditions';
import { ChatEvent, validateChatMessage, ChatEventFilter } from '../../../services/events/conditions/chatConditions';
import { ProcessedEvent, EventProcessor } from '../../../services/events/eventProcessor';

class TikTokService {
    private socket: Socket | null = null;
    private static instance: TikTokService;
    private filterManager: EventFilterManager;

    private constructor() {
        this.filterManager = EventFilterManager.getInstance();
        this.initializeSocket();
        this.reconnect();
    }

    public static getInstance(): TikTokService {
        if (!TikTokService.instance) {
            TikTokService.instance = new TikTokService();
        }
        return TikTokService.instance;
    }

    private initializeSocket(): void {
        this.socket = io(TIKTOK_SOCKET_CONFIG.SERVER_URL, {
            reconnectionAttempts: TIKTOK_SOCKET_CONFIG.RECONNECTION_ATTEMPTS,
            reconnectionDelay: TIKTOK_SOCKET_CONFIG.RECONNECTION_DELAY,
            autoConnect: false
        });

        this.setupEventListeners();
    }

    private processEvent<T>(eventType: EventType, data: T): boolean {
        //console.log('🔍 TikTokService - processEvent:', { eventType, data });
        // Obtener el filtro para este tipo de evento
        const filter = this.filterManager.getFilter(eventType);
        
        // Si no hay filtro configurado, permitir el evento
        if (!filter) {
            return true;
        }

        // Si el filtro está deshabilitado, permitir el evento
        if (!filter.enabled) {
            return true;
        }

        // Aplicar filtros específicos según el tipo de evento
        switch (eventType) {
            case EventType.CHAT:
                const chatValidation = validateChatMessage(data as unknown as ChatEvent, filter as ChatEventFilter);
                return chatValidation.isValid;
            // Aquí se añadirían más casos para otros tipos de eventos
            default:
                return true; // Por defecto, permitir el evento si no hay filtro específico
        }
    }

    private createProcessedChatEvent(data: any): ProcessedEvent<ChatEvent> {
        return {
            type: EventType.CHAT,
            data: {
                comment: data.comment,
                userId: data.userId,
                uniqueId: data.uniqueId,
                nickname: data.nickname,
                followRole: data.followRole || 0,
                userBadges: data.userBadges || [],
                followInfo: {
                    followingCount: data.followInfo?.followingCount || 0,
                    followerCount: data.followInfo?.followerCount || 0,
                    followStatus: data.followInfo?.followStatus || 0
                },
                isModerator: data.isModerator || false,
                isNewGifter: data.isNewGifter || false,
                isSubscriber: data.isSubscriber || false,
                topGifterRank: data.topGifterRank || 0,
                msgId: data.msgId || `msg_${Date.now()}`,
                createTime: data.createTime || Date.now()
            },
            timestamp: Date.now(),
            priority: 1,
            metadata: {
                contextId: `chat_${Date.now()}`,
                processingAttempts: 0
            }
        };
    }

    private setupEventListeners(): void {
        if (!this.socket) return;

        // Eventos de conexión básica
        this.socket.on(TIKTOK_SOCKET_CONFIG.EVENTS.CONNECT, () => {
            console.log('✅ Conectado al servidor de TikTok');
        });

        this.socket.on(TIKTOK_SOCKET_CONFIG.EVENTS.DISCONNECT, () => {
            console.log('❌ Desconectado del servidor de TikTok');
            // Intentar reconexión automática
            this.reconnect();
        });

        this.socket.on(TIKTOK_SOCKET_CONFIG.EVENTS.ERROR, (error) => {
            console.error('🔴 Error en la conexión:', error);
        });

        // Eventos de chat y mensajes
        this.socket.on(TIKTOK_SOCKET_CONFIG.EVENTS.CHAT_MESSAGE, (data) => {
            // LOG 1: Mensaje recibido desde TikTok
            console.log('[LOG 1] Mensaje recibido desde TikTok:', {
                userId: data.userId,
                comment: data.comment,
                timestamp: Date.now()
            });
            
            // Validación inicial del evento
            if (this.processEvent(EventType.CHAT, data)) {
                try {
                    // Crear evento procesado con toda la información necesaria
                    const processedEvent = this.createProcessedChatEvent(data);
                    console.log('✨ TikTokService - Evento procesado:', processedEvent);

                    // Enviar al EventProcessor usando el patrón Singleton
                    const eventProcessor = EventProcessor.getInstance();
                    eventProcessor.addEvent(processedEvent);
                    console.log('✅ TikTokService - Evento enviado a eventProcessor');
                } catch (error) {
                    console.error('❌ Error procesando evento de chat:', error);
                }
            } else {
                console.log('⚠️ Evento no pasó la validación inicial');
            }
        });

        this.socket.on(TIKTOK_SOCKET_CONFIG.EVENTS.EMOTE, (data) => {
            if (this.processEvent(EventType.EMOTE, data)) {
                // console.log('Emote recibido:', data);
            }
        });

        // Eventos de regalos y monetización
        this.socket.on(TIKTOK_SOCKET_CONFIG.EVENTS.GIFT, (data) => {
            if (this.processEvent(EventType.GIFT, data)) {
                // console.log('Regalo recibido:', data);
            }
        });

        this.socket.on(TIKTOK_SOCKET_CONFIG.EVENTS.ENVELOPE, (data) => {
            if (this.processEvent(EventType.ENVELOPE, data)) {
                // console.log('Sobre especial recibido:', data);
            }
        });

        this.socket.on(TIKTOK_SOCKET_CONFIG.EVENTS.SUBSCRIBE, (data) => {
            if (this.processEvent(EventType.SUBSCRIBE, data)) {
                // console.log('Nueva suscripción:', data);
            }
        });

        // Eventos de interacción
        this.socket.on(TIKTOK_SOCKET_CONFIG.EVENTS.LIKE, (data) => {
            if (this.processEvent(EventType.LIKE, data)) {
                // console.log('Like recibido:', data);
            }
        });

        this.socket.on(TIKTOK_SOCKET_CONFIG.EVENTS.SHARE, (data) => {
            if (this.processEvent(EventType.SHARE, data)) {
                // console.log('Stream compartido:', data);
            }
        });

        this.socket.on(TIKTOK_SOCKET_CONFIG.EVENTS.FOLLOW, (data) => {
            if (this.processEvent(EventType.FOLLOW, data)) {
                // console.log('Nuevo seguidor:', data);
            }
        });

        // Eventos de sala y usuarios
        this.socket.on(TIKTOK_SOCKET_CONFIG.EVENTS.MEMBER, (data) => {
            if (this.processEvent(EventType.MEMBER, data)) {
                // console.log('Nuevo miembro:', data);
            }
        });

        this.socket.on(TIKTOK_SOCKET_CONFIG.EVENTS.ROOM_USER, (data) => {
            if (this.processEvent(EventType.ROOM_USER, data)) {
                // console.log('Información de usuario en sala:', data);
            }
        });

        // Eventos de preguntas y batallas
        this.socket.on(TIKTOK_SOCKET_CONFIG.EVENTS.QUESTION_NEW, (data) => {
            if (this.processEvent(EventType.QUESTION, data)) {
                // console.log('Nueva pregunta:', data);
            }
        });

        this.socket.on(TIKTOK_SOCKET_CONFIG.EVENTS.LINK_MIC_BATTLE, (data) => {
            if (this.processEvent(EventType.LINK_MIC_BATTLE, data)) {
                // console.log('Batalla de micrófono:', data);
            }
        });

        this.socket.on(TIKTOK_SOCKET_CONFIG.EVENTS.LINK_MIC_ARMIES, (data) => {
            if (this.processEvent(EventType.LINK_MIC_ARMIES, data)) {
                // console.log('Ejércitos en batalla:', data);
            }
        });

        // Otros eventos
        this.socket.on(TIKTOK_SOCKET_CONFIG.EVENTS.LIVE_INTRO, (data) => {
            if (this.processEvent(EventType.LIVE_INTRO, data)) {
                // console.log('Introducción en vivo:', data);
            }
        });
    }

    // Métodos para gestionar filtros
    public setEventFilter(eventType: EventType, filter: any): void {
        this.filterManager.addFilter(eventType, filter);
    }

    public removeEventFilter(eventType: EventType): void {
        // Al remover un filtro, simplemente lo deshabilitamos
        this.filterManager.updateFilter(eventType, { enabled: false });
    }

    public getEventFilter(eventType: EventType): any {
        return this.filterManager.getFilter(eventType);
    }

    // Métodos públicos para interactuar con el socket
    public disconnect(): void {
        this.socket?.disconnect();
    }

    public reconnect(): void {
        if (this.socket && !this.socket.connected) {
            console.log('Intentando reconexión al servidor TikTok...');
            this.socket.connect();
        }
    }

    public isConnected(): boolean {
        return this.socket?.connected || false;
    }

    public subscribe<T>(event: string, callback: (data: T) => void): void {
        this.socket?.on(event, callback);
    }

    public unsubscribe(event: string): void {
        this.socket?.off(event);
    }
}

export const tiktokService = TikTokService.getInstance();
