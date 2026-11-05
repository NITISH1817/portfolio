import React from 'react';
import { Float, Text } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import LandmarkBeacon from './LandmarkBeacon';

export default function LandmarkResume({ onEnter, onLeave, isDiscovered, isNight }) {
  const position = [36, 0, -34];

  return (
    <group position={position}>
      {/* Interactive Trigger Beacon */}
      <LandmarkBeacon
        id="resume"
        name="RESUME ARCHIVES"
        position={[0, 0, 3]}
        color="#06B6D4"
        radius={6.5}
        onEnter={onEnter}
        onLeave={onLeave}
        isDiscovered={isDiscovered}
      />

      {/* Futuristic Archival Tower with Static Collider */}
      <RigidBody type="fixed" colliders={false} position={[0, 0, -3]}>
        <CuboidCollider args={[2.5, 4.0, 2.5]} position={[0, 4.0, 0]} />

        {/* Foundation Base */}
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[3.2, 3.8, 0.8, 8]} />
          <meshStandardMaterial color={isNight ? '#1E293B' : '#CBD5E1'} roughness={0.3} />
        </mesh>

        {/* Tall Server Monolith */}
        <mesh position={[0, 4.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 7.0, 3.2]} />
          <meshStandardMaterial color={isNight ? '#0F172A' : '#1E293B'} roughness={0.2} metalness={0.7} />
        </mesh>

        {/* Glowing Data Accent Strips */}
        {[-1.2, 0, 1.2].map((x) => (
          <mesh key={x} position={[x, 4.2, 1.62]}>
            <planeGeometry args={[0.2, 6.2]} />
            <meshStandardMaterial color="#06B6D4" emissive="#06B6D4" emissiveIntensity={1.8} />
          </mesh>
        ))}

        {/* Floating Holographic Document Icon */}
        <Float speed={2.5} rotationIntensity={0.6} floatIntensity={0.5}>
          <group position={[0, 9.2, 0]}>
            <mesh castShadow>
              <boxGeometry args={[2.0, 2.6, 0.15]} />
              <meshStandardMaterial color="#06B6D4" emissive="#0891B2" emissiveIntensity={1.2} />
            </mesh>
            <Text position={[0, 0, 0.1]} fontSize={0.42} color="#FFFFFF" anchorX="center" fontWeight="bold">
              PDF
            </Text>
          </group>
        </Float>
      </RigidBody>
    </group>
  );
}
