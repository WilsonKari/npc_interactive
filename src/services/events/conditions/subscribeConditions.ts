import { BaseEventFilter } from '../eventConditions';

export interface SubscribeEventFilter extends BaseEventFilter {
  // Aquí irán los filtros específicos para Subscribe
}

export const defaultSubscribeFilter: SubscribeEventFilter = {
  enabled: true,
  priority: 1,
  cooldown: 1000,
  // Aquí irán los valores por defecto específicos para Subscribe
};
