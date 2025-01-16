import { mkdir, writeFile } from 'fs/promises';
import { dirname } from 'path';

const createFile = async (filePath, content = '') => {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, content);
};

// Lista de eventos de TikTok
const events = [
  'chat',
  'gift',
  'like',
  'follow',
  'share',
  'questionNew',
  'linkMicBattle',
  'linkMicArmies',
  'liveIntro',
  'emote',
  'envelope',
  'subscribe',
  'roomUser',
  'member'
];

// Template básico para los archivos de condiciones
const getConditionTemplate = (eventName) => `import { BaseEventFilter } from '../eventConditions';

export interface ${eventName}EventFilter extends BaseEventFilter {
  // Aquí irán los filtros específicos para ${eventName}
}

export const default${eventName}Filter: ${eventName}EventFilter = {
  enabled: true,
  priority: 1,
  cooldown: 1000,
  // Aquí irán los valores por defecto específicos para ${eventName}
};
`;

const eventStructure = [
  // Directorio principal de condiciones
  ...events.map(event => ({
    path: `src/services/events/conditions/${event}Conditions.ts`,
    content: getConditionTemplate(event.charAt(0).toUpperCase() + event.slice(1))
  }))
];

try {
  await Promise.all(eventStructure.map(file => createFile(file.path, file.content)));
  console.log("Estructura de eventos creada exitosamente.");
  console.log("Se han creado los siguientes archivos:");
  eventStructure.forEach(file => console.log(`- ${file.path}`));
} catch (error) {
  console.error("Error al crear la estructura:", error);
}
