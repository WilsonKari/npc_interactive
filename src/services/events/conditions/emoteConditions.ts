import { BaseEventFilter } from '../eventConditions';

export interface EmoteEventFilter extends BaseEventFilter {
  // Aquí irán los filtros específicos para Emote
}

export const defaultEmoteFilter: EmoteEventFilter = {
  enabled: true,
  priority: 1,
  cooldown: 1000,
  // Aquí irán los valores por defecto específicos para Emote
};
