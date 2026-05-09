import React, { useRef } from 'react';
import { RigidBody } from '@react-three/rapier';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { InteractableItem } from './InteractableItem';
import { useGameStore } from '../../store/useGameStore';

export const Level = () => {
  const lightsRef = useRef<THREE.Group>(null);
  const { inventory } = useGameStore();
  const hasKey = inventory.includes('Hospital Key');
  
  // Flicker lights randomly
  useFrame((state) => {
    if (lightsRef.current && hasKey) {
      lightsRef.current.children.forEach((light) => {
        if (Math.random() > 0.95) {
           (light as THREE.PointLight).intensity = Math.random() * 0.8;
        }
      });
    }
  });

  return (
    <group>
      {/* Floor - Hospital Linoleum */}
      <RigidBody type="fixed" friction={1}>
        <mesh position={[0, -0.5, -25]} receiveShadow>
          <boxGeometry args={[10, 1, 100]} />
          <meshStandardMaterial color="#c0c5ce" roughness={0.5} metalness={0.1} />
        </mesh>
      </RigidBody>

      {/* Ceiling - White drop ceiling tiles */}
      <RigidBody type="fixed">
        <mesh position={[0, 4.5, -25]} receiveShadow>
          <boxGeometry args={[10, 1, 100]} />
          <meshStandardMaterial color="#f0f0f0" roughness={0.9} />
        </mesh>
      </RigidBody>

      {/* Left Wall - Pale Hospital Green border bottom, white top */}
      <RigidBody type="fixed">
        <mesh position={[-5, 0.5, -25]} receiveShadow castShadow>
          <boxGeometry args={[1, 2, 100]} />
          <meshStandardMaterial color="#b2d8d8" roughness={0.9} />
        </mesh>
        <mesh position={[-5, 2.5, -25]} receiveShadow castShadow>
          <boxGeometry args={[1, 2, 100]} />
          <meshStandardMaterial color="#e0e5e5" roughness={0.9} />
        </mesh>
        {/* Wall bumper strip */}
        <mesh position={[-4.4, 1.5, -25]} receiveShadow castShadow>
          <boxGeometry args={[0.2, 0.2, 100]} />
          <meshStandardMaterial color="#444444" roughness={0.7} />
        </mesh>
      </RigidBody>

      {/* Right Wall */}
      <RigidBody type="fixed">
        <mesh position={[5, 0.5, -25]} receiveShadow castShadow>
          <boxGeometry args={[1, 2, 100]} />
          <meshStandardMaterial color="#b2d8d8" roughness={0.9} />
        </mesh>
        <mesh position={[5, 2.5, -25]} receiveShadow castShadow>
          <boxGeometry args={[1, 2, 100]} />
          <meshStandardMaterial color="#e0e5e5" roughness={0.9} />
        </mesh>
        <mesh position={[4.4, 1.5, -25]} receiveShadow castShadow>
          <boxGeometry args={[0.2, 0.2, 100]} />
          <meshStandardMaterial color="#444444" roughness={0.7} />
        </mesh>
      </RigidBody>

      {/* End Wall */}
      <RigidBody type="fixed">
        <mesh position={[0, 2, -75]} receiveShadow castShadow>
          <boxGeometry args={[10, 4, 1]} />
          <meshStandardMaterial color="#e0e5e5" roughness={0.9} />
        </mesh>
      </RigidBody>
      
      {/* Starting wall behind player */}
      <RigidBody type="fixed">
        <mesh position={[0, 2, 10]} receiveShadow castShadow>
          <boxGeometry args={[10, 4, 1]} />
          <meshStandardMaterial color="#e0e5e5" roughness={0.9} />
        </mesh>
      </RigidBody>

      {/* Hospital Doors along the corridor */}
      {Array.from({ length: 8 }).map((_, i) => (
        <group key={`door_${i}`} position={[i % 2 === 0 ? -4.4 : 4.4, 0.5, -10 - i * 8]}>
          {/* Door Frame */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.3, 3, 2]} />
            <meshStandardMaterial color="#5c4033" roughness={0.8} /> {/* Dark wood */}
          </mesh>
          {/* Door Window glass (blacked out) */}
          <mesh position={[i % 2 === 0 ? 0.2 : -0.2, 0.5, 0]}>
            <planeGeometry args={[0.5, 0.8]} />
            <meshBasicMaterial color="#000" />
          </mesh>
        </group>
      ))}

      {/* Normal overhead lights that stay on until key is picked up */}
      {!hasKey && (
        <group>
          <pointLight position={[0, 3.5, 0]} color="#ffffff" intensity={0.4} distance={20} />
          <pointLight position={[0, 3.5, -25]} color="#ffffff" intensity={0.4} distance={20} />
          <pointLight position={[0, 3.5, -50]} color="#ffffff" intensity={0.4} distance={20} />
        </group>
      )}

      {/* Creepy dim red emergency lights */}
      {hasKey && (
        <group ref={lightsRef}>
          <pointLight position={[0, 3.5, 0]} color="#ff2222" intensity={0.5} distance={15} castShadow />
          <pointLight position={[0, 3.5, -15]} color="#ff2222" intensity={0.5} distance={15} castShadow />
          <pointLight position={[0, 3.5, -30]} color="#ff4444" intensity={0.3} distance={15} castShadow /> 
          <pointLight position={[0, 3.5, -45]} color="#ff2222" intensity={0.5} distance={15} castShadow />
          <pointLight position={[0, 3.5, -60]} color="#ff2222" intensity={0.5} distance={15} castShadow />
        </group>
      )}

      {/* Items */}
      {!hasKey && (
        <InteractableItem name="Hospital Key" position={[0, 0.5, -25]} color="#666666" isKey noLight />
      )}
    </group>
  );
};
