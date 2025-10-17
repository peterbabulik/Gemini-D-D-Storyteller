import React from 'react';
import { Character } from '../types';

interface CharacterSheetProps {
  character: Character;
  isActive: boolean;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ character, isActive }) => {
  const healthPercentage = (character.health / character.maxHealth) * 100;

  const getHealthColor = () => {
    if (healthPercentage > 60) return 'bg-green-500';
    if (healthPercentage > 30) return 'bg-yellow-500';
    return 'bg-red-600';
  };

  const cardClasses = `
    w-48 md:w-56 flex-shrink-0 bg-slate-800/70 p-3 rounded-lg shadow-lg border-2 backdrop-blur-sm
    transition-all duration-300 ease-in-out cursor-pointer
    ${isActive
      ? 'border-amber-400 scale-105 -translate-y-4 shadow-xl shadow-amber-900/50'
      : 'border-slate-700 hover:border-slate-500 hover:-translate-y-2'
    }
  `;

  return (
    <div className={cardClasses}>
      {/* Character Portrait */}
      <div className="w-full h-24 md:h-32 bg-slate-700 rounded-md mb-3 overflow-hidden border border-slate-600">
        <img 
            src={`https://picsum.photos/seed/${character.name}/200/300`} 
            alt={`${character.name} portrait`}
            className="w-full h-full object-cover object-top"
        />
      </div>

      {/* Character Info */}
      <div className="flex justify-between items-baseline mb-1">
        <h3 className="text-md md:text-lg font-bold font-cinzel text-amber-300 truncate">{character.name}</h3>
        <span className="text-xs text-slate-400">Lvl {character.level}</span>
      </div>
      <p className="text-xs text-slate-300 mb-2 truncate">{character.race} {character.class}</p>

      {/* Health Bar */}
      <div className="w-full bg-slate-700 rounded-full h-3 mb-1 border border-slate-600">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getHealthColor()}`}
          style={{ width: `${healthPercentage}%` }}
        ></div>
      </div>
      <p className="text-right text-xs font-mono text-slate-400 mb-3">{character.health}/{character.maxHealth}</p>

      {/* Inventory */}
      <div>
        <h4 className="font-bold text-slate-400 text-xs mb-1">Inventory</h4>
        <ul className="text-xs text-slate-300 space-y-1">
          {character.inventory.slice(0, 2).map((item, index) => (
            <li key={index} className="truncate">&#x25C8; {item}</li>
          ))}
          {character.inventory.length > 2 && <li className="text-slate-500 italic">...and more</li>}
          {character.inventory.length === 0 && <li className="text-slate-500 italic">Empty</li>}
        </ul>
      </div>
    </div>
  );
};

export default CharacterSheet;
