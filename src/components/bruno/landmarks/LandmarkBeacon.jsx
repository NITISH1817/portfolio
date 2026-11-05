import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { vehicleState } from '../VehiclePhysics';

export default function LandmarkBeacon({
  id,
  name,
  position = [0, 0, 0],
  color = '#EA580C',
  radius = 7.0,
  onEnter,
  onLeave,
  isDiscovered = false
}) {
  const groupRef = useRef(null);
  const badgeRef = useRef(null);
  const ringRef = useRef(null);
  const isInside = useRef(false);
  const worldPosRef = useRef(new THREE.Vector3());

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Subtle gentle float and spin of the waypoint badge
    if (badgeRef.current) {
      badgeRef.current.rotation.y = t * 1.4;
      badgeRef.current.position.y = 2.4 + Math.sin(t * 2.2) * 0.12;
    }

    // Gentle pulse of the ground ring
    if (ringRef.current) {
      const pulse = 1.0 + Math.sin(t * 3.0) * 0.05;
      ringRef.current.scale.set(pulse, pulse, 1);
    }

    // World position proximity detection
    if (groupRef.current) {
      groupRef.current.getWorldPosition(worldPosRef.current);
    } else {
      worldPosRef.current.set(position[0], position[1], position[2]);
    }
    const carPos = vehicleState.position;
    const dx = carPos.x - worldPosRef.current.x;
    const dz = carPos.z - worldPosRef.current.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < radius) {
      if (!isInside.current) {
        isInside.current = true;
        onEnter({
          id,
          name,
          position: [worldPosRef.current.x, worldPosRef.current.y, worldPosRef.current.z],
          color
        });
      }
    } else {
      if (isInside.current) {
        isInside.current = false;
        onLeave(id);
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* 1. Painted Ground Circle & Outer Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <circleGeometry args={[radius * 0.72, 32]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.18}
          roughness={0.7}
        />
      </mesh>

      <mesh
        ref={ringRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.025, 0]}
      >
        <ringGeometry args={[radius * 0.68, radius * 0.74, 36]} />
        <meshBasicMaterial color="#FEF3C7" />
      </mesh>

      {/* 2. Low-Poly White Stone Pedestal */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.35, 0.45, 1.0, 8]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.4} flatShading />
      </mesh>
      <mesh position={[0, 1.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.75, 0.1, 0.75]} />
        <meshStandardMaterial color="#EA580C" roughness={0.5} flatShading />
      </mesh>

      {/* 3. Spinning Floating Diamond / Star Emblem */}
      <mesh ref={badgeRef} position={[0, 2.4, 0]} castShadow>
        <octahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial
          color={color}
          roughness={0.2}
          metalness={0.4}
        />
      </mesh>

      {/* 4. Overhead Crisp Waypoint Sign */}
      <group position={[0, 3.4, 0]}>
        <Text
          fontSize={0.48}
          color="#1E293B"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
          outlineWidth={0.05}
          outlineColor="#FFFFFF"
        >
          {name}
        </Text>
      </group>
    </group>
  );
}
