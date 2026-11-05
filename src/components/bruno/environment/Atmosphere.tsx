import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Atmosphere() {
  const particlesCount = 80;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Floating glowing ambient fireflies / particles
  const particlesData = useMemo(() => {
    return Array.from({ length: particlesCount }, () => ({
      x: (Math.random() - 0.5) * 110,
      y: 1.0 + Math.random() * 8.0,
      z: (Math.random() - 0.5) * 110,
      speedY: 0.2 + Math.random() * 0.4,
      freq: 1.0 + Math.random() * 2.0,
      scale: 0.15 + Math.random() * 0.2
    }));
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);

    particlesData.forEach((p, i) => {
      p.y += Math.sin(t * p.freq) * 0.4 * dt;
      p.x += Math.cos(t * p.freq * 0.7) * 0.3 * dt;

      dummy.position.set(p.x, p.y, p.z);
      const pulse = 1 + Math.sin(t * 3 + i) * 0.3;
      dummy.scale.setScalar(p.scale * pulse);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* Background Dark Purple Sky Color & Atmospheric Fog */}
      <color attach="background" args={['#171222']} />
      <fog attach="fog" args={['#171222', 50, 150]} />

      {/* Ambient Lighting with Neon Purple Tint */}
      <ambientLight intensity={0.65} color="#E9D5FF" />

      {/* Main Warm Directional Sun/Moon Light */}
      <directionalLight
        position={[35, 55, 30]}
        intensity={1.7}
        color="#FFE4D6"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={10}
        shadow-camera-far={140}
        shadow-camera-left={-75}
        shadow-camera-right={75}
        shadow-camera-top={75}
        shadow-camera-bottom={-75}
        shadow-bias={-0.0004}
      />

      {/* Electric Blue Fill Light */}
      <directionalLight
        position={[-35, 25, -35]}
        intensity={0.6}
        color="#61A5FF"
      />

      {/* Neon Purple Rim Light from Opposite Horizon */}
      <directionalLight
        position={[0, 15, -50]}
        intensity={0.8}
        color="#A855F7"
      />

      {/* Floating Glowing Fireflies / Magic Embers */}
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, particlesCount]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial color="#61A5FF" transparent opacity={0.75} />
      </instancedMesh>
    </group>
  );
}

