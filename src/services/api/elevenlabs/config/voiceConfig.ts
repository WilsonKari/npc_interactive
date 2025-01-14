import { DEFAULT_ELEVENLABS_CONFIG } from './defaults';
import { ElevenLabsConfig, Voice, VoiceSettings } from './types';

let currentConfig: ElevenLabsConfig = { ...DEFAULT_ELEVENLABS_CONFIG };

export const updateVoiceConfig = (newConfig: Partial<ElevenLabsConfig>): void => {
    currentConfig = {
        ...currentConfig,
        ...newConfig
    };
};

export const getCurrentConfig = (): ElevenLabsConfig => {
    return { ...currentConfig };
};

export const getVoicePreset = (presetName: string): Voice | undefined => {
    return currentConfig.voicePresets[presetName];
};

export const getVoiceSettings = (presetName: string): VoiceSettings => {
    const preset = getVoicePreset(presetName);
    return preset?.settings || currentConfig.defaultSettings;
};

export const getApiEndpoint = (path: string): string => {
    return `${currentConfig.baseUrl}/${currentConfig.version}/${path}`;
};
