import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../store/useGameStore';

export const HUD: React.FC = () => {
  const { sanity, flashlightOn, inventory, interactPrompt, dialogue } = useGameStore();

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

      {/* Dialogue Box */}
      {dialogue && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 max-w-2xl w-full text-center">
          <p className="text-white font-serif text-xl tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] px-4 py-2 bg-black/40 border-t border-b border-white/10 italic">
            "{dialogue}"
          </p>
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
      <div className="absolute bottom-8 right-8 flex flex-col items-end gap-2">
        <span className="text-gray-500 text-xs tracking-widest uppercase mb-1">POCKETS</span>
        <div className="flex gap-4">
          {[0, 1, 2].map((slot) => (
            <div key={slot} className="w-14 h-14 border border-white/20 bg-black/60 flex items-center justify-center relative shadow-[0_0_10px_rgba(0,0,0,0.5)]">
              {inventory[slot] && (
                <div className="flex flex-col items-center justify-center w-full h-full text-center p-1">
                  {/* Pseudo item icon based on name */}
                  {inventory[slot] === 'Hospital Key' && <span className="text-yellow-400 text-xl font-sans font-bold shadow-yellow-500 drop-shadow-md">🗝️</span>}
                  {inventory[slot] === 'Batteries' && <span className="text-green-400 text-xl font-sans drop-shadow-md">🔋</span>}
                  {inventory[slot] === 'Strange Tape' && <span className="text-gray-300 text-xl font-sans drop-shadow-md">📼</span>}
                  <span className="text-[9px] text-white/80 uppercase mt-1 leading-tight tracking-wider font-bold">
                    {inventory[slot].split(' ')[0]}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
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
