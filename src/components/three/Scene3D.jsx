import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MathUtils } from 'three';

export default function Scene3D() {
  const groupRef = useRef();
  const objectRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Normalizing mouse to -1 to 1 for 3D space
    const mouseX = (state.pointer.x * window.innerWidth) / 1000;
    const mouseY = (state.pointer.y * window.innerHeight) / 1000;
    
    const scrollY = window.scrollY;
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = scrollY / maxScroll;

    if (groupRef.current && objectRef.current) {
      // Base rotation and cursor follow (spatial interaction)
      groupRef.current.rotation.y = MathUtils.lerp(groupRef.current.rotation.y, mouseX * 0.4 + t * 0.1, 0.05);
      groupRef.current.rotation.x = MathUtils.lerp(groupRef.current.rotation.x, -mouseY * 0.4 + t * 0.05, 0.05);
      groupRef.current.position.y = Math.sin(t) * 0.1;

      let targetX = 0;
      let targetY = 0;
      let targetZ = 0;
      let targetScale = 1;

      // Section morphing and positioning
      if (progress < 0.15) { // Hero
        targetX = window.innerWidth > 768 ? 3 : 0;
        targetY = 0;
        targetScale = 1.2;
      } else if (progress < 0.3) { // Identity (Orbital System)
        targetX = window.innerWidth > 768 ? 4 : 0;
        targetY = 0;
        targetScale = 0.8;
      } else if (progress < 0.45) { // Capabilities
        targetX = window.innerWidth > 768 ? -4 : 0;
        targetY = 1;
        targetScale = 1;
      } else if (progress < 0.75) { // Work
        targetX = 4;
        targetY = 2;
        targetScale = 0.5;
        targetZ = -5;
      } else if (progress < 0.85) { // Education & Certs
        targetX = -4;
        targetY = -1;
        targetScale = 0.7;
      } else { // Achievements, Resume, Contact (Network object)
        targetX = 0;
        targetY = 0;
        targetScale = 1.5;
        targetZ = -2;
      }

      groupRef.current.position.x = MathUtils.lerp(groupRef.current.position.x, targetX, 0.05);
      groupRef.current.position.y = MathUtils.lerp(groupRef.current.position.y, targetY, 0.05);
      groupRef.current.position.z = MathUtils.lerp(groupRef.current.position.z, targetZ, 0.05);
      
      const s = MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.05);
      groupRef.current.scale.set(s, s, s);

      // Morphing object appearance slightly based on progress & cursor velocity
      const vel = Math.abs(state.pointer.x) + Math.abs(state.pointer.y);
      objectRef.current.rotation.x = t * 0.1 + (vel * 0.5);
      objectRef.current.rotation.z = t * 0.15;
    }
  });

  return (
    <>
      <fog attach="fog" args={['#07080C', 5, 15]} />
      
      {/* Very subtle background grid */}
      <gridHelper args={[30, 30, '#121722', '#0D1017']} position={[0, -3, 0]} />

      <group ref={groupRef} data-cursor="explore">
        {/* Abstract Spatial Object */}
        <mesh ref={objectRef}>
          <octahedronGeometry args={[2.5, 1]} />
          <meshPhysicalMaterial 
            color="#5B6CFF"
            transmission={0.9}
            opacity={1}
            metalness={0.2}
            roughness={0.1}
            ior={1.5}
            thickness={1.5}
            specularIntensity={1}
            specularColor="#38D9FF"
            envMapIntensity={1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            wireframe={true}
          />
        </mesh>

        <mesh>
          <icosahedronGeometry args={[1.2, 0]} />
          <meshStandardMaterial 
            color="#07080C"
            metalness={0.9}
            roughness={0.2}
            wireframe={false}
          />
        </mesh>
        
        {/* Lighting */}
        <ambientLight intensity={0.5} color="#F5F7FA" />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#5B6CFF" />
        <directionalLight position={[-5, -5, 5]} intensity={1} color="#9B6CFF" />
        
        {/* Cursor Point Light representation - subtle */}
        <pointLight position={[0, 0, 2]} intensity={2} color="#38D9FF" distance={5} />
      </group>
    </>
  );
}
