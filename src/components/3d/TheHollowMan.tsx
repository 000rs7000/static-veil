import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';

export const TheHollowMan = ({ isMenu }: { isMenu?: boolean }) => {
  const meshRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const setSanity = useGameStore(state => state.setSanity);
  const [targetPos, setTargetPos] = useState(new THREE.Vector3(0, 0, -50));
  const [visible, setVisible] = useState(true);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    if (isMenu) {
      // Just stand at the end of the hall
      meshRef.current.position.set(0, 0, -60);
      meshRef.current.lookAt(0, 0, 0);
      return;
    }

    // AI Logic during gameplay
    const dist = camera.position.distanceTo(meshRef.current.position);

    if (dist < 15) {
      // Drain sanity if looking at him
      const dirToPlayer = new THREE.Vector3().subVectors(camera.position, meshRef.current.position).normalize();
      const playerForward = new THREE.Vector3();
      camera.getWorldDirection(playerForward);
      
      const dot = playerForward.dot(dirToPlayer);
      if (dot < -0.8) { // Player is looking roughly at him
         setSanity(useGameStore.getState().sanity - (delta * 10)); // drain fast
         
         // Twitching effect
         meshRef.current.position.x += (Math.random() - 0.5) * 0.1;
      }
    }

    // Teleport logic if player gets too close
    if (dist < 5) {
      setVisible(false);
      setTimeout(() => {
        // Appears far behind or far away
        const back = new THREE.Vector3();
        camera.getWorldDirection(back);
        back.multiplyScalar(-20).add(camera.position);
        setTargetPos(back);
        setVisible(true);
      }, 5000);
    }
    
    // Smoothly interpolate to target position
    if (visible) {
      meshRef.current.position.lerp(targetPos, 0.01);
      meshRef.current.position.y = 0; // lock y
      // Look at player
      meshRef.current.lookAt(camera.position.x, 0, camera.position.z);
    } else {
      meshRef.current.position.set(0, -100, 0); // hide
    }
  });

  // Base y position makes him stand properly.
  // 9 feet tall is ~2.74 meters/units.
  
  return (
    <group ref={meshRef}>
      {/* Tall, unnatural thin body / Torso (1.2 units long) */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.15, 1.2, 8]} />
        <meshStandardMaterial color="#020202" roughness={0.9} />
      </mesh>
      
      {/* Extremely Long Legs (~1.5 units) */}
      <mesh position={[-0.15, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.05, 1.5, 8]} />
        <meshStandardMaterial color="#020202" roughness={0.9} />
      </mesh>
      <mesh position={[0.15, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.05, 1.5, 8]} />
        <meshStandardMaterial color="#020202" roughness={0.9} />
      </mesh>
      
      {/* Elongated Arms (~1.6 units long) hanging unnaturally low */}
      <mesh position={[-0.3, 1.7, 0]} rotation={[0, 0, 0.1]} castShadow>
        <cylinderGeometry args={[0.06, 0.04, 1.6, 8]} />
        <meshStandardMaterial color="#020202" roughness={0.9} />
      </mesh>
      <mesh position={[0.3, 1.7, 0]} rotation={[0, 0, -0.1]} castShadow>
        <cylinderGeometry args={[0.06, 0.04, 1.6, 8]} />
        <meshStandardMaterial color="#020202" roughness={0.9} />
      </mesh>

      {/* Gaunt Head - 9 feet mark ~2.74 */}
      <mesh position={[0, 2.6, 0]} castShadow>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#dddddd" roughness={0.4} /> {/* Cracked Porcelain Color */}
      </mesh>
      
      {/* Hollow black eyes */}
      <mesh position={[-0.06, 2.62, 0.17]} rotation={[-0.1, 0, 0]}>
        <planeGeometry args={[0.06, 0.12]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[0.06, 2.62, 0.17]} rotation={[-0.1, 0, 0]}>
        <planeGeometry args={[0.06, 0.12]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      {/* Gaping Mouth */}
      <mesh position={[0, 2.52, 0.17]} rotation={[-0.1, 0, 0]}>
        <planeGeometry args={[0.08, 0.15]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
};
