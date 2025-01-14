import { Voice, VoiceSettings, TextToSpeechRequest } from '../types';

export class ElevenLabsError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ElevenLabsError';
    }
}

export class ElevenLabsProvider {
    private apiKey: string;
    private baseUrl = 'https://api.elevenlabs.io/v1';
    private defaultVoiceId = 'CwhRBWXzGAHq8TQ4Fs17';
    private modelId = 'eleven_multilingual_v2';  // Usando el modelo multilingüe v2

    private defaultVoiceSettings: VoiceSettings = {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0,
        use_speaker_boost: true
    };

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    updateApiKey(newApiKey: string) {
        this.apiKey = newApiKey;
    }

    private async makeRequest(endpoint: string, options: RequestInit = {}) {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers: {
                'xi-api-key': this.apiKey,
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            throw new ElevenLabsError(
                `Error en la solicitud: ${response.status} ${response.statusText}`
            );
        }

        return response;
    }

    async getVoices(): Promise<Voice[]> {
        try {
            const response = await this.makeRequest('/voices');
            const data = await response.json();
            return data.voices;
        } catch (error) {
            throw new ElevenLabsError(
                `Error obteniendo voces: ${error instanceof Error ? error.message : 'Error desconocido'}`
            );
        }
    }

    async synthesizeSpeech(
        text: string,
        voiceId: string = this.defaultVoiceId,
        voiceSettings: VoiceSettings = this.defaultVoiceSettings
    ): Promise<string> {
        try {
            const request: TextToSpeechRequest = {
                text,
                voice_settings: voiceSettings,
                model_id: this.modelId  // Especificando el modelo multilingüe
            };

            const response = await this.makeRequest(`/text-to-speech/${voiceId}`, {
                method: 'POST',
                body: JSON.stringify(request),
            });

            const audioBlob = await response.blob();
            return URL.createObjectURL(audioBlob);
        } catch (error) {
            throw new ElevenLabsError(
                `Error sintetizando voz: ${error instanceof Error ? error.message : 'Error desconocido'}`
            );
        }
    }
}

export default ElevenLabsProvider;
