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
            useGameStore.getState().showDialogue("What was that...?", 3000);
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

  // Custom 3D geometries for our specific items
  const renderItemModel = () => {
    switch (name) {
      case 'Hospital Key':
        return (
          <group ref={meshRef}>
            {/* Key Head */}
            <mesh position={[0, 0, 0]} castShadow>
              <torusGeometry args={[0.08, 0.03, 8, 16]} />
              <meshStandardMaterial color={color} roughness={0.3} metalness={0.9} />
            </mesh>
            {/* Key Body */}
            <mesh position={[0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
              <meshStandardMaterial color={color} roughness={0.3} metalness={0.9} />
            </mesh>
            {/* Key Teeth */}
            <mesh position={[0.25, -0.04, 0]} castShadow>
              <boxGeometry args={[0.04, 0.08, 0.01]} />
              <meshStandardMaterial color={color} roughness={0.3} metalness={0.9} />
            </mesh>
            <mesh position={[0.18, -0.03, 0]} castShadow>
              <boxGeometry args={[0.04, 0.06, 0.01]} />
              <meshStandardMaterial color={color} roughness={0.3} metalness={0.9} />
            </mesh>
          </group>
        );
      case 'Batteries':
        return (
          <group ref={meshRef}>
            {/* Battery 1 */}
            <mesh position={[-0.05, 0, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 0.2, 16]} />
              <meshStandardMaterial color="#222" roughness={0.8} />
            </mesh>
            <mesh position={[-0.05, 0.1, 0]} castShadow>
              <cylinderGeometry args={[0.015, 0.015, 0.02, 16]} />
              <meshStandardMaterial color="#silver" metalness={0.8} />
            </mesh>
            {/* Battery 2 */}
            <mesh position={[0.05, 0, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 0.2, 16]} />
              <meshStandardMaterial color="#222" roughness={0.8} />
            </mesh>
            <mesh position={[0.05, 0.1, 0]} castShadow>
              <cylinderGeometry args={[0.015, 0.015, 0.02, 16]} />
              <meshStandardMaterial color="#silver" metalness={0.8} />
            </mesh>
          </group>
        );
      case 'Strange Tape':
        return (
          <group ref={meshRef}>
            {/* Cassette Base */}
            <mesh castShadow>
              <boxGeometry args={[0.3, 0.2, 0.05]} />
              <meshStandardMaterial color="#111" roughness={0.8} />
            </mesh>
            {/* Cassette Label */}
            <mesh position={[0, 0, 0.026]}>
              <planeGeometry args={[0.2, 0.1]} />
              <meshStandardMaterial color="#888" roughness={0.9} />
            </mesh>
            {/* Spool holes */}
            <mesh position={[-0.08, 0, 0.01]}>
              <cylinderGeometry args={[0.03, 0.03, 0.06, 16]} />
              <meshStandardMaterial color="#000" />
            </mesh>
            <mesh position={[0.08, 0, 0.01]}>
              <cylinderGeometry args={[0.03, 0.03, 0.06, 16]} />
              <meshStandardMaterial color="#000" />
            </mesh>
          </group>
        );
      default:
        // Fallback cube
        return (
          <mesh ref={meshRef} castShadow>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} roughness={0.4} />
          </mesh>
        );
    }
  };

  return (
    <RigidBody type="fixed" colliders="cuboid" position={position}>
      {renderItemModel()}
      {!noLight && <pointLight position={[0, 0, 0]} color={color} intensity={0.5} distance={2} />}
    </RigidBody>
  );
};
