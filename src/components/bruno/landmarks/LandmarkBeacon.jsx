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
  const groupRef = useRef(null);
  const ringRef = useRef(null);
  const orbitRingRef = useRef(null);
  const beamRef = useRef(null);
  const prismRef = useRef(null);
  const isInside = useRef(false);
  const worldPosRef = useRef(new THREE.Vector3());

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Pulse the ground ring
    if (ringRef.current) {
      ringRef.current.scale.setScalar(1 + Math.sin(t * 3.2) * 0.08);
    }

    // Rotating holographic orbital ring
    if (orbitRingRef.current) {
      orbitRingRef.current.rotation.z = t * 1.2;
      orbitRingRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 1.8) * 0.25;
    }

    // Shimmer vertical holographic beam
    if (beamRef.current && beamRef.current.material) {
      beamRef.current.material.opacity = 0.2 + Math.sin(t * 2.2) * 0.1;
    }

    // Floating rotating crystal prism atop the beacon
    if (prismRef.current) {
      prismRef.current.rotation.y = t * 1.5;
      prismRef.current.position.y = 2.4 + Math.sin(t * 2.5) * 0.15;
    }

    // World position proximity check to authoritative vehicle
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
      {/* 1. Ground Energy Disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <circleGeometry args={[radius * 0.72, 32]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.15}
          roughness={0.6}
        />
      </mesh>

      {/* Pulsing Outer Neon Ring */}
      <mesh
        ref={ringRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.04, 0]}
      >
        <ringGeometry args={[radius * 0.68, radius * 0.75, 36]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2.2}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* 2. Vertical Beacon Holographic Column */}
      <mesh ref={beamRef} position={[0, 7.5, 0]}>
        <cylinderGeometry args={[0.2, radius * 0.35, 15, 20, 1, true]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.2}
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* 3. Sleek Low-Poly Waypoint Pillar Base (Dark Chrome & Neon Accents) */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.45, 1.4, 8]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0, 1.42, 0]} castShadow>
        <boxGeometry args={[0.65, 0.12, 0.65]} />
        <meshStandardMaterial color="#1E293B" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Floating Holographic Kinetic Ring */}
      <mesh ref={orbitRingRef} position={[0, 2.4, 0]}>
        <torusGeometry args={[0.65, 0.025, 8, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2.5}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Floating Crystal Prism Marker */}
      <mesh ref={prismRef} position={[0, 2.4, 0]} castShadow>
        <octahedronGeometry args={[0.38, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2.8}
          roughness={0.1}
          metalness={0.7}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Dynamic Colored Point Light Illuminating Ground and Approaching Car */}
      <pointLight color={color} intensity={2.8} distance={10} decay={2} position={[0, 2.0, 0]} />

      {/* Elegant Waypoint Label Sign */}
      <group position={[0, 3.4, 0]}>
        <Text
          fontSize={0.4}
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
  );
}
