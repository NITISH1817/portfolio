import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../../store/gameStore';

export default function Ocean() {
  const timeOfDay = useGameStore((s) => s.timeOfDay);
  const weather = useGameStore((s) => s.weather);
  const meshRef = useRef();
  const materialRef = useRef();

  const uniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uWaterColor: { value: new THREE.Color('#06B6D4') },
      uDeepColor: { value: new THREE.Color('#0B132B') },
      uFoamColor: { value: new THREE.Color('#A5F3FC') }
    };
  }, []);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
      
      // Update water color depending on time of day
      const isNight = timeOfDay === 'night';
      const isSunset = timeOfDay === 'sunset';

      const targetWater = isNight
        ? new THREE.Color('#082F49')
        : isSunset
        ? new THREE.Color('#C026D3')
        : new THREE.Color('#06B6D4');
      const targetDeep = isNight
        ? new THREE.Color('#050C1A')
        : isSunset
        ? new THREE.Color('#4A044E')
        : new THREE.Color('#083344');

      materialRef.current.uniforms.uWaterColor.value.lerp(targetWater, 0.05);
      materialRef.current.uniforms.uDeepColor.value.lerp(targetDeep, 0.05);
    }
  });

  const vertexShader = `
    uniform float uTime;
    varying vec2 vUv;
    varying float vElevation;

    void main() {
      vUv = uv;
      vec3 pos = position;

      // Dual-octave wave displacement
      float wave1 = sin(pos.x * 0.06 + uTime * 1.6) * cos(pos.y * 0.06 + uTime * 1.3) * 0.38;
      float wave2 = sin(pos.x * 0.15 - uTime * 2.2 + pos.y * 0.1) * 0.14;
      pos.z += wave1 + wave2;

      vElevation = pos.z;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    uniform vec3 uWaterColor;
    uniform vec3 uDeepColor;
    uniform vec3 uFoamColor;
    uniform float uTime;
    varying vec2 vUv;
    varying float vElevation;

    void main() {
      float mixStrength = (vElevation + 0.35) * 1.25;
      vec3 color = mix(uDeepColor, uWaterColor, clamp(mixStrength, 0.0, 1.0));

      // Animated high-frequency glints & caustics
      float glint = pow(abs(sin(vUv.x * 75.0 + uTime * 2.8) * cos(vUv.y * 75.0 + uTime * 2.2)), 8.0) * 0.45;
      color += glint * uFoamColor;

      gl_FragColor = vec4(color, 0.92);
    }
  `;

  return (
    <group>
      {/* Outer Deep Ocean with Custom GLSL Wave Shader */}
      <mesh
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.45, 0]}
        receiveShadow
      >
        <planeGeometry args={[360, 360, 64, 64]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
        />
      </mesh>

      {/* Shore Foam Ring around the Island */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.36, 0]}>
        <ringGeometry args={[74, 82, 48]} />
        <meshStandardMaterial
          color={timeOfDay === 'night' ? '#38BDF8' : '#BAE6FD'}
          transparent
          opacity={0.38}
          roughness={0.5}
        />
      </mesh>

      {/* Island Sandy Shoreline Base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]} receiveShadow>
        <circleGeometry args={[78, 48]} />
        <meshStandardMaterial
          color={timeOfDay === 'night' ? '#1E293B' : timeOfDay === 'sunset' ? '#831843' : '#FDE68A'}
          roughness={0.85}
        />
      </mesh>
    </group>
  );
}
