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

export default function District3SoftwareEng({ onEnter, onLeave, onInteract }: DistrictProps) {
  const cubeRef = useRef<THREE.Group>(null);
  const dataBeamRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (cubeRef.current) {
      cubeRef.current.rotation.y = t * 0.7;
      cubeRef.current.rotation.z = Math.sin(t * 0.5) * 0.2;
    }
    if (dataBeamRef.current) {
      (dataBeamRef.current.material as THREE.MeshStandardMaterial).opacity =
        0.5 + Math.sin(t * 4) * 0.3;
    }
  });

  return (
    <group position={[42, 0, 38]}>
      {/* Interactive Trigger Beacon */}
      <mesh
        visible={false}
        onPointerOver={() => onEnter && onEnter({ id: 'engineering', name: 'DISTRICT 03 — SOFTWARE ENGINEERING' })}
        onPointerOut={() => onLeave && onLeave('engineering')}
        onClick={() => onInteract && onInteract('about')}
      >
        <sphereGeometry args={[9.5, 16, 16]} />
      </mesh>

      <RigidBody type="fixed" colliders={false} position={[0, 0, 0]}>
        <CuboidCollider args={[5.0, 6.0, 5.0]} position={[0, 6.0, 0]} />

        {/* Foundation Plinth */}
        <mesh position={[0, 0.25, 0]} receiveShadow castShadow>
          <boxGeometry args={[14, 0.5, 14]} />
          <meshStandardMaterial color="#0A0E1A" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* 4 Towering Server Blade Racks */}
        {[[-3.8, -3.8], [3.8, -3.8], [-3.8, 3.8], [3.8, 3.8]].map(([x, z], i) => (
          <group key={i} position={[x, 0, z]}>
            <mesh position={[0, 5.0, 0]} castShadow receiveShadow>
              <boxGeometry args={[2.4, 10.0, 2.4]} />
              <meshStandardMaterial color="#080C16" roughness={0.2} metalness={0.8} />
            </mesh>

            {/* Glowing Server LED Status Strips */}
            {[-0.6, 0, 0.6].map((sx, si) => (
              <mesh key={si} position={[sx, 5.0, 1.22]}>
                <planeGeometry args={[0.2, 9.2]} />
                <meshStandardMaterial
                  color="#A855F7"
                  emissive="#A855F7"
                  emissiveIntensity={2.5}
                />
              </mesh>
            ))}
          </group>
        ))}

        {/* Central Asynchronous Data Pipeline Hub */}
        <mesh position={[0, 4.0, 0]} castShadow>
          <cylinderGeometry args={[1.8, 2.2, 8.0, 12]} />
          <meshStandardMaterial color="#111827" roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Pulsing Vertical Energy Beam */}
        <mesh ref={dataBeamRef} position={[0, 12.0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 16.0, 8]} />
          <meshStandardMaterial
            color="#A855F7"
            emissive="#A855F7"
            emissiveIntensity={3.2}
            transparent
            opacity={0.7}
          />
        </mesh>

        {/* Floating Java SE 17 & Microservice Cube */}
        <Float speed={2} rotationIntensity={0.6} floatIntensity={0.6}>
          <group ref={cubeRef} position={[0, 14.5, 0]}>
            <mesh>
              <boxGeometry args={[2.2, 2.2, 2.2]} />
              <meshStandardMaterial
                color="#A855F7"
                emissive="#A855F7"
                emissiveIntensity={2.0}
                wireframe
              />
            </mesh>
            <mesh>
              <boxGeometry args={[1.4, 1.4, 1.4]} />
              <meshStandardMaterial
                color="#FF8A3D"
                emissive="#FF8A3D"
                emissiveIntensity={2.4}
              />
            </mesh>
          </group>
        </Float>

        {/* District Signage Banner */}
        <Text
          position={[0, 4.8, 4.8]}
          fontSize={0.52}
          color="#F8FAFC"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          SOFTWARE ENGINEERING
        </Text>
        <Text
          position={[0, 4.0, 4.8]}
          fontSize={0.28}
          color="#A855F7"
          anchorX="center"
          anchorY="middle"
        >
          DISTRICT 03 // DISTRIBUTED JAVA & SYSTEMS
        </Text>
      </RigidBody>
    </group>
  );
}

