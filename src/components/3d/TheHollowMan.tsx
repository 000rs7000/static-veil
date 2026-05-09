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
  
  // Patrol path waypoints
  const waypoints = useRef([
    new THREE.Vector3(3, 0, -10),
    new THREE.Vector3(-3, 0, -20),
    new THREE.Vector3(3, 0, -40),
    new THREE.Vector3(-3, 0, -60),
    new THREE.Vector3(0, 0, -70),
  ]);
  const [currentWaypoint, setCurrentWaypoint] = useState(0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    if (isMenu) {
      // Just stand at the end of the hall
      meshRef.current.position.set(0, 0, -60);
      meshRef.current.lookAt(0, 0, 0);
      return;
    }

    // AI Logic during gameplay
    const distToPlayer = camera.position.distanceTo(meshRef.current.position);

    if (distToPlayer < 15) {
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
    if (distToPlayer < 5) {
      if (visible) {
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
    } else {
      // If far from player, follow patrol path
      const activeWaypoint = waypoints.current[currentWaypoint];
      const distToWaypoint = activeWaypoint.distanceTo(meshRef.current.position);
      
      if (distToWaypoint < 1) {
        // Switch to next waypoint
        setCurrentWaypoint((prev) => (prev + 1) % waypoints.current.length);
      } else {
        setTargetPos(activeWaypoint);
      }
    }
    
    // Smoothly interpolate to target position
    if (visible) {
      // Calculate movement direction
      const moveDir = new THREE.Vector3().subVectors(targetPos, meshRef.current.position).normalize();
      // Move slowly
      meshRef.current.position.add(moveDir.multiplyScalar(delta * 1.5));
      meshRef.current.position.y = 0; // lock y
      
      // Look at where he's going or at player if close
      if (distToPlayer < 10) {
        meshRef.current.lookAt(camera.position.x, 0, camera.position.z);
      } else {
        meshRef.current.lookAt(targetPos.x, 0, targetPos.z);
      }
    } else {
      meshRef.current.position.set(0, -100, 0); // hide
    }
  });

  return (
    <group ref={meshRef}>
      {/* Tall, unnatural thin body */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.1, 3.6, 8]} />
        <meshStandardMaterial color="#050505" roughness={0.9} />
      </mesh>
      
      {/* Long arms */}
      <mesh position={[-0.4, 1.5, 0]} rotation={[0, 0, 0.1]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 2.5, 8]} />
        <meshStandardMaterial color="#050505" roughness={0.9} />
      </mesh>
      <mesh position={[0.4, 1.5, 0]} rotation={[0, 0, -0.1]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 2.5, 8]} />
        <meshStandardMaterial color="#050505" roughness={0.9} />
      </mesh>

      {/* Cracked Porcelain Mask */}
      <mesh position={[0, 3.6, 0.1]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#dddddd" roughness={0.4} />
      </mesh>
      
      {/* Black eyes leaking fluid (simple planes on face) */}
      <mesh position={[-0.08, 3.65, 0.28]} rotation={[-0.1, 0, 0]}>
        <planeGeometry args={[0.05, 0.15]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[0.08, 3.65, 0.28]} rotation={[-0.1, 0, 0]}>
        <planeGeometry args={[0.05, 0.15]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
};
