import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';

export default function BrunoPlaygroundWorld() {
  const waterRef = useRef<THREE.Mesh>(null);

  // Subtle water surface motion
  useFrame((state) => {
    if (waterRef.current) {
      const t = state.clock.getElapsedTime();
      waterRef.current.position.y = -0.35 + Math.sin(t * 1.5) * 0.04;
    }
  });

  // Racing kerb segments along curved road turns
  const kerbPositions = [
    // Turn 1: South-West Curve
    ...Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 0.5;
      return {
        pos: [-30 - Math.sin(angle) * 12, 0.05, 15 + Math.cos(angle) * 12] as [number, number, number],
        color: i % 2 === 0 ? '#EF4444' : '#FFFFFF'
      };
    }),
    // Turn 2: North-East Curve
    ...Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 0.5;
      return {
        pos: [30 + Math.sin(angle) * 12, 0.05, -20 - Math.cos(angle) * 12] as [number, number, number],
        color: i % 2 === 0 ? '#EF4444' : '#FFFFFF'
      };
    })
  ];

  return (
    <group>
      {/* =========================================================================
          1. MAIN TOPOGRAPHIC TERRAIN WITH ELEVATED HILLS & FIXED RAPIER GROUND
      ========================================================================= */}
      {/* Ground Physical Collider (Flat terrain at y=0) */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[85, 0.5, 85]} position={[0, -0.5, 0]} friction={0.7} restitution={0.05} />
      </RigidBody>

      {/* Main Stylized Clay/Slate Terrain Surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[78, 64]} />
        <meshStandardMaterial color="#1E2235" roughness={0.75} metalness={0.1} />
      </mesh>

      {/* Outer Perimeter Glowing Cyber Trim */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[77.5, 78.5, 64]} />
        <meshStandardMaterial color="#FF9A45" emissive="#FF9A45" emissiveIntensity={2.0} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry args={[76.5, 77.3, 64]} />
        <meshStandardMaterial color="#A855F7" emissive="#A855F7" emissiveIntensity={1.5} />
      </mesh>

      {/* ELEVATED NORTHWEST HILL (ACHIEVEMENT ARENA PLATEAU: +2.8m) */}
      <group position={[28, 0, -32]}>
        {/* Physical RigidBody for Hill */}
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[15, 1.4, 15]} position={[0, 1.4, 0]} friction={0.6} />
          {/* Sloped Access Ramp */}
          <CuboidCollider args={[4, 0.4, 8]} position={[-14, 1.4, 0]} rotation={[0, 0, -0.19]} friction={0.8} />
        </RigidBody>

        {/* Hill Visual Geometry */}
        <mesh position={[0, 1.4, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[14, 16, 2.8, 32]} />
          <meshStandardMaterial color="#252A42" roughness={0.7} />
        </mesh>
        {/* Hill Top Cap Trim */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 2.82, 0]}>
          <ringGeometry args={[13.5, 14.1, 32]} />
          <meshStandardMaterial color="#A855F7" emissive="#A855F7" emissiveIntensity={2.0} />
        </mesh>
        {/* Visual Driveable Ramp connecting Ground to Hill */}
        <mesh position={[-14, 1.4, 0]} rotation={[0, 0, -0.19]} receiveShadow>
          <boxGeometry args={[8, 0.3, 6]} />
          <meshStandardMaterial color="#2B314D" roughness={0.6} />
        </mesh>
      </group>

      {/* ELEVATED NORTHEAST HILL (SKILL LAB PLATEAU: +2.0m) */}
      <group position={[36, 0, 14]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[12, 1.0, 12]} position={[0, 1.0, 0]} friction={0.6} />
          <CuboidCollider args={[4, 0.4, 7]} position={[-12, 1.0, 0]} rotation={[0, 0, -0.16]} friction={0.8} />
        </RigidBody>

        <mesh position={[0, 1.0, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[11, 13, 2.0, 32]} />
          <meshStandardMaterial color="#23283E" roughness={0.7} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 2.02, 0]}>
          <ringGeometry args={[10.5, 11.1, 32]} />
          <meshStandardMaterial color="#61A5FF" emissive="#61A5FF" emissiveIntensity={2.0} />
        </mesh>
        <mesh position={[-12, 1.0, 0]} rotation={[0, 0, -0.16]} receiveShadow>
          <boxGeometry args={[7, 0.3, 6]} />
          <meshStandardMaterial color="#2B314D" roughness={0.6} />
        </mesh>
      </group>

      {/* =========================================================================
          2. THE CYBER CANAL & FLOWING WATER
      ========================================================================= */}
      {/* Sunken Canal Trench */}
      <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[110, 14]} />
        <meshStandardMaterial color="#0B0F19" roughness={0.9} />
      </mesh>

      {/* Translucent Animated Water Surface */}
      <mesh ref={waterRef} position={[0, -0.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[110, 14]} />
        <meshStandardMaterial
          color="#38BDF8"
          emissive="#0284C7"
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.4}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* =========================================================================
          3. MAIN STONE ARCH BRIDGE WITH APPROACH RAMPS ACROSS THE CANAL
      ========================================================================= */}
      <group position={[0, 0, 0]}>
        {/* Physical Bridge Colliders */}
        <RigidBody type="fixed" colliders={false}>
          {/* Main Elevated Bridge Deck */}
          <CuboidCollider args={[4.2, 0.3, 7.5]} position={[0, 0.9, 0]} friction={0.8} />
          {/* South Approach Ramp */}
          <CuboidCollider args={[4.2, 0.3, 5]} position={[0, 0.45, 10]} rotation={[0.09, 0, 0]} friction={0.85} />
          {/* North Approach Ramp */}
          <CuboidCollider args={[4.2, 0.3, 5]} position={[0, 0.45, -10]} rotation={[-0.09, 0, 0]} friction={0.85} />
          {/* Bridge Side Barriers */}
          <CuboidCollider args={[0.3, 0.6, 7.5]} position={[-4.0, 1.5, 0]} />
          <CuboidCollider args={[0.3, 0.6, 7.5]} position={[4.0, 1.5, 0]} />
        </RigidBody>

        {/* Visual Bridge Deck */}
        <mesh position={[0, 0.9, 0]} receiveShadow castShadow>
          <boxGeometry args={[8.4, 0.5, 15]} />
          <meshStandardMaterial color="#2D334D" roughness={0.6} />
        </mesh>
        {/* South Visual Incline */}
        <mesh position={[0, 0.45, 10]} rotation={[0.09, 0, 0]} receiveShadow>
          <boxGeometry args={[8.4, 0.45, 10]} />
          <meshStandardMaterial color="#262C42" roughness={0.6} />
        </mesh>
        {/* North Visual Incline */}
        <mesh position={[0, 0.45, -10]} rotation={[-0.09, 0, 0]} receiveShadow>
          <boxGeometry args={[8.4, 0.45, 10]} />
          <meshStandardMaterial color="#262C42" roughness={0.6} />
        </mesh>

        {/* Bridge Side Curbs & Neon Guide Strips */}
        {[-4.0, 4.0].map((x, idx) => (
          <React.Fragment key={idx}>
            <mesh position={[x, 1.35, 0]} castShadow>
              <boxGeometry args={[0.4, 0.5, 15]} />
              <meshStandardMaterial color="#1E2333" roughness={0.8} />
            </mesh>
            <mesh position={[x, 1.62, 0]}>
              <boxGeometry args={[0.1, 0.08, 15]} />
              <meshStandardMaterial color="#FF9A45" emissive="#FF9A45" emissiveIntensity={2.5} />
            </mesh>
          </React.Fragment>
        ))}

        {/* Centerline Orange Dashes on Bridge */}
        {[-5, -2, 1, 4].map((z, idx) => (
          <mesh key={idx} position={[0, 1.16, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.3, 1.8]} />
            <meshStandardMaterial color="#FF9A45" emissive="#FF9A45" emissiveIntensity={2.0} />
          </mesh>
        ))}
      </group>

      {/* =========================================================================
          4. JUMP RAMPS (CANAL BOOST JUMP & HILL LAUNCH)
      ========================================================================= */}
      {/* Canal Jump Ramp (South-West to Projects) */}
      <group position={[-24, 0, 9]}>
        <RigidBody type="fixed" colliders={false}>
          {/* Angled ramp surface: 22 degrees incline */}
          <CuboidCollider args={[2.5, 0.25, 4.5]} position={[0, 1.0, 0]} rotation={[0.22, 0, 0]} friction={0.9} />
        </RigidBody>
        <mesh position={[0, 1.0, 0]} rotation={[0.22, 0, 0]} receiveShadow castShadow>
          <boxGeometry args={[5, 0.4, 9]} />
          <meshStandardMaterial color="#F59E0B" roughness={0.5} />
        </mesh>
        {/* High-visibility yellow/black hazard chevron decals */}
        {[-3, -1, 1, 3].map((z, i) => (
          <mesh key={i} position={[0, 1.25, z]} rotation={[0.22, 0, 0]}>
            <planeGeometry args={[4.2, 0.6]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#111827' : '#FBBF24'} />
          </mesh>
        ))}
      </group>

      {/* Hill Jump Ramp (North-East to Main Loop) */}
      <group position={[20, 2.0, -14]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[2.5, 0.25, 4.0]} position={[0, 0.8, 0]} rotation={[-0.24, 0, 0]} friction={0.9} />
        </RigidBody>
        <mesh position={[0, 0.8, 0]} rotation={[-0.24, 0, 0]} receiveShadow castShadow>
          <boxGeometry args={[5, 0.4, 8]} />
          <meshStandardMaterial color="#A855F7" roughness={0.5} />
        </mesh>
      </group>

      {/* =========================================================================
          5. SMASHABLE PHYSICS DOMINOES (BRUNO SIMON SIGNATURE PLAYABILITY)
      ========================================================================= */}
      <group position={[-16, 0, 24]}>
        {/* Row of 8 dynamic physics dominoes */}
        {Array.from({ length: 8 }, (_, i) => (
          <RigidBody
            key={i}
            type="dynamic"
            position={[0, 1.2, i * 1.8]}
            mass={45}
            linearDamping={0.4}
            angularDamping={0.6}
          >
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.8, 2.4, 0.35]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? '#FF9A45' : '#61A5FF'}
                metalness={0.2}
                roughness={0.4}
              />
            </mesh>
            {/* White domino dot markings */}
            <mesh position={[0, 0.5, 0.18]}>
              <circleGeometry args={[0.15, 12]} />
              <meshStandardMaterial color="#FFFFFF" />
            </mesh>
            <mesh position={[0, -0.5, 0.18]}>
              <circleGeometry args={[0.15, 12]} />
              <meshStandardMaterial color="#FFFFFF" />
            </mesh>
          </RigidBody>
        ))}
        {/* Nearby Signpost */}
        <group position={[2.4, 0, 4]}>
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 2.4, 8]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          <mesh position={[0, 2.3, 0]}>
            <boxGeometry args={[2.2, 0.8, 0.1]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
          <Text
            position={[0, 2.3, 0.06]}
            fontSize={0.24}
            color="#FF9A45"
            anchorX="center"
            anchorY="middle"
          >
            SMASH ME!
          </Text>
        </group>
      </group>

      {/* =========================================================================
          6. GIANT 3D EXTRUDED LETTERING ON CENTRAL LAWN
      ========================================================================= */}
      <group position={[-14, 0.1, -12]} rotation={[0, 0.3, 0]}>
        {/* "NITISH PRIYAN" Lettering */}
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[10, 0.6, 1.5]} position={[0, 0.6, 0]} />
        </RigidBody>
        <Text
          position={[0, 0.4, 0]}
          rotation={[-0.4, 0, 0]}
          fontSize={1.8}
          color="#FF9A45"
          outlineWidth={0.06}
          outlineColor="#7C2D12"
          anchorX="center"
          anchorY="middle"
        >
          NITISH PRIYAN
        </Text>
        <Text
          position={[0, 0.2, 1.8]}
          rotation={[-0.4, 0, 0]}
          fontSize={0.9}
          color="#61A5FF"
          outlineWidth={0.04}
          outlineColor="#1E3A8A"
          anchorX="center"
          anchorY="middle"
        >
          FULL STACK & AI/ML
        </Text>
      </group>

      {/* =========================================================================
          7. CURVED ASPHALT ROAD NETWORK & RACING KERBS
      ========================================================================= */}
      {/* Main East-West Highway */}
      <mesh position={[0, 0.01, 24]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[110, 7.5]} />
        <meshStandardMaterial color="#181B26" roughness={0.8} />
      </mesh>
      {/* North Loop Road */}
      <mesh position={[0, 0.01, -24]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[110, 7.5]} />
        <meshStandardMaterial color="#181B26" roughness={0.8} />
      </mesh>
      {/* South-North Connecting Boulevard */}
      <mesh position={[-38, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[7.5, 60]} />
        <meshStandardMaterial color="#181B26" roughness={0.8} />
      </mesh>
      <mesh position={[38, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[7.5, 60]} />
        <meshStandardMaterial color="#181B26" roughness={0.8} />
      </mesh>

      {/* Road Dashed Centerline Markers */}
      {[-45, -35, -25, -15, 15, 25, 35, 45].map((x, i) => (
        <React.Fragment key={i}>
          <mesh position={[x, 0.02, 24]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.2, 0.35]} />
            <meshStandardMaterial color="#FF9A45" emissive="#FF9A45" emissiveIntensity={1.8} />
          </mesh>
          <mesh position={[x, 0.02, -24]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.2, 0.35]} />
            <meshStandardMaterial color="#FF9A45" emissive="#FF9A45" emissiveIntensity={1.8} />
          </mesh>
        </React.Fragment>
      ))}

      {/* Red-and-White Checkered Racing Kerbs on Curves */}
      {kerbPositions.map((kerb, idx) => (
        <mesh key={idx} position={kerb.pos} receiveShadow>
          <boxGeometry args={[1.6, 0.12, 0.8]} />
          <meshStandardMaterial color={kerb.color} roughness={0.5} />
        </mesh>
      ))}

      {/* =========================================================================
          8. STYLIZED LOW-POLY TREES & WARM AMBER STREETLAMPS
      ========================================================================= */}
      {/* Peach & Pink Stylized Geometric Trees */}
      {[
        { pos: [-12, 0, 14], color: '#FFB66D', scale: 1.2 },
        { pos: [-20, 0, 16], color: '#FF70A6', scale: 1.4 },
        { pos: [14, 0, 18], color: '#FFB66D', scale: 1.1 },
        { pos: [22, 0, 14], color: '#FF70A6', scale: 1.3 },
        { pos: [-28, 0, -14], color: '#FFB66D', scale: 1.5 },
        { pos: [-18, 0, -32], color: '#FF70A6', scale: 1.3 },
        { pos: [12, 0, -34], color: '#FFB66D', scale: 1.4 },
        { pos: [20, 0, -18], color: '#FF70A6', scale: 1.2 }
      ].map((tree, i) => (
        <group key={i} position={tree.pos as [number, number, number]} scale={[tree.scale, tree.scale, tree.scale]}>
          {/* Wood Trunk */}
          <mesh position={[0, 1.2, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.35, 2.4, 6]} />
            <meshStandardMaterial color="#5C3A21" roughness={0.8} />
          </mesh>
          {/* Faceted Foliage Tiers */}
          <mesh position={[0, 2.8, 0]} castShadow>
            <coneGeometry args={[1.8, 2.2, 6]} />
            <meshStandardMaterial color={tree.color} roughness={0.6} />
          </mesh>
          <mesh position={[0, 4.0, 0]} castShadow>
            <coneGeometry args={[1.3, 1.8, 6]} />
            <meshStandardMaterial color={tree.color} roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Stylized Streetlamps along Main Roads */}
      {[
        [-18, 27], [18, 27], [-18, -27], [18, -27], [-35, 0], [35, 0]
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 2.2, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.12, 4.4, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.7} />
          </mesh>
          {/* Lamp Head & Amber Light */}
          <mesh position={[0, 4.5, 0]}>
            <sphereGeometry args={[0.28, 12, 12]} />
            <meshStandardMaterial color="#FEF08A" emissive="#F59E0B" emissiveIntensity={3.0} />
          </mesh>
          <pointLight position={[0, 4.5, 0]} intensity={18} distance={14} color="#F59E0B" decay={2} />
        </group>
      ))}
    </group>
  );
}
