import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

const DSA_STRUCTURES = [
  { label: 'ARRAY',       color: '#3B82F6', pos: [-6, 0, 0] },
  { label: 'LINKED LIST', color: '#8B5CF6', pos: [-2, 0, 0] },
  { label: 'TREE',        color: '#10B981', pos: [2,  0, 0] },
  { label: 'GRAPH',       color: '#F59E0B', pos: [6,  0, 0] },
  { label: 'RECURSION',   color: '#EF4444', pos: [0,  0, -5] },
];

function DSANode({ label, color, pos }) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * (hovered ? 0.8 : 0.2);
  });
  return (
    <group ref={ref} position={pos}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}>
      <mesh>
        <octahedronGeometry args={[0.6, 0]} />
        <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.7 : 0.2} roughness={0.1} metalness={0.7} />
      </mesh>
      <Text fontSize={0.25} color="#F5F7FA" anchorX="center" anchorY="bottom" position={[0, 1, 0]}>
        {label}
      </Text>
    </group>
  );
}

export default function AlgorithmWorld({ position = [0, 0, -260] }) {
  return (
    <group position={position}>
      <Text fontSize={0.5} color="#3B82F6" anchorX="center" anchorY="middle" position={[0, 4, 0]}>
        ALGORITHM LAB
      </Text>
      <Text fontSize={0.28} color="#6B7280" anchorX="center" anchorY="middle" position={[0, 3, 0]}>
        170+ Problems · Java
      </Text>
      {DSA_STRUCTURES.map(s => <DSANode key={s.label} {...s} />)}
    </group>
  );
}
