import OpenAI from 'openai';
import { OpenAIConfigType, OpenAIConfigError } from './types';
import { NPCTemplateType, getTemplate } from './templates';
import { generateSystemPrompt } from './prompt';
import { DEFAULT_OPENAI_CONFIG } from './defaults';

// Estado actual de la configuración
let currentConfig: OpenAIConfigType = { ...DEFAULT_OPENAI_CONFIG };
let currentPrompt: string = generateSystemPrompt(currentConfig);

// Funciones para actualizar la configuración
export const updateOpenAIConfig = (newConfig: Partial<OpenAIConfigType>): void => {
    try {
        currentConfig = {
            ...currentConfig,
            ...newConfig
        };
        validateOpenAIConfig(currentConfig);
        // Actualizamos el prompt cuando cambia la configuración
        currentPrompt = generateSystemPrompt(currentConfig);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error al actualizar la configuración:', error.message);
            currentConfig = { ...DEFAULT_OPENAI_CONFIG };
            throw new OpenAIConfigError(`Error al actualizar la configuración: ${error.message}`);
        }
        throw new OpenAIConfigError('Error desconocido al actualizar la configuración');
    }
};

// Función para aplicar un template
export const applyTemplate = (templateType: NPCTemplateType): void => {
    try {
        const template = getTemplate(templateType);
        
        // Actualizamos la configuración con la del template
        updateOpenAIConfig(template.baseConfig);
        
        // Generamos el nuevo prompt con el template
        currentPrompt = generateSystemPrompt(currentConfig, template);
        
        console.log(`Template ${templateType} aplicado exitosamente`);
        
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new OpenAIConfigError(`Error al aplicar el template: ${error.message}`);
        }
        throw new OpenAIConfigError('Error desconocido al aplicar el template');
    }
};

// Obtener la configuración actual
export const getCurrentConfig = (): OpenAIConfigType => {
    return { ...currentConfig };
};

// Obtener el prompt actual
export const getCurrentPrompt = (): string => {
    return currentPrompt;
};

// Cliente de OpenAI con mejor manejo de errores
export const createOpenAIClient = (): OpenAI => {
    try {
        return new OpenAI({
            apiKey: currentConfig.apiKey,
            organization: currentConfig.organization
        });
    } catch (error) {
        throw new OpenAIConfigError('Error al crear el cliente de OpenAI');
    }
};

// Validación de configuración mejorada
const validateOpenAIConfig = (config: OpenAIConfigType): boolean => {
    if (!config) {
        throw new OpenAIConfigError('La configuración no puede ser nula');
    }

    // Validaciones básicas
    if (!config.npcPersonality || !config.characteristics) {
        throw new OpenAIConfigError('Faltan propiedades básicas de la configuración');
    }

    // Validación de nombre y rol
    if (!config.npcPersonality.name || !config.npcPersonality.role) {
        throw new OpenAIConfigError('El NPC debe tener un nombre y un rol definidos');
    }

    return true;
};