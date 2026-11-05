import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CRYSTALS, useGameStore, Crystal } from '../../../store/gameStore';
import { vehicleState } from '../VehiclePhysics';
import { carAudio } from '../CarAudio';

export default function Crystals() {
  const collectedCrystals = useGameStore((s) => s.collectedCrystals);
  const collectCrystal = useGameStore((s) => s.collectCrystal);

  return (
    <group name="collectibles-crystals">
      {CRYSTALS.map((crystal) => {
        const isCollected = collectedCrystals.includes(crystal.id);
        return (
          <SingleCrystal
            key={crystal.id}
            crystal={crystal}
            isCollected={isCollected}
            onCollect={() => {
              carAudio.playCrystal();
              collectCrystal(crystal.id);
            }}
          />
        );
      })}
    </group>
  );
}

interface SingleCrystalProps {
  crystal: Crystal;
  isCollected: boolean;
  onCollect: () => void;
}

function SingleCrystal({ crystal, isCollected, onCollect }: SingleCrystalProps) {
  const groupRef = useRef<THREE.Group>(null);
  const crystalMeshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);

  // Animation states
  const isCollecting = useRef(false);
  const collectProgress = useRef(0);
  const basePos = crystal.position;

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // If collected and finished animating, keep hidden
    if (isCollected && !isCollecting.current) {
      groupRef.current.visible = false;
      return;
    }

    // Collecting Burst Animation
    if (isCollecting.current) {
      collectProgress.current += delta * 2.5;
      if (crystalMeshRef.current) {
        crystalMeshRef.current.rotation.y += delta * 15;
        const scale = Math.max(0, 1.0 + Math.sin(collectProgress.current * Math.PI) * 0.5 - collectProgress.current);
        crystalMeshRef.current.scale.set(scale, scale, scale);
      }
      groupRef.current.position.y += delta * 3.5;

      if (collectProgress.current >= 1.0) {
        isCollecting.current = false;
        groupRef.current.visible = false;
      }
      return;
    }

    // Idle Bobbing & Floating Rotation
    const bob = Math.sin(t * 2.5 + basePos[0]) * 0.22;
    groupRef.current.position.set(basePos[0], basePos[1] + bob, basePos[2]);

    if (crystalMeshRef.current) {
      crystalMeshRef.current.rotation.y = t * 1.8;
      crystalMeshRef.current.rotation.z = Math.sin(t * 1.2) * 0.15;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = -t * 1.4;
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 2.0) * 0.2;
    }

    // Proximity Detection to Vehicle
    const carPos = vehicleState.position;
    const crystalWorldPos = groupRef.current.position;
    const dist = carPos.distanceTo(crystalWorldPos);

    if (dist < 2.8 && !isCollecting.current && !isCollected) {
      isCollecting.current = true;
      collectProgress.current = 0;
      onCollect();
    }
  });

  return (
    <group ref={groupRef} position={basePos}>
      {/* Dynamic Colored Point Light */}
      <pointLight
        ref={pointLightRef}
        color={crystal.emissive}
        intensity={2.8}
        distance={7.5}
        decay={2}
      />

      {/* Rotating Diamond Octahedron Crystal */}
      <mesh ref={crystalMeshRef} castShadow>
        <octahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial
          color={crystal.color}
          emissive={crystal.emissive}
          emissiveIntensity={2.5}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Floating Energy Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.85, 0.03, 8, 24]} />
        <meshStandardMaterial
          color={crystal.emissive}
          emissive={crystal.emissive}
          emissiveIntensity={2.0}
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* Ground Projection Glow Disc */}
      <mesh position={[0, -0.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.9, 16]} />
        <meshBasicMaterial
          color={crystal.emissive}
          transparent
          opacity={0.25}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

