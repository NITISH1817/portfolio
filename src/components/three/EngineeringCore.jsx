import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { MathUtils } from 'three';

// Procedural materials for the Engineering Core
const coreMaterial = new THREE.MeshPhysicalMaterial({
  color: '#10131A',
  metalness: 0.9,
  roughness: 0.1,
  clearcoat: 1.0,
  clearcoatRoughness: 0.1,
});

const ringMaterial = new THREE.MeshStandardMaterial({
  color: '#4C6FFF', // Accent blue
  metalness: 0.8,
  roughness: 0.2,
  emissive: '#4C6FFF',
  emissiveIntensity: 0.5,
  wireframe: true,
});

const nodeMaterial = new THREE.MeshStandardMaterial({
  color: '#22D3EE', // Cyan
  metalness: 0.5,
  roughness: 0.1,
  emissive: '#22D3EE',
  emissiveIntensity: 0.8,
});

export default function EngineeringCore() {
  const groupRef = useRef();
  const coreRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  const particlesRef = useRef();
  const { viewport } = useThree();

  // Geometries
  const coreGeometry = useMemo(() => new THREE.IcosahedronGeometry(1.5, 2), []);
  const ringGeometry1 = useMemo(() => new THREE.TorusGeometry(2.2, 0.02, 16, 100), []);
  const ringGeometry2 = useMemo(() => new THREE.TorusGeometry(2.6, 0.01, 16, 100), []);
  const ringGeometry3 = useMemo(() => new THREE.TorusGeometry(3.0, 0.015, 16, 100), []);
  
  // Ambient Particles
  const particlesCount = 150;
  const particlesPosition = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      // Particles spread around
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
    }
    return pos;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const mouseX = state.pointer.x;
    const mouseY = state.pointer.y;

    // Scroll progress (0 to 1)
    const scrollY = window.scrollY;
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = scrollY / maxScroll;

    if (groupRef.current) {
      // Base rotation
      groupRef.current.rotation.y = t * 0.05 + progress * Math.PI * 2;
      groupRef.current.rotation.x = progress * Math.PI;

      // Section Choreography
      let targetX = 0;
      let targetY = 0;
      let targetZ = 0;
      let targetScale = 1.0;

      // The object is scaled to be roughly 30-40% viewport height by default.
      
      // 0.00: HERO (Right side)
      if (progress < 0.12) {
        targetX = viewport.width * 0.25;
        targetY = 0;
        targetScale = 1.0;
      }
      // 0.12 - 0.25: IDENTITY (Far right, smaller)
      else if (progress < 0.25) {
        targetX = viewport.width * 0.35;
        targetY = 0;
        targetScale = 0.8;
      }
      // 0.25 - 0.45: CAPABILITIES (Far left, larger)
      else if (progress < 0.45) {
        targetX = -viewport.width * 0.35;
        targetY = 0;
        targetScale = 1.2;
      }
      // 0.45 - 0.65: WORK (Right side, pushed back)
      else if (progress < 0.65) {
        targetX = viewport.width * 0.3;
        targetY = 0;
        targetScale = 1.0;
        targetZ = -2;
      }
      // 0.65 - 0.75: EDUCATION & CERTIFICATIONS (Center-left background)
      else if (progress < 0.75) {
        targetX = -viewport.width * 0.2;
        targetY = viewport.height * 0.2;
        targetScale = 0.7;
        targetZ = -4;
      }
      // 0.75 - 0.85: ACHIEVEMENTS (Far Right)
      else if (progress < 0.85) {
        targetX = viewport.width * 0.35;
        targetY = 0;
        targetScale = 0.9;
        targetZ = -1;
      }
      // 0.85 - 1.00: RESUME & CONTACT (Far Right Edge)
      else {
        targetX = viewport.width * 0.35;
        targetY = viewport.height * 0.15;
        targetScale = 0.8;
      }

      // Add mouse parallax
      targetX += mouseX * 0.3;
      targetY += mouseY * 0.3;

      // Smooth interpolation
      groupRef.current.position.x = MathUtils.lerp(groupRef.current.position.x, targetX, 0.05);
      groupRef.current.position.y = MathUtils.lerp(groupRef.current.position.y, targetY, 0.05);
      groupRef.current.position.z = MathUtils.lerp(groupRef.current.position.z, targetZ, 0.05);
      
      const s = MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.05);
      groupRef.current.scale.set(s, s, s);
    }

    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.1;
      coreRef.current.rotation.x = t * 0.05;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.5) * 0.2;
      ring1Ref.current.rotation.y = t * 0.2;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = Math.PI / 3 + Math.cos(t * 0.3) * 0.3;
      ring2Ref.current.rotation.z = -t * 0.15;
    }

    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = Math.PI / 4;
      ring3Ref.current.rotation.x = -t * 0.1;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.02 + progress;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Core */}
      <mesh ref={coreRef} geometry={coreGeometry} material={coreMaterial} />
      
      {/* Orbital Rings */}
      <mesh ref={ring1Ref} geometry={ringGeometry1} material={ringMaterial} />
      <mesh ref={ring2Ref} geometry={ringGeometry2} material={nodeMaterial} />
      <mesh ref={ring3Ref} geometry={ringGeometry3} material={ringMaterial} />
      
      {/* Tiny floating nodes on the rings */}
      <mesh position={[2.2, 0, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <primitive object={nodeMaterial} />
      </mesh>
      <mesh position={[-1.3, 2.2, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <primitive object={nodeMaterial} />
      </mesh>

      {/* Ambient Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlesCount}
            array={particlesPosition}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.02} color="#8B5CF6" transparent opacity={0.5} sizeAttenuation />
      </points>

      {/* Futuristic Lighting Setup */}
      <ambientLight intensity={1.0} color="#10131A" />
      {/* Soft fill */}
      <directionalLight position={[-5, 5, 5]} intensity={1.5} color="#4C6FFF" />
      {/* Rim light (Violet) */}
      <spotLight position={[5, 10, -5]} intensity={3} angle={0.5} penumbra={1} color="#8B5CF6" />
      {/* Core glow (Cyan) */}
      <pointLight position={[0, 0, 0]} intensity={2} color="#22D3EE" distance={5} />
    </group>
  );
}
