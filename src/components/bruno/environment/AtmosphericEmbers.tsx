import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const EMBER_COUNT = 85;

export default function AtmosphericEmbers() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate particle positions, velocities, and color variations
  const embers = useMemo(() => {
    return Array.from({ length: EMBER_COUNT }, () => ({
      x: (Math.random() - 0.5) * 110,
      y: 0.8 + Math.random() * 8.5,
      z: (Math.random() - 0.5) * 110,
      vx: (Math.random() - 0.5) * 0.4,
      vy: 0.15 + Math.random() * 0.35,
      vz: (Math.random() - 0.5) * 0.4,
      scale: 0.08 + Math.random() * 0.12,
      phase: Math.random() * Math.PI * 2,
      baseColor: ['#A855F7', '#FFB66D', '#61A5FF', '#FF70A6'][Math.floor(Math.random() * 4)]
    }));
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const dt = Math.min(delta, 0.05);
    const time = state.clock.getElapsedTime();

    embers.forEach((e, i) => {
      // Ethereal floating drift motion
      e.y += e.vy * dt;
      e.x += (e.vx + Math.sin(time * 0.6 + e.phase) * 0.25) * dt;
      e.z += (e.vz + Math.cos(time * 0.6 + e.phase) * 0.25) * dt;

      // Wrap around when floating above boundary
      if (e.y > 10.5) {
        e.y = 0.6 + Math.random() * 1.5;
        e.x = (Math.random() - 0.5) * 105;
        e.z = (Math.random() - 0.5) * 105;
      }

      // Shimmer scale
      const shimmer = 0.8 + Math.sin(time * 2.5 + e.phase) * 0.25;
      dummy.position.set(e.x, e.y, e.z);
      dummy.scale.setScalar(e.scale * shimmer);
      dummy.updateMatrix();

      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, EMBER_COUNT]}
      frustumCulled={false}
    >
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color="#FFB66D"
        emissive="#A855F7"
        emissiveIntensity={2.5}
        roughness={0.2}
        metalness={0.8}
        toneMapped={false}
      />
    </instancedMesh>
  );
}
