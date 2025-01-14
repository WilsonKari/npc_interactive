# TikTok NPC Events Processor

## Descripción del Proyecto
Este proyecto implementa un prototipo web para un NPC (Non-Player Character) que interactúa con eventos de TikTok en tiempo real. El objetivo es crear un NPC basado en inteligencia artificial que pueda reaccionar de manera fluida a los datos de 14 eventos diferentes de TikTok, como regalos, número de espectadores, comentarios y más. Estos datos se procesarán para activar condicionales que definirán cómo debe responder el NPC, logrando una interacción personalizada y dinámica con los usuarios de un live.

El prototipo web será responsable de:

Recibir los datos en tiempo real desde la API de TikTok mediante Socket.IO.
Procesar estos datos mediante condicionales que definan las reacciones del NPC según los eventos recibidos.
Integrar IA avanzada para generar respuestas naturales e interacciones coherentes.
El NPC estará basado en tecnologías como OpenAI o Grok 2 para el procesamiento de datos y generación de respuestas inteligentes. Además, utilizará ElevenLabs para la síntesis de voz, dotándolo de una capacidad de interacción más natural y humanizada.

Para este proyecto, se emplearán las siguientes herramientas y tecnologías:

API de TikTok: Proveerá los datos en tiempo real de los eventos del live (la documentación será proporcionada más adelante).
OpenAI o Grok 2: Procesará los datos para generar respuestas inteligentes y coherentes.
ElevenLabs: Permitirá que el NPC hable utilizando una voz sintetizada natural y adaptable.
Con este enfoque, el proyecto busca crear una interacción intuitiva, fluida y adaptativa, donde el NPC sea capaz de responder a los eventos en tiempo real y conectarse con los espectadores de manera personalizada y efectiva.

## Descripción del Proyectto principal

El TikTok NPC Events Processor es una aplicación web innovadora que implementa un NPC (Non-Player Character) interactivo impulsado por inteligencia artificial, diseñado específicamente para interactuar en tiempo real con transmisiones de TikTok Live. Este sistema procesa y responde a 14 tipos diferentes de eventos de TikTok, creando una experiencia de interacción única y personalizada para cada stream.

### Características Principales

#### 1. Procesamiento de Eventos en Tiempo Real
- Integración directa con TikTok Live mediante WebSocket
- Monitoreo continuo de actividad del stream
- Procesamiento instantáneo de eventos y métricas
- Sistema de priorización de eventos para respuestas óptimas

#### 2. Sistema de IA Avanzado
- Integración modular con múltiples proveedores de IA:
  - OpenAI GPT-4 para procesamiento principal
  - Google Gemini como alternativa robusta
  - Grok 2 para capacidades experimentales
- Análisis contextual para respuestas coherentes
- Memoria a corto y largo plazo para conversaciones naturales
- Adaptación dinámica de personalidad según el contexto

#### 3. Síntesis de Voz Natural
- Integración con ElevenLabs para voz realista
- Sistema de caché para respuestas frecuentes
- Control de velocidad y optimización de recursos
- Manejo robusto de errores y reintentos

#### 4. Eventos Soportados
- Interacciones básicas: likes, comentarios, seguidores
- Eventos monetarios: regalos, suscripciones, sobres
- Eventos sociales: compartidos, preguntas, batallas
- Eventos especiales: introducciones, emotes, membresías

### Objetivos del Proyecto

1. **Engagement Mejorado**
   - Respuestas personalizadas a cada tipo de interacción
   - Mantenimiento de contexto en conversaciones largas
   - Adaptación al tono y estilo del stream

2. **Optimización de Recursos**
   - Sistema de caché inteligente
   - Control de límites de API
   - Distribución eficiente de carga

3. **Experiencia Natural**
   - Respuestas coherentes y contextuales
   - Voz natural y expresiva
   - Personalidad consistente y adaptable

### Tecnologías Principales

