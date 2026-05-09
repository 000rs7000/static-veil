import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { Volume2, VolumeX } from 'lucide-react';

export const MainMenu: React.FC = () => {
  const { setGameState, setLoadingMessage, setChapter } = useGameStore();
  const [muted, setMuted] = useState(false);
  const [activeMenu, setActiveMenu] = useState<'MAIN' | 'CHAPTERS' | 'SETTINGS'>('MAIN');

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
    <div className="absolute inset-0 z-40 flex flex-col items-start justify-center p-12 sm:p-24 select-none">
      <div className="mb-16 animate-pulse flicker">
        <h1 className="text-6xl sm:text-8xl font-serif font-bold text-red-700 tracking-[0.2em] glitch-text drop-shadow-[0_0_15px_rgba(255,0,0,0.8)]">
          STATIC VEIL
        </h1>
        <p className="text-sm sm:text-base font-mono text-gray-400 mt-4 tracking-[0.3em] uppercase">
          Abandon all hope, ye who enter here.
        </p>
      </div>

      <nav className="flex flex-col gap-6 text-xl sm:text-2xl font-mono text-gray-300">
        {activeMenu === 'MAIN' && (
          <>
            <button onClick={startGame} className="text-left w-fit glitch-hover hover:text-white hover:pl-2 transition-all duration-300 uppercase tracking-widest flex items-center">
              <span className="opacity-0 group-hover:opacity-100 mr-2 text-red-500">▶</span>
              New Game
            </button>
            <button className="text-left w-fit glitch-hover hover:text-gray-400 opacity-50 cursor-not-allowed uppercase tracking-widest">
              Continue
            </button>
            <button onClick={() => setActiveMenu('CHAPTERS')} className="text-left w-fit glitch-hover hover:text-white hover:pl-2 transition-all duration-300 uppercase tracking-widest flex items-center">
              <span className="opacity-0 group-hover:opacity-100 mr-2 text-red-500">▶</span>
              Chapters
            </button>
            <button onClick={() => setActiveMenu('SETTINGS')} className="text-left w-fit glitch-hover hover:text-white hover:pl-2 transition-all duration-300 uppercase tracking-widest flex items-center">
              <span className="opacity-0 group-hover:opacity-100 mr-2 text-red-500">▶</span>
              Settings
            </button>
            <button className="text-left w-fit glitch-hover hover:text-white hover:pl-2 transition-all duration-300 uppercase tracking-widest">
              Exit
            </button>
          </>
        )}

        {activeMenu === 'CHAPTERS' && (
          <>
            <h2 className="text-3xl text-red-500 mb-4 opacity-80">SELECT CHAPTER</h2>
            {[1, 2, 3, 4, 5].map((chapter) => (
              <button key={chapter} onClick={() => { setChapter(chapter); startGame(); }} className="text-left w-fit glitch-hover hover:text-white hover:pl-2 transition-all duration-300 uppercase tracking-widest flex items-center">
                <span className="opacity-0 group-hover:opacity-100 mr-2 text-red-500">▶</span>
                Chapter {chapter}
              </button>
            ))}
            <button onClick={() => setActiveMenu('MAIN')} className="text-left w-fit text-sm text-gray-500 hover:text-white mt-8 uppercase tracking-widest">
              &lt; Back
            </button>
          </>
        )}

        {activeMenu === 'SETTINGS' && (
          <>
            <h2 className="text-3xl text-red-500 mb-4 opacity-80">SETTINGS</h2>
            <div className="flex flex-col gap-4 text-lg">
              <div className="flex justify-between items-center w-64 border-b border-gray-800 pb-2">
                <span className="opacity-70">Master Volume</span>
                <span className="text-white cursor-pointer hover:text-red-500">100%</span>
              </div>
              <div className="flex justify-between items-center w-64 border-b border-gray-800 pb-2">
                <span className="opacity-70">Mouse Sensitivity</span>
                <span className="text-white cursor-pointer hover:text-red-500">5.0</span>
              </div>
              <div className="flex justify-between items-center w-64 border-b border-gray-800 pb-2">
                <span className="opacity-70">Film Grain</span>
                <span className="text-red-500 cursor-pointer">ON</span>
              </div>
              <div className="flex justify-between items-center w-64 border-b border-gray-800 pb-2">
                <span className="opacity-70">Subtitles</span>
                <span className="text-red-500 cursor-pointer">ON</span>
              </div>
            </div>
            <button onClick={() => setActiveMenu('MAIN')} className="text-left w-fit text-sm text-gray-500 hover:text-white mt-8 uppercase tracking-widest">
              &lt; Back
            </button>
          </>
        )}
      </nav>

      {/* Audio Toggle (since browsers block autoplay) */}
      <button 
        onClick={() => setMuted(!muted)}
        className="absolute bottom-8 right-8 text-gray-500 hover:text-white transition-colors"
      >
        {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>

      {/* Fake distortion flashes */}
      <div className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-10 transition-opacity bg-white mix-blend-difference z-50"></div>
    </div>
  );
};
