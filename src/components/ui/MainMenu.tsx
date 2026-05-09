import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { Volume2, VolumeX, ChevronLeft, Sliders, BookOpen } from 'lucide-react';

export const MainMenu: React.FC = () => {
  const { setGameState, setLoadingMessage } = useGameStore();
  const [muted, setMuted] = useState(false);
  const [view, setView] = useState<'MAIN' | 'SETTINGS' | 'CHAPTERS'>('MAIN');

  const startGame = () => {
    setLoadingMessage('Initializing STATIC VEIL...');
    setGameState('LOADING');
    setTimeout(() => {
      setLoadingMessage('Corrupting reality slowly...');
      setTimeout(() => {
        setLoadingMessage('The Hollow Man is watching...');
        setTimeout(() => {
          setGameState('PLAYING');
        }, 2500);
      }, 2500);
    }, 2500);
  };

  return (
    <div className="absolute inset-0 z-40 flex flex-col items-start justify-center p-12 sm:p-24 select-none bg-black/40">
      <div className="mb-16 animate-pulse flicker">
        <h1 className="text-6xl sm:text-8xl font-serif font-bold text-red-700 tracking-[0.2em] glitch-text drop-shadow-[0_0_15px_rgba(255,0,0,0.8)]">
          STATIC VEIL
        </h1>
        <p className="text-sm sm:text-base font-mono text-gray-400 mt-4 tracking-[0.3em] uppercase">
          Abandon all hope, ye who enter here.
        </p>
      </div>

      {view === 'MAIN' && (
        <nav className="flex flex-col gap-6 text-xl sm:text-2xl font-mono text-gray-300">
          <button onClick={startGame} className="text-left w-fit glitch-hover hover:text-white hover:pl-2 transition-all duration-300 uppercase tracking-widest flex items-center">
            <span className="opacity-0 group-hover:opacity-100 mr-2 text-red-500">▶</span>
            New Game
          </button>
          <button className="text-left w-fit glitch-hover hover:text-gray-400 opacity-50 cursor-not-allowed uppercase tracking-widest">
            Continue
          </button>
          <button onClick={() => setView('CHAPTERS')} className="text-left w-fit glitch-hover hover:text-white hover:pl-2 transition-all duration-300 uppercase tracking-widest flex items-center">
            <span className="opacity-0 group-hover:opacity-100 mr-2 text-red-500">▶</span>
            Chapters
          </button>
          <button onClick={() => setView('SETTINGS')} className="text-left w-fit glitch-hover hover:text-white hover:pl-2 transition-all duration-300 uppercase tracking-widest flex items-center">
            <span className="opacity-0 group-hover:opacity-100 mr-2 text-red-500">▶</span>
            Settings
          </button>
          <button className="text-left w-fit glitch-hover hover:text-white hover:pl-2 transition-all duration-300 uppercase tracking-widest">
            Exit
          </button>
        </nav>
      )}

      {view === 'SETTINGS' && (
        <div className="flex flex-col gap-8 text-xl font-mono text-gray-300 w-full max-w-md">
          <div className="flex items-center gap-4 text-red-500 text-3xl mb-4 border-b border-red-900/50 pb-4">
            <Sliders size={32} />
            <h2>SETTINGS</h2>
          </div>
          
          <div className="flex justify-between items-center group">
            <span>MASTER VOLUME</span>
            <span className="text-red-500 group-hover:text-red-400 cursor-pointer">100%</span>
          </div>
          <div className="flex justify-between items-center group">
            <span>GRAPHICS</span>
            <span className="text-red-500 group-hover:text-red-400 cursor-pointer">ULTRA</span>
          </div>
          <div className="flex justify-between items-center group">
            <span>MOUSE SENSITIVITY</span>
            <span className="text-red-500 group-hover:text-red-400 cursor-pointer">5.0</span>
          </div>
          <div className="flex justify-between items-center group">
            <span>FILM GRAIN</span>
            <span className="text-red-500 group-hover:text-red-400 cursor-pointer">ON</span>
          </div>
          <div className="flex justify-between items-center group">
            <span>HEAD BOB</span>
            <span className="text-red-500 group-hover:text-red-400 cursor-pointer">ON</span>
          </div>

          <button onClick={() => setView('MAIN')} className="text-left w-fit mt-8 hover:text-white hover:pl-2 transition-all duration-300 uppercase tracking-widest flex items-center text-red-600">
            <ChevronLeft className="mr-2" />
            BACK
          </button>
        </div>
      )}

      {view === 'CHAPTERS' && (
        <div className="flex flex-col gap-6 text-xl font-mono text-gray-300 w-full max-w-lg">
          <div className="flex items-center gap-4 text-red-500 text-3xl mb-4 border-b border-red-900/50 pb-4">
            <BookOpen size={32} />
            <h2>CHAPTER SELECT</h2>
          </div>

          <button onClick={startGame} className="text-left flex flex-col group hover:pl-4 transition-all duration-300">
            <span className="text-red-500 group-hover:text-red-400">CHAPTER 1: AWAKENING</span>
            <span className="text-sm text-gray-500">The hospital seems abandoned. Escape.</span>
          </button>
          
          <button className="text-left flex flex-col group opacity-50 cursor-not-allowed">
            <span className="text-red-500 line-through">CHAPTER 2: DESCENT</span>
            <span className="text-sm text-gray-500">LOCKED</span>
          </button>

          <button className="text-left flex flex-col group opacity-50 cursor-not-allowed">
            <span className="text-red-500 line-through">CHAPTER 3: THE HOLLOW MAN</span>
            <span className="text-sm text-gray-500">LOCKED</span>
          </button>

          <button onClick={() => setView('MAIN')} className="text-left w-fit mt-8 hover:text-white hover:pl-2 transition-all duration-300 uppercase tracking-widest flex items-center text-red-600">
            <ChevronLeft className="mr-2" />
            BACK
          </button>
        </div>
      )}

      {/* Audio Toggle */}
      <button 
        onClick={() => setMuted(!muted)}
        className="absolute bottom-8 right-8 text-gray-500 hover:text-white transition-colors"
      >
        {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>

      {/* Fake distortion flashes */}
      <div className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-10 transition-opacity bg-red-900 mix-blend-color-burn z-50"></div>
    </div>
  );
};
