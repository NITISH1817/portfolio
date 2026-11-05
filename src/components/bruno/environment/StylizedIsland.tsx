import React from 'react';
import * as THREE from 'three';

export default function StylizedIsland() {
  const terrainOrange = '#FF9A45';
  const terrainPeach = '#FFB66D';
  const trackAsphalt = '#21252F';
  const neonCyan = '#61A5FF';
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
          color="#A855F7"
          emissive="#A855F7"
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

      {/* 5. Center Roundabout Neon Glow Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[11.6, 12.2, 32]} />
        <meshStandardMaterial
          color={neonCyan}
          emissive={neonCyan}
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* 6. Stylized Lakes & Water Bodies */}
      {/* North-West Lake */}
      <group position={[-20, 0, -18]}>
        {/* Lake Water Surface */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
          <circleGeometry args={[9, 32]} />
          <meshStandardMaterial
            color="#38BDF8"
            roughness={0.15}
            metalness={0.3}
            transparent
            opacity={0.9}
          />
        </mesh>
        {/* Neon Shore Glow Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.027, 0]}>
          <ringGeometry args={[8.8, 9.3, 32]} />
          <meshStandardMaterial color="#61A5FF" emissive="#61A5FF" emissiveIntensity={2.0} />
        </mesh>
      </group>

      {/* South-East Lake */}
      <group position={[18, 0, 16]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
          <circleGeometry args={[8.5, 32]} />
          <meshStandardMaterial
            color="#38BDF8"
            roughness={0.15}
            metalness={0.3}
            transparent
            opacity={0.9}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.027, 0]}>
          <ringGeometry args={[8.3, 8.8, 32]} />
          <meshStandardMaterial color="#61A5FF" emissive="#61A5FF" emissiveIntensity={2.0} />
        </mesh>
      </group>

      {/* 7. Small Wooden Bridges Across Streams */}
      <group position={[0, 0.22, 28]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[11, 0.25, 4.5]} />
          <meshStandardMaterial color={woodBrown} roughness={0.7} />
        </mesh>
        {/* Bridge Side Railings */}
        <mesh position={[-5.3, 0.45, 0]} castShadow>
          <boxGeometry args={[0.2, 0.7, 4.5]} />
          <meshStandardMaterial color="#5C3826" />
        </mesh>
        <mesh position={[5.3, 0.45, 0]} castShadow>
          <boxGeometry args={[0.2, 0.7, 4.5]} />
          <meshStandardMaterial color="#5C3826" />
        </mesh>
      </group>

      {/* 8. Wooden Benches Scattered on the Island */}
      {[
        { pos: [-6, 0.35, 12], rotY: 0 },
        { pos: [6, 0.35, 12], rotY: 0 },
        { pos: [-12, 0.35, -8], rotY: 1.57 },
        { pos: [12, 0.35, -8], rotY: -1.57 }
      ].map((bench, idx) => (
        <group key={idx} position={bench.pos as [number, number, number]} rotation={[0, bench.rotY, 0]}>
          {/* Seat Planks */}
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[1.8, 0.08, 0.6]} />
            <meshStandardMaterial color={woodBrown} roughness={0.7} />
          </mesh>
          {/* Backrest */}
          <mesh position={[0, 0.35, -0.28]} castShadow>
            <boxGeometry args={[1.8, 0.4, 0.08]} />
            <meshStandardMaterial color={woodBrown} roughness={0.7} />
          </mesh>
          {/* Legs */}
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

      {/* 9. Decorative Rocks */}
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

