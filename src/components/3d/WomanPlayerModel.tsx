import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const WomanPlayerModel = () => {
  const groupRef = useRef<THREE.Group>(null);

  // Animate walking if needed, but since it's attached to the camera/body, it'll follow mostly.
  // We'll just provide the visual mesh.
  return (
    <group ref={groupRef} position={[0, -1.2, 0]}>
      {/* Torso */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.25, 0.6, 16]} />
        {/* Medical Scrubs Blue */}
        <meshStandardMaterial color="#4A90E2" roughness={0.8} />
      </mesh>

      {/* Chest/Bust (giving female shape) */}
      <mesh position={[0, 1.05, 0.15]} castShadow>
        <boxGeometry args={[0.3, 0.25, 0.2]} />
        <meshStandardMaterial color="#4A90E2" roughness={0.8} />
      </mesh>

      {/* Hips/Skirt/Pants */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.5, 16]} />
        <meshStandardMaterial color="#3A70B2" roughness={0.8} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.12, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} />
        <meshStandardMaterial color="#3A70B2" roughness={0.8} />
      </mesh>
      <mesh position={[0.12, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} />
        <meshStandardMaterial color="#3A70B2" roughness={0.8} />
      </mesh>

      {/* Feet/Shoes */}
      <mesh position={[-0.12, -0.25, 0.05]} castShadow>
        <boxGeometry args={[0.1, 0.1, 0.2]} />
        <meshStandardMaterial color="#222" roughness={0.9} />
      </mesh>
      <mesh position={[0.12, -0.25, 0.05]} castShadow>
        <boxGeometry args={[0.1, 0.1, 0.2]} />
        <meshStandardMaterial color="#222" roughness={0.9} />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.3, 0.8, 0]} rotation={[0, 0, 0.2]} castShadow>
        <cylinderGeometry args={[0.06, 0.05, 0.7, 16]} />
        <meshStandardMaterial color="#fcd5b8" roughness={0.4} /> {/* Skin tone */}
      </mesh>
      <mesh position={[0.3, 0.8, 0]} rotation={[0, 0, -0.2]} castShadow>
        <cylinderGeometry args={[0.06, 0.05, 0.7, 16]} />
        <meshStandardMaterial color="#fcd5b8" roughness={0.4} /> {/* Skin tone */}
      </mesh>
    </group>
  );
};
