import React from 'react';
import { Text } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import LandmarkBeacon from './LandmarkBeacon';
import { certificationsList } from '../../../data/portfolio';

export default function LandmarkExperience({ onEnter, onLeave, isDiscovered, isNight }) {
  const position = [34, 0, 34];

  return (
    <group position={position}>
      {/* Interactive Beacon in Front */}
      <LandmarkBeacon
        id="experience"
        name="EXPERIENCE & HONORS"
        position={[0, 0, -3]}
        color="#F59E0B"
        radius={7.0}
        onEnter={onEnter}
        onLeave={onLeave}
        isDiscovered={isDiscovered}
      />

      {/* University Campus Hall of Fame Building with Static Collider */}
      <RigidBody type="fixed" colliders={false} position={[0, 0, 4]}>
        <CuboidCollider args={[6.5, 2.5, 3.5]} position={[0, 2.5, 0]} />
        <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[13, 5, 7]} />
          <meshStandardMaterial color={isNight ? '#1E293B' : '#F8FAFC'} roughness={0.4} />
        </mesh>
        <mesh position={[0, 5.5, 0]} castShadow>
          <boxGeometry args={[14, 0.7, 8]} />
          <meshStandardMaterial color="#D97706" />
        </mesh>

        {/* Pillars */}
        {[-5.0, -2.5, 2.5, 5.0].map((x) => (
          <mesh key={x} position={[x, 2.5, 3.6]} castShadow>
            <cylinderGeometry args={[0.3, 0.4, 5, 12]} />
            <meshStandardMaterial color={isNight ? '#334155' : '#E2E8F0'} />
          </mesh>
        ))}

        {/* University Sign */}
        <mesh position={[0, 4.0, 3.6]}>
          <boxGeometry args={[8.5, 1.2, 0.2]} />
          <meshStandardMaterial color="#1E293B" />
        </mesh>
        <Text
          position={[0, 4.2, 3.75]}
          fontSize={0.34}
          color="#FBBF24"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          BANNARI AMMAN INSTITUTE OF TECH
        </Text>
        <Text
          position={[0, 3.75, 3.75]}
          fontSize={0.25}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          B.E. CSE • BATCH 2028 • CGPA 7.8
        </Text>
      </RigidBody>

      {/* Golden Trophies Row */}
      <group position={[0, 0, -6]}>
        {certificationsList.map((cert, i) => (
          <group key={cert.id} position={[(i - 1) * 6, 0, 0]}>
            <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[1.3, 1.5, 1.6, 16]} />
              <meshStandardMaterial color={isNight ? '#1E293B' : '#E2E8F0'} roughness={0.3} />
            </mesh>
            <group position={[0, 2.2, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.35, 0.15, 0.6, 12]} />
                <meshStandardMaterial color="#F59E0B" metalness={0.8} roughness={0.2} />
              </mesh>
              <mesh position={[0, 0.45, 0]} castShadow>
                <sphereGeometry args={[0.25, 12, 12]} />
                <meshStandardMaterial color="#FBBF24" metalness={0.9} roughness={0.1} />
              </mesh>
            </group>
            <Text
              position={[0, 0.7, 1.4]}
              fontSize={0.22}
              color={isNight ? '#F8FAFC' : '#0F172A'}
              anchorX="center"
              anchorY="middle"
              fontWeight="bold"
              maxWidth={2.8}
              textAlign="center"
            >
              {cert.title}
            </Text>
          </group>
        ))}
      </group>

      {/* 250+ DSA Cube & SIH 2025 Block */}
      <group position={[12, 0, 0]}>
        <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 3.2, 3.2]} />
          <meshStandardMaterial color="#10B981" roughness={0.3} />
        </mesh>
        <Text position={[0, 2.2, 1.65]} fontSize={0.8} color="#FFFFFF" anchorX="center" fontWeight="bold">
          250+
        </Text>
        <Text
          position={[0, 1.1, 1.65]}
          fontSize={0.24}
          color="#FFFFFF"
          anchorX="center"
          maxWidth={2.8}
          textAlign="center"
          fontWeight="bold"
        >
          DSA PROBLEMS SOLVED IN JAVA
        </Text>
      </group>

      <group position={[-12, 0, 0]}>
        <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 3.2, 3.2]} />
          <meshStandardMaterial color="#8B5CF6" roughness={0.3} />
        </mesh>
        <Text position={[0, 2.2, 1.65]} fontSize={0.42} color="#FFFFFF" anchorX="center" fontWeight="bold">
          IoT 3RD PLACE
        </Text>
        <Text
          position={[0, 1.1, 1.65]}
          fontSize={0.22}
          color="#FFFFFF"
          anchorX="center"
          maxWidth={2.8}
          textAlign="center"
          fontWeight="bold"
        >
          INNOVATION HACKATHON
        </Text>
      </group>
    </group>
  );
}
