import React from 'react';
import { Float } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import LandmarkBeacon from './LandmarkBeacon';

export default function LandmarkAbout({ onEnter, onLeave, isDiscovered, isNight }) {
  const position = [-34, 0, 22];

  return (
    <group position={position}>
      {/* Interactive Trigger Beacon in Front of Structure */}
      <LandmarkBeacon
        id="about"
        name="ABOUT ME"
        position={[0, 0, 3]}
        color="#8B5CF6"
        radius={6.5}
        onEnter={onEnter}
        onLeave={onLeave}
        isDiscovered={isDiscovered}
      />

      {/* Static Rapier Collider for the Pavilion */}
      <RigidBody type="fixed" colliders={false} position={[0, 0, -4]}>
        <CuboidCollider args={[4.2, 2.5, 4.2]} position={[0, 2.5, 0]} />

        {/* Base Platform */}
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[4.2, 4.8, 0.8, 8]} />
          <meshStandardMaterial color={isNight ? '#1E293B' : '#E2E8F0'} roughness={0.3} />
        </mesh>

        {/* Outer Columns */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const x = Math.cos(angle) * 3.6;
          const z = Math.sin(angle) * 3.6;
          return (
            <mesh key={i} position={[x, 2.5, z]} castShadow>
              <cylinderGeometry args={[0.15, 0.2, 4.2, 8]} />
              <meshStandardMaterial color="#64748B" metalness={0.7} />
            </mesh>
          );
        })}

        {/* Glass Dome Roof */}
        <mesh position={[0, 4.6, 0]} castShadow>
          <sphereGeometry args={[3.8, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color="#8B5CF6"
            transparent
            opacity={0.65}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>

        {/* Central Glowing Hologram Core */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.4}>
          <mesh position={[0, 2.4, 0]}>
            <octahedronGeometry args={[1.2]} />
            <meshStandardMaterial
              color="#A78BFA"
              emissive="#8B5CF6"
              emissiveIntensity={1.8}
              wireframe
            />
          </mesh>
        </Float>
      </RigidBody>
    </group>
  );
}
