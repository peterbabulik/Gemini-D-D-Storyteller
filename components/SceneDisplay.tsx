import React from 'react';

interface SceneDisplayProps {
  description: string | null;
  imageUrl: string | null;
  isLoading: boolean;
}

const SceneDisplay: React.FC<SceneDisplayProps> = ({ description, imageUrl, isLoading }) => {
  return (
    <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-lg rounded-lg shadow-2xl border border-slate-700 overflow-hidden">
      <div className="relative w-full aspect-video bg-slate-800 flex items-center justify-center">
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10">
            <div className="w-16 h-16 border-4 border-t-amber-400 border-slate-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-lg font-cinzel tracking-widest">The scrolls of fate are unfurling...</p>
          </div>
        )}
        {imageUrl ? (
          <img src={imageUrl} alt="Current Scene" className="w-full h-full object-cover" />
        ) : (
          <div className="text-slate-500 font-cinzel text-2xl">Awaiting Visions...</div>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col justify-between overflow-y-auto">
        <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed">
          <p>{description || "The story is about to begin. Click 'Next Turn' to start your adventure."}</p>
        </div>
      </div>
    </div>
  );
};

export default SceneDisplay;
