
import { GoogleGenAI, Type } from "@google/genai";
import { User, Resource } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getSmartMatch = async (user: User, partners: User[]) => {
  const prompt = `Based on the user's profile and the available partners, recommend the best 3 partners for a case interview practice session.
  
  User Profile:
  - Level: ${user.level}
  - Role Preference: ${user.rolePreference}
  - Case Focus: ${user.caseFocus}
  - Availability: ${user.availability.join(', ')}

  Partners List:
  ${partners.map(p => `- ${p.fullName} (Level: ${p.level}, Rating: ${p.rating}, Focus: ${p.caseFocus}, Availability: ${p.availability.join(', ')})`).join('\n')}
  
  Return the result as a JSON array of partner IDs in order of suitability.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini Error:", error);
    return partners.slice(0, 3).map(p => p.id);
  }
};
