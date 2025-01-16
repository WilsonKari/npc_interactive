import { BaseEventFilter } from '../eventConditions';

// Interfaces auxiliares para una mejor organización
interface UserBadgeRequirements {
    requiredTypes?: string[];        // Tipos específicos de badges requeridos
    minimumLevel?: number;           // Nivel mínimo de badge requerido
    excludedTypes?: string[];        // Tipos de badges a excluir
}

interface FollowRequirements {
    minFollowerCount?: number;       // Mínimo número de seguidores
    minFollowingCount?: number;      // Mínimo número de seguidos
    requireFollowing?: boolean;      // Requerir que el usuario siga al streamer
    minimumFollowRole?: number;      // Rol mínimo de seguidor (0: no sigue, 1: sigue, 2: amigo)
}

interface UserRoleRequirements {
    allowModerators?: boolean;       // Permitir mensajes de moderadores
    allowSubscribers?: boolean;      // Permitir mensajes de suscriptores
    allowNewGifters?: boolean;       // Permitir mensajes de nuevos gifters
    minTopGifterRank?: number;       // Rango mínimo de gifter requerido
}

interface MessageRequirements {
    minLength: number;               // Longitud mínima del mensaje
    maxLength: number;               // Longitud máxima del mensaje
    bannedWords: string[];           // Palabras prohibidas
    requiredWords?: string[];        // Palabras requeridas
    spamThreshold: number;           // Número máximo de mensajes similares permitidos
    messageInterval: number;         // Intervalo mínimo entre mensajes (ms)
    languageFilter?: string[];       // Filtro de idiomas permitidos
}

interface ModerationSettings {
    requireApproval: boolean;        // Requerir aprobación de moderador
    autoModeration: boolean;         // Usar moderación automática
    sensitivityLevel: 'low' | 'medium' | 'high'; // Nivel de sensibilidad
}

interface PriorityMultipliers {
    subscriberMultiplier: number;    // Multiplicador para suscriptores
    moderatorMultiplier: number;     // Multiplicador para moderadores
    gifterMultiplier: number;        // Multiplicador para gifters
    followRoleMultiplier: number;    // Multiplicador basado en rol de seguidor
}

// Interfaz para el evento de chat
export interface ChatEvent {
    comment: string;
    userId: string;
    uniqueId: string;
    nickname: string;
    followRole: number;
    userBadges: Array<{
        type: string;
        name: string;
        level: number;
    }>;
    followInfo: {
        followingCount: number;
        followerCount: number;
        followStatus: number;
    };
    isModerator: boolean;
    isNewGifter: boolean;
    isSubscriber: boolean;
    topGifterRank: number;
    msgId: string;
    createTime: number;
}

// Interfaz principal para el filtro de chat que extiende BaseEventFilter
export interface ChatEventFilter extends BaseEventFilter {
    messageRequirements: MessageRequirements;
    userRoleRequirements: UserRoleRequirements;
    followRequirements?: FollowRequirements;
    badgeRequirements?: UserBadgeRequirements;
    moderationSettings: ModerationSettings;
    priorityMultipliers: PriorityMultipliers;
}

// Configuración por defecto para el filtro de chat
export const defaultChatFilter: ChatEventFilter = {
    // Configuración base heredada de BaseEventFilter
    enabled: true,
    priority: 1,
    cooldown: 1000,

    // Requisitos del mensaje
    messageRequirements: {
        minLength: 2,
        maxLength: 200,
        bannedWords: [],
        spamThreshold: 3,
        messageInterval: 1000,
        languageFilter: ['es', 'en']
    },

    // Requisitos de rol de usuario
    userRoleRequirements: {
        allowModerators: true,
        allowSubscribers: true,
        allowNewGifters: true,
        minTopGifterRank: 0
    },

    // Requisitos de seguidor
    followRequirements: {
        minFollowerCount: 0,
        minFollowingCount: 0,
        requireFollowing: false,
        minimumFollowRole: 0
    },

    // Requisitos de badges
    badgeRequirements: {
        requiredTypes: [],
        minimumLevel: 0,
        excludedTypes: []
    },

    // Configuración de moderación
    moderationSettings: {
        requireApproval: false,
        autoModeration: true,
        sensitivityLevel: 'medium'
    },

    // Multiplicadores de prioridad
    priorityMultipliers: {
        subscriberMultiplier: 1.5,
        moderatorMultiplier: 2.0,
        gifterMultiplier: 1.3,
        followRoleMultiplier: 1.2
    }
};

