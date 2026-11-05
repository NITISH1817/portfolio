import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../../store/gameStore';

export default function Atmosphere() {
  const timeOfDay = useGameStore((s) => s.timeOfDay);
  const weather = useGameStore((s) => s.weather);

  const particlesCount = 95;
  const emberMeshRef = useRef<THREE.InstancedMesh>(null);
  const rainMeshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Ambient floating glowing embers / bioluminescent fireflies
  const particlesData = useMemo(() => {
    return Array.from({ length: particlesCount }, () => ({
      x: (Math.random() - 0.5) * 120,
      y: 0.8 + Math.random() * 9.0,
      z: (Math.random() - 0.5) * 120,
      speedY: 0.2 + Math.random() * 0.4,
      freq: 1.0 + Math.random() * 2.0,
      scale: 0.12 + Math.random() * 0.24
    }));
  }, []);

  // Rain particle system data (320 falling streaks)
  const rainCount = 320;
  const rainData = useMemo(() => {
    return Array.from({ length: rainCount }, () => ({
      x: (Math.random() - 0.5) * 110,
      y: Math.random() * 35,
      z: (Math.random() - 0.5) * 110,
      speed: 38 + Math.random() * 25
    }));
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);

    // 1. Update floating bioluminescent particles
    if (emberMeshRef.current) {
      particlesData.forEach((p, i) => {
        p.y += Math.sin(t * p.freq) * 0.35 * dt;
        p.x += Math.cos(t * p.freq * 0.7) * 0.25 * dt;

        dummy.position.set(p.x, p.y, p.z);
        const pulse = 1.0 + Math.sin(t * 3.5 + i) * 0.4;
        const baseScale = timeOfDay === 'day' ? p.scale * 0.35 : p.scale;
        dummy.scale.setScalar(baseScale * pulse);
        dummy.updateMatrix();
        emberMeshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      emberMeshRef.current.instanceMatrix.needsUpdate = true;
    }

    // 2. Update dynamic rain streaks if weather is rain
    if (weather === 'rain' && rainMeshRef.current) {
      rainData.forEach((drop, i) => {
        drop.y -= drop.speed * dt;
        drop.x -= 3.5 * dt; // subtle wind drift
        if (drop.y < -0.2) {
          drop.y = 28 + Math.random() * 8;
          drop.x = (Math.random() - 0.5) * 110;
          drop.z = (Math.random() - 0.5) * 110;
        }
        dummy.position.set(drop.x, drop.y, drop.z);
        dummy.rotation.set(0.12, 0, -0.08); // wind tilt
        dummy.scale.set(0.04, 0.65, 0.04);
        dummy.updateMatrix();
        rainMeshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      rainMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  // Sophisticated PBR atmospheric lighting with weather overrides
  const config = useMemo(() => {
    let base = {
      bg: '#0A0612',
      fogNear: 48,
      fogFar: 155,
      ambientColor: '#C084FC',
      ambientInt: 0.55,
      sunPos: [35, 55, 30] as [number, number, number],
      sunColor: '#FFE4E6',
      sunInt: 1.6,
      fillColor: '#38BDF8',
      fillInt: 0.9,
      rimColor: '#9333EA',
      rimInt: 1.1,
      particleColor: '#38BDF8'
    };

    if (timeOfDay === 'day') {
      base = {
        bg: '#0F172A',
        fogNear: 55,
        fogFar: 180,
        ambientColor: '#CBD5E1',
        ambientInt: 0.75,
        sunPos: [45, 70, 35],
        sunColor: '#FFFBEB',
        sunInt: 2.4,
        fillColor: '#93C5FD',
        fillInt: 0.6,
        rimColor: '#A855F7',
        rimInt: 0.4,
        particleColor: '#FDE047'
      };
    } else if (timeOfDay === 'sunset') {
      base = {
        bg: '#1C0E18',
        fogNear: 45,
        fogFar: 160,
        ambientColor: '#F472B6',
        ambientInt: 0.65,
        sunPos: [60, 22, 25],
        sunColor: '#F59E0B',
        sunInt: 2.8,
        fillColor: '#C084FC',
        fillInt: 0.75,
        rimColor: '#FB923C',
        rimInt: 0.8,
        particleColor: '#F97316'
      };
    }

    // Weather adjustments
    if (weather === 'rain') {
      return {
        ...base,
        bg: timeOfDay === 'day' ? '#1E293B' : '#07050F',
        fogNear: 28,
        fogFar: 95,
        ambientInt: base.ambientInt * 0.75,
        sunInt: base.sunInt * 0.55,
        sunColor: '#94A3B8',
        fillColor: '#38BDF8',
        particleColor: '#60A5FA'
      };
    } else if (weather === 'mist') {
      return {
        ...base,
        bg: timeOfDay === 'day' ? '#334155' : '#140D26',
        fogNear: 15,
        fogFar: 70,
        ambientInt: base.ambientInt * 0.9,
        sunInt: base.sunInt * 0.4,
        particleColor: '#A855F7'
      };
    }

    return base;
  }, [timeOfDay, weather]);

  return (
    <group>
      {/* Background Color & Dynamic Exponential Fog */}
      <color attach="background" args={[config.bg]} />
      <fog attach="fog" args={[config.bg, config.fogNear, config.fogFar]} />

      {/* Ambient Lighting & Chromatic Hemisphere Sky/Ground Bounce */}
      <ambientLight intensity={config.ambientInt * 0.6} color={config.ambientColor} />
      <hemisphereLight
        args={[config.ambientColor, timeOfDay === 'sunset' ? '#F97316' : '#FF9A45', config.ambientInt * 0.7]}
      />

      {/* Key Directional Light (Sun / Horizon Moon) with Soft Contact Shadows */}
      <directionalLight
        position={config.sunPos}
        intensity={config.sunInt}
        color={config.sunColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={10}
        shadow-camera-far={140}
        shadow-camera-left={-75}
        shadow-camera-right={75}
        shadow-camera-top={75}
        shadow-camera-bottom={-75}
        shadow-bias={-0.0003}
        shadow-radius={2.8}
      />

      {/* Electric Blue Secondary Fill Light */}
      <directionalLight
        position={[-35, 25, -35]}
        intensity={config.fillInt}
        color={config.fillColor}
      />

      {/* Midnight Violet Horizon Rim Light */}
      <directionalLight
        position={[0, 18, -55]}
        intensity={config.rimInt}
        color={config.rimColor}
      />

      {/* Bioluminescent Volumetric Ambient Embers */}
      <instancedMesh
        ref={emberMeshRef}
        args={[undefined, undefined, particlesCount]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial
          color={config.particleColor}
          transparent
          opacity={timeOfDay === 'day' ? 0.2 : 0.85}
        />
      </instancedMesh>

      {/* Rain Streaks Instanced Particle Mesh (when weather = 'rain') */}
      {weather === 'rain' && (
        <instancedMesh
          ref={rainMeshRef}
          args={[undefined, undefined, rainCount]}
          frustumCulled={false}
        >
          <cylinderGeometry args={[0.03, 0.03, 1.4, 4]} />
          <meshBasicMaterial
            color="#67E8F9"
            transparent
            opacity={0.65}
          />
        </instancedMesh>
      )}
    </group>
  );
}
