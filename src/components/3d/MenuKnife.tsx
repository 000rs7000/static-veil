import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const MenuKnife = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, 1.5, 3]} rotation={[0, Math.PI / 4, Math.PI / 6]} scale={2}>
      {/* Blade */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.02, 0.6, 0.1]} />
        <meshStandardMaterial color="#b0b0b0" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Sharp edge outline (make it look dangerous) */}
      <mesh position={[-0.012, 0.4, 0]}>
        <boxGeometry args={[0.005, 0.6, 0.08]} />
        <meshStandardMaterial color="#ffffff" metalness={1} roughness={0} />
      </mesh>
      
      {/* Blood Stains on Blade */}
      <mesh position={[0.011, 0.5, 0.02]} rotation={[0, 0, 0.1]}>
        <planeGeometry args={[0.02, 0.2]} />
        <meshStandardMaterial color="#660000" metalness={0.2} roughness={0.6} transparent opacity={0.8} />
      </mesh>
      
      {/* Handle */}
      <mesh position={[0, -0.1, 0]} castShadow>
        <boxGeometry args={[0.04, 0.4, 0.12]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.1} roughness={0.8} />
      </mesh>
      {/* Handle Guard */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[0.06, 0.05, 0.18]} />
        <meshStandardMaterial color="#333333" metalness={0.7} roughness={0.4} />
      </mesh>
      
      {/* Dramatic lighting just for the knife */}
      <pointLight position={[0.5, 1, 0.5]} color="#ff4444" intensity={2} distance={3} />
      <pointLight position={[-0.5, 0, -0.5]} color="#4444ff" intensity={0.5} distance={3} />
    </group>
  );
};
