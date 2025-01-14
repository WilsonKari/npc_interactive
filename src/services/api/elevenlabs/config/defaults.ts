import { ElevenLabsConfig, VoiceSettings, VoiceCategory } from './types';

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
    stability: 0.75,
    similarity_boost: 0.75,
    style: 0.5,
    use_speaker_boost: true
};

// Configuración por defecto para ElevenLabs
export const DEFAULT_ELEVENLABS_CONFIG: ElevenLabsConfig = {
    apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY || '',
    defaultVoiceId: 'josh', // ID de voz por defecto
    defaultSettings: DEFAULT_VOICE_SETTINGS,
    baseUrl: 'https://api.elevenlabs.io',
    version: 'v1',
    voicePresets: {
        // Voces predefinidas para diferentes personalidades
        entertainer: {
            voice_id: 'josh',
            name: 'Entertainer Voice',
            category: VoiceCategory.PREMADE,
            description: 'Voz energética y carismática para streamers',
            settings: {
                ...DEFAULT_VOICE_SETTINGS,
                style: 0.8 // Más expresiva
            }
        },
        educator: {
            voice_id: 'adam',
            name: 'Educator Voice',
            category: VoiceCategory.PREMADE,
            description: 'Voz clara y profesional para educación',
            settings: {
                ...DEFAULT_VOICE_SETTINGS,
                stability: 0.9 // Más estable
            }
        },
        socializer: {
            voice_id: 'rachel',
            name: 'Socializer Voice',
            category: VoiceCategory.PREMADE,
            description: 'Voz amigable y social para influencers',
            settings: {
                ...DEFAULT_VOICE_SETTINGS,
                similarity_boost: 0.8 // Más natural
            }
        },
        mystic: {
            voice_id: 'bella',
            name: 'Mystic Voice',
            category: VoiceCategory.PREMADE,
            description: 'Voz misteriosa y etérea',
            settings: {
                ...DEFAULT_VOICE_SETTINGS,
                stability: 0.6, // Más variada
                style: 0.9 // Más dramática
            }
        }
    }
};
