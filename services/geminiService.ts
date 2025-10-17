import { GoogleGenAI, Type, Modality } from "@google/genai";
import { GameState, Character, TurnUpdate } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const turnUpdateSchema = {
  type: Type.OBJECT,
  properties: {
    narration: { type: Type.STRING, description: "A detailed and vivid narration of the current scene, events, and NPC actions. This is what the players experience directly." },
    visualPrompt: { type: Type.STRING, description: "A concise, single-sentence prompt for an image generator, describing the key visual elements of the scene. E.g., 'A stoic human fighter and a graceful elf wizard cautiously enter a dimly lit, moss-covered cavern.'"},
    playerActions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          characterName: { type: Type.STRING },
          action: { type: Type.STRING, description: "Describe the action this character takes in response to the scene." }
        },
        required: ["characterName", "action"]
      }
    },
    updatedGameState: {
      type: Type.OBJECT,
      properties: {
        location: { type: Type.STRING },
        quest: { type: Type.STRING },
        combatActive: { type: Type.BOOLEAN }
      },
      required: ["location", "quest", "combatActive"]
    },
    characterUpdates: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          characterName: { type: Type.STRING },
          healthChange: { type: Type.NUMBER, description: "Number indicating health change (e.g., -10 for damage, 15 for healing, 0 for no change)." },
          inventoryChange: { type: Type.STRING, description: "Description of any item used or gained. E.g., 'Used Healing Potion' or 'Found a mysterious amulet'." }
        },
        required: ["characterName", "healthChange", "inventoryChange"]
      }
    }
  },
  required: ["narration", "visualPrompt", "playerActions", "updatedGameState", "characterUpdates"]
};


export async function generateGameTurn(
  gameState: GameState,
  characters: Character[],
  lastEvent: string | null
): Promise<TurnUpdate> {
  const prompt = `
    You are the Game Master for a Dungeons & Dragons campaign. Your role is to narrate the story, control NPCs, describe environments, and manage game mechanics.

    **Current Campaign State:**
    - Location: ${gameState.location}
    - Quest: ${gameState.quest}
    - Combat Active: ${gameState.combatActive}
    - Turn Number: ${gameState.turn}

    **Party Members:**
    ${characters.map(c => `- ${c.name} (${c.race} ${c.class}, Health: ${c.health}/${c.maxHealth}, Inventory: ${c.inventory.join(', ')})`).join('\n')}

    **Last Event:**
    ${lastEvent || "The adventure begins. The party finds themselves together, ready for action."}

    **Your Task:**
    Advance the story by one turn. Create a compelling narrative. Describe the actions of all party members as they react to the situation, staying true to their personalities. Update the game state and character stats accordingly. Ensure the story is coherent and engaging.

    Provide your response in the specified JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: turnUpdateSchema,
      },
    });
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as TurnUpdate;
  } catch (error) {
    console.error("Error generating game turn:", error);
    throw new Error("Failed to get a valid response from the Game Master AI.");
  }
}

export async function generateSceneImage(prompt: string): Promise<string> {
  const fullPrompt = `A highly detailed, epic fantasy digital painting in the style of Dungeons & Dragons art. ${prompt}. Cinematic lighting, dramatic atmosphere.`;
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: fullPrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '16:9',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    throw new Error("No image was generated.");
  } catch (error) {
    console.error("Error generating scene image:", error);
    throw new Error("Failed to generate scene image.");
  }
}

export async function generateSpeech(text: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say with a dramatic, storytelling voice for a fantasy setting: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            // A voice well-suited for storytelling. Others include 'Puck', 'Charon', 'Zephyr'.
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return base64Audio;
    }
    throw new Error("No audio was generated from the text.");
  } catch (error) {
    console.error("Error generating speech:", error);
    throw new Error("Failed to generate speech audio.");
  }
}
