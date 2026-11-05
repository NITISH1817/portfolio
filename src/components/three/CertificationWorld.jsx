import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { certifications } from '../../data/certifications';

function CertCard({ cert, position, index }) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 0.6 + index) * 0.3;
    ref.current.rotation.y = hovered ? 0.2 : Math.sin(clock.getElapsedTime() * 0.3 + index) * 0.1;
  });
  return (
    <group ref={ref} position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}>
      <mesh>
        <boxGeometry args={[3.2, 1.8, 0.08]} />
        <meshPhysicalMaterial color="#0f172a" roughness={0.1} metalness={0.9}
          emissive="#3B82F6" emissiveIntensity={hovered ? 0.2 : 0.05} />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(3.2, 1.8, 0.08)]} />
        <lineBasicMaterial color={hovered ? '#3B82F6' : '#1d2535'} />
      </lineSegments>
      <Text fontSize={0.2} color="#F5F7FA" anchorX="center" anchorY="middle" position={[0, 0.3, 0.05]} maxWidth={2.8}>
        {cert.title}
      </Text>
      <Text fontSize={0.16} color="#6B7280" anchorX="center" anchorY="middle" position={[0, -0.2, 0.05]}>
        {cert.issuer}
      </Text>
    </group>
  );
}

export default function CertificationWorld({ position = [-25, 0, -220] }) {
  const certList = certifications || [];
  return (
    <group position={position}>
      {certList.map((cert, i) => (
        <CertCard key={cert.title} cert={cert} index={i}
          position={[(i - 1) * 5, Math.sin(i) * 1.5, Math.cos(i) * 2]} />
      ))}
    </group>
  );
}
