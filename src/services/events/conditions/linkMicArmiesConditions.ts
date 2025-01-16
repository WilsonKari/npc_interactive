import { BaseEventFilter } from '../eventConditions';

export interface LinkMicArmiesEventFilter extends BaseEventFilter {
  // Aquí irán los filtros específicos para LinkMicArmies
}

export const defaultLinkMicArmiesFilter: LinkMicArmiesEventFilter = {
  enabled: true,
  priority: 1,
  cooldown: 1000,
  // Aquí irán los valores por defecto específicos para LinkMicArmies
};
