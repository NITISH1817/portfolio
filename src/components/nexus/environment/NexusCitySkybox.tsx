import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function NexusCitySkybox() {
  const hazeRef = useRef<THREE.Group>(null);
  const distantBuildingsRef = useRef<THREE.InstancedMesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (hazeRef.current) {
      hazeRef.current.rotation.y = t * 0.02;
    }
  });

  // Generate distant cyber skyscraper silhouettes
  const buildingCount = 48;
  const buildingData = React.useMemo(() => {
    const data = [];
    for (let i = 0; i < buildingCount; i++) {
      const angle = (i / buildingCount) * Math.PI * 2;
      const dist = 95 + (i % 5) * 6;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;
      const height = 24 + ((i * 7) % 36);
      const width = 8 + ((i * 3) % 8);
      data.push({ x, z, height, width, angle });
    }
    return data;
  }, []);

  return (
    <group>
      {/* Deep Cyber Atmospheric Fog */}
      <color attach="background" args={['#080A12']} />
      <fog attach="fog" args={['#080A12', 45, 140]} />

      {/* Atmospheric Lighting */}
      <ambientLight intensity={0.45} color="#1E293B" />
      <directionalLight
        position={[40, 60, 30]}
        intensity={1.2}
        color="#F8FAFC"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={10}
        shadow-camera-far={180}
        shadow-camera-left={-75}
        shadow-camera-right={75}
        shadow-camera-top={75}
        shadow-camera-bottom={-75}
        shadow-bias={-0.0005}
      />

      {/* Purple & Orange Cyber Rim Lighting */}
      <directionalLight position={[-50, 25, -50]} intensity={0.8} color="#A855F7" />
      <directionalLight position={[50, 15, -40]} intensity={0.65} color="#FF8A3D" />

      {/* Distant Cyber Skyscraper Silhouettes */}
      <group position={[0, 0, 0]}>
        {buildingData.map((b, idx) => (
          <group key={idx} position={[b.x, b.height / 2 - 2, b.z]}>
            {/* Dark Obsidian Building Body */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[b.width, b.height, b.width]} />
              <meshStandardMaterial color="#0A0E1A" roughness={0.3} metalness={0.7} />
            </mesh>

            {/* Glowing Roof Antenna / Beacon */}
            <mesh position={[0, b.height / 2 + 1.5, 0]}>
              <cylinderGeometry args={[0.08, 0.12, 3, 6]} />
              <meshStandardMaterial
                color={idx % 2 === 0 ? '#38BDF8' : '#FF8A3D'}
                emissive={idx % 2 === 0 ? '#38BDF8' : '#FF8A3D'}
                emissiveIntensity={2.5}
              />
            </mesh>

            {/* Neon Vertical Window Strip */}
            <mesh position={[0, 0, b.width / 2 + 0.05]}>
              <planeGeometry args={[0.3, b.height * 0.8]} />
              <meshStandardMaterial
                color={idx % 3 === 0 ? '#A855F7' : '#38BDF8'}
                emissive={idx % 3 === 0 ? '#A855F7' : '#38BDF8'}
                emissiveIntensity={1.8}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Drifting Cyber Haze & Data Grid Ceiling */}
      <group ref={hazeRef} position={[0, 22, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[50, 110, 32]} />
          <meshBasicMaterial
            color="#A855F7"
            wireframe
            transparent
            opacity={0.04}
          />
        </mesh>
      </group>
    </group>
  );
}

