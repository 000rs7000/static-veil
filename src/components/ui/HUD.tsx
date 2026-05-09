import React from 'react';
import { useGameStore } from '../../store/useGameStore';

export const HUD: React.FC = () => {
  const { sanity, flashlightOn, inventory, interactPrompt } = useGameStore();

  return (
    <div className="absolute inset-0 pointer-events-none z-30 select-none">
      {/* Reticle */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white/50 rounded-full"></div>

      {/* Interaction Prompt */}
      {interactPrompt && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-8 font-mono text-white text-sm tracking-widest drop-shadow-[0_0_5px_rgba(0,0,0,1)] animate-pulse">
          {interactPrompt}
        </div>
      )}

      {/* Top Left: Status */}
      <div className="absolute top-8 left-8 font-mono space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs tracking-widest">HR:</span>
          <span className={`text-sm ${sanity < 30 ? 'text-red-500 animate-pulse' : 'text-green-500'}`}>
             {140 - sanity} BPM
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs tracking-widest">FLASHLIGHT:</span>
          <span className={`text-sm ${flashlightOn ? 'text-white' : 'text-gray-600'}`}>
            {flashlightOn ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>

      {/* Top Right: Camcorder REC UI */}
      <div className="absolute top-8 right-8 font-mono flex items-center gap-2 text-red-500">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse flicker"></div>
        <span className="tracking-widest text-lg font-bold">REC</span>
      </div>
      <div className="absolute top-16 right-8 text-xs font-mono text-white/70">
        SP 0:00:23 / 1:30:00
      </div>

      {/* Bottom Right: Inventory slots */}
      <div className="absolute bottom-8 right-8 flex gap-4">
        {[0, 1, 2].map((slot) => (
          <div key={slot} className="w-12 h-12 border border-white/20 bg-black/40 flex items-center justify-center">
            {inventory[slot] && <span className="text-xs text-center text-white/80">{inventory[slot]}</span>}
          </div>
        ))}
      </div>

      {/* Sanity Vignette overlay base */}
      {sanity < 50 && (
         <div 
           className="absolute inset-0 pointer-events-none transition-opacity duration-1000 mix-blend-multiply" 
           style={{ 
             background: 'radial-gradient(circle, transparent 30%, rgba(100,0,0,0.4) 80%, black 100%)',
             opacity: (50 - sanity) / 50 
           }} 
         />
      )}
    </div>
  );
};
