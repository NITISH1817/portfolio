import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Float, OrbitControls } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// A simple core placeholder for now.
function EngineeringCore() {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial color="#3B82F6" wireframe />
      </mesh>
    </group>
  );
}

export default function GlobalScene() {
  const cameraGroupRef = useRef();
  
  useEffect(() => {
    // In the future, this is where we will define the GSAP master timeline
    // that animates cameraGroupRef.current.position and rotation based on scroll.
    const ctx = gsap.context(() => {
      // Setup master timeline
    });
    
    return () => ctx.revert();
  }, []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* Group to control camera movements via GSAP without fighting OrbitControls (if used) */}
      <group ref={cameraGroupRef}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <EngineeringCore />
        </Float>
      </group>

      <Environment preset="city" />
      {/* OrbitControls disabled for scroll-driven experience, but kept for debugging if needed */}
      {/* <OrbitControls enableZoom={false} /> */}
    </>
  );
}
