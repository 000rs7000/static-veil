import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { KeyboardControls } from '@react-three/drei';
import { Player } from './Player';
import { Level } from './Level';
import { PostProcessing } from './PostProcessing';
import { TheHollowMan } from './TheHollowMan';
import { useGameStore } from '../../store/useGameStore';
import { Jumpscare } from './Jumpscare';
import { MenuKnife } from './MenuKnife';

const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump', keys: ['Space'] },
  { name: 'run', keys: ['Shift'] },
];

interface GameSceneProps {
  isMenu?: boolean;
}

export const GameScene: React.FC<GameSceneProps> = ({ isMenu }) => {
  const { inventory } = useGameStore();
  const hasKey = inventory.includes('Hospital Key');

  return (
    <KeyboardControls map={keyboardMap}>
      <Canvas 
        shadows 
        camera={{ position: [0, 1.6, 5], fov: 60 }} 
        dpr={[1, 2]}
      >
        <color attach="background" args={[isMenu ? '#0a0000' : '#000000']} />
        
        {/* Dark heavy fog */}
        {isMenu ? (
          <fog attach="fog" args={['#0a0000', 0, 10]} />
        ) : hasKey ? (
          <fog attach="fog" args={['#050505', 2, 25]} />
        ) : (
          <fog attach="fog" args={['#000000', 0, 5]} />
        )}
        
        {(hasKey || isMenu) && <ambientLight intensity={isMenu ? 0.02 : 0.05} />}

        <Physics gravity={[0, -9.81, 0]}>
          <Level />
          {!isMenu && <Player />}
          <TheHollowMan isMenu={isMenu} />
        </Physics>
        
        {isMenu && <MenuKnife />}
        {!isMenu && <Jumpscare />}

        <PostProcessing />
      </Canvas>
    </KeyboardControls>
  );
};
