import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

function WireframeBlueprint() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.05;
  });
  return (
    <group ref={ref}>
      {[0, 1, 2, 3, 4].map(i => (
        <mesh key={i} position={[(i - 2) * 2.5, Math.sin(i) * 1.5, 0]}>
          <boxGeometry args={[1.5, 1.5 + i * 0.3, 1.5]} />
          <meshStandardMaterial color="#1e3a5f" wireframe />
        </mesh>
      ))}
      {/* Grid lines */}
      {[-4, -2, 0, 2, 4].map(x => (
        <mesh key={x} position={[x, 0, 0]}>
          <boxGeometry args={[0.02, 6, 0.02]} />
          <meshBasicMaterial color="#1d4ed8" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

export default function AboutWorld({ position = [0, 0, -30] }) {
  return (
    <group position={position}>
      <WireframeBlueprint />
      {/* Floating geometric fragments */}
      {[...Array(8)].map((_, i) => (
        <mesh key={i} position={[
          Math.cos(i / 8 * Math.PI * 2) * 6,
          Math.sin(i * 0.7) * 2,
          Math.sin(i / 8 * Math.PI * 2) * 3
        ]}>
          <octahedronGeometry args={[0.3, 0]} />
          <meshStandardMaterial color="#3B82F6" transparent opacity={0.4} wireframe />
        </mesh>
      ))}
    </group>
  );
}
