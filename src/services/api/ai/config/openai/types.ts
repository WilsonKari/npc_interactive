// Enums base
export enum OpenAIModel {
    GPT4 = 'gpt-4',
    GPT4_MINI = 'gpt-4-mini',
    GPT4_PREVIEW = 'gpt-4-1106-preview'
}

export enum SystemLanguage {
    SPANISH = 'es',
    ENGLISH = 'en',
    AUTO = 'auto'
}

// Interfaces base del NPC
export interface NPCPersonality {
    name: string;
    role: string;
    personality: string;
    baseLanguage: SystemLanguage;
    tone: string;
    customInstructions?: string;
}

export interface NPCCharacteristics {
    age: number | 'variable';
    background: string;
    interests: string[] | {
        primary: string[];
        situational: string[];
    };
    expertise: string[];
    catchphrases: string[] | {
        common: string[];
        rare: string[];
        contextual: string[];
    };
    mood: {
        default: string;
        variations: string[];
        adaptiveMode: boolean;
    };
}

// Interfaces de configuración de comportamiento
export interface InteractionRules {
    maxResponseLength: number | {
        default: number;
        dynamic: boolean;
        range: {min: number; max: number};
    };
    emojiPolicy: 'mirror' | 'never' | 'always' | 'adaptive' | 'subtle' | 'contextual';
    formalityLevel: 'casual' | 'semi-formal' | 'formal' | 'dynamic';
    humorLevel: 'none' | 'subtle' | 'playful' | 'very-humorous' | 'adaptive';
    sarcasmAllowed: boolean | 'contextual';
}

export interface MemorySettings {
    userMemoryDuration: number | 'adaptive';
    contextRetention: 'short' | 'medium' | 'long' | 'dynamic';
    priorityUsers: string[] | {
        fixed: string[];
        temporary: string[];
        automatic: boolean;
    };
    topicMemory: boolean | {
        enabled: boolean;
        adaptiveTopics: boolean;
        forgetRate: 'fast' | 'medium' | 'slow' | 'contextual';
    };
}

export interface EmotionalResponses {
    giftExcitement: 'mild' | 'moderate' | 'extreme' | 'variable';
    followersReaction: 'grateful' | 'excited' | 'ecstatic' | 'adaptive';
    negativeCommentPolicy: 'ignore' | 'deflect' | 'address' | 'contextual';
    emotionalRange: string[] | {
        base: string[];
        contextual: string[];
        intensity: 'fixed' | 'dynamic';
    };
    reactionIntensity: {
        default: 'low' | 'medium' | 'high';
        dynamic: boolean;
    };
}

export interface StreamSettings {
    streamType: 'gaming' | 'chatting' | 'educational' | 'performance' | 'mixed';
    audienceAge: 'all' | 'kids' | 'teens' | 'adults' | 'adaptive';
    contentGuidelines: 'family-friendly' | 'mature' | 'professional' | 'dynamic';
    energyLevel: 'calm' | 'moderate' | 'high-energy' | 'adaptive' | {
        base: 'calm' | 'moderate' | 'high-energy';
        dynamic: boolean;
        factors: {
            viewerCount: boolean;
            timeOfDay: boolean;
            eventIntensity: boolean;
        };
    };
    crowdReadingEnabled: boolean;
}

export interface PersonalityVariations {
    timeBasedPersonality?: {
        morning: string;
        afternoon: string;
        evening: string;
        dynamic: boolean;
    };
    viewerCountBased?: {
        lowViewers: string;
        mediumViewers: string;
        highViewers: string;
        adaptiveThresholds: boolean;
    };
    eventBased?: {
        specialEvents: string;
        celebrations: string;
        challenges: string;
        intensity: 'fixed' | 'adaptive';
    };
    moodSwings?: {
        enabled: boolean;
        intensity: 'subtle' | 'moderate' | 'dramatic' | 'contextual';
        triggers: string[];
    };
    audienceAdaptation?: {
        enabled: boolean;
        factors: {
            engagement: boolean;
            sentiment: boolean;
            demographicMix: boolean;
        };
    };
}

// Configuración principal de OpenAI
export interface OpenAIConfigType {
    apiKey: string;
    organization?: string;
    models: {
        chat: OpenAIModel;
        completion: OpenAIModel;
        default: OpenAIModel;
    };
    defaultParams: {
        temperature: number;
        max_tokens: number;
        top_p: number;
        frequency_penalty: number;
        presence_penalty: number;
    };
    npcPersonality: NPCPersonality;
    characteristics: NPCCharacteristics;
    interactionRules: InteractionRules;
    memorySettings: MemorySettings;
    emotionalResponses: EmotionalResponses;
    streamSettings: StreamSettings;
    personalityVariations: PersonalityVariations;
}

// Error personalizado
export class OpenAIConfigError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'OpenAIConfigError';
    }
}