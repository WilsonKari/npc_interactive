const fs = require("fs");
const path = require("path");

const createFile = (filePath) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, "");
};

const structure = [
  // Archivos principales
  "src/App.tsx",
  "src/App.styles.ts",
  "src/main.tsx",
  "src/index.css",
  "src/vite-env.d.ts",

  // TemplateSelector
  "src/components/TemplateSelector/TemplateSelector.tsx",

  // Componentes de eventos
  "src/components/Events/ChatEvent/ChatEvent.tsx",
  "src/components/Events/ChatEvent/ChatEventStyles.ts",
  "src/components/Events/ChatEvent/ChatEventLogic.ts",
  "src/components/Events/ChatEvent/__tests__/ChatEvent.test.tsx",
  "src/components/Events/GiftEvent/GiftEvent.tsx",
  "src/components/Events/GiftEvent/GiftEventStyles.ts",
  "src/components/Events/GiftEvent/GiftEventLogic.ts",
  "src/components/Events/GiftEvent/__tests__/GiftEvent.test.tsx",
  "src/components/Events/LikeEvent/LikeEvent.tsx",
  "src/components/Events/LikeEvent/LikeEventStyles.ts",
  "src/components/Events/LikeEvent/LikeEventLogic.ts",
  "src/components/Events/LikeEvent/__tests__/LikeEvent.test.tsx",
  "src/components/Events/MemberEvent/MemberEvent.tsx",
  "src/components/Events/MemberEvent/MemberEventStyles.ts",
  "src/components/Events/MemberEvent/MemberEventLogic.ts",
  "src/components/Events/MemberEvent/__tests__/MemberEvent.test.tsx",
  "src/components/Events/RoomUserEvent/RoomUserEvent.tsx",
  "src/components/Events/RoomUserEvent/RoomUserEventStyles.ts",
  "src/components/Events/RoomUserEvent/RoomUserEventLogic.ts",
  "src/components/Events/RoomUserEvent/__tests__/RoomUserEvent.test.tsx",
  "src/components/Events/FollowEvent/FollowEvent.tsx",
  "src/components/Events/FollowEvent/FollowEventStyles.ts",
  "src/components/Events/FollowEvent/FollowEventLogic.ts",
  "src/components/Events/FollowEvent/__tests__/FollowEvent.test.tsx",
  "src/components/Events/ShareEvent/ShareEvent.tsx",
  "src/components/Events/ShareEvent/ShareEventStyles.ts",
  "src/components/Events/ShareEvent/ShareEventLogic.ts",
  "src/components/Events/ShareEvent/__tests__/ShareEvent.test.tsx",
  "src/components/Events/QuestionNewEvent/QuestionNewEvent.tsx",
  "src/components/Events/QuestionNewEvent/QuestionNewEventStyles.ts",
  "src/components/Events/QuestionNewEvent/QuestionNewEventLogic.ts",
  "src/components/Events/QuestionNewEvent/__tests__/QuestionNewEvent.test.tsx",
  "src/components/Events/LinkMicBattleEvent/LinkMicBattleEvent.tsx",
  "src/components/Events/LinkMicBattleEvent/LinkMicBattleEventStyles.ts",
  "src/components/Events/LinkMicBattleEvent/LinkMicBattleEventLogic.ts",
  "src/components/Events/LinkMicBattleEvent/__tests__/LinkMicBattleEvent.test.tsx",
  "src/components/Events/LinkMicArmiesEvent/LinkMicArmiesEvent.tsx",
  "src/components/Events/LinkMicArmiesEvent/LinkMicArmiesEventStyles.ts",
  "src/components/Events/LinkMicArmiesEvent/LinkMicArmiesEventLogic.ts",
  "src/components/Events/LinkMicArmiesEvent/__tests__/LinkMicArmiesEvent.test.tsx",
  "src/components/Events/LiveIntroEvent/LiveIntroEvent.tsx",
  "src/components/Events/LiveIntroEvent/LiveIntroEventStyles.ts",
  "src/components/Events/LiveIntroEvent/LiveIntroEventLogic.ts",
  "src/components/Events/LiveIntroEvent/__tests__/LiveIntroEvent.test.tsx",
  "src/components/Events/EmoteEvent/EmoteEvent.tsx",
  "src/components/Events/EmoteEvent/EmoteEventStyles.ts",
  "src/components/Events/EmoteEvent/EmoteEventLogic.ts",
  "src/components/Events/EmoteEvent/__tests__/EmoteEvent.test.tsx",
  "src/components/Events/EnvelopeEvent/EnvelopeEvent.tsx",
  "src/components/Events/EnvelopeEvent/EnvelopeEventStyles.ts",
  "src/components/Events/EnvelopeEvent/EnvelopeEventLogic.ts",
  "src/components/Events/EnvelopeEvent/__tests__/EnvelopeEvent.test.tsx",
  "src/components/Events/SubscribeEvent/SubscribeEvent.tsx",
  "src/components/Events/SubscribeEvent/SubscribeEventStyles.ts",
  "src/components/Events/SubscribeEvent/SubscribeEventLogic.ts",
  "src/components/Events/SubscribeEvent/__tests__/SubscribeEvent.test.tsx",
  "src/components/EventContainer/EventContainer.tsx",
  "src/components/EventContainer/EventContainerStyles.ts",
  "src/components/EventContainer/EventContainerLogic.ts",
  "src/components/EventContainer/__tests__/EventContainer.test.tsx",

  // Servicios de TikTok
  "src/services/api/tiktok/tiktokConfig.ts",
  "src/services/api/tiktok/tiktokService.ts",
  "src/services/api/tiktok/__tests__/tiktokService.test.ts",

  // Servicios de IA
  "src/services/api/ai/config/openai/config.ts",
  "src/services/api/ai/config/openai/defaults.ts",
  "src/services/api/ai/config/openai/prompt.ts",
  "src/services/api/ai/config/openai/templates.ts",
  "src/services/api/ai/config/openai/types.ts",
  "src/services/api/ai/config/gemini/config.ts",
  "src/services/api/ai/config/gemini/templates.ts",
  "src/services/api/ai/config/grok/config.ts",
  "src/services/api/ai/config/grok/templates.ts",
  "src/services/api/ai/providers/openai/openaiProvider.ts",
  "src/services/api/ai/providers/gemini/geminiProvider.ts",
  "src/services/api/ai/providers/grok/grokProvider.ts",
  "src/services/api/ai/types/aiTypes.ts",
  "src/services/api/ai/aiService.ts",
  "src/services/api/ai/__tests__/aiService.test.ts",

  // Servicios de ElevenLabs
  "src/services/api/elevenlabs/config/defaults.ts",
  "src/services/api/elevenlabs/config/types.ts",
  "src/services/api/elevenlabs/config/voiceConfig.ts",
  "src/services/api/elevenlabs/providers/elevenlabsProvider.ts",
  "src/services/api/elevenlabs/types.ts",
  "src/services/api/elevenlabs/index.ts",
  "src/services/api/elevenlabs/__tests__/voiceService.test.ts",

  // Servicios de eventos
  "src/services/events/eventProcessor.ts",
  "src/services/events/eventConditions.ts",
  "src/services/events/__tests__/eventProcessor.test.ts",

  // Hooks
  "src/hooks/useEventProcessor.ts",
  "src/hooks/useTikTokStream.ts",
  "src/hooks/useAIResponse.ts",
  "src/hooks/useElevenLabs.ts",
  "src/hooks/useNPCResponse.ts",
  "src/hooks/__tests__/useEventProcessor.test.ts",
  "src/hooks/__tests__/useTikTokStream.test.ts",
  "src/hooks/__tests__/useAIResponse.test.ts",

  // Store
  "src/store/eventStore.ts",
  "src/store/aiStore.ts",
  "src/store/aiConfigStore.ts",
  "src/store/__tests__/eventStore.test.ts",
  "src/store/__tests__/aiStore.test.ts",

  // Types
  "src/types/events.d.ts",
  "src/types/ai.d.ts",
  "src/types/responses.d.ts",

  // Utils
  "src/utils/eventHelpers.ts",
  "src/utils/aiHelpers.ts",
  "src/utils/constants.ts",
  "src/utils/__tests__/eventHelpers.test.ts",
  "src/utils/__tests__/aiHelpers.test.ts",

  // Config
  "src/config/env.ts",
  "src/config/apiConfig.ts",
];

structure.forEach((filePath) => createFile(filePath));

console.log("Estructura de archivos y carpetas creada exitosamente.");