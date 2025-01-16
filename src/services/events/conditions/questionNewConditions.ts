import { BaseEventFilter } from '../eventConditions';

export interface QuestionNewEventFilter extends BaseEventFilter {
  // Aquí irán los filtros específicos para QuestionNew
}

export const defaultQuestionNewFilter: QuestionNewEventFilter = {
  enabled: true,
  priority: 1,
  cooldown: 1000,
  // Aquí irán los valores por defecto específicos para QuestionNew
};
