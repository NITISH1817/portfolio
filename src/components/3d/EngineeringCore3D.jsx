import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function EngineeringCore3D() {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial color="#3B82F6" wireframe />
    </mesh>
  );
}
