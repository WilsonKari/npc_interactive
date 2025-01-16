import { BaseEventFilter } from '../eventConditions';

export interface ShareEventFilter extends BaseEventFilter {
  // Aquí irán los filtros específicos para Share
}

export const defaultShareFilter: ShareEventFilter = {
  enabled: true,
  priority: 1,
  cooldown: 1000,
  // Aquí irán los valores por defecto específicos para Share
};
