import { BaseEventFilter } from '../eventConditions';

export interface FollowEventFilter extends BaseEventFilter {
  // Aquí irán los filtros específicos para Follow
}

export const defaultFollowFilter: FollowEventFilter = {
  enabled: true,
  priority: 1,
  cooldown: 1000,
  // Aquí irán los valores por defecto específicos para Follow
};
