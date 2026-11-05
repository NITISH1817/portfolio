import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function EngineeringCore() {
  const groupRef = useRef();
  const materialRef = useRef();
  const particlesRef = useRef();
  
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      mouseRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const baseDistort = useRef({ value: 0.4, speed: 2 });
  
  useEffect(() => {
    if (!groupRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "main",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      }
    });

    tl.to(groupRef.current.position, { x: 2, z: -2, y: 1, duration: 1 }) // Hero to Identity
      .to(groupRef.current.rotation, { z: Math.PI / 8, duration: 1 }, "<")
      .to(groupRef.current.scale, { x: 0.8, y: 0.8, z: 0.8, duration: 1 }, "<")
      
      .to(groupRef.current.position, { x: -3, z: -3, duration: 1 }) // Identity to Capabilities
      .to(baseDistort.current, { value: 0.6, speed: 4, duration: 1 }, "<")
      
      .to(groupRef.current.position, { x: 3, y: 0, z: -4, duration: 2 }) // Capabilities to Projects
      .to(baseDistort.current, { value: 0.3, speed: 1, duration: 2 }, "<")
      
      .to(groupRef.current.position, { x: -3, y: -1, z: -3, duration: 2 }) // Projects to Education/Certs
      .to(particlesRef.current.scale, { x: 2, y: 2, z: 2, duration: 2 }, "<")
      
      .to(groupRef.current.position, { x: 2, y: 1, z: -2, duration: 2 }) // Edu to Achievements
      .to(baseDistort.current, { value: 0.5, speed: 3, duration: 2 }, "<")
      
      .to(groupRef.current.position, { x: 0, y: 0, z: -4, duration: 2 }) // to Resume/Contact
      .to(groupRef.current.scale, { x: 1, y: 1, z: 1, duration: 2 }, "<")
      .to(particlesRef.current.scale, { x: 1, y: 1, z: 1, duration: 2 }, "<")
      .to(baseDistort.current, { value: 0.2, speed: 1, duration: 2 }, "<");

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    // Procedural animation
    const elapsedTime = clock.getElapsedTime();
    groupRef.current.rotation.y += 0.005;
    
    if (materialRef.current) {
      materialRef.current.distort = baseDistort.current.value + Math.sin(elapsedTime) * 0.2;
      materialRef.current.speed = baseDistort.current.speed;
    }

    // Mouse Parallax interaction (smooth interpolation)
    targetRotation.current.x = THREE.MathUtils.lerp(targetRotation.current.x, mouseRef.current.y * 0.5, 0.05);
    targetRotation.current.y = THREE.MathUtils.lerp(targetRotation.current.y, mouseRef.current.x * 0.5, 0.05);
    
    groupRef.current.rotation.x = targetRotation.current.x;
    
    if (particlesRef.current) {
      particlesRef.current.rotation.y -= 0.002;
      particlesRef.current.rotation.x += 0.001;
    }
  });

  const [particleCount, setParticleCount] = useState(window.innerWidth > 768 ? 2000 : 300);
  const [particlePositions, setParticlePositions] = useState(() => {
    const count = window.innerWidth > 768 ? 2000 : 300;
    return new Float32Array(count * 3).map(() => (Math.random() - 0.5) * 15);
  });

  useEffect(() => {
    const handleResize = () => {
      const count = window.innerWidth > 768 ? 2000 : 300;
      setParticleCount(count);
      setParticlePositions(new Float32Array(count * 3).map(() => (Math.random() - 0.5) * 15));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    
    const handleCapFocus = (e) => {
      if (e.detail) {
        gsap.to(particlesRef.current.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 1 });
        gsap.to(baseDistort.current, { speed: 4, duration: 1 });
      }
    };
    const handleCapUnfocus = () => {
      gsap.to(particlesRef.current.scale, { x: 1, y: 1, z: 1, duration: 1 });
      gsap.to(baseDistort.current, { speed: 2, duration: 1 });
    };

    const handleMenuOpen = () => {
      gsap.to(groupRef.current.position, { z: -5, duration: 1 });
      gsap.to(groupRef.current.scale, { x: 0.8, y: 0.8, z: 0.8, duration: 1 });
      gsap.to(baseDistort.current, { speed: 1, duration: 1 });
    };

    const handleMenuClose = () => {
      gsap.to(groupRef.current.position, { z: 0, duration: 1 });
      gsap.to(groupRef.current.scale, { x: 1, y: 1, z: 1, duration: 1 });
      gsap.to(baseDistort.current, { speed: 2, duration: 1 });
    };

    const handleMenuHover = (e) => {
      const label = e.detail;
      if (label === 'WORK') {
        gsap.to(groupRef.current.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 0.5 });
      } else if (label === 'CAPABILITIES') {
        gsap.to(particlesRef.current.scale, { x: 2, y: 2, z: 2, duration: 0.5 });
      } else if (label === 'CONTACT') {
        gsap.to(groupRef.current.position, { x: 2, duration: 0.5 });
      } else {
        gsap.to(groupRef.current.scale, { x: 0.8, y: 0.8, z: 0.8, duration: 0.5 });
        gsap.to(particlesRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.5 });
        gsap.to(groupRef.current.position, { x: 0, duration: 0.5 });
      }
    };

    window.addEventListener('capability-focus', handleCapFocus);
    window.addEventListener('capability-unfocus', handleCapUnfocus);
    window.addEventListener('menu-open', handleMenuOpen);
    window.addEventListener('menu-close', handleMenuClose);
    window.addEventListener('menu-hover', handleMenuHover);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('capability-focus', handleCapFocus);
      window.removeEventListener('capability-unfocus', handleCapUnfocus);
      window.removeEventListener('menu-open', handleMenuOpen);
      window.removeEventListener('menu-close', handleMenuClose);
      window.removeEventListener('menu-hover', handleMenuHover);
    };
  }, []);

  return (
    <group ref={groupRef} position={[3, 0, -2]}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={2} color="#1A2FFB" />
      <directionalLight position={[-10, -10, -10]} intensity={1} color="#ffffff" />
      
      <Sphere args={[2, 64, 64]}>
        <MeshDistortMaterial
          ref={materialRef}
          color="#000000"
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.8}
          roughness={0.2}
          distort={0.4}
          speed={2}
        />
      </Sphere>
      
      {/* Particles around the core */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.03} color="#1A2FFB" transparent opacity={0.6} sizeAttenuation={true} />
      </points>
    </group>
  );
}
