import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';

const STATE_CONFIG = {
  idle: { scale: 0, wireframe: false, opacity: 0 },
  genesis: { scale: 1, wireframe: false, opacity: 0.8 },
  identity: { scale: 1.5, wireframe: true, opacity: 1 },
  capabilities: { scale: 2, wireframe: true, opacity: 0.5 },
  work: { scale: 2.5, wireframe: true, opacity: 0.3 },
  education: { scale: 1.2, wireframe: false, opacity: 0.9 },
  certifications: { scale: 1.8, wireframe: true, opacity: 0.6 },
  achievements: { scale: 2.2, wireframe: false, opacity: 0.8 },
  resume: { scale: 1, wireframe: true, opacity: 0.2 },
  contact: { scale: 1.5, wireframe: false, opacity: 1 },
};

export default function DigitalCore() {
  const meshRef = useRef();
  const materialRef = useRef();
  const coreState = useStore((state) => state.coreState);
  
  const targetConfig = STATE_CONFIG[coreState] || STATE_CONFIG.genesis;

  useFrame((state, delta) => {
    if (!meshRef.current || !materialRef.current) return;

    // Smooth interpolation to target state
    const dt = 1.0 - Math.pow(0.01, delta); // frame-rate independent damping
    
    meshRef.current.scale.lerp(new THREE.Vector3(targetConfig.scale, targetConfig.scale, targetConfig.scale), dt * 2);
    materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, targetConfig.opacity, dt * 2);
    
    // Always rotate
    meshRef.current.rotation.x += delta * 0.2;
    meshRef.current.rotation.y += delta * 0.3;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial 
        ref={materialRef}
        color="#5C6CFF" 
        emissive="#5C6CFF"
        emissiveIntensity={0.5}
        wireframe={targetConfig.wireframe}
        transparent
      />
    </mesh>
  );
}
