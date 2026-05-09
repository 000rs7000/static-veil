import React from 'react';
import { EffectComposer, Noise, Glitch, Vignette, Scanline } from '@react-three/postprocessing';
import { GlitchMode, BlendFunction } from 'postprocessing';
import { useGameStore } from '../../store/useGameStore';

export const PostProcessing = () => {
  const sanity = useGameStore((state) => state.sanity);
  
  return (
    <EffectComposer disableNormalPass>
      <Noise premultiply blendFunction={BlendFunction.OVERLAY} opacity={sanity < 50 ? 0.8 : 0.4} />
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
      <Scanline blendFunction={BlendFunction.OVERLAY} density={1.2} opacity={0.1} />
      
      {sanity < 30 && (
        <Glitch 
          delay={[1.5, 3.5]} // min and max delay
          duration={[0.2, 0.4]} // min and max duration
          strength={[0.2, 0.4]} // min and max strength
          mode={GlitchMode.SPORADIC}
          active
        />
      )}
      
      {sanity < 15 && (
        <Glitch 
          delay={[0.5, 1.5]}
          duration={[0.1, 0.5]}
          strength={[0.5, 1.0]}
          mode={GlitchMode.CONSTANT_WILD}
          active
        />
      )}
    </EffectComposer>
  );
};
