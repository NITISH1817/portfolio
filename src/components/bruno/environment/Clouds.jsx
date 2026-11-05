import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Clouds() {
  const groupRef = useRef(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.015;
    }
  });

  const cloudColor = '#3B2D54';

  const cloudPositions = [
    [-35, 26, -40],
    [40, 28, -30],
    [-20, 25, 45],
    [35, 27, 35],
    [-50, 30, 0],
    [50, 29, 10]
  ];

  return (
    <group ref={groupRef}>
      {cloudPositions.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[4.5, 7, 7]} />
            <meshStandardMaterial color={cloudColor} roughness={0.9} flatShading />
          </mesh>
          <mesh position={[3, -0.6, 0]}>
            <sphereGeometry args={[3.2, 7, 7]} />
            <meshStandardMaterial color={cloudColor} roughness={0.9} flatShading />
          </mesh>
          <mesh position={[-3, -0.8, 0]}>
            <sphereGeometry args={[3.5, 7, 7]} />
            <meshStandardMaterial color={cloudColor} roughness={0.9} flatShading />
          </mesh>
          <mesh position={[0.8, -0.4, 2.5]}>
            <sphereGeometry args={[2.8, 7, 7]} />
            <meshStandardMaterial color={cloudColor} roughness={0.9} flatShading />
          </mesh>
        </group>
      ))}
    </group>
  );
}
