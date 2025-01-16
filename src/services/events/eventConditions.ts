// Interfaz base para todos los filtros de eventos
export interface BaseEventFilter {
    enabled: boolean;                 // Switch general para activar/desactivar el evento
    priority: number;                 // Prioridad base del evento
    cooldown: number;                 // Tiempo de espera entre eventos
    minUserLevel?: number;            // Nivel mínimo de usuario requerido
    maxProcessingTime?: number;       // Tiempo máximo de procesamiento
}

// Interfaz para la configuración global de eventos
export interface GlobalEventConfig {
    maxEventsPerMinute: number;
    defaultCooldown: number;
    defaultPriority: number;
    enabledEvents: string[];
    logLevel: 'debug' | 'info' | 'warn' | 'error';
}

// Interfaz para la configuración de un filtro de eventos
export interface EventFilterConfig {
    enabled: boolean;
    priority: number;
    cooldown: number;
}

// Clase singleton para gestionar los filtros de eventos
export class EventFilterManager {
    private static instance: EventFilterManager;
    private filters: Map<EventType, BaseEventFilter> = new Map();
    private config: EventFilterConfig = {
        enabled: true,
        priority: 1,
        cooldown: 1000
    };

    private constructor() {
        // Inicialización del manager
    }

    static getInstance(): EventFilterManager {
        if (!EventFilterManager.instance) {
            EventFilterManager.instance = new EventFilterManager();
        }
        return EventFilterManager.instance;
    }

    public addFilter(eventType: EventType, filter: BaseEventFilter): void {
        this.filters.set(eventType, filter);
    }

    public getFilter(eventType: EventType): BaseEventFilter | undefined {
        return this.filters.get(eventType);
    }

    public updateFilter(eventType: EventType, updates: Partial<BaseEventFilter>): void {
        const currentFilter = this.filters.get(eventType);
        if (currentFilter) {
            this.filters.set(eventType, { ...currentFilter, ...updates });
        }
    }

    public getConfig(): EventFilterConfig {
        return { ...this.config };
    }

    public updateConfig(updates: Partial<EventFilterConfig>): void {
        this.config = { ...this.config, ...updates };
    }
}

// Tipos de eventos soportados
export enum EventType {
    CHAT = 'chat',
    GIFT = 'gift',
    LIKE = 'like',
    FOLLOW = 'follow',
    SHARE = 'share',
    QUESTION = 'questionNew',
    LINK_MIC_BATTLE = 'linkMicBattle',
    LINK_MIC_ARMIES = 'linkMicArmies',
    LIVE_INTRO = 'liveIntro',
    EMOTE = 'emote',
    ENVELOPE = 'envelope',
    SUBSCRIBE = 'subscribe',
    ROOM_USER = 'roomUser',
    MEMBER = 'member'
}