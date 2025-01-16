import { BaseEventFilter } from '../eventConditions';

export interface EnvelopeEventFilter extends BaseEventFilter {
  // Aquí irán los filtros específicos para Envelope
}

export const defaultEnvelopeFilter: EnvelopeEventFilter = {
  enabled: true,
  priority: 1,
  cooldown: 1000,
  // Aquí irán los valores por defecto específicos para Envelope
};
