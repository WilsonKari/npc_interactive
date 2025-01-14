export const TIKTOK_SOCKET_CONFIG = {
    SERVER_URL: 'http://localhost:8080',
    RECONNECTION_ATTEMPTS: 5,
    RECONNECTION_DELAY: 1000,
    EVENTS: {
        // Eventos de conexión básica
        CONNECT: 'connect',
        DISCONNECT: 'disconnect',
        ERROR: 'error',
        
        // Eventos específicos de TikTok
        CHAT_MESSAGE: 'chatMessage',
        GIFT: 'tiktokGift',
        LIKE: 'tiktokLike',
        MEMBER: 'tiktokMember',
        ROOM_USER: 'tiktokRoomUser',
        FOLLOW: 'tiktokFollow',
        SHARE: 'tiktokShare',
        QUESTION_NEW: 'tiktokQuestionNew',
        LINK_MIC_BATTLE: 'tiktokLinkMicBattle',
        LINK_MIC_ARMIES: 'tiktokLinkMicArmies',
        LIVE_INTRO: 'tiktokLiveIntro',
        EMOTE: 'tiktokEmote',
        ENVELOPE: 'tiktokEnvelope',
        SUBSCRIBE: 'tiktokSubscribe'
    }
} as const;