export interface Voice {
    voice_id: string;
    name: string;
    preview_url: string | undefined;
    category: string;
}

export interface VoiceSettings {
    stability: number;
    similarity_boost: number;
    style: number;
    use_speaker_boost: boolean;
}

export interface TextToSpeechRequest {
    text: string;
    voice_settings: VoiceSettings;
    model_id: string;
}

export interface ElevenLabsConfig {
    apiKey: string;
    voiceId: string;
    voiceSettings: VoiceSettings;
}
