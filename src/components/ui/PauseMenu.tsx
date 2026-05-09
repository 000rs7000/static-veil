import React from 'react';
import { useGameStore } from '../../store/useGameStore';

export const PauseMenu = () => {
  const { setGameState } = useGameStore();

  return (
    <div className="absolute inset-0 z-40 bg-black/80 flex flex-col items-center justify-center pointer-events-auto">
      <h1 className="text-5xl font-bold text-red-600 mb-8 tracking-widest drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]">
        PAUSED
      </h1>
      <button 
        onClick={() => setGameState('PLAYING')}
        className="px-8 py-3 text-2xl border-2 border-red-800 text-red-500 hover:bg-red-900 hover:text-white transition-all cursor-pointer mb-6"
      >
        RESUME (P / ESC)
      </button>
      <button 
        onClick={() => setGameState('MENU')}
        className="px-8 py-3 text-xl border-2 border-zinc-800 text-zinc-500 hover:bg-zinc-800 hover:text-white transition-all cursor-pointer"
      >
        MAIN MENU
      </button>
      <div className="absolute bottom-10 left-10 text-zinc-500 max-w-md">
        <p>You can see her body if you look down.</p>
        <p>The Hollow Man is 9 feet tall.</p>
      </div>
    </div>
  );
};
