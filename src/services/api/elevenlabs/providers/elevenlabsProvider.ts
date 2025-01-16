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
        console.log('[LOG 20] ElevenLabsProvider - Obteniendo lista de voces');
        try {
            console.log('[LOG 21] ElevenLabsProvider - Iniciando solicitud de voces');
            const response = await this.makeRequest('/voices');
            console.log('[LOG 22] ElevenLabsProvider - Respuesta recibida, procesando JSON');
            
            const data = await response.json();
            console.log('[LOG 23] ElevenLabsProvider - Voces obtenidas:', {
                count: data.voices?.length || 0
            });
            
            return data.voices;
        } catch (error) {
            if (error instanceof Error) {
                console.error('[ERROR] ElevenLabsProvider - Error obteniendo voces:', {
                    error: error.message,
                    stack: error.stack
                });
            } else {
                console.error('[ERROR] ElevenLabsProvider - Error desconocido obteniendo voces:', error);
            }
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
        console.log('[LOG 24] ElevenLabsProvider - Iniciando síntesis de voz', {
            textLength: text.length,
            voiceId,
            voiceSettings
        });
        
        try {
            const request: TextToSpeechRequest = {
                text,
                voice_settings: voiceSettings,
                model_id: this.modelId
            };

            console.log('[LOG 25] ElevenLabsProvider - Creando solicitud TTS', {
                modelId: this.modelId,
                textPreview: text.slice(0, 50) + (text.length > 50 ? '...' : '')
            });

            const response = await this.makeRequest(`/text-to-speech/${voiceId}`, {
                method: 'POST',
                body: JSON.stringify(request),
            });

            console.log('[LOG 26] ElevenLabsProvider - Respuesta recibida, procesando audio');
            const audioBlob = await response.blob();
            
            console.log('[LOG 27] ElevenLabsProvider - Audio generado', {
                size: audioBlob.size,
                type: audioBlob.type
            });

            const audioUrl = URL.createObjectURL(audioBlob);
            console.log('[LOG 28] ElevenLabsProvider - URL de audio creada:', {
                urlPreview: audioUrl.slice(0, 50) + '...'
            });

            return audioUrl;
        } catch (error) {
            if (error instanceof Error) {
                console.error('[ERROR] ElevenLabsProvider - Error sintetizando voz:', {
                    error: error.message,
                    stack: error.stack,
                    textPreview: text.slice(0, 50) + (text.length > 50 ? '...' : ''),
                    voiceId
                });
            } else {
                console.error('[ERROR] ElevenLabsProvider - Error desconocido sintetizando voz:', {
                    error,
                    textPreview: text.slice(0, 50) + (text.length > 50 ? '...' : ''),
                    voiceId
                });
            }
            throw new ElevenLabsError(
                `Error sintetizando voz: ${error instanceof Error ? error.message : 'Error desconocido'}`
            );
        }
    }
}

export default ElevenLabsProvider;
