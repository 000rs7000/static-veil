import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';

export const Jumpscare = () => {
  const { jumpscareActive } = useGameStore();
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (jumpscareActive && groupRef.current) {
        // Place very close to camera
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
        groupRef.current.position.copy(camera.position).add(forward.multiplyScalar(0.6));
        groupRef.current.quaternion.copy(camera.quaternion);
        
        // Add violent shaking
        groupRef.current.position.x += (Math.random() - 0.5) * 0.15;
        groupRef.current.position.y += (Math.random() - 0.5) * 0.15;
    }
  });

  if (!jumpscareActive) return null;

  return (
    <group ref={groupRef}>
      {/* Scary Face */}
      <mesh position={[0, -0.1, 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      {/* Hollow black eyes */}
      <mesh position={[-0.07, 0.02, 0.18]} rotation={[-0.2, 0, 0]}>
        <planeGeometry args={[0.08, 0.12]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[0.07, 0.02, 0.18]} rotation={[-0.2, 0, 0]}>
        <planeGeometry args={[0.08, 0.12]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      {/* Wide open screaming mouth */}
      <mesh position={[0, -0.12, 0.18]}>
        <planeGeometry args={[0.12, 0.22]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      {/* Intense light on face to make it pop even in blackness */}
      <pointLight position={[0, 0, 0.5]} color="#aaaaaa" intensity={2} distance={2} />
    </group>
  );
};
