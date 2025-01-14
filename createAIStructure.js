import { mkdir, writeFile } from 'fs/promises';
import { dirname } from 'path';

const createFile = async (filePath) => {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, '');
};

const aiStructure = [
  // Configuraciones de IAs
  "src/services/api/ai/config/openaiConfig.ts",
  "src/services/api/ai/config/geminiConfig.ts",
  "src/services/api/ai/config/grokConfig.ts",
  
  // Providers
  "src/services/api/ai/providers/openai/openaiProvider.ts",
  "src/services/api/ai/providers/gemini/geminiProvider.ts",
  "src/services/api/ai/providers/grok/grokProvider.ts",
  
  // Types
  "src/services/api/ai/types/aiTypes.ts",
  
  // Servicio principal y tests
  "src/services/api/ai/aiService.ts",
  "src/services/api/ai/__tests__/aiService.test.ts"
];

try {
  await Promise.all(aiStructure.map(filePath => createFile(filePath)));
  console.log("Estructura del servicio de AI creada exitosamente.");
} catch (error) {
  console.error("Error al crear la estructura:", error);
}
