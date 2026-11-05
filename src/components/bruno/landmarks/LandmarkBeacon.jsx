import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { vehicleState } from '../VehiclePhysics';

export default function LandmarkBeacon({
  id,
  name,
  position = [0, 0, 0],
  color = '#3B82F6',
  radius = 6.5,
  onEnter,
  onLeave,
  isDiscovered = false
}) {
  const groupRef = useRef();
  const ringRef = useRef();
  const beamRef = useRef();
  const isInside = useRef(false);
  const worldPosRef = useRef(new THREE.Vector3());

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Pulse the ground ring
    if (ringRef.current) {
      ringRef.current.scale.setScalar(1 + Math.sin(t * 3.5) * 0.08);
      ringRef.current.rotation.z += 0.01;
    }

    // Shimmer vertical beacon beam
    if (beamRef.current) {
      beamRef.current.material.opacity = 0.18 + Math.sin(t * 2) * 0.08;
    }

    // Distance check to car using authoritative physics position and beacon world position
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
      {/* 1. Ground Trigger Pad */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <circleGeometry args={[radius * 0.72, 32]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.18}
          roughness={0.5}
        />
      </mesh>

      {/* Pulsing Outer Ring */}
      <mesh
        ref={ringRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.04, 0]}
      >
        <ringGeometry args={[radius * 0.7, radius * 0.76, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.8}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* 2. Vertical Beacon Light Column */}
      <mesh ref={beamRef} position={[0, 8, 0]}>
        <cylinderGeometry args={[0.15, radius * 0.35, 16, 16, 1, true]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.4}
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* 3. Proportioned Landmark Waypoint Signage (Height ~2.6m - Does NOT obstruct driving) */}
      <group position={[0, 0, 0]}>
        {/* Sleek Dark Pedestal Base */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.42, 0.6, 8]} />
          <meshStandardMaterial color="#1E232A" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Central Stem */}
        <mesh position={[0, 1.2, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 1.4, 8]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Glowing Waypoint Emblem Core */}
        <mesh position={[0, 2.1, 0]}>
          <octahedronGeometry args={[0.35]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={2.5}
            roughness={0.1}
          />
        </mesh>
        {/* Point light accentuating the emblem */}
        <pointLight position={[0, 2.1, 0]} color={color} intensity={1.8} distance={6} />

        {/* Compact Proportioned Landmark Sign Tag */}
        <group position={[0, 2.75, 0]}>
          <Text
            fontSize={0.36}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
            outlineWidth={0.04}
            outlineColor="#0F172A"
          >
            {name}
          </Text>
        </group>
      </group>
    </group>
  );
}
