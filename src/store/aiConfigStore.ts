import { create } from 'zustand';
import { VoiceSettings } from '../services/api/elevenlabs/types';

interface AIConfigState {
    // ElevenLabs Configuration
    elevenLabsApiKey: string;
    customVoiceId: string;
    selectedVoicePreset: VoiceSettings;
    setElevenLabsApiKey: (key: string) => void;
    setCustomVoiceId: (id: string) => void;
    setSelectedVoicePreset: (settings: VoiceSettings) => void;
}

const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
    stability: 0.5,
    similarity_boost: 0.75,
    style: 0,
    use_speaker_boost: true
};

export const useAIConfigStore = create<AIConfigState>((set) => ({
    // ElevenLabs Configuration
    elevenLabsApiKey: import.meta.env.VITE_ELEVENLABS_API_KEY || '',
    customVoiceId: 'CwhRBWXzGAHq8TQ4Fs17',
    selectedVoicePreset: DEFAULT_VOICE_SETTINGS,
    
    setElevenLabsApiKey: (key: string) => set({ elevenLabsApiKey: key }),
    setCustomVoiceId: (id: string) => set({ customVoiceId: id }),
    setSelectedVoicePreset: (settings: VoiceSettings) => set({ selectedVoicePreset: settings })
}));
