import { GoogleGenAI, Type } from "@google/genai";
import { ProjectIdea } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Generic Chat with Grounding (Web Search)
export const sendMessageToGemini = async (
  history: { role: string; content: string }[],
  newMessage: string,
  useSearch: boolean = false
) => {
  try {
    const modelId = useSearch ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
    
    // Convert generic history to Gemini format if needed, 
    // but the SDK handles history via Chat object usually. 
    // Here we'll do single turn or manual history management for simplicity in this service function
    // or use the chat API. Let's use the Chat API.
    
    const chat = ai.chats.create({
      model: modelId,
      config: {
        systemInstruction: "You are ElectroMind, an expert senior electronics engineer and professor. You assist students with circuit design, component selection, code (Arduino/C++/Python), and theory. Be precise, practical, and safety-conscious.",
        tools: useSearch ? [{ googleSearch: {} }] : undefined,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.content }]
      }))
    });

    const result = await chat.sendMessage({ message: newMessage });
    
    // Extract sources if available
    const groundingChunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources = groundingChunks
      ?.map((chunk: any) => chunk.web ? { title: chunk.web.title, uri: chunk.web.uri } : null)
      .filter((s: any) => s !== null) || [];

    return {
      text: result.text || "No response generated.",
      sources: sources
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

// Structured Project Generation
export const generateProjectIdeas = async (interest: string, level: string): Promise<ProjectIdea[]> => {
  try {
    const prompt = `Generate 3 unique electronics project ideas for a student interested in "${interest}" at a "${level}" difficulty level. Return JSON only.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ["Beginner", "Intermediate", "Advanced"] },
              description: { type: Type.STRING },
              components: { type: Type.ARRAY, items: { type: Type.STRING } },
              field: { type: Type.STRING, enum: ["IoT", "Robotics", "Analog", "Embedded", "Power"] }
            },
            required: ["title", "difficulty", "description", "components", "field"]
          }
        }
      }
    });

    if (response.text) {
      const projects = JSON.parse(response.text);
      return projects.map((p: any, index: number) => ({
        ...p,
        id: `gen_${Date.now()}_${index}`
      }));
    }
    return [];

  } catch (error) {
    console.error("Project Generation Error:", error);
    return [];
  }
};
