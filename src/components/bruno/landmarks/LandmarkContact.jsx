import React from 'react';
import { Text } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import LandmarkBeacon from './LandmarkBeacon';
import { identityData } from '../../../data/portfolio';

export default function LandmarkContact({ onEnter, onLeave, isDiscovered, isNight }) {
  const position = [-42, 0, -12];

  const socials = [
    { name: 'GitHub', url: identityData.github, color: '#24292F' },
    { name: 'LinkedIn', url: identityData.linkedin, color: '#0A66C2' },
    { name: 'Email', url: `mailto:${identityData.email}`, color: '#EA4335' }
  ];

  return (
    <group position={position} rotation={[0, Math.PI / 2, 0]}>
      {/* Interactive Beacon */}
      <LandmarkBeacon
        id="contact"
        name="CONTACT & TRANSMISSION"
        position={[0, 0, 4]}
        color="#10B981"
        radius={6.5}
        onEnter={onEnter}
        onLeave={onLeave}
        isDiscovered={isDiscovered}
      />

      {/* Transmission Station Structure with Static Collider */}
      <RigidBody type="fixed" colliders={false} position={[0, 0, -4]}>
        <CuboidCollider args={[2.5, 3.0, 3.5]} position={[0, 3.0, 0]} />

        <mesh position={[0, 2.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[5, 4.4, 4]} />
          <meshStandardMaterial color={isNight ? '#1E293B' : '#10B981'} roughness={0.3} />
        </mesh>

        {/* Antenna Mast */}
        <mesh position={[0, 5.8, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.15, 3.2, 8]} />
          <meshStandardMaterial color="#64748B" metalness={0.8} />
        </mesh>
        {/* Radar Dish */}
        <mesh position={[0, 7.2, 0]} rotation={[0.4, 0, 0]} castShadow>
          <sphereGeometry args={[1.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* Blinking Top Beacon LED */}
        <mesh position={[0, 7.8, 0]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={2.5} />
        </mesh>

        <Text
          position={[0, 3.2, 2.05]}
          fontSize={0.42}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          STATION HQ
        </Text>
      </RigidBody>

      {/* Social Pedestals */}
      <group position={[0, 0, 8]}>
        {socials.map((s, i) => (
          <group
            key={s.name}
            position={[(i - 1) * 4.8, 0, 0]}
            onClick={() => window.open(s.url, '_blank')}
          >
            <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[1.2, 1.4, 1.4, 16]} />
              <meshStandardMaterial color={isNight ? '#1E293B' : '#E2E8F0'} roughness={0.3} />
            </mesh>
            <mesh position={[0, 1.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[1.1, 16]} />
              <meshStandardMaterial color={s.color} emissive={s.color} emissiveIntensity={0.6} />
            </mesh>
            <Text
              position={[0, 2.0, 0]}
              fontSize={0.32}
              color={isNight ? '#F8FAFC' : '#0F172A'}
              anchorX="center"
              fontWeight="bold"
            >
              {s.name}
            </Text>
          </group>
        ))}
      </group>
    </group>
  );
}
