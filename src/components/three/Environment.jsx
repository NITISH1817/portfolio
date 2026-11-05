import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

function FloatingParticles({ count = 800 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 200;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 2] = -(Math.random() * 400);
    }
    return pos;
  }, [count]);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.005;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#3B82F6" size={0.08} transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

function GridFloor() {
  const ref = useRef();
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(600, 600, 60, 60);
    return g;
  }, []);

  return (
    <lineSegments position={[0, -6, -170]} rotation={[-Math.PI / 2, 0, 0]}>
      <edgesGeometry args={[new THREE.PlaneGeometry(600, 600, 60, 60)]} />
      <lineBasicMaterial color="#1d2535" transparent opacity={0.3} />
    </lineSegments>
  );
}

export default function Environment() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 10]} intensity={1.2} color="#ffffff" castShadow />
      <pointLight position={[-10, 10, -10]} intensity={0.8} color="#3B82F6" />
      <pointLight position={[10, -10, 10]} intensity={0.5} color="#8B5CF6" />
      <Stars radius={150} depth={80} count={3000} factor={3} saturation={0} fade speed={0.5} />
      <FloatingParticles count={600} />
      <GridFloor />
      <fog attach="fog" args={['#08090C', 8, 80]} />
    </>
  );
}
