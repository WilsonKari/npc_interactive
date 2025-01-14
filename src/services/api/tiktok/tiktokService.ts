import { io, Socket } from 'socket.io-client';
import { TIKTOK_SOCKET_CONFIG } from './tiktokConfig';

class TikTokService {
    private socket: Socket | null = null;
    private static instance: TikTokService;

    private constructor() {
        this.initializeSocket();
        this.reconnect(); // Conectar explícitamente
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
            autoConnect: false  // Cambiado a false para mejor control
        });

        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        if (!this.socket) return;

        // Eventos de conexión básica
        this.socket.on(TIKTOK_SOCKET_CONFIG.EVENTS.CONNECT, () => {
            console.log('Conectado al servidor de TikTok');
        });

        this.socket.on(TIKTOK_SOCKET_CONFIG.EVENTS.DISCONNECT, () => {
            console.log('Desconectado del servidor de TikTok');
        });

        this.socket.on(TIKTOK_SOCKET_CONFIG.EVENTS.ERROR, (error) => {
            console.error('Error en la conexión:', error);
        });

        // Eventos de chat y mensajes
        this.socket.on(TIKTOK_SOCKET_CONFIG.EVENTS.CHAT_MESSAGE, (data) => {
            console.log('Mensaje de chat recibido:', data);
        });

        this.socket.on(TIKTOK_SOCKET_CONFIG.EVENTS.EMOTE, (data) => {
            console.log('Emote recibido:', data);
        });

        // Eventos de regalos y monetización
        this.socket.on(TIKTOK_SOCKET_CONFIG.EVENTS.GIFT, (data) => {
            console.log('Regalo recibido:', data);
        });

        this.socket.on(TIKTOK_SOCKET_CONFIG.EVENTS.ENVELOPE, (data) => {
            console.log('Sobre especial recibido:', data);
        });

        this.socket.on(TIKTOK_SOCKET_CONFIG.EVENTS.SUBSCRIBE, (data) => {
            console.log('Nueva suscripción:', data);
        });

        // Eventos de interacción
        this.socket.on(TIKTOK_SOCKET_CONFIG.EVENTS.LIKE, (data) => {
            console.log('Like recibido:', data);
        });

        this.socket.on(TIKTOK_SOCKET_CONFIG.EVENTS.SHARE, (data) => {
            console.log('Stream compartido:', data);
        });

        this.socket.on(TIKTOK_SOCKET_CONFIG.EVENTS.FOLLOW, (data) => {
            console.log('Nuevo seguidor:', data);
        });

        // Eventos de sala y usuarios
        this.socket.on(TIKTOK_SOCKET_CONFIG.EVENTS.MEMBER, (data) => {
            console.log('Nuevo miembro:', data);
        });

        this.socket.on(TIKTOK_SOCKET_CONFIG.EVENTS.ROOM_USER, (data) => {
            console.log('Información de usuario en sala:', data);
        });

        // Eventos de preguntas y batallas
        this.socket.on(TIKTOK_SOCKET_CONFIG.EVENTS.QUESTION_NEW, (data) => {
            console.log('Nueva pregunta:', data);
        });

        this.socket.on(TIKTOK_SOCKET_CONFIG.EVENTS.LINK_MIC_BATTLE, (data) => {
            console.log('Batalla de micrófono:', data);
        });

        this.socket.on(TIKTOK_SOCKET_CONFIG.EVENTS.LINK_MIC_ARMIES, (data) => {
            console.log('Ejércitos en batalla:', data);
        });

        // Otros eventos
        this.socket.on(TIKTOK_SOCKET_CONFIG.EVENTS.LIVE_INTRO, (data) => {
            console.log('Introducción en vivo:', data);
        });
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

    // Método para suscribirse a eventos específicos
    public subscribe<T>(event: string, callback: (data: T) => void): void {
        this.socket?.on(event, callback);
    }

    // Método para cancelar suscripción a eventos
    public unsubscribe(event: string): void {
        this.socket?.off(event);
    }
}

export const tiktokService = TikTokService.getInstance();