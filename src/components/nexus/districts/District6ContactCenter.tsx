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

export default function District6ContactCenter({ onEnter, onLeave, onInteract }: DistrictProps) {
  const radarRef = useRef<THREE.Group>(null);
  const beamRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (radarRef.current) {
      radarRef.current.rotation.y = t * 1.1;
    }
    if (beamRef.current) {
      (beamRef.current.material as THREE.MeshStandardMaterial).opacity =
        0.6 + Math.sin(t * 3.5) * 0.3;
    }
  });

  return (
    <group position={[0, 0, -56]}>
      {/* Interactive Trigger Beacon */}
      <mesh
        visible={false}
        onPointerOver={() => onEnter && onEnter({ id: 'contact', name: 'DISTRICT 06 — TRANSMISSION CITADEL' })}
        onPointerOut={() => onLeave && onLeave('contact')}
        onClick={() => onInteract && onInteract('contact')}
      >
        <sphereGeometry args={[11, 16, 16]} />
      </mesh>

      <RigidBody type="fixed" colliders={false} position={[0, 0, 0]}>
        <CuboidCollider args={[6.0, 5.0, 6.0]} position={[0, 5.0, 0]} />

        {/* Foundation Plinth */}
        <mesh position={[0, 0.25, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[8.5, 9.2, 0.5, 16]} />
          <meshStandardMaterial color="#0A0E1A" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Transmission Tower Body */}
        <mesh position={[0, 4.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 8.5, 3.2]} />
          <meshStandardMaterial color="#080C16" roughness={0.2} metalness={0.8} />
        </mesh>

        {/* Rotating Quantum Radar Dish Array */}
        <group ref={radarRef} position={[0, 10.2, 0]}>
          {/* Dish mount stem */}
          <mesh position={[0, 0.8, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.3, 1.6, 8]} />
            <meshStandardMaterial color="#64748B" metalness={0.9} />
          </mesh>

          {/* Concave Dish */}
          <mesh position={[0, 1.8, 0]} rotation={[0.4, 0, 0]} castShadow>
            <coneGeometry args={[2.4, 0.9, 16]} />
            <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Emissive Center Receiver Needle */}
          <mesh position={[0, 2.2, 0.4]} rotation={[0.4, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.08, 1.5, 8]} />
            <meshStandardMaterial color="#38BDF8" emissive="#38BDF8" emissiveIntensity={3.5} />
          </mesh>
        </group>

        {/* Vertical Orbital Sky Laser Beacon */}
        <mesh ref={beamRef} position={[0, 22.0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 26.0, 8]} />
          <meshStandardMaterial
            color="#34D399"
            emissive="#34D399"
            emissiveIntensity={3.2}
            transparent
            opacity={0.75}
          />
        </mesh>

        {/* District Signage Banner */}
        <Text
          position={[0, 5.2, 1.7]}
          fontSize={0.52}
          color="#F8FAFC"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          TRANSMISSION CITADEL
        </Text>
        <Text
          position={[0, 4.4, 1.7]}
          fontSize={0.28}
          color="#34D399"
          anchorX="center"
          anchorY="middle"
        >
          DISTRICT 06 // RECRUITER & COMMS ARRAY
        </Text>
      </RigidBody>
    </group>
  );
}