// Función para validar un mensaje de chat
export function validateChatMessage(
    message: ChatEvent,
    filter: ChatEventFilter
): { isValid: boolean; priority: number; reason?: string } {
    // LOG 2: Validación inicial del mensaje
    console.log('[LOG 2] Validando mensaje:', {
        userId: message.userId,
        comment: message.comment.substring(0, 50), // Mostrar primeros 50 caracteres
        timestamp: Date.now()
    });
    
    // Si no hay filtros activos, permitir todos los mensajes
    if (!filter.enabled || 
        (!filter.messageRequirements.bannedWords.length &&
         !filter.userRoleRequirements.allowModerators &&
         !filter.userRoleRequirements.allowSubscribers &&
         !filter.userRoleRequirements.allowNewGifters &&
         !filter.followRequirements?.requireFollowing)) {
        return { isValid: true, priority: filter.priority };
    }

    // Validar longitud del mensaje solo si hay configuraciones específicas
    if (filter.messageRequirements.minLength > 0 && 
        message.comment.length < filter.messageRequirements.minLength) {
        return { isValid: false, priority: 0, reason: 'Message too short' };
    }
    if (filter.messageRequirements.maxLength > 0 && 
        message.comment.length > filter.messageRequirements.maxLength) {
        return { isValid: false, priority: 0, reason: 'Message too long' };
    }

    // Validar palabras prohibidas solo si hay palabras configuradas
    if (filter.messageRequirements.bannedWords.length > 0 &&
        filter.messageRequirements.bannedWords.some(word => 
        message.comment.toLowerCase().includes(word.toLowerCase()))) {
        return { isValid: false, priority: 0, reason: 'Contains banned words' };
    }

    // Validar roles de usuario solo si hay restricciones configuradas
    if (message.isModerator && 
        filter.userRoleRequirements.allowModerators === false) {
        return { isValid: false, priority: 0, reason: 'Moderators not allowed' };
    }
    if (message.isSubscriber && 
        filter.userRoleRequirements.allowSubscribers === false) {
        return { isValid: false, priority: 0, reason: 'Subscribers not allowed' };
    }

    // Validar requisitos de seguidor solo si están configurados
    if (filter.followRequirements) {
        if (filter.followRequirements.requireFollowing && message.followRole === 0) {
            return { isValid: false, priority: 0, reason: 'Must be following' };
        }
        if (filter.followRequirements.minFollowerCount !== undefined && 
            filter.followRequirements.minFollowerCount > 0 &&
            message.followInfo.followerCount < filter.followRequirements.minFollowerCount) {
            return { isValid: false, priority: 0, reason: 'Insufficient followers' };
        }
    }

    // Calcular prioridad base en los multiplicadores
    let finalPriority = filter.priority;
    
    if (message.isSubscriber) {
        finalPriority *= filter.priorityMultipliers.subscriberMultiplier;
    }
    if (message.isModerator) {
        finalPriority *= filter.priorityMultipliers.moderatorMultiplier;
    }
    if (message.topGifterRank > 0) {
        finalPriority *= filter.priorityMultipliers.gifterMultiplier;
    }
    if (message.followRole > 0) {
        finalPriority *= filter.priorityMultipliers.followRoleMultiplier;
    }

    return { 
        isValid: true, 
        priority: finalPriority 
    };
}
