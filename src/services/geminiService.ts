import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `You are "Nur AI", a helpful and respectful Islamic Knowledge Assistant for a spiritual lifestyle app called Nur.
Your goal is to provide accurate information about Islamic history, ethics, general practices, and the Quran.
- Always respond in Arabic (اللغة العربية).
- Be polite, humble, and encouraging.
- For complex legal questions (Fiqh), provide general information based on major schools of thought but always include a disclaimer that users should consult a qualified local scholar for specific fatwas.
- Use Quranic verses and Hadith where appropriate to support your answers.
- If you don't know something, admit it humbly.
- Avoid political controversies.
- Focus on spiritual growth, mindfulness, and the beauty of Islam.`;

export async function askNur(prompt: string, history: { role: 'user' | 'model', content: string }[] = []) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history.map(m => ({ role: m.role, parts: [{ text: m.content }] })),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text || "I am sorry, I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I encountered an error connecting to my knowledge base. Please try again later.";
  }
}
