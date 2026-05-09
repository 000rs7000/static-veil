import React from 'react';
import { useGameStore } from '../../store/useGameStore';

export const LoadingScreen: React.FC = () => {
  const { loadingMessage } = useGameStore();

  return (
    <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center scanlines">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-1">
        <div className="w-4 h-4 bg-red-800 animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-4 h-4 bg-red-800 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-4 h-4 bg-red-800 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
      <p className="mt-16 text-red-500 font-mono text-xl tracking-[0.2em] glitch-text">
        {loadingMessage}
      </p>
    </div>
  );
};
