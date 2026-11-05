import React from 'react';

export default function SpawnZone({ isNight = false }) {
  return (
    <group position={[0, 0, 0]}>
      {/* 1. Dedicated Spawn Plaza Circular Ground (Matching Start Screen Ref) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <circleGeometry args={[9.5, 48]} />
        <meshStandardMaterial color="#FF9A45" roughness={0.7} />
      </mesh>

      {/* Inner Peach Ring Accent */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <ringGeometry args={[7.8, 8.2, 48]} />
        <meshStandardMaterial color="#FFB66D" roughness={0.6} />
      </mesh>

      {/* Glowing Neon Blue Island / Plaza Border (Electric Blue) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[9.4, 9.8, 48]} />
        <meshStandardMaterial
          color="#61A5FF"
          emissive="#61A5FF"
          emissiveIntensity={2.5}
        />
      </mesh>

      {/* Secondary Neon Purple Border */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.028, 0]}>
        <ringGeometry args={[8.8, 9.1, 48]} />
        <meshStandardMaterial
          color="#A855F7"
          emissive="#A855F7"
          emissiveIntensity={1.8}
        />
      </mesh>

      {/* 2. Vintage Streetlight illuminating the vehicle with warm ambient glow */}
      <group position={[-3.6, 0, 2.6]}>
        {/* Base */}
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.35, 0.5, 8]} />
          <meshStandardMaterial color="#1E232A" metalness={0.7} roughness={0.4} />
        </mesh>
        {/* Pole */}
        <mesh position={[0, 2.2, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.12, 3.8, 8]} />
          <meshStandardMaterial color="#1E232A" metalness={0.7} roughness={0.4} />
        </mesh>
        {/* Lantern Head */}
        <mesh position={[0, 4.2, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.2, 0.5, 6]} />
          <meshStandardMaterial color="#1E232A" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Glowing Amber Bulb */}
        <mesh position={[0, 4.05, 0]}>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshStandardMaterial
            color="#FEF08A"
            emissive="#F59E0B"
            emissiveIntensity={3.5}
          />
        </mesh>
        {/* Real warm point light casting on the vehicle */}
        <pointLight
          position={[0, 3.9, 0]}
          color="#FEF08A"
          intensity={3.5}
          distance={14}
          decay={2}
          castShadow
        />
      </group>

      {/* 3. Low-Poly Wooden Park Bench */}
      <group position={[3.6, 0, -1.8]} rotation={[0, -0.4, 0]}>
        {/* Seat Planks */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[1.8, 0.08, 0.6]} />
          <meshStandardMaterial color="#78350F" roughness={0.7} />
        </mesh>
        {/* Backrest */}
        <mesh position={[0, 0.82, -0.28]} castShadow>
          <boxGeometry args={[1.8, 0.42, 0.08]} />
          <meshStandardMaterial color="#78350F" roughness={0.7} />
        </mesh>
        {/* Metal Legs */}
        <mesh position={[-0.7, 0.22, 0]} castShadow>
          <boxGeometry args={[0.08, 0.44, 0.52]} />
          <meshStandardMaterial color="#1E232A" />
        </mesh>
        <mesh position={[0.7, 0.22, 0]} castShadow>
          <boxGeometry args={[0.08, 0.44, 0.52]} />
          <meshStandardMaterial color="#1E232A" />
        </mesh>
      </group>

      {/* 4. Beautiful Pink Cherry Blossom Trees framing the spawn plaza */}
      <SpawnCherryTree position={[-5.2, 0, -3.2]} scale={1.1} />
      <SpawnCherryTree position={[5.2, 0, 3.2]} scale={0.95} />
    </group>
  );
}

// Low-poly stylized Cherry Blossom Tree
function SpawnCherryTree({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {/* Curved Dark Wood Trunk */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.45, 2.8, 7]} />
        <meshStandardMaterial color="#451A03" roughness={0.85} />
      </mesh>
      <mesh position={[0.2, 2.6, 0]} rotation={[0, 0, -0.2]} castShadow>
        <cylinderGeometry args={[0.18, 0.25, 1.4, 6]} />
        <meshStandardMaterial color="#451A03" roughness={0.85} />
      </mesh>
      {/* Pink Sakura Foliage Canopy */}
      <mesh position={[0, 3.2, 0]} castShadow>
        <dodecahedronGeometry args={[1.8, 1]} />
        <meshStandardMaterial color="#FF70A6" roughness={0.5} />
      </mesh>
      <mesh position={[0.6, 3.8, 0.4]} castShadow>
        <dodecahedronGeometry args={[1.3, 1]} />
        <meshStandardMaterial color="#FF85B3" roughness={0.5} />
      </mesh>
      <mesh position={[-0.5, 3.6, -0.4]} castShadow>
        <dodecahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial color="#FF5C99" roughness={0.5} />
      </mesh>
    </group>
  );
}
