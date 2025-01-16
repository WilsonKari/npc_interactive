import { BaseEventFilter } from '../eventConditions';

export interface LikeEventFilter extends BaseEventFilter {
  // Aquí irán los filtros específicos para Like
}

export const defaultLikeFilter: LikeEventFilter = {
  enabled: true,
  priority: 1,
  cooldown: 1000,
  // Aquí irán los valores por defecto específicos para Like
};
