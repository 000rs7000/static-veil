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
      {/* Floor */}
      <RigidBody type="fixed" friction={2}>
        <mesh position={[0, 0, -25]} receiveShadow>
          <boxGeometry args={[10, 0.5, 100]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.1} />
        </mesh>
      </RigidBody>

      {/* Ceiling */}
      <RigidBody type="fixed">
        <mesh position={[0, 4, -25]} receiveShadow>
          <boxGeometry args={[10, 0.5, 100]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
        </mesh>
      </RigidBody>

      {/* Left Wall */}
      <RigidBody type="fixed">
        <mesh position={[-5, 2, -25]} receiveShadow castShadow>
          <boxGeometry args={[1, 4, 100]} />
          <meshStandardMaterial color="#302a2a" roughness={0.9} />
        </mesh>
      </RigidBody>

      {/* Right Wall */}
      <RigidBody type="fixed">
        <mesh position={[5, 2, -25]} receiveShadow castShadow>
          <boxGeometry args={[1, 4, 100]} />
          <meshStandardMaterial color="#302a2a" roughness={0.9} />
        </mesh>
      </RigidBody>

      {/* End Wall */}
      <RigidBody type="fixed">
        <mesh position={[0, 2, -75]} receiveShadow castShadow>
          <boxGeometry args={[10, 4, 1]} />
          <meshStandardMaterial color="#111111" roughness={0.9} />
        </mesh>
      </RigidBody>
      
      {/* Start Area dim lights - Always visible */}
      <group>
        <pointLight position={[0, 3, -5]} color="#5566aa" intensity={0.15} distance={10} castShadow />
        <pointLight position={[0, 0.5, -2]} color="#666" intensity={0.2} distance={3} />
      </group>

      {/* Creepy dim red emergency lights */}
      {hasKey && (
        <group ref={lightsRef}>
          <pointLight position={[0, 3, 0]} color="#ff2222" intensity={0.5} distance={15} castShadow />
          <pointLight position={[0, 3, -15]} color="#ff2222" intensity={0.5} distance={15} castShadow />
          <pointLight position={[0, 3, -30]} color="#44ff44" intensity={0.2} distance={10} castShadow /> {/* Spooky green */}
          <pointLight position={[0, 3, -45]} color="#ff2222" intensity={0.5} distance={15} castShadow />
          <pointLight position={[0, 3, -60]} color="#ff2222" intensity={0.5} distance={15} castShadow />
        </group>
      )}

      {/* Details/Props (lockers, pillars) */}
      {[...Array(6)].map((_, i) => (
        <RigidBody type="fixed" key={`lockerL_${i}`}>
          <mesh position={[-4, 1, -10 * (i + 1)]} castShadow receiveShadow>
             <boxGeometry args={[1, 2, 1]} />
             <meshStandardMaterial color="#222" roughness={0.6} metalness={0.8} />
          </mesh>
        </RigidBody>
      ))}
      {[...Array(6)].map((_, i) => (
        <RigidBody type="fixed" key={`lockerR_${i}`}>
          <mesh position={[4, 1, -10 * (i + 1) - 5]} castShadow receiveShadow>
             <boxGeometry args={[1, 2, 1]} />
             <meshStandardMaterial color="#222" roughness={0.6} metalness={0.8} />
          </mesh>
        </RigidBody>
      ))}

      {/* TV at end of hall */}
      <mesh position={[0, 1, -74]} castShadow>
        <boxGeometry args={[1.5, 1, 1]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* TV Screen */}
      <mesh position={[0, 1, -73.4]}>
        <planeGeometry args={[1.3, 0.8]} />
        <meshBasicMaterial color={hasKey ? "#ffffff" : "#000000"} />
      </mesh>
      {hasKey && <pointLight position={[0, 1, -73]} color="#aaaaff" intensity={0.4} distance={5} />}

      {/* Items */}
      {!hasKey && (
        <InteractableItem name="Hospital Key" position={[0, 1.5, -2]} color="#666666" isKey noLight />
      )}
      {hasKey && (
        <>
          <InteractableItem name="Batteries" position={[-3.5, 0.5, -15]} color="#44ff44" />
          <InteractableItem name="Strange Tape" position={[3.5, 0.5, -25]} color="#bbbbbb" />
        </>
      )}
    </group>
  );
};
