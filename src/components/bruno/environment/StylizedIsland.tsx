import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function StylizedIsland() {
  const terrainOrange = '#FF9A45';
  const terrainPeach = '#FFB66D';
  const trackAsphalt = '#21252F';
  const neonCyan = '#61A5FF';
  const neonPurple = '#A855F7';
  const grassGreen = '#22C55E';
  const woodBrown = '#78350F';

  // Curb segment coordinates for the red-and-white racing borders
  const racingCurbSegments = [
    // North track curves
    ...Array.from({ length: 18 }, (_, i) => ({
      pos: [-24 + i * 2.8, 0.04, -34 + Math.sin(i * 0.4) * 3] as [number, number, number],
      rotY: 0.1 * i,
      color: i % 2 === 0 ? '#EF4444' : '#FFFFFF'
    })),
    // East track curves
    ...Array.from({ length: 16 }, (_, i) => ({
      pos: [36 + Math.cos(i * 0.4) * 3, 0.04, -20 + i * 2.8] as [number, number, number],
      rotY: 1.57 + 0.1 * i,
      color: i % 2 === 0 ? '#EF4444' : '#FFFFFF'
    })),
    // South track curves
    ...Array.from({ length: 18 }, (_, i) => ({
      pos: [24 - i * 2.8, 0.04, 32 + Math.sin(i * 0.4) * 3] as [number, number, number],
      rotY: 3.14 + 0.1 * i,
      color: i % 2 === 0 ? '#EF4444' : '#FFFFFF'
    })),
    // West track curves
    ...Array.from({ length: 16 }, (_, i) => ({
      pos: [-36 + Math.cos(i * 0.4) * 3, 0.04, 20 - i * 2.8] as [number, number, number],
      rotY: -1.57 + 0.1 * i,
      color: i % 2 === 0 ? '#EF4444' : '#FFFFFF'
    }))
  ];

  // Highway dashed centerline segments
  const northSouthDashes = [
    -50, -46, -42, -38, -34, -30, -26, -22, -18, -14,
    14, 18, 22, 26, 30, 34, 38, 42, 46, 50
  ];
  const eastWestDashes = [
    -50, -46, -42, -38, -34, -30, -26, -22, -18, -14,
    14, 18, 22, 26, 30, 34, 38, 42, 46, 50
  ];

  // Boulevard ring dashed markers
  const boulevardDashes = Array.from({ length: 36 }, (_, i) => {
    const angle = (i / 36) * Math.PI * 2;
    const r = 41.5;
    return {
      x: Math.cos(angle) * r,
      z: Math.sin(angle) * r,
      rotY: -angle
    };
  });

  return (
    <group position={[0, -0.01, 0]}>
      {/* 1. Main Stylized Island Landmass (Warm Orange & Peach) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[76, 64]} />
        <meshStandardMaterial color={terrainOrange} roughness={0.75} />
      </mesh>

      {/* Peach Center Inset Plate */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow>
        <circleGeometry args={[56, 48]} />
        <meshStandardMaterial color={terrainPeach} roughness={0.7} />
      </mesh>

      {/* Outer Neon Blue Glowing Perimeter Boundary */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <ringGeometry args={[75.5, 76.5, 64]} />
        <meshStandardMaterial
          color={neonCyan}
          emissive={neonCyan}
          emissiveIntensity={2.5}
        />
      </mesh>
      {/* Secondary Purple Border Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[74.5, 75.3, 64]} />
        <meshStandardMaterial
          color={neonPurple}
          emissive={neonPurple}
          emissiveIntensity={1.8}
        />
      </mesh>

      {/* 2. Green Grass Patches on Terrain */}
      {[
        { pos: [-24, 0.01, 18], r: 12 },
        { pos: [26, 0.01, -16], r: 14 },
        { pos: [-28, 0.01, -22], r: 11 },
        { pos: [22, 0.01, 24], r: 13 },
        { pos: [0, 0.01, 38], r: 10 }
      ].map((patch, idx) => (
        <mesh
          key={idx}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[patch.pos[0], patch.pos[1], patch.pos[2]]}
          receiveShadow
        >
          <circleGeometry args={[patch.r, 32]} />
          <meshStandardMaterial color={grassGreen} roughness={0.8} />
        </mesh>
      ))}

      {/* 3. Winding Racing Track Circuit */}
      {/* North-South Main Highway */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[11, 110]} />
        <meshStandardMaterial color={trackAsphalt} roughness={0.65} />
      </mesh>

      {/* East-West Highway */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[110, 11]} />
        <meshStandardMaterial color={trackAsphalt} roughness={0.65} />
      </mesh>

      {/* Outer Ring Boulevard Connecting All Zones */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.018, 0]} receiveShadow>
        <ringGeometry args={[36, 47, 48]} />
        <meshStandardMaterial color={trackAsphalt} roughness={0.65} />
      </mesh>

      {/* Center Plaza Roundabout */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.022, 0]} receiveShadow>
        <circleGeometry args={[12, 32]} />
        <meshStandardMaterial color={trackAsphalt} roughness={0.65} />
      </mesh>

      {/* Road Markings: Dashed Highway Centerlines */}
      {northSouthDashes.map((z, idx) => (
        <mesh key={`ns-${idx}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.026, z]}>
          <planeGeometry args={[0.32, 2.2]} />
          <meshStandardMaterial color="#FFB66D" emissive="#FFB66D" emissiveIntensity={0.8} />
        </mesh>
      ))}
      {eastWestDashes.map((x, idx) => (
        <mesh key={`ew-${idx}`} rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[x, 0.026, 0]}>
          <planeGeometry args={[0.32, 2.2]} />
          <meshStandardMaterial color="#FFB66D" emissive="#FFB66D" emissiveIntensity={0.8} />
        </mesh>
      ))}
      {/* Boulevard Ring Dashed Markings */}
      {boulevardDashes.map((b, idx) => (
        <mesh key={`b-${idx}`} rotation={[-Math.PI / 2, 0, b.rotY]} position={[b.x, 0.024, b.z]}>
          <planeGeometry args={[0.28, 1.8]} />
          <meshStandardMaterial color="#FFB66D" emissive="#FFB66D" emissiveIntensity={0.6} />
        </mesh>
      ))}

      {/* 4. Red & White Striped Racing Curbs / Borders */}
      {racingCurbSegments.map((curb, i) => (
        <mesh
          key={i}
          position={curb.pos}
          rotation={[0, curb.rotY, 0]}
          castShadow
        >
          <boxGeometry args={[1.8, 0.12, 0.6]} />
          <meshStandardMaterial color={curb.color} roughness={0.4} />
        </mesh>
      ))}

      {/* 5. Center Roundabout Neon Glow Ring & Compass Rose */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[11.6, 12.2, 32]} />
        <meshStandardMaterial
          color={neonCyan}
          emissive={neonCyan}
          emissiveIntensity={1.5}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.028, 0]}>
        <ringGeometry args={[5.2, 5.8, 32]} />
        <meshStandardMaterial
          color={neonPurple}
          emissive={neonPurple}
          emissiveIntensity={1.8}
        />
      </mesh>

      {/* 6. Dynamic Animated Water Bodies */}
      <AnimatedLake position={[-20, 0, -18]} radius={9} glowColor={neonCyan} />
      <AnimatedLake position={[18, 0, 16]} radius={8.5} glowColor={neonCyan} />

      {/* 7. Cyber Data Circuit Traces to 6 Landmarks */}
      <CyberDataTrace from={[0, 0.028, 0]} to={[-34, 0.028, 22]} color={neonPurple} />
      <CyberDataTrace from={[0, 0.028, 0]} to={[38, 0.028, -4]} color={neonCyan} />
      <CyberDataTrace from={[0, 0.028, 0]} to={[0, 0.028, -36]} color="#38BDF8" />
      <CyberDataTrace from={[0, 0.028, 0]} to={[34, 0.028, 34]} color="#F59E0B" />
      <CyberDataTrace from={[0, 0.028, 0]} to={[36, 0.028, -34]} color="#06B6D4" />
      <CyberDataTrace from={[0, 0.028, 0]} to={[-42, 0.028, -12]} color="#10B981" />

      {/* 8. Small Wooden Bridges Across Streams */}
      <group position={[0, 0.22, 28]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[11, 0.25, 4.5]} />
          <meshStandardMaterial color={woodBrown} roughness={0.7} />
        </mesh>
        <mesh position={[-5.3, 0.45, 0]} castShadow>
          <boxGeometry args={[0.2, 0.7, 4.5]} />
          <meshStandardMaterial color="#5C3826" />
        </mesh>
        <mesh position={[5.3, 0.45, 0]} castShadow>
          <boxGeometry args={[0.2, 0.7, 4.5]} />
          <meshStandardMaterial color="#5C3826" />
        </mesh>
      </group>

      {/* 9. Wooden Benches Scattered on the Island */}
      {[
        { pos: [-6, 0.35, 12], rotY: 0 },
        { pos: [6, 0.35, 12], rotY: 0 },
        { pos: [-12, 0.35, -8], rotY: 1.57 },
        { pos: [12, 0.35, -8], rotY: -1.57 }
      ].map((bench, idx) => (
        <group key={idx} position={bench.pos as [number, number, number]} rotation={[0, bench.rotY, 0]}>
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[1.8, 0.08, 0.6]} />
            <meshStandardMaterial color={woodBrown} roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.35, -0.28]} castShadow>
            <boxGeometry args={[1.8, 0.4, 0.08]} />
            <meshStandardMaterial color={woodBrown} roughness={0.7} />
          </mesh>
          <mesh position={[-0.7, -0.18, 0]} castShadow>
            <boxGeometry args={[0.1, 0.36, 0.5]} />
            <meshStandardMaterial color="#1E232A" />
          </mesh>
          <mesh position={[0.7, -0.18, 0]} castShadow>
            <boxGeometry args={[0.1, 0.36, 0.5]} />
            <meshStandardMaterial color="#1E232A" />
          </mesh>
        </group>
      ))}

      {/* 10. Decorative Rocks */}
      {[
        { pos: [-14, 0.4, 8], s: 0.9 },
        { pos: [-16, 0.3, 10], s: 0.6 },
        { pos: [14, 0.4, -12], s: 0.8 },
        { pos: [15, 0.3, -10], s: 0.5 },
        { pos: [-24, 0.5, -14], s: 1.1 },
        { pos: [22, 0.4, 18], s: 0.85 }
      ].map((rock, idx) => (
        <mesh
          key={idx}
          position={rock.pos as [number, number, number]}
          scale={rock.s}
          castShadow
        >
          <dodecahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial color="#475569" roughness={0.9} flatShading />
        </mesh>
      ))}
    </group>
  );
}

// Dynamic Animated Lake Surface with Gentle Water Ripples
function AnimatedLake({
  position,
  radius,
  glowColor
}: {
  position: [number, number, number];
  radius: number;
  glowColor: string;
}) {
  const rippleRef = useRef<THREE.Mesh>(null);
  const waterMatRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (rippleRef.current) {
      const s = 1.0 + Math.sin(t * 1.8) * 0.04;
      rippleRef.current.scale.set(s, s, 1);
    }
    if (waterMatRef.current) {
      waterMatRef.current.emissiveIntensity = 0.3 + Math.sin(t * 1.4) * 0.15;
    }
  });

  return (
    <group position={position}>
      {/* Lake Water Surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <circleGeometry args={[radius, 36]} />
        <meshStandardMaterial
          ref={waterMatRef}
          color="#0284C7"
          emissive="#0369A1"
          emissiveIntensity={0.3}
          roughness={0.12}
          metalness={0.4}
          transparent
          opacity={0.92}
        />
      </mesh>
      {/* Dynamic Ripple Shoreline Ring */}
      <mesh
        ref={rippleRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.027, 0]}
      >
        <ringGeometry args={[radius - 0.3, radius + 0.3, 36]} />
        <meshStandardMaterial
          color={glowColor}
          emissive={glowColor}
          emissiveIntensity={2.2}
          transparent
          opacity={0.85}
        />
      </mesh>
    </group>
  );
}

// Cybernetic Data Trace Connecting Plaza to Landmarks
function CyberDataTrace({
  from,
  to,
  color
}: {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
}) {
  const lineRef = useRef<THREE.Mesh>(null);
  const dx = to[0] - from[0];
  const dz = to[2] - from[2];
  const length = Math.sqrt(dx * dx + dz * dz);
  const midX = (from[0] + to[0]) / 2;
  const midZ = (from[2] + to[2]) / 2;
  const angle = Math.atan2(dz, dx);

  useFrame((state) => {
    if (lineRef.current) {
      const t = state.clock.getElapsedTime();
      (lineRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        1.2 + Math.sin(t * 2.8 + midX) * 0.6;
    }
  });

  return (
    <group position={[midX, from[1], midZ]} rotation={[-Math.PI / 2, 0, angle]}>
      {/* Thin glowing data trace */}
      <mesh ref={lineRef}>
        <planeGeometry args={[length, 0.14]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.2}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
}

