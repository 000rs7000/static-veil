import React from 'react';
import { useGameStore } from '../../store/useGameStore';

export const PauseMenu: React.FC = () => {
  const { setGameState } = useGameStore();

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm select-none font-mono">
      <h1 className="text-6xl text-red-600 mb-8 tracking-[0.3em] font-bold glitch-text">PAUSED</h1>
      
      <div className="flex flex-col gap-6 text-xl items-center w-full max-w-sm">
        <button
          onClick={() => setGameState('PLAYING')}
          className="text-white hover:text-red-500 hover:scale-105 transition-all tracking-widest uppercase py-2"
        >
           Click To Resume
        </button>
        
        <div className="w-full text-sm text-gray-400 uppercase tracking-widest border border-gray-800 p-6 bg-black/60 shadow-[0_0_15px_rgba(0,0,0,0.8)]">
          <h3 className="text-red-500 mb-4 border-b border-gray-800 pb-2 text-center text-lg">Controls</h3>
          <div className="grid grid-cols-2 gap-y-3">
            <span>W/A/S/D</span> <span className="text-right text-gray-500">Move</span>
            <span>MOUSE</span> <span className="text-right text-gray-500">Look</span>
            <span>SHIFT</span> <span className="text-right text-gray-500">Sprint</span>
            <span>F</span> <span className="text-right text-gray-500">Flashlight</span>
            <span>E</span> <span className="text-right text-gray-500">Interact</span>
            <span>M / ESC</span> <span className="text-right text-gray-500">Pause</span>
          </div>
        </div>
        
        <button
          onClick={() => setGameState('MENU')}
          className="text-gray-600 hover:text-white hover:scale-105 mt-4 transition-all tracking-widest uppercase text-sm"
        >
          Return to Details
        </button>
      </div>
      
      {/* Visual noise overlay for pause screen */}
      <div 
        className="pointer-events-none absolute inset-0 z-50 opacity-5 mix-blend-overlay"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      ></div>
    </div>
  );
};
