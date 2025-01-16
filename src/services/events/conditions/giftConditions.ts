import { BaseEventFilter } from '../eventConditions';

export interface GiftEventFilter extends BaseEventFilter {
  // Aquí irán los filtros específicos para Gift
}

export const defaultGiftFilter: GiftEventFilter = {
  enabled: true,
  priority: 1,
  cooldown: 1000,
  // Aquí irán los valores por defecto específicos para Gift
};
