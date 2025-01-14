export * from './config/types';
export * from './config/defaults';
export * from './config/voiceConfig';
export * from './providers/elevenlabsProvider';

// Re-exportar las funciones y tipos más comunes para facilitar su uso
export { 
    ElevenLabsProvider,
    ElevenLabsError 
} from './providers/elevenlabsProvider';

export { 
    getCurrentConfig,
    getVoicePreset,
    getVoiceSettings 
} from './config/voiceConfig';

export { 
    DEFAULT_VOICE_SETTINGS,
    DEFAULT_ELEVENLABS_CONFIG 
} from './config/defaults';
