import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { certificationsList, achievementsList, identityData } from '../../../data/portfolio';

interface DistrictProps {
  onEnter?: (district: any) => void;
  onLeave?: (id: string) => void;
  onInteract?: (id: string) => void;
}

export default function District5AchievementCenter({ onEnter, onLeave, onInteract }: DistrictProps) {
  const trophyRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (trophyRef.current) {
      trophyRef.current.rotation.y = t * 0.75;
    }
  });

  return (
    <group position={[42, 0, -42]}>
      {/* Interactive Trigger Proximity Beacon */}
      <mesh
        visible={false}
        onPointerOver={() => onEnter && onEnter({ id: 'achievements', name: 'DISTRICT 05 — ACHIEVEMENT CENTER' })}
        onPointerOut={() => onLeave && onLeave('achievements')}
        onClick={() => onInteract && onInteract('experience')}
      >
        <sphereGeometry args={[12, 16, 16]} />
      </mesh>

      <RigidBody type="fixed" colliders={false} position={[0, 0, 0]}>
        <CuboidCollider args={[7.0, 5.0, 7.0]} position={[0, 5.0, 0]} />

        {/* Polished Charcoal Octagonal Vault Plinth */}
        <mesh position={[0, 0.25, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[9.5, 10.5, 0.5, 8]} />
          <meshStandardMaterial color="#0B0F1C" roughness={0.25} metalness={0.8} />
        </mesh>

        {/* Central Honors Monolith */}
        <mesh position={[0, 4.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 8.0, 3.2]} />
          <meshStandardMaterial color="#080C18" roughness={0.15} metalness={0.85} />
        </mesh>

        {/* Floating Golden Trophy / Honor Emblem */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.6}>
          <group ref={trophyRef} position={[0, 10.5, 0]}>
            <mesh>
              <octahedronGeometry args={[1.6, 0]} />
              <meshStandardMaterial
                color="#FBBF24"
                emissive="#FBBF24"
                emissiveIntensity={2.5}
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
          </group>
        </Float>

        {/* District Signage Banner */}
        <Text
          position={[0, 6.2, 1.7]}
          fontSize={0.48}
          color="#F8FAFC"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          HONORS & CREDENTIALS
        </Text>
        <Text
          position={[0, 5.4, 1.7]}
          fontSize={0.25}
          color="#FBBF24"
          anchorX="center"
          anchorY="middle"
        >
          DISTRICT 05 // ORACLE & AWS VAULT
        </Text>
        <Text
          position={[0, 4.7, 1.7]}
          fontSize={0.22}
          color="#38BDF8"
          anchorX="center"
          anchorY="middle"
        >
          B.E. CSE • BATCH 2028 • CGPA 7.79
        </Text>

        {/* 3 Golden Trophy Podiums in Front */}
        {certificationsList.map((cert, idx) => {
          const xPos = (idx - 1) * 4.8;
          return (
            <group key={cert.id} position={[xPos, 0, 4.5]}>
              <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[1.1, 1.3, 1.8, 12]} />
                <meshStandardMaterial color="#1E293B" metalness={0.7} />
              </mesh>
              <mesh position={[0, 1.9, 0]}>
                <sphereGeometry args={[0.3, 12, 12]} />
                <meshStandardMaterial color="#FBBF24" emissive="#FBBF24" emissiveIntensity={2.8} />
              </mesh>
              <Text
                position={[0, 2.5, 0]}
                fontSize={0.18}
                color="#FFFFFF"
                anchorX="center"
                maxWidth={2.8}
                fontWeight="bold"
              >
                {cert.title ? (cert.title.includes(':') ? cert.title.split(':')[0] : cert.title) : ''}
              </Text>
            </group>
          );
        })}
      </RigidBody>
    </group>
  );
}

