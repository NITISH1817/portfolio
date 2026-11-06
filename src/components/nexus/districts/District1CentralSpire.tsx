import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';

interface DistrictProps {
  onEnter?: (district: any) => void;
  onLeave?: (id: string) => void;
  onInteract?: (id: string) => void;
}

export default function District1CentralSpire({ onEnter, onLeave, onInteract }: DistrictProps) {
  const emblemRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (emblemRef.current) {
      emblemRef.current.rotation.y = t * 0.8;
    }
    if (ringRef.current) {
      ringRef.current.rotation.y = -t * 0.5;
      ringRef.current.rotation.x = Math.sin(t * 0.4) * 0.2;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Interactive Trigger Beacon Proximity Sphere (Radius 8m) */}
      <mesh
        visible={false}
        onPointerOver={() => onEnter && onEnter({ id: 'central', name: 'DISTRICT 01 — NEXUS CENTRAL' })}
        onPointerOut={() => onLeave && onLeave('central')}
        onClick={() => onInteract && onInteract('about')}
      >
        <sphereGeometry args={[8.5, 16, 16]} />
      </mesh>

      {/* Physics Collider for the Central Base */}
      <RigidBody type="fixed" colliders={false} position={[0, 0, 0]}>
        <CuboidCollider args={[4.2, 8.0, 4.2]} position={[0, 8.0, 0]} />

        {/* Multi-Tier Radial Plaza Plinth */}
        <mesh position={[0, 0.15, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[9.5, 10.5, 0.3, 16]} />
          <meshStandardMaterial color="#0C1326" roughness={0.3} metalness={0.7} />
        </mesh>

        <mesh position={[0, 0.35, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[7.5, 8.2, 0.3, 16]} />
          <meshStandardMaterial color="#10182E" roughness={0.25} metalness={0.8} />
        </mesh>

        {/* 28-Meter Obsidian Central Spire */}
        <mesh position={[0, 14.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.8, 28, 3.8]} />
          <meshStandardMaterial
            color="#080C18"
            roughness={0.15}
            metalness={0.85}
          />
        </mesh>

        {/* Tapered Crown Spire */}
        <mesh position={[0, 30.5, 0]} castShadow>
          <coneGeometry args={[2.2, 6.0, 4]} />
          <meshStandardMaterial color="#0A0F22" roughness={0.1} metalness={0.9} />
        </mesh>

        {/* Vertical Glowing Plasma Conduits (Orange & Purple) */}
        {[-1.92, 1.92].map((x, i) => (
          <React.Fragment key={`conduit-x-${i}`}>
            <mesh position={[x, 14.5, 0]}>
              <planeGeometry args={[0.35, 26]} />
              <meshStandardMaterial
                color="#FF8A3D"
                emissive="#FF8A3D"
                emissiveIntensity={2.8}
              />
            </mesh>
            <mesh position={[0, 14.5, x]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry args={[26, 0.35]} />
              <meshStandardMaterial
                color="#A855F7"
                emissive="#A855F7"
                emissiveIntensity={2.8}
              />
            </mesh>
          </React.Fragment>
        ))}

        {/* Floating Rotating 3D Holographic Emblem at Top */}
        <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
          <group ref={emblemRef} position={[0, 35, 0]}>
            {/* Holographic Diamond */}
            <mesh>
              <octahedronGeometry args={[2.4, 0]} />
              <meshStandardMaterial
                color="#38BDF8"
                emissive="#38BDF8"
                emissiveIntensity={2.2}
                wireframe
              />
            </mesh>

            <mesh>
              <octahedronGeometry args={[1.5, 0]} />
              <meshStandardMaterial
                color="#FF8A3D"
                emissive="#FF8A3D"
                emissiveIntensity={2.5}
              />
            </mesh>
          </group>

          {/* Holographic Orbiting Data Rings */}
          <group ref={ringRef} position={[0, 35, 0]}>
            <mesh rotation={[Math.PI / 3, 0, 0]}>
              <torusGeometry args={[3.8, 0.05, 8, 32]} />
              <meshStandardMaterial
                color="#A855F7"
                emissive="#A855F7"
                emissiveIntensity={3.0}
              />
            </mesh>
          </group>
        </Float>

        {/* District Signage Banner */}
        <Text
          position={[0, 5.2, 2.05]}
          fontSize={0.65}
          color="#F8FAFC"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          NEXUS CENTRAL
        </Text>
        <Text
          position={[0, 4.3, 2.05]}
          fontSize={0.3}
          color="#FF8A3D"
          anchorX="center"
          anchorY="middle"
        >
          DISTRICT 01 // CIVIC SPIRE
        </Text>
      </RigidBody>
    </group>
  );
}