- **Frontend**: React 18 + TypeScript
- **Estado**: Zustand para gestión global
- **IA**: OpenAI/Gemini/Grok
- **Voz**: ElevenLabs
- **Eventos**: TikTok Live API
- **Estilos**: Styled Components + TailwindCSS

Este proyecto representa un avance significativo en la interacción automatizada en streams de TikTok, combinando tecnologías de punta en IA y síntesis de voz para crear una experiencia única y envolvente para los espectadores.

## Stack Tecnológico
- **Framework**: React 18
- **Build Tool**: Vite 5.0
- **Lenguaje**: TypeScript 5.2
- **Gestor de Estado**: Zustand
- **Estilos**: Styled Components + TailwindCSS

## Estructura del Proyecto

```
src/
├── components/
│   ├── Events/                      # Contenedor principal de eventos
│   │   ├── ChatEvent/
│   │   │   ├── ChatEvent.tsx        # Componente principal
│   │   │   ├── ChatEventStyles.ts   # Estilos del componente
│   │   │   ├── ChatEventLogic.ts    # Lógica de negocio
│   │   │   └── __tests__/
│   │   │       └── ChatEvent.test.tsx
│   │   │
│   │   ├── GiftEvent/
│   │   │   ├── GiftEvent.tsx
│   │   │   ├── GiftEventStyles.ts
│   │   │   ├── GiftEventLogic.ts
│   │   │   └── __tests__/
│   │   │       └── GiftEvent.test.tsx
│   │   │
│   │   ├── LikeEvent/
│   │   │   ├── LikeEvent.tsx
│   │   │   ├── LikeEventStyles.ts
│   │   │   ├── LikeEventLogic.ts
│   │   │   └── __tests__/
│   │   │       └── LikeEvent.test.tsx
│   │   │
│   │   ├── MemberEvent/
│   │   │   ├── MemberEvent.tsx
│   │   │   ├── MemberEventStyles.ts
│   │   │   ├── MemberEventLogic.ts
│   │   │   └── __tests__/
│   │   │       └── MemberEvent.test.tsx
│   │   │
│   │   ├── RoomUserEvent/
│   │   │   ├── RoomUserEvent.tsx
│   │   │   ├── RoomUserEventStyles.ts
│   │   │   ├── RoomUserEventLogic.ts
│   │   │   └── __tests__/
│   │   │       └── RoomUserEvent.test.tsx
│   │   │
│   │   ├── FollowEvent/
│   │   │   ├── FollowEvent.tsx
│   │   │   ├── FollowEventStyles.ts
│   │   │   ├── FollowEventLogic.ts
│   │   │   └── __tests__/
│   │   │       └── FollowEvent.test.tsx
│   │   │
│   │   ├── ShareEvent/
│   │   │   ├── ShareEvent.tsx
│   │   │   ├── ShareEventStyles.ts
│   │   │   ├── ShareEventLogic.ts
│   │   │   └── __tests__/
│   │   │       └── ShareEvent.test.tsx
│   │   │
│   │   ├── QuestionNewEvent/
│   │   │   ├── QuestionNewEvent.tsx
│   │   │   ├── QuestionNewEventStyles.ts
│   │   │   ├── QuestionNewEventLogic.ts
│   │   │   └── __tests__/
│   │   │       └── QuestionNewEvent.test.tsx
│   │   │
│   │   ├── LinkMicBattleEvent/
│   │   │   ├── LinkMicBattleEvent.tsx
│   │   │   ├── LinkMicBattleEventStyles.ts
│   │   │   ├── LinkMicBattleEventLogic.ts
│   │   │   └── __tests__/
│   │   │       └── LinkMicBattleEvent.test.tsx
│   │   │
│   │   ├── LinkMicArmiesEvent/
│   │   │   ├── LinkMicArmiesEvent.tsx
│   │   │   ├── LinkMicArmiesEventStyles.ts
│   │   │   ├── LinkMicArmiesEventLogic.ts
│   │   │   └── __tests__/
│   │   │       └── LinkMicArmiesEvent.test.tsx
│   │   │
│   │   ├── LiveIntroEvent/
│   │   │   ├── LiveIntroEvent.tsx
│   │   │   ├── LiveIntroEventStyles.ts
│   │   │   ├── LiveIntroEventLogic.ts
│   │   │   └── __tests__/
│   │   │       └── LiveIntroEvent.test.tsx
│   │   │
│   │   ├── EmoteEvent/
│   │   │   ├── EmoteEvent.tsx
│   │   │   ├── EmoteEventStyles.ts
│   │   │   ├── EmoteEventLogic.ts
│   │   │   └── __tests__/
│   │   │       └── EmoteEvent.test.tsx
│   │   │
│   │   ├── EnvelopeEvent/
│   │   │   ├── EnvelopeEvent.tsx
│   │   │   ├── EnvelopeEventStyles.ts
│   │   │   ├── EnvelopeEventLogic.ts
│   │   │   └── __tests__/
│   │   │       └── EnvelopeEvent.test.tsx
│   │   │
│   │   └── SubscribeEvent/
│   │       ├── SubscribeEvent.tsx
│   │       ├── SubscribeEventStyles.ts
│   │       ├── SubscribeEventLogic.ts
│   │       └── __tests__/
│   │           └── SubscribeEvent.test.tsx
│   │
│   ├── TemplateSelector/
│   │   └── TemplateSelector.tsx    # Componente para seleccionar plantillas
│   │
│   └── EventContainer/
│       ├── EventContainer.tsx       # Componente contenedor principal
│       ├── EventContainerStyles.ts  # Estilos del contenedor
│       ├── EventContainerLogic.ts   # Lógica del contenedor
│       └── __tests__/
│           └── EventContainer.test.tsx
│
├── services/
│   └── api/
│       ├── tiktok/                  # Gestión de conexión WebSocket y eventos TikTok Live
│       │   ├── __tests__/          # Pruebas de integración y simulación de eventos
│       │   │   └── tiktokService.test.ts
│       │   ├── tiktokConfig.ts      # Configuración de credenciales y endpoints de TikTok
│       │   └── tiktokService.ts     # Implementación de WebSocket y manejo de eventos en tiempo real
│       │
│       ├── ai/                      # Sistema central de IA para procesamiento de lenguaje natural
│       │   ├── config/              # Configuración modular para múltiples proveedores de IA
│       │   │   ├── openai/          # Módulo OpenAI: Motor principal de personalidad del NPC
│       │   │   │   ├── config.ts    # Configuración de modelos y parámetros de generación
│       │   │   │   ├── defaults.ts  # Valores base para personalidad y comportamiento del NPC
│       │   │   │   ├── prompt.ts    # Sistema de prompts dinámicos para control contextual
│       │   │   │   ├── templates.ts # Plantillas predefinidas de personalidad y respuestas
│       │   │   │   └── types.ts     # Tipado para configuración y respuestas de OpenAI
│       │   │   ├── gemini/          # Módulo Gemini: Alternativa para procesamiento de lenguaje
│       │   │   │   ├── config.ts    # Configuración específica del modelo Gemini
│       │   │   │   └── templates.ts # Plantillas optimizadas para Gemini
│       │   │   ├── grok/            # Módulo Grok: Sistema experimental de IA avanzada
│       │   │   │   ├── config.ts    # Configuración del modelo experimental Grok
│       │   │   │   └── templates.ts # Plantillas especializadas para Grok
│       │   │   └── __tests__/      # Pruebas de configuración y validación de templates
│       │   ├── providers/           # Implementaciones específicas para cada proveedor de IA
│       │   │   ├── openai/
│       │   │   │   └── openaiProvider.ts # Cliente OpenAI con manejo de tokens y rate limiting
│       │   │   ├── gemini/
│       │   │   │   └── geminiProvider.ts # Cliente Gemini con optimizaciones de rendimiento
│       │   │   └── grok/
│       │   │       └── grokProvider.ts   # Cliente Grok con características avanzadas
│       │   ├── types/              # Interfaces compartidas entre proveedores de IA
│       │   │   └── aiTypes.ts
│       │   ├── __tests__/         # Pruebas de integración de servicios de IA
│       │   │   └── aiService.test.ts
│       │   └── aiService.ts       # Orquestador central de servicios de IA y gestión de respuestas
│       │
│       ├── elevenlabs/            # Sistema de síntesis de voz para respuestas del NPC
│       │   ├── config/            # Configuración de voces y parámetros de síntesis
│       │   │   ├── defaults.ts      # Configuración base de voces y parámetros de síntesis
│       │   │   ├── types.ts         # Tipos para configuración de voces y respuestas
│       │   │   └── voiceConfig.ts   # Configuración de voces, estilos y emociones
│       │   ├── providers/
│       │   │   └── elevenlabsProvider.ts # Cliente con caché y optimización de llamadas
│       │   ├── __tests__/         # Pruebas de síntesis y streaming de voz
│       │   │   └── voiceService.test.ts
│       │   ├── types.ts             # Tipos para síntesis y streaming de audio
│       │   └── index.ts             # Punto de entrada unificado para servicios de voz
│       │
│       └── events/                 # Sistema de procesamiento y análisis de eventos
│           ├── __tests__/         # Pruebas de lógica de eventos y condiciones
│           │   └── eventProcessor.test.ts
│           ├── eventConditions.ts   # Lógica de condiciones y triggers para respuestas
│           └── eventProcessor.ts    # Procesador central de eventos y análisis
│
├── hooks/
│   ├── useAIResponse.ts           # Hook para gestión de respuestas IA con caché y control de estado
│   ├── useElevenLabs.ts           # Hook para síntesis de voz con rate limiting y reintentos
│   ├── useEventProcessor.ts        # Hook para procesamiento de eventos TikTok en tiempo real
│   ├── useNPCResponse.ts          # Hook para generación de respuestas contextuales del NPC
│   ├── useTikTokStream.ts         # Hook para gestión de WebSocket y eventos TikTok Live
│   └── __tests__/                # Pruebas de hooks y lógica de negocio
│       ├── useAIResponse.test.ts
│       ├── useEventProcessor.test.ts
│       ├── useTikTokStream.test.ts
│
├── store/
│   ├── aiConfigStore.ts         # Estado global de configuración de IA y personalidad del NPC
│   ├── aiStore.ts               # Estado de respuestas, métricas y análisis de uso de IA
│   ├── eventStore.ts            # Estado global de eventos TikTok y análisis en tiempo real
│   └── __tests__/              # Pruebas de gestión de estado y actualizaciones
│       ├── aiStore.test.ts
│       ├── eventStore.test.ts
│
├── types/
│   ├── ai.d.ts                 # Tipos para modelos de IA, configuración y respuestas
│   ├── events.d.ts             # Interfaces para eventos TikTok y metadatos asociados
│   ├── responses.d.ts          # Tipos para respuestas del NPC y métricas de interacción
│
├── utils/
│   ├── aiHelpers.ts           # Utilidades para IA: rate limiting, caché y sistema de reintentos
│   ├── constants.ts           # Configuración global y constantes del sistema
│   ├── eventHelpers.ts        # Funciones auxiliares para procesamiento y análisis de eventos
│   └── __tests__/            # Pruebas de utilidades y funciones auxiliares
│       ├── aiHelpers.test.ts
│       └── eventHelpers.test.ts
│
└── config/
   ├── apiConfig.ts            # Configuración de APIs
   └── env.ts                   # Variables de entorno
├── App.styles.ts               # Estilos del componente principal
├── App.tsx                      # Componente principal de la aplicación
├── index.css                   # Estilos globales
├── main.tsx                    # Punto de entrada de la aplicación
├── vite-env.d.ts              # Tipos de Vite

```

