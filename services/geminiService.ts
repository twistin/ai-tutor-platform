import { GoogleGenAI } from "@google/genai";

// Initialize GoogleGenAI with API key from environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const isValidApiKey = apiKey && apiKey !== 'PLACEHOLDER_API_KEY' && apiKey.length > 10;

let ai: GoogleGenAI | null = null;
if (isValidApiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const explainCode = async (code: string): Promise<string> => {
  if (!ai || !isValidApiKey) {
    return "⚠️ Para usar esta función, necesitas configurar tu API key de Gemini.\n\n" +
           "1. Ve a https://ai.google.dev/ y obtén tu API key\n" +
           "2. Edita el archivo .env.local\n" +
           "3. Reemplaza PLACEHOLDER_API_KEY con tu clave real\n" +
           "4. Reinicia el servidor (npm run dev)";
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: `Explica el siguiente código Python de forma simple para un principiante de 15 años. Usa emojis y ejemplos:\n\n\`\`\`python\n${code}\n\`\`\``,
    });
    return response.text;
  } catch (error: any) {
    console.error("Error explaining code:", error);
    if (error?.message?.includes('API key')) {
      return "❌ Error: API key inválida. Verifica que tu VITE_GEMINI_API_KEY en .env.local sea correcta.";
    }
    return "😔 Lo siento, no pude explicar el código en este momento. Intenta de nuevo.";
  }
};

export const askQuestionAboutLesson = async (
  lessonTitle: string,
  lessonContent: string,
  question: string
): Promise<string> => {
  if (!ai || !isValidApiKey) {
    return "⚠️ Para usar esta función, necesitas configurar tu API key de Gemini.\n\n" +
           "1. Ve a https://ai.google.dev/ y obtén tu API key\n" +
           "2. Edita el archivo .env.local\n" +
           "3. Reemplaza PLACEHOLDER_API_KEY con tu clave real\n" +
           "4. Reinicia el servidor (npm run dev)";
  }

  try {
    const prompt = `Eres un tutor de Python para estudiantes de 15 años. 

Basándote en la lección "${lessonTitle}" con el siguiente contenido:
---
${lessonContent.substring(0, 1000)}
---

Responde esta pregunta del estudiante de forma clara y amigable: "${question}"

Usa emojis, ejemplos simples y un tono cercano.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
    });
    return response.text;
  } catch (error: any) {
    console.error("Error asking question:", error);
    if (error?.message?.includes('API key')) {
      return "❌ Error: API key inválida. Verifica que tu VITE_GEMINI_API_KEY en .env.local sea correcta.";
    }
    return "😔 Lo siento, no pude responder tu pregunta en este momento. Intenta de nuevo.";
  }
};
