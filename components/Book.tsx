import React from 'react';
import { BookPage } from '../types';

interface BookProps {
  pages: BookPage[];
  currentPageIndex: number;
  isOpen: boolean;
  isLoading: boolean;
  onPageTurn: (direction: 'prev' | 'next') => void;
  onSpeak: (text: string) => void;
  onCancelSpeech: () => void;
  isSpeaking: boolean;
  isLoadingSpeech: boolean;
}

const Book: React.FC<BookProps> = ({ pages, currentPageIndex, isOpen, isLoading, onPageTurn, onSpeak, onCancelSpeech, isSpeaking, isLoadingSpeech }) => {
  const currentPage = pages[currentPageIndex];
  const narration = currentPage?.narration || "The story is about to begin...";

  const handleSpeechToggle = () => {
    if (isSpeaking) {
      onCancelSpeech();
    } else if (currentPage && !isLoadingSpeech) {
      onSpeak(narration);
    }
  };


  return (
    <div className="w-full h-full flex items-center justify-center p-4" style={{ perspective: '2000px' }}>
      <div
        className={`relative w-full max-w-5xl aspect-[2/1] transition-transform duration-1000 ease-in-out`}
        style={{ transformStyle: 'preserve-3d', transform: isOpen ? 'translateX(0%) rotateY(0deg)' : 'translateX(25%) rotateY(-30deg) scale(0.8)' }}
      >
        {/* Back Cover */}
        <div className="absolute w-1/2 h-full left-0 bg-amber-900 rounded-r-lg shadow-2xl border-l-4 border-t-4 border-b-4 border-amber-950" style={{ transform: 'translateZ(-1px)' }}></div>

        {/* Left Page (Inside) */}
        <div className="absolute w-1/2 h-full left-0 bg-stone-100 rounded-l-lg shadow-inner-lg p-8 md:p-12 overflow-y-auto flex flex-col">
            <div className="prose max-w-none text-stone-800 leading-relaxed flex-1">
                <p>{narration}</p>
            </div>
            <div className="flex justify-between items-center text-stone-500 font-serif pt-4">
              {currentPage && (
                <button 
                  onClick={handleSpeechToggle}
                  disabled={isLoadingSpeech}
                  className="p-2 rounded-full hover:bg-stone-200 disabled:opacity-50 disabled:cursor-wait transition-colors"
                  aria-label={isSpeaking ? "Stop narration" : "Read narration aloud"}
                >
                  {isLoadingSpeech ? (
                     <svg className="animate-spin h-6 w-6 text-stone-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : isSpeaking ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l4-4m0 4l-4-4" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  )}
                </button>
              )}
              <span>{currentPageIndex > -1 ? currentPageIndex * 2 + 1 : ''}</span>
            </div>
        </div>

        {/* Right Page (Inside) */}
        <div className="absolute w-1/2 h-full right-0 bg-stone-100 rounded-r-lg shadow-inner-lg p-2 flex flex-col items-center justify-center">
             <div className="relative w-full h-full bg-stone-200 border-4 border-stone-200 flex items-center justify-center">
                {isLoading && currentPageIndex === pages.length - 1 && (
                     <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10">
                        <div className="w-12 h-12 border-4 border-t-amber-800 border-stone-400 rounded-full animate-spin"></div>
                        <p className="mt-4 text-stone-100 font-cinzel tracking-widest text-sm">The artist sketches the scene...</p>
                    </div>
                )}
                {currentPage?.imageUrl ? (
                    <img src={currentPage.imageUrl} alt="Current Scene" className="w-full h-full object-cover" />
                ) : (
                    <div className="text-stone-500 font-cinzel text-xl">Awaiting Visions...</div>
                )}
            </div>
            <div className="text-center text-stone-500 font-serif pt-1">{currentPageIndex > -1 ? currentPageIndex * 2 + 2 : ''}</div>
        </div>
        
        {/* Front Cover */}
        <div
          className={`absolute w-1/2 h-full right-0 bg-amber-800 rounded-r-lg shadow-2xl border-r-4 border-t-4 border-b-4 border-amber-950 flex flex-col items-center justify-center p-8 transition-transform duration-1000 ease-in-out cursor-pointer`}
          style={{ transformOrigin: 'left', transform: isOpen ? 'rotateY(-180deg)' : 'rotateY(0deg)', backfaceVisibility: 'hidden' }}
        >
            <h2 className="font-cinzel text-4xl text-amber-200 drop-shadow-lg text-center">The Adventure Begins</h2>
            <div className="w-24 h-px bg-amber-400 my-4"></div>
            <p className="text-amber-300 text-center">Click 'Next Turn' to open the book and start your journey.</p>
        </div>

        {/* Page Turn Buttons */}
        {isOpen && (
             <>
                {currentPageIndex > 0 && (
                    <button onClick={() => onPageTurn('prev')} className="absolute top-1/2 -left-8 -translate-y-1/2 z-20 w-12 h-12 bg-slate-800/50 rounded-full flex items-center justify-center text-2xl text-amber-300 hover:bg-slate-700 transition-colors">
                        ‹
                    </button>
                )}
                {currentPageIndex < pages.length - 1 && (
                     <button onClick={() => onPageTurn('next')} className="absolute top-1/2 -right-8 -translate-y-1/2 z-20 w-12 h-12 bg-slate-800/50 rounded-full flex items-center justify-center text-2xl text-amber-300 hover:bg-slate-700 transition-colors">
                        ›
                    </button>
                )}
             </>
        )}
      </div>
    </div>
  );
};

export default Book;
