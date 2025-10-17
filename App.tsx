import React, { useState, useCallback } from 'react';
import { initialCharacters } from './data/characters';
import { generateGameTurn, generateSceneImage } from './services/geminiService';
import { Character, GameState, BookPage, TurnUpdate } from './types';
import CharacterSheet from './components/CharacterSheet';
import Book from './components/Book';
import MainMenu from './components/MainMenu';
import { useSpeech } from './hooks/useSpeech';

type AppView = 'menu' | 'game';

const App: React.FC = () => {
    const [view, setView] = useState<AppView>('menu');
    const [characters, setCharacters] = useState<Character[]>(initialCharacters);
    const [gameState, setGameState] = useState<GameState>({
        location: "Tavern in Mistwood Village",
        quest: "No active quest yet",
        combatActive: false,
        turn: 0,
    });
    const [bookPages, setBookPages] = useState<BookPage[]>([]);
    const [currentPageIndex, setCurrentPageIndex] = useState(-1);
    const [isBookOpen, setIsBookOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeCharacterName, setActiveCharacterName] = useState<string>(initialCharacters[0].name);
    const { speak, cancel, isSpeaking, isLoadingSpeech } = useSpeech();

    const handleStartGame = () => {
        setView('game');
    };

    const handleNextTurn = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        
        if (!isBookOpen) {
            setIsBookOpen(true);
        }

        const lastEvent = bookPages.length > 0 ? bookPages[bookPages.length - 1].narration : "The adventure begins.";

        try {
            const turnUpdate: TurnUpdate = await generateGameTurn(gameState, characters, lastEvent);
            
            // Auto-play narration for the new turn
            speak(turnUpdate.narration);
            
            const placeholderPage: BookPage = { narration: turnUpdate.narration, imageUrl: '' };
            const newPages = [...bookPages, placeholderPage];
            setBookPages(newPages);
            setCurrentPageIndex(newPages.length - 1);

            const imageUrlPromise = generateSceneImage(turnUpdate.visualPrompt);

            const updatedCharacters = characters.map(char => {
                const update = turnUpdate.characterUpdates.find(u => u.characterName === char.name);
                if (update) {
                    return {
                        ...char,
                        health: Math.max(0, Math.min(char.maxHealth, char.health + update.healthChange)),
                    };
                }
                return char;
            });
            
            setCharacters(updatedCharacters);
            setGameState({ ...turnUpdate.updatedGameState, turn: gameState.turn + 1 });

            const currentIndex = updatedCharacters.findIndex(c => c.name === activeCharacterName);
            const nextIndex = (currentIndex + 1) % updatedCharacters.length;
            setActiveCharacterName(updatedCharacters[nextIndex].name);

            const newImageUrl = await imageUrlPromise;
            setBookPages(prevPages => {
                const updatedPages = [...prevPages];
                updatedPages[updatedPages.length - 1].imageUrl = newImageUrl;
                return updatedPages;
            });

        } catch (e) {
            const err = e as Error;
            setError(err.message || "An unknown error occurred.");
            console.error(e);
            // Rollback optimistic UI updates on failure
            setBookPages(prev => prev.slice(0, -1));
            setCurrentPageIndex(prev => Math.max(-1, prev - 1));
            cancel(); // Stop any speech that might have started

        } finally {
            setIsLoading(false);
        }
    }, [gameState, characters, bookPages, activeCharacterName, isBookOpen, speak, cancel]);

    const handlePageTurn = (direction: 'prev' | 'next') => {
        cancel(); // Stop any active narration when turning pages
        if (direction === 'prev' && currentPageIndex > 0) {
            setCurrentPageIndex(currentPageIndex - 1);
        }
        if (direction === 'next' && currentPageIndex < bookPages.length - 1) {
            setCurrentPageIndex(currentPageIndex + 1);
        }
    };

    if (view === 'menu') {
        return <MainMenu onStartGame={handleStartGame} />;
    }

    return (
        <div className="min-h-screen bg-slate-900 bg-cover bg-center bg-fixed flex flex-col" style={{backgroundImage: "url('https://picsum.photos/seed/dndbg/1920/1080')"}}>
            <div className="min-h-screen bg-black/70 backdrop-blur-sm p-4 md:p-6 flex flex-col">
                <header className="text-center mb-2">
                    <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-amber-300 drop-shadow-lg">Gemini D&D Storyteller</h1>
                </header>

                <main className="flex-1 flex flex-col justify-center items-center gap-4">
                    <Book 
                        pages={bookPages}
                        currentPageIndex={currentPageIndex}
                        isOpen={isBookOpen}
                        isLoading={isLoading}
                        onPageTurn={handlePageTurn}
                        onSpeak={speak}
                        onCancelSpeech={cancel}
                        isSpeaking={isSpeaking}
                        isLoadingSpeech={isLoadingSpeech}
                    />
                </main>

                <footer className="w-full pt-4 flex flex-col items-center gap-4">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handleNextTurn}
                            disabled={isLoading}
                            className="font-cinzel text-xl px-8 py-3 bg-amber-600 text-white rounded-lg shadow-lg hover:bg-amber-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                        >
                            {isLoading ? 'Thinking...' : 'Next Turn'}
                        </button>
                    </div>
                    {error && <p className="text-red-400 mt-2 text-center">{error}</p>}
                    
                    <div className="flex justify-center items-end gap-2 md:gap-4 pb-2 transition-all duration-500">
                        {characters.map(char => (
                            <CharacterSheet 
                                key={char.name} 
                                character={char} 
                                isActive={char.name === activeCharacterName} 
                            />
                        ))}
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default App;
