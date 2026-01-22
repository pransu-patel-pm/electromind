import { GoogleGenAI, Type } from "@google/genai";
import { ProjectIdea, ComponentData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Generic Chat with Grounding (Web Search)
export const sendMessageToGemini = async (
  history: { role: string; content: string }[],
  newMessage: string,
  useSearch: boolean = false
) => {
  try {
    const modelId = useSearch ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
    
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

// Generate Image
export const generateImage = async (prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "4:3",
        }
      }
    });
    
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    return null;
  }
};

// Component Details
export const getComponentDetails = async (componentName: string): Promise<ComponentData | null> => {
  try {
      const textPrompt = `Provide technical details for the electronic component "${componentName}". Return JSON only.`;
      
      const textPromise = ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: textPrompt,
          config: {
              responseMimeType: "application/json",
              responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                      name: { type: Type.STRING },
                      description: { type: Type.STRING },
                      specs: { 
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                             param: { type: Type.STRING },
                             value: { type: Type.STRING }
                          }
                        } 
                      },
                      pinout: { type: Type.STRING, description: "Text description of pin configuration" }
                  },
                  required: ["name", "description", "specs", "pinout"]
              }
          }
      });

      const imagePromise = generateImage(`A clean, realistic, white background product photo of the electronic component: ${componentName}, high quality, macro photography`);

      const [textResponse, imageUrl] = await Promise.all([textPromise, imagePromise]);
      
      if (textResponse.text) {
          const data = JSON.parse(textResponse.text);
          return {
              ...data,
              imageUrl: imageUrl || undefined
          };
      }
      return null;

  } catch (e) {
      console.error(e);
      return null;
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