import { BaseEventFilter } from '../eventConditions';

export interface LiveIntroEventFilter extends BaseEventFilter {
  // Aquí irán los filtros específicos para LiveIntro
}

export const defaultLiveIntroFilter: LiveIntroEventFilter = {
  enabled: true,
  priority: 1,
  cooldown: 1000,
  // Aquí irán los valores por defecto específicos para LiveIntro
};
