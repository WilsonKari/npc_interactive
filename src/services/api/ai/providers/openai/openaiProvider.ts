import { getCurrentConfig } from '../../config/openai/config';
import { OpenAIConfigType } from '../../config/openai/types';

export class OpenAIError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'OpenAIError';
    }
}

export class OpenAIProvider {
    private apiKey: string;

    constructor() {
        this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    }

    private async makeRequest(endpoint: string, options: RequestInit = {}) {
        const response = await fetch(endpoint, {
            ...options,
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            throw new OpenAIError(
                `Error en la solicitud: ${response.status} ${response.statusText}`
            );
        }

        return response;
    }

    async generateResponse(input: string): Promise<string> {
        try {
            const config: OpenAIConfigType = getCurrentConfig();
            const endpoint = 'https://api.openai.com/v1/chat/completions';

            const response = await this.makeRequest(endpoint, {
                method: 'POST',
                body: JSON.stringify({
                    model: config.models.chat,
                    messages: [
                        {
                            role: "system",
                            content: config.npcPersonality.customInstructions || 
                                    `Eres ${config.npcPersonality.name}, ${config.npcPersonality.role}. ${config.npcPersonality.personality}`
                        },
                        {
                            role: "user",
                            content: input
                        }
                    ],
                    temperature: config.defaultParams.temperature,
                    max_tokens: config.defaultParams.max_tokens,
                    top_p: config.defaultParams.top_p,
                    frequency_penalty: config.defaultParams.frequency_penalty,
                    presence_penalty: config.defaultParams.presence_penalty
                })
            });

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            throw new OpenAIError(
                `Error generando respuesta: ${error instanceof Error ? error.message : 'Error desconocido'}`
            );
        }
    }
}

export default OpenAIProvider;