import { BaseEventFilter } from '../eventConditions';

export interface RoomUserEventFilter extends BaseEventFilter {
  // Aquí irán los filtros específicos para RoomUser
}

export const defaultRoomUserFilter: RoomUserEventFilter = {
  enabled: true,
  priority: 1,
  cooldown: 1000,
  // Aquí irán los valores por defecto específicos para RoomUser
};
