import { BaseEventFilter } from '../eventConditions';

export interface MemberEventFilter extends BaseEventFilter {
  // Aquí irán los filtros específicos para Member
}

export const defaultMemberFilter: MemberEventFilter = {
  enabled: true,
  priority: 1,
  cooldown: 1000,
  // Aquí irán los valores por defecto específicos para Member
};
