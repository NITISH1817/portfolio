import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as CANNON from 'cannon-es';
import { usePhysics } from '../PhysicsContext';
import { identityData } from '../../../data/portfolio';
import { carAudio } from '../CarAudio';

export default function ContactZone({ onSelectContact, isNight }) {
  const { world, carState } = usePhysics();
  const triggerCooldown = useRef(0);

  // Static collision bodies for post office & pedestals
  useEffect(() => {
    const boothBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      position: new CANNON.Vec3(-46, 2.5, 0)
    });
    boothBody.addShape(new CANNON.Box(new CANNON.Vec3(2.5, 2.5, 3.5)));
    world.addBody(boothBody);

    return () => {
      world.removeBody(boothBody);
    };
  }, [world]);

  // Proximity check
  useFrame(() => {
    const carPos = carState.current.position;
    const now = performance.now();

    const dx = carPos.x - (-38);
    const dz = carPos.z - 0;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < 4.5 && now - triggerCooldown.current > 3000) {
      triggerCooldown.current = now;
      carAudio.playChime();
      onSelectContact();
    }
  });

  const socials = [
    { name: 'GitHub', url: identityData.github, color: '#24292F', label: 'github.com/NITISH1817' },
    { name: 'LinkedIn', url: identityData.linkedin, color: '#0A66C2', label: 'in/nitish-priyan' },
    { name: 'LeetCode', url: identityData.leetcode, color: '#FFA116', label: 'leetcode/NITISH1817' },
    { name: 'Email', url: `mailto:${identityData.email}`, color: '#EA4335', label: identityData.email }
  ];

  return (
    <group position={[-42, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
      {/* Zone Title Banner */}
      <group position={[0, 8, -12]}>
        <Text
          fontSize={2.2}
          color={isNight ? '#34D399' : '#059669'}
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          CONTACT & SOCIAL HUB
        </Text>
        <Text
          position={[0, -1.0, 0]}
          fontSize={0.7}
          color={isNight ? '#94A3B8' : '#64748B'}
          anchorX="center"
          anchorY="middle"
        >
          DRIVE OVER A PEDESTAL TO CONNECT OR OPEN LINK
        </Text>
      </group>

      {/* 3D Giant Mailbox / Post Office */}
      <group position={[0, 0, -4]}>
        <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[5, 5, 4]} />
          <meshStandardMaterial color={isNight ? '#1E293B' : '#EF4444'} roughness={0.3} />
        </mesh>
        <mesh position={[0, 5.3, 0]} castShadow>
          <cylinderGeometry args={[2.5, 2.5, 4, 16, 1, false, 0, Math.PI]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial color={isNight ? '#0F172A' : '#DC2626'} />
        </mesh>
        {/* Mail slot */}
        <mesh position={[0, 3.2, 2.05]}>
          <boxGeometry args={[3, 0.4, 0.1]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
        <Text
          position={[0, 4.0, 2.05]}
          fontSize={0.5}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          POST OFFICE
        </Text>
      </group>

      {/* Social Pedestals */}
      <group position={[0, 0, 7]}>
        {socials.map((s, i) => (
          <group
            key={s.name}
            position={[(i - 1.5) * 5.5, 0, 0]}
            onClick={() => {
              carAudio.playChime();
              window.open(s.url, '_blank');
            }}
          >
            {/* Base Pedestal */}
            <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[1.5, 1.7, 1.6, 16]} />
              <meshStandardMaterial color={isNight ? '#1E293B' : '#E2E8F0'} roughness={0.4} />
            </mesh>
            {/* Colored Top Pad */}
            <mesh position={[0, 1.62, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[1.4, 16]} />
              <meshStandardMaterial color={s.color} emissive={s.color} emissiveIntensity={0.6} />
            </mesh>
            <Text
              position={[0, 2.3, 0]}
              fontSize={0.4}
              color={isNight ? '#F8FAFC' : '#0F172A'}
              anchorX="center"
              anchorY="middle"
              fontWeight="bold"
            >
              {s.name}
            </Text>
            <Text
              position={[0, 0.7, 1.6]}
              fontSize={0.22}
              color={isNight ? '#94A3B8' : '#64748B'}
              anchorX="center"
              anchorY="middle"
              maxWidth={3.0}
              textAlign="center"
            >
              {s.label}
            </Text>
          </group>
        ))}
      </group>
    </group>
  );
}

