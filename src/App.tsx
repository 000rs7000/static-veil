import React, { Suspense } from 'react';
import { useGameStore } from './store/useGameStore';
import { MainMenu } from './components/ui/MainMenu';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { HUD } from './components/ui/HUD';
import { PauseMenu } from './components/ui/PauseMenu';
import { GameScene } from './components/3d/GameScene';
import { AudioEngine } from './components/AudioEngine';

export default function App() {
  const { gameState } = useGameStore();

  return (
    <div className="relative w-full h-full bg-black overflow-hidden font-mono text-white scanlines">
      <AudioEngine />
      
      {gameState === 'MENU' && <MainMenu />}
      {gameState === 'LOADING' && <LoadingScreen />}
      {gameState === 'PAUSED' && <PauseMenu />}
      
      {(gameState === 'PLAYING' || gameState === 'PAUSED' || gameState === 'MENU') && (
        <div className="absolute inset-0 z-10">
          <Suspense fallback={null}>
            <GameScene isMenu={gameState === 'MENU'} />
          </Suspense>
        </div>
      )}

      {gameState === 'PLAYING' && <HUD />}

      
      <div 
        className="pointer-events-none absolute inset-0 z-50 opacity-10 mix-blend-overlay"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      ></div>
    </div>
  );
}