## Estado Actual del Proyecto (Actualización: 2025-01-14)

### Últimas Mejoras Implementadas

#### 1. Manejo de Errores y Optimización de ElevenLabs
Se han implementado mejoras significativas en el manejo de errores y la optimización de las llamadas a la API de ElevenLabs:

##### Nuevas Utilidades en `aiHelpers.ts`:
- **RateLimiter**: Implementación de control de velocidad para las llamadas a la API
  - Limita las solicitudes a 50 por minuto
  - Cola de solicitudes para manejar picos de tráfico
  - Distribución uniforme de solicitudes

- **ResponseCache**: Sistema de caché para respuestas
  - Almacenamiento temporal de respuestas de voz
  - TTL (Time To Live) configurable
  - Reducción de llamadas redundantes a la API

- **withRetry**: Mecanismo de reintentos automáticos
  - Manejo de errores temporales
  - Reintentos configurables con retraso exponencial
  - Máximo de 3 intentos por defecto

##### Integración en `useElevenLabs`:
- Implementación de caché para voces y respuestas sintetizadas
- Control de velocidad para prevenir límites de API
- Reintentos automáticos para mayor robustez
- Manejo mejorado de errores CORS y respuestas 502

### Próximos Pasos
1. **Pruebas de Estrés**: Validar el comportamiento del sistema bajo carga
2. **Monitoreo**: Implementar sistema de seguimiento para las llamadas a la API
3. **Documentación**: Actualizar la documentación de la API con los nuevos cambios
4. **Optimización**: Revisar y ajustar los parámetros de caché y rate limiting según el uso real

