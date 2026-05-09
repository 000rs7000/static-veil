import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, useKeyboardControls } from '@react-three/drei';
import { RigidBody, RapierRigidBody, CapsuleCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';
import { WomanPlayerModel } from './WomanPlayerModel';

const SPEED = 3.0;
const RUN_SPEED = 5.0;

export const Player = () => {
  const bodyRef = useRef<RapierRigidBody>(null);
  const [, getKeys] = useKeyboardControls();
  const { camera } = useThree();
  const { flashlightOn, toggleFlashlight, setGameState, gameState } = useGameStore();
  const flashLightRef = useRef<THREE.SpotLight>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'PLAYING') return;
      if (e.key.toLowerCase() === 'f') {
        toggleFlashlight();
      }
      if (e.key.toLowerCase() === 'p') {
        document.exitPointerLock();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleFlashlight, setGameState, gameState]);

  // Sync camera position with physics body
  useFrame((state) => {
    if (!bodyRef.current || gameState !== 'PLAYING') return;

    // Movement
    const keys = getKeys();
    const velocity = bodyRef.current.linvel();
    
    // Front/Back
    const frontVector = new THREE.Vector3(0, 0, (keys.backward ? 1 : 0) - (keys.forward ? 1 : 0));
    // Left/Right
    const sideVector = new THREE.Vector3((keys.left ? 1 : 0) - (keys.right ? 1 : 0), 0, 0);

    const direction = new THREE.Vector3();
    
    const moveSpeed = keys.run ? RUN_SPEED : SPEED;

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(moveSpeed)
      .applyEuler(camera.rotation); // Move in the direction the camera is looking

    // Apply horizontal velocity, keep vertical (falling)
    bodyRef.current.setLinvel({
      x: direction.x,
      y: velocity.y,
      z: direction.z
    }, true);

    // Update Camera Position
    const translation = bodyRef.current.translation();
    // Headbob effect
    const t = state.clock.elapsedTime;
    const isMoving = keys.forward || keys.backward || keys.left || keys.right;
    const bobOffset = isMoving ? Math.sin(t * (keys.run ? 10 : 6)) * 0.05 : 0;
    
    camera.position.set(translation.x, translation.y + 0.8 + bobOffset, translation.z);

    // Update flashlight direction
    if (flashLightRef.current) {
      flashLightRef.current.position.copy(camera.position);
      flashLightRef.current.position.y -= 0.2; 
      flashLightRef.current.position.x += 0.2; 
      
      const target = new THREE.Vector3();
      camera.getWorldDirection(target);
      target.multiplyScalar(10).add(flashLightRef.current.position);
      flashLightRef.current.target.position.copy(target);
      flashLightRef.current.target.updateMatrixWorld();
    }
  });

  return (
    <>
      <PointerLockControls 
        onUnlock={() => {
          if (useGameStore.getState().gameState === 'PLAYING') {
            setGameState('PAUSED');
          }
        }}
        onLock={() => {
          if (useGameStore.getState().gameState === 'PAUSED') {
            setGameState('PLAYING');
          }
        }}
      />
      <RigidBody 
        ref={bodyRef} 
        colliders={false} 
        mass={1} 
        type="dynamic" 
        position={[0, 2, 0]} 
        enabledRotations={[false, false, false]}
      >
        <CapsuleCollider args={[0.5, 0.4]} />
        <WomanPlayerModel />
      </RigidBody>

      <spotLight
        ref={flashLightRef}
        color="#ffffff"
        intensity={flashlightOn ? 2 : 0}
        angle={0.6}
        penumbra={0.5}
        distance={25}
        castShadow
      />
      <primitive object={flashLightRef.current?.target || new THREE.Object3D()} />
    </>
  );
};


