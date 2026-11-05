import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';

export default function Particles({ count = 2000 }) {
  const meshRef = useRef();
  const coreState = useStore((state) => state.coreState);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 20;
      const speed = Math.random() * 0.02 + 0.01;
      const radius = Math.random() * 10 + 2;
      const angle = Math.random() * Math.PI * 2;
      temp.push({ x, y, z, speed, radius, angle, initialY: y });
    }
    return temp;
  }, [count]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Animate based on state
    const isOrbiting = coreState !== 'genesis' && coreState !== 'idle';
    const time = state.clock.getElapsedTime();

    particles.forEach((particle, i) => {
      if (isOrbiting) {
        // Orbit around center
        particle.angle += particle.speed;
        const x = Math.cos(particle.angle) * particle.radius;
        const z = Math.sin(particle.angle) * particle.radius;
        const y = particle.initialY + Math.sin(time * 2 + i) * 0.5;
        
        dummy.position.set(x, y, z);
      } else {
        // Float randomly
        dummy.position.set(
          particle.x + Math.sin(time + particle.speed * i) * 0.5,
          particle.y + Math.cos(time + particle.speed * i) * 0.5,
          particle.z
        );
      }
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial color="#F4F7FB" transparent opacity={0.6} />
    </instancedMesh>
  );
}
