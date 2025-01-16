import { BaseEventFilter } from '../eventConditions';

export interface LinkMicBattleEventFilter extends BaseEventFilter {
  // Aquí irán los filtros específicos para LinkMicBattle
}

export const defaultLinkMicBattleFilter: LinkMicBattleEventFilter = {
  enabled: true,
  priority: 1,
  cooldown: 1000,
  // Aquí irán los valores por defecto específicos para LinkMicBattle
};
