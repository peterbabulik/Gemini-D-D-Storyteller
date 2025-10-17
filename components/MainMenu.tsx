import React from 'react';

interface MainMenuProps {
  onStartGame: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStartGame }) => {
  return (
    <div className="min-h-screen bg-slate-900 bg-cover bg-center bg-fixed flex flex-col items-center justify-center p-4" style={{backgroundImage: "url('https://picsum.photos/seed/dndbg/1920/1080')"}}>
      <div className="min-h-screen w-full bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center">
        <header className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-cinzel font-bold text-amber-300 drop-shadow-lg">Gemini D&D Storyteller</h1>
        </header>

        {/* Ornate Menu Box */}
        <div className="w-full max-w-sm p-2 bg-amber-900/80 border-4 border-amber-950 shadow-2xl rounded-lg">
          <div className="w-full p-2 bg-amber-800 border-2 border-amber-950 rounded-md">
            <div className="w-full p-8 bg-amber-900/50 border-2 border-amber-950/50 rounded-md flex flex-col items-center gap-4">
              
              <button
                onClick={onStartGame}
                className="w-full font-cinzel text-xl px-6 py-3 bg-amber-600 text-white rounded-md shadow-lg border-2 border-amber-400/50 hover:bg-amber-500 hover:border-amber-300 transition-all duration-300 transform hover:scale-105"
              >
                Begin Adventure
              </button>

              <button
                disabled
                className="w-full font-cinzel text-xl px-6 py-3 bg-slate-700 text-slate-500 rounded-md shadow-md border-2 border-slate-600/50 cursor-not-allowed"
              >
                Load Game
              </button>
              
              <button
                disabled
                className="w-full font-cinzel text-xl px-6 py-3 bg-slate-700 text-slate-500 rounded-md shadow-md border-2 border-slate-600/50 cursor-not-allowed"
              >
                Options
              </button>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MainMenu;
