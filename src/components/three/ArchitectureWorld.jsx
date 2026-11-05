import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const ARCH_NODES = [
  { label: 'USER',     color: '#10B981', pos: [0, 5, 0] },
  { label: 'FRONTEND', color: '#3B82F6', pos: [0, 3, 0] },
  { label: 'API',      color: '#8B5CF6', pos: [0, 1, 0] },
  { label: 'BACKEND',  color: '#3B82F6', pos: [0, -1, 0] },
  { label: 'MODEL',    color: '#F59E0B', pos: [0, -3, 0] },
  { label: 'DATABASE', color: '#EF4444', pos: [0, -5, 0] },
];

function DataPacket({ from, to, color, offset = 0 }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = (clock.getElapsedTime() * 0.6 + offset) % 1;
    if (ref.current) {
      ref.current.position.x = from[0] + (to[0] - from[0]) * t;
      ref.current.position.y = from[1] + (to[1] - from[1]) * t;
      ref.current.position.z = from[2] + (to[2] - from[2]) * t;
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

export default function ArchitectureWorld({ position = [0, 0, -140] }) {
  return (
    <group position={position}>
      {ARCH_NODES.map(({ label, color, pos }) => (
        <group key={label} position={pos}>
          <mesh>
            <boxGeometry args={[2, 0.8, 0.5]} />
            <meshPhysicalMaterial color="#111827" emissive={color} emissiveIntensity={0.2} roughness={0.2} metalness={0.8} />
          </mesh>
          <Text fontSize={0.3} color={color} anchorX="center" anchorY="middle" position={[0, 0, 0.3]}>
            {label}
          </Text>
          {/* Connector line down */}
          {label !== 'DATABASE' && (
            <mesh position={[0, -1, 0]}>
              <boxGeometry args={[0.03, 1.5, 0.03]} />
              <meshBasicMaterial color={color} transparent opacity={0.4} />
            </mesh>
          )}
        </group>
      ))}
      {/* Animated data packets */}
      {ARCH_NODES.slice(0, -1).map((node, i) => (
        <DataPacket
          key={i}
          from={node.pos}
          to={ARCH_NODES[i + 1].pos}
          color={node.color}
          offset={i / ARCH_NODES.length}
        />
      ))}
    </group>
  );
}
