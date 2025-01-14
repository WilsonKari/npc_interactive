export interface VoiceSettings {
    stability: number;
    similarity_boost: number;
    style: number;
    use_speaker_boost: boolean;
}

export interface Voice {
    voice_id: string;
    name: string;
    category: string;
    description?: string;
    preview_url?: string;
    settings?: VoiceSettings;
}

export interface ElevenLabsConfig {
    apiKey: string;
    defaultVoiceId: string;
    defaultSettings: VoiceSettings;
    voicePresets: Record<string, Voice>;
    baseUrl: string;
    version: string;
}

export interface TextToSpeechRequest {
    text: string;
    voice_id?: string;
    voice_settings?: VoiceSettings;
    model_id?: string;
}

export interface TextToSpeechResponse {
    audio: ArrayBuffer;
    metadata?: {
        text: string;
        voice_id: string;
        audio_duration: number;
    };
}

export enum VoiceCategory {
    CLONED = 'cloned',
    PREMADE = 'premade',
    GENERATED = 'generated'
}
