import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';

interface InteractableItemProps {
  name: string;
  position: [number, number, number];
  color?: string;
  isKey?: boolean;
  noLight?: boolean;
}

export const InteractableItem: React.FC<InteractableItemProps> = ({ name, position, color = '#ffcc00', isKey = false, noLight = false }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const { setInteractPrompt, addToInventory, inventory, triggerJumpscare } = useGameStore();
  const [pickedUp, setPickedUp] = useState(false);
  const [isNear, setIsNear] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'e' && isNear && !pickedUp) {
        if (inventory.length < 3) {
          addToInventory(name);
          setPickedUp(true);
          setInteractPrompt(null);
          
          if (name === 'Hospital Key') {
            triggerJumpscare();
          }
        } else {
          setInteractPrompt('Inventory Full');
          setTimeout(() => setInteractPrompt(null), 2000);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (isNear) setInteractPrompt(null);
    };
  }, [isNear, pickedUp, inventory, name, addToInventory, setInteractPrompt, triggerJumpscare]);

  useFrame((state, delta) => {
    if (pickedUp || !meshRef.current) return;
    
    // Rotate item slowly to draw attention
    meshRef.current.rotation.y += delta;
    
    // Hovering effect
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;

    // Check distance between player camera and item
    const distance = camera.position.distanceTo(meshRef.current.position);
    
    // If close enough
    if (distance < 2.5) {
      if (!isNear) {
        setIsNear(true);
        setInteractPrompt(`Press E to pick up ${name}`);
      }
    } else {
      if (isNear) {
        setIsNear(false);
        setInteractPrompt(null);
      }
    }
  });

  if (pickedUp) return null;

  return (
    <RigidBody type="fixed" colliders="cuboid" position={position}>
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={isKey ? [0.4, 0.1, 0.2] : [0.3, 0.3, 0.3]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} roughness={0.4} />
      </mesh>
      {!noLight && <pointLight position={[0, 0, 0]} color={color} intensity={0.5} distance={2} />}
    </RigidBody>
  );
};
