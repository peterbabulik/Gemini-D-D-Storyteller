
import { Character } from '../types';

export const initialCharacters: Character[] = [
    {
        name: "Thorne",
        role: "Player",
        race: "Human",
        class: "Fighter",
        level: 5,
        maxHealth: 45,
        health: 45,
        abilities: ["Second Wind", "Action Surge", "Extra Attack", "Great Weapon Fighting"],
        inventory: ["Greatsword", "Chain Mail", "Healing Potion"],
        personality: "Bold, protective, and direct. Former soldier who values loyalty and honor. Takes point in combat situations."
    },
    {
        name: "Lyra",
        role: "Player",
        race: "Elf",
        class: "Wizard",
        level: 5,
        maxHealth: 28,
        health: 28,
        abilities: ["Arcane Recovery", "Fireball", "Counterspell", "Fly"],
        inventory: ["Spellbook", "Wand", "Mage Armor Scroll"],
        personality: "Intelligent, curious, and occasionally arrogant. Fascinated by magical knowledge and ancient history."
    },
    {
        name: "Grimble",
        role: "Player",
        race: "Halfling",
        class: "Rogue",
        level: 5,
        maxHealth: 35,
        health: 35,
        abilities: ["Sneak Attack", "Cunning Action", "Uncanny Dodge"],
        inventory: ["Shortsword", "Shortbow", "Leather Armor", "Thieves' Tools"],
        personality: "Witty, light-fingered, and surprisingly brave. Always looking for treasure and tends to act before thinking."
    },
    {
        name: "Aurelia",
        role: "Player",
        race: "Aasimar",
        class: "Cleric",
        level: 5,
        maxHealth: 40,
        health: 40,
        abilities: ["Channel Divinity", "Spiritual Weapon", "Cure Wounds", "Revivify"],
        inventory: ["Mace", "Shield", "Chain Shirt", "Holy Symbol"],
        personality: "Compassionate, wise, and steadfast. Dedicated to her deity and protecting the innocent. Voice of reason in the party."
    }
];
