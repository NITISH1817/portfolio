import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { education } from '../../data/education';
import { achievements } from '../../data/achievements';

export default function JourneyWorld({ position = [25, 0, -180] }) {
  const curveRef = useRef();

  const milestones = [
    { label: 'SCHOOLING', sub: '93.1% HSC', pos: [0, 0, 0] },
    { label: 'B.E. CSE', sub: 'BIT — 2024→2028', pos: [0, 1.5, -4] },
    { label: 'JAVA / DSA', sub: '170+ Problems', pos: [2, 0, -8] },
    { label: 'PROJECTS', sub: 'SETU / DR / MLOps', pos: [-2, 1, -12] },
    { label: 'SIH 2025', sub: 'Selected Participant', pos: [0, 0, -16] },
    { label: 'CERTIFICATIONS', sub: 'Oracle • AWS • Cisco', pos: [2, 1.5, -20] },
  ];

  const tubePoints = milestones.map(m => new THREE.Vector3(...m.pos));
  const curve = useMemo(() => new THREE.CatmullRomCurve3(tubePoints), []);
  const tubeGeo = useMemo(() => new THREE.TubeGeometry(curve, 100, 0.05, 8, false), [curve]);

  return (
    <group position={position}>
      <mesh geometry={tubeGeo}>
        <meshBasicMaterial color="#3B82F6" transparent opacity={0.4} />
      </mesh>
      {milestones.map(({ label, sub, pos }) => (
        <group key={label} position={pos}>
          <mesh>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshPhysicalMaterial color="#3B82F6" emissive="#1d4ed8" emissiveIntensity={0.6} roughness={0.1} metalness={0.8} />
          </mesh>
          <Text fontSize={0.28} color="#F5F7FA" anchorX="left" anchorY="middle" position={[0.5, 0.2, 0]}>{label}</Text>
          <Text fontSize={0.18} color="#6B7280" anchorX="left" anchorY="middle" position={[0.5, -0.15, 0]}>{sub}</Text>
        </group>
      ))}
    </group>
  );
}
