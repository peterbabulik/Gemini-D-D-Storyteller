
// FIX: Removed a circular import of 'Character'. The file defines the 'Character' interface and was incorrectly trying to import it from itself.
export interface Character {
  name: string;
  role: "Player";
  race: string;
  class: string;
  level: number;
  maxHealth: number;
  health: number;
  abilities: string[];
  inventory: string[];
  personality: string;
}

export interface GameState {
  location: string;
  quest: string;
  combatActive: boolean;
  turn: number;
}

export interface GameLogEntry {
  actor: string;
  event: string;
  timestamp: string;
}

export interface TurnUpdate {
  narration: string;
  visualPrompt: string;
  playerActions: {
    characterName: string;
    action: string;
  }[];
  updatedGameState: {
    location: string;
    quest: string;
    combatActive: boolean;
  };
  characterUpdates: {
    characterName: string;
    healthChange: number;
    inventoryChange: string;
  }[];
}

export interface BookPage {
  narration: string;
  imageUrl: string;
}