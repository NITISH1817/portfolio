import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Ocean({ isNight }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      meshRef.current.position.y = -0.45 + Math.sin(t * 1.2) * 0.08;
    }
  });

  const waterColor = isNight ? '#0C1B2E' : '#38BDF8';
  const foamColor = isNight ? '#1E3A5F' : '#BAE6FD';

  return (
    <group>
      {/* Outer Deep Ocean */}
      <mesh
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.45, 0]}
        receiveShadow
      >
        <planeGeometry args={[360, 360, 24, 24]} />
        <meshStandardMaterial
          color={waterColor}
          roughness={0.25}
          metalness={0.2}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Shore Foam Ring around the Island */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.38, 0]}>
        <ringGeometry args={[74, 82, 48]} />
        <meshStandardMaterial
          color={foamColor}
          transparent
          opacity={0.45}
          roughness={0.8}
        />
      </mesh>

      {/* Island Sandy Shoreline Base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]} receiveShadow>
        <circleGeometry args={[78, 48]} />
        <meshStandardMaterial
          color={isNight ? '#1E293B' : '#FDE68A'}
          roughness={0.9}
        />
      </mesh>
    </group>
  );
}

