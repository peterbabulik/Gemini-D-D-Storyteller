
import React, { useEffect, useRef } from 'react';
import { GameLogEntry } from '../types';

interface GameLogProps {
  log: GameLogEntry[];
}

const GameLog: React.FC<GameLogProps> = ({ log }) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log]);

  return (
    <div className="w-full md:w-96 bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-slate-700 flex flex-col">
      <h2 className="text-2xl font-cinzel text-amber-300 mb-4 border-b border-slate-700 pb-2">Campaign Log</h2>
      <div className="flex-1 overflow-y-auto pr-2">
        {log.length === 0 && <p className="text-slate-500 italic">No events yet.</p>}
        <ul className="space-y-4">
          {log.map((entry, index) => (
            <li key={index} className="text-sm">
              <span className={`font-bold ${entry.actor === 'Game Master' ? 'text-amber-400' : 'text-cyan-400'}`}>{entry.actor}: </span>
              <span className="text-slate-300">{entry.event}</span>
            </li>
          ))}
        </ul>
        <div ref={logEndRef} />
      </div>
    </div>
  );
};

export default GameLog;