### Estado de Componentes Principales
- ✅ Sistema de Templates
- ✅ Integración con OpenAI
- ✅ Manejo de Eventos TikTok
- ✅ Síntesis de Voz con ElevenLabs
- ✅ Sistema de Caché y Rate Limiting
- 🔄 Pruebas de Integración (En Progreso)
- 📝 Documentación Detallada (En Progreso)

## Jerarquía y Lógica de Componentes

### 1. Componentes Core
- `App.tsx`: Componente raíz que define la estructura principal
- `EventContainer`: Gestiona y muestra todos los eventos activos

### 2. Eventos Específicos
Cada evento tiene su propia carpeta con:
- `Component.tsx`: UI del evento
- `Logic.ts`: Lógica de negocio
- `Styles.ts`: Estilos específicos
- `__tests__/`: Tests unitarios

### 3. Servicios
- **TikTok API**: Manejo de conexión y eventos de TikTok
- **OpenAI/Grok**: Procesamiento de IA para respuestas del NPC
- **ElevenLabs**: Síntesis de voz para respuestas

### 4. Estado Global
- `eventStore.ts`: Estado de eventos de TikTok
- `aiStore.ts`: Estado de respuestas de IA

## Flujo de Datos
1. Los eventos de TikTok son recibidos y procesados
2. Se evalúan las condiciones para la reacción del NPC
3. Se genera una respuesta usando IA (OpenAI/Grok)
4. Se sintetiza la voz usando ElevenLabs
5. Se muestra la respuesta en la interfaz

## Tipos de Eventos Soportados
1. Chat Events
2. Gift Events
3. Like Events
4. Member Events
5. Room User Events
6. Follow Events
7. Share Events
8. Question Events
9. LinkMic Battle Events
10. LinkMic Armies Events
11. Live Intro Events
12. Emote Events
13. Envelope Events
14. Subscribe Events

## Configuración del Proyecto
1. Instalar dependencias:
```bash
npm install
```

2. Iniciar servidor de desarrollo:
```bash
npm run dev
```

3. Ejecutar tests:
```bash
npm test
```

## Próximos Pasos
- Implementación de la conexión con la API de TikTok
- Integración con OpenAI/Grok
- Configuración de ElevenLabs
- Desarrollo de lógica de eventos
- Implementación de condiciones de respuesta
- Pruebas de integración