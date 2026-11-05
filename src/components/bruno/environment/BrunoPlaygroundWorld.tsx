import React, { useMemo } from 'react';
import { Text } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';

// Low-poly Tree Component (Tiered Cones with Faceted Shading)
function StylizedTree({
  position,
  scale = 1,
  foliageColor = '#22C55E',
  trunkColor = '#78543E',
  type = 'cone'
}: {
  position: [number, number, number];
  scale?: number;
  foliageColor?: string;
  trunkColor?: string;
  type?: 'cone' | 'round' | 'layered';
}) {
  return (
    <group position={position} scale={scale}>
      {/* Slender Low-Poly Trunk */}
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.32, 2.2, 6]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} flatShading />
      </mesh>

      {/* Foliage Canopy */}
      {type === 'cone' && (
        <group position={[0, 2.2, 0]}>
          <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
            <coneGeometry args={[1.5, 1.8, 6]} />
            <meshStandardMaterial color={foliageColor} roughness={0.8} flatShading />
          </mesh>
          <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
            <coneGeometry args={[1.2, 1.5, 6]} />
            <meshStandardMaterial color={foliageColor} roughness={0.8} flatShading />
          </mesh>
          <mesh position={[0, 2.2, 0]} castShadow receiveShadow>
            <coneGeometry args={[0.85, 1.2, 6]} />
            <meshStandardMaterial color={foliageColor} roughness={0.8} flatShading />
          </mesh>
        </group>
      )}

      {type === 'round' && (
        <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
          <dodecahedronGeometry args={[1.4, 0]} />
          <meshStandardMaterial color={foliageColor} roughness={0.8} flatShading />
        </mesh>
      )}

      {type === 'layered' && (
        <group position={[0, 2.0, 0]}>
          <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
            <coneGeometry args={[1.7, 1.4, 7]} />
            <meshStandardMaterial color={foliageColor} roughness={0.8} flatShading />
          </mesh>
          <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
            <coneGeometry args={[1.3, 1.3, 7]} />
            <meshStandardMaterial color={foliageColor} roughness={0.8} flatShading />
          </mesh>
          <mesh position={[0, 1.9, 0]} castShadow receiveShadow>
            <coneGeometry args={[0.9, 1.1, 7]} />
            <meshStandardMaterial color={foliageColor} roughness={0.8} flatShading />
          </mesh>
        </group>
      )}
    </group>
  );
}

// Low-poly Faceted Rock Component
function StylizedRock({
  position,
  scale = [1, 1, 1],
  rotation = [0, 0, 0],
  color = '#E2E8F0'
}: {
  position: [number, number, number];
  scale?: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[0.7, 0.6, 0.7]} position={[0, 0.6, 0]} />
      </RigidBody>
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial color={color} roughness={0.85} flatShading />
      </mesh>
    </group>
  );
}

// Low-poly Wooden Post-and-Rail Fence Segment
function WoodenFence({
  position,
  rotation = [0, 0, 0],
  length = 4.0
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  length?: number;
}) {
  return (
    <group position={position} rotation={rotation}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[length / 2, 0.45, 0.15]} position={[0, 0.45, 0]} />
      </RigidBody>
      {/* Posts */}
      {[-length / 2, length / 2].map((x, i) => (
        <mesh key={i} position={[x, 0.45, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.9, 6]} />
          <meshStandardMaterial color="#B45309" roughness={0.9} flatShading />
        </mesh>
      ))}
      {/* Horizontal Rails */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[length, 0.08, 0.06]} />
        <meshStandardMaterial color="#D97706" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
        <boxGeometry args={[length, 0.08, 0.06]} />
        <meshStandardMaterial color="#D97706" roughness={0.9} flatShading />
      </mesh>
    </group>
  );
}

// Low-poly White Stone Wall Segment
function StoneWall({
  position,
  rotation = [0, 0, 0],
  length = 3.6
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  length?: number;
}) {
  return (
    <group position={position} rotation={rotation}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[length / 2, 0.35, 0.25]} position={[0, 0.35, 0]} />
      </RigidBody>
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[length, 0.7, 0.5]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.9} flatShading />
      </mesh>
      {/* Wall Cap */}
      <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
        <boxGeometry args={[length + 0.15, 0.08, 0.58]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.8} flatShading />
      </mesh>
    </group>
  );
}

// Dynamic Physics Domino
function PhysicsDomino({
  position,
  rotation = [0, 0, 0],
  color = '#FEF3C7',
  spotColor = '#EA580C'
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  spotColor?: string;
}) {
  return (
    <RigidBody
      type="dynamic"
      colliders="cuboid"
      position={position}
      rotation={rotation}
      mass={12}
      friction={0.6}
      restitution={0.15}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.7, 1.8, 0.22]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Center Dividing Groove */}
      <mesh position={[0, 0, 0.115]}>
        <boxGeometry args={[0.55, 0.03, 0.02]} />
        <meshStandardMaterial color={spotColor} />
      </mesh>
      {/* Decorative Domino Spots */}
      {[-0.45, 0.45].map((y, i) => (
        <mesh key={i} position={[0, y, 0.115]}>
          <circleGeometry args={[0.07, 12]} />
          <meshBasicMaterial color={spotColor} />
        </mesh>
      ))}
    </RigidBody>
  );
}

// Toy Stunt Launch Ramp
function StuntRamp({
  position,
  rotation = [0, 0, 0],
  width = 3.6,
  length = 4.8,
  height = 1.3
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  length?: number;
  height?: number;
}) {
  const slopeAngle = Math.atan2(height, length);
  return (
    <group position={position} rotation={rotation}>
      <RigidBody type="fixed" colliders={false}>
        {/* Sloped Surface Collider */}
        <CuboidCollider
          args={[width / 2, 0.15, Math.hypot(length, height) / 2]}
          position={[0, height / 2, length / 2]}
          rotation={[-slopeAngle, 0, 0]}
          friction={0.85}
        />
      </RigidBody>

      {/* Ramp Wedge Visual Mesh */}
      <mesh
        position={[0, height / 2, length / 2]}
        rotation={[-slopeAngle, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[width, 0.2, Math.hypot(length, height)]} />
        <meshStandardMaterial color="#EA580C" roughness={0.7} />
      </mesh>

      {/* Ramp Side Walls */}
      {[-width / 2, width / 2].map((x, i) => (
        <mesh key={i} position={[x, height / 4, length / 2]} castShadow receiveShadow>
          <boxGeometry args={[0.15, height / 2, length]} />
          <meshStandardMaterial color="#C2410C" roughness={0.8} />
        </mesh>
      ))}

      {/* Hazard Warning Chevron Stripes on Ramp Face */}
      {[-1.2, 0, 1.2].map((x, i) => (
        <mesh
          key={i}
          position={[x, height / 2 + 0.12, length / 2]}
          rotation={[-slopeAngle, 0, 0]}
        >
          <planeGeometry args={[0.5, Math.hypot(length, height) * 0.8]} />
          <meshBasicMaterial color="#FEF08A" />
        </mesh>
      ))}
    </group>
  );
}

// Toy Bowling Pin Component
function BowlingPin({ position }: { position: [number, number, number] }) {
  return (
    <RigidBody
      type="dynamic"
      colliders="cuboid"
      position={position}
      mass={3}
      friction={0.5}
      restitution={0.2}
    >
      <group>
        {/* Base */}
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.18, 0.22, 0.7, 12]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
        </mesh>
        {/* Red Collar Stripe */}
        <mesh position={[0, 0.72, 0]}>
          <cylinderGeometry args={[0.13, 0.15, 0.12, 12]} />
          <meshStandardMaterial color="#EF4444" roughness={0.5} />
        </mesh>
        {/* Head */}
        <mesh position={[0, 0.9, 0]} castShadow>
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
        </mesh>
      </group>
    </RigidBody>
  );
}

export default function BrunoPlaygroundWorld() {
  // Array of 8 Dynamic Dominoes along the East Stunt Lane
  const dominoes = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const z = -4 - i * 1.6;
      return {
        pos: [18, 0.9, z] as [number, number, number],
        rot: [0, 0, 0] as [number, number, number]
      };
    });
  }, []);

  // Carefully arranged tree positions framing the world and zones
  const trees = useMemo(() => {
    return [
      // Spawn Plaza Perimeter
      { pos: [-16, 0, 16] as [number, number, number], scale: 1.15, color: '#22C55E', type: 'cone' as const },
      { pos: [-20, 0, 22] as [number, number, number], scale: 1.0, color: '#4ADE80', type: 'layered' as const },
      { pos: [16, 0, 18] as [number, number, number], scale: 1.2, color: '#16A34A', type: 'round' as const },
      { pos: [22, 0, 24] as [number, number, number], scale: 1.05, color: '#84CC16', type: 'cone' as const },

      // West Grove (Near Skills Zone)
      { pos: [-38, 0, -2] as [number, number, number], scale: 1.3, color: '#22C55E', type: 'cone' as const },
      { pos: [-42, 0, 6] as [number, number, number], scale: 1.1, color: '#4ADE80', type: 'round' as const },
      { pos: [-40, 0, 14] as [number, number, number], scale: 1.25, color: '#16A34A', type: 'layered' as const },
      { pos: [-36, 0, 22] as [number, number, number], scale: 0.95, color: '#A3E635', type: 'cone' as const },

      // Northwest Grove (Near Projects Exhibition)
      { pos: [-36, 0, -22] as [number, number, number], scale: 1.2, color: '#22C55E', type: 'cone' as const },
      { pos: [-44, 0, -32] as [number, number, number], scale: 1.35, color: '#16A34A', type: 'layered' as const },
      { pos: [-40, 0, -42] as [number, number, number], scale: 1.1, color: '#84CC16', type: 'round' as const },
      { pos: [-22, 0, -44] as [number, number, number], scale: 1.15, color: '#4ADE80', type: 'cone' as const },

      // North Border
      { pos: [-10, 0, -48] as [number, number, number], scale: 1.3, color: '#22C55E', type: 'round' as const },
      { pos: [4, 0, -50] as [number, number, number], scale: 1.25, color: '#16A34A', type: 'layered' as const },
      { pos: [14, 0, -46] as [number, number, number], scale: 1.1, color: '#A3E635', type: 'cone' as const },

      // Northeast Plateau Base (Near Achievement Arena)
      { pos: [38, 0, -18] as [number, number, number], scale: 1.2, color: '#22C55E', type: 'cone' as const },
      { pos: [44, 0, -26] as [number, number, number], scale: 1.3, color: '#16A34A', type: 'round' as const },
      { pos: [42, 0, -38] as [number, number, number], scale: 1.15, color: '#84CC16', type: 'layered' as const },

      // East Border (Near Education Center)
      { pos: [44, 0, 2] as [number, number, number], scale: 1.25, color: '#22C55E', type: 'cone' as const },
      { pos: [46, 0, 16] as [number, number, number], scale: 1.1, color: '#4ADE80', type: 'round' as const },
      { pos: [42, 0, 26] as [number, number, number], scale: 1.3, color: '#16A34A', type: 'layered' as const },

      // South Border (Near Contact Station)
      { pos: [-18, 0, 44] as [number, number, number], scale: 1.2, color: '#22C55E', type: 'cone' as const },
      { pos: [-6, 0, 48] as [number, number, number], scale: 1.3, color: '#84CC16', type: 'layered' as const },
      { pos: [10, 0, 46] as [number, number, number], scale: 1.15, color: '#4ADE80', type: 'round' as const },
      { pos: [24, 0, 42] as [number, number, number], scale: 1.25, color: '#16A34A', type: 'cone' as const }
    ];
  }, []);

  // Stylized White & Grey Rocks clustered naturally
  const rocks = useMemo(() => {
    return [
      { pos: [-14, 0, 12] as [number, number, number], scale: [1.2, 0.9, 1.1] as [number, number, number], rot: [0.1, 0.4, 0] as [number, number, number], color: '#F8FAFC' },
      { pos: [-15.5, 0, 13] as [number, number, number], scale: [0.8, 0.6, 0.8] as [number, number, number], rot: [0.2, 0.8, 0] as [number, number, number], color: '#E2E8F0' },
      { pos: [14, 0, 14] as [number, number, number], scale: [1.1, 0.8, 1.2] as [number, number, number], rot: [0.3, 0.2, 0] as [number, number, number], color: '#F8FAFC' },
      { pos: [15.2, 0, 15] as [number, number, number], scale: [0.7, 0.5, 0.7] as [number, number, number], rot: [0.1, 0.9, 0] as [number, number, number], color: '#CBD5E1' },
      { pos: [-24, 0, -12] as [number, number, number], scale: [1.4, 1.0, 1.3] as [number, number, number], rot: [0.2, 0.6, 0] as [number, number, number], color: '#F8FAFC' },
      { pos: [22, 0, -8] as [number, number, number], scale: [1.3, 0.9, 1.2] as [number, number, number], rot: [0.1, 0.5, 0] as [number, number, number], color: '#E2E8F0' },
      { pos: [25, 0, 20] as [number, number, number], scale: [1.2, 0.8, 1.1] as [number, number, number], rot: [0.4, 0.3, 0] as [number, number, number], color: '#F8FAFC' },
      { pos: [-8, 0, 32] as [number, number, number], scale: [1.3, 0.9, 1.2] as [number, number, number], rot: [0.2, 0.7, 0] as [number, number, number], color: '#E2E8F0' },
      { pos: [8, 0, 34] as [number, number, number], scale: [1.1, 0.7, 1.0] as [number, number, number], rot: [0.3, 0.1, 0] as [number, number, number], color: '#F8FAFC' }
    ];
  }, []);

  return (
    <group>
      {/* =========================================================================
          1. MAIN CONTINUOUS WARM ORANGE / SUNSET GROUND
      ========================================================================= */}
      {/* Physical Flat Ground Plane Collider (y = 0) */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[95, 0.5, 95]} position={[0, -0.5, 0]} friction={0.7} restitution={0.05} />
      </RigidBody>

      {/* Main Warm Terracotta Sunset Ground Surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[88, 64]} />
        <meshStandardMaterial color="#E67E38" roughness={0.88} />
      </mesh>

      {/* Inner Subtle Sunlit Center Blend */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow>
        <circleGeometry args={[48, 48]} />
        <meshStandardMaterial color="#F08942" roughness={0.9} />
      </mesh>

      {/* Horizon Soft Perimeter Border */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[87, 88.5, 64]} />
        <meshBasicMaterial color="#FFA05C" />
      </mesh>

      {/* =========================================================================
          2. CENTRAL SPAWN ROUNDABOUT & PAINTED GROUND TRACK MARKINGS
      ========================================================================= */}
      {/* Central Spawn Roundabout Outer Border */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]} receiveShadow>
        <ringGeometry args={[8.8, 9.2, 48]} />
        <meshStandardMaterial color="#FEF3C7" roughness={0.6} />
      </mesh>

      {/* Central Roundabout Inner Island Curb */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]} receiveShadow>
        <circleGeometry args={[4.2, 36]} />
        <meshStandardMaterial color="#D9722C" roughness={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry args={[4.1, 4.3, 36]} />
        <meshStandardMaterial color="#FEF3C7" roughness={0.6} />
      </mesh>

      {/* Dashed Center Lane Marking on Roundabout */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const x = Math.sin(angle) * 6.5;
        const z = Math.cos(angle) * 6.5;
        return (
          <mesh
            key={i}
            rotation={[-Math.PI / 2, 0, -angle]}
            position={[x, 0.015, z]}
          >
            <planeGeometry args={[0.3, 1.2]} />
            <meshBasicMaterial color="#FEF3C7" />
          </mesh>
        );
      })}

      {/* White "START" Chevron Line at Spawn Plaza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.018, 12]}>
        <planeGeometry args={[5.2, 0.45]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      <Text
        position={[0, 0.02, 13.2]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
        fontSize={0.65}
        color="#FEF3C7"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        START EXPLORING
      </Text>

      {/* Connecting Track Markings to Zones */}
      {/* Track to Skills (West: [-32, 0, 8]) */}
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh
          key={`track-skills-${i}`}
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          position={[-10 - i * 2.4, 0.014, 2 + (i * 0.6)]}
        >
          <planeGeometry args={[0.25, 1.3]} />
          <meshBasicMaterial color="#FEF3C7" />
        </mesh>
      ))}

      {/* Track to Projects (Northwest: [-28, 0, -32]) */}
      {Array.from({ length: 11 }).map((_, i) => (
        <mesh
          key={`track-proj-${i}`}
          rotation={[-Math.PI / 2, 0, Math.PI / 4]}
          position={[-7 - i * 1.9, 0.014, -7 - i * 2.2]}
        >
          <planeGeometry args={[0.25, 1.3]} />
          <meshBasicMaterial color="#FEF3C7" />
        </mesh>
      ))}

      {/* Track to Achievements (Northeast Hill: [28, 0, -28]) */}
      {Array.from({ length: 11 }).map((_, i) => (
        <mesh
          key={`track-achieve-${i}`}
          rotation={[-Math.PI / 2, 0, -Math.PI / 4]}
          position={[7 + i * 1.9, 0.014, -7 - i * 2.0]}
        >
          <planeGeometry args={[0.25, 1.3]} />
          <meshBasicMaterial color="#FEF3C7" />
        </mesh>
      ))}

      {/* Track to Education (East: [34, 0, 10]) */}
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh
          key={`track-edu-${i}`}
          rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
          position={[10 + i * 2.5, 0.014, 3 + i * 0.8]}
        >
          <planeGeometry args={[0.25, 1.3]} />
          <meshBasicMaterial color="#FEF3C7" />
        </mesh>
      ))}

      {/* Track to Contact (South: [0, 0, 36]) */}
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh
          key={`track-contact-${i}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.014, 15 + i * 2.2]}
        >
          <planeGeometry args={[0.25, 1.3]} />
          <meshBasicMaterial color="#FEF3C7" />
        </mesh>
      ))}

      {/* =========================================================================
          3. ELEVATED NORTHEAST HILL PLATEAU (ACHIEVEMENT ARENA: +2.2m)
      ========================================================================= */}
      <group position={[28, 0, -28]}>
        {/* Hill Physical Collider */}
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[14, 1.1, 14]} position={[0, 1.1, 0]} friction={0.6} />
          {/* Gentle 12-degree Sloped Incline Drive Ramp */}
          <CuboidCollider
            args={[3.8, 0.25, 7.5]}
            position={[-13.5, 1.1, 0]}
            rotation={[0, 0, -0.19]}
            friction={0.85}
          />
        </RigidBody>

        {/* Low-Poly Terraced Hill Geometry */}
        <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[13, 15, 2.2, 28]} />
          <meshStandardMaterial color="#D9722C" roughness={0.85} flatShading />
        </mesh>

        {/* Hill Plateau Top Cap */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 2.21, 0]} receiveShadow>
          <circleGeometry args={[12.8, 28]} />
          <meshStandardMaterial color="#E67E38" roughness={0.8} />
        </mesh>

        {/* White Trim Ring on Hill Top */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 2.22, 0]}>
          <ringGeometry args={[12.4, 12.8, 28]} />
          <meshBasicMaterial color="#FEF3C7" />
        </mesh>

        {/* Visual Driveable Access Ramp connecting Ground to Plateau */}
        <mesh
          position={[-13.5, 1.1, 0]}
          rotation={[0, 0, -0.19]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[7.5, 0.3, 5.2]} />
          <meshStandardMaterial color="#EA580C" roughness={0.7} />
        </mesh>

        {/* Ramp Center Striping */}
        <mesh
          position={[-13.5, 1.28, 0]}
          rotation={[0, 0, -0.19]}
        >
          <planeGeometry args={[7.2, 0.35]} />
          <meshBasicMaterial color="#FEF3C7" />
        </mesh>
      </group>

      {/* =========================================================================
          4. GIANT 3D EXTRUDED LAWN LETTERS ("NITISH PRIYAN")
      ========================================================================= */}
      <group position={[0, 0.05, 5]} rotation={[-Math.PI / 2, 0, Math.PI]}>
        <Text
          fontSize={2.4}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
          letterSpacing={0.12}
        >
          NITISH PRIYAN
        </Text>
      </group>

      {/* =========================================================================
          5. 8 DYNAMIC PHYSICS DOMINOES (EAST STUNT LANE)
      ========================================================================= */}
      <group>
        {dominoes.map((d, i) => (
          <PhysicsDomino
            key={`domino-${i}`}
            position={d.pos}
            rotation={d.rot}
            color={i % 2 === 0 ? '#FFFFFF' : '#FEF3C7'}
            spotColor="#EA580C"
          />
        ))}
      </group>

      {/* Domino Lane Indicator Sign */}
      <group position={[18, 0, 1.5]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 1.0, 8]} />
          <meshStandardMaterial color="#78543E" roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.0, 0]} castShadow>
          <boxGeometry args={[1.6, 0.45, 0.1]} />
          <meshStandardMaterial color="#EA580C" roughness={0.7} />
        </mesh>
        <Text
          position={[0, 1.0, 0.06]}
          fontSize={0.18}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          DOMINO RUN &rarr;
        </Text>
      </group>

      {/* =========================================================================
          6. WEDGE JUMP RAMPS (SPEED LAUNCHES)
      ========================================================================= */}
      {/* Ramp 1: Canal Speed Launch Ramp */}
      <StuntRamp
        position={[-14, 0, -6]}
        rotation={[0, Math.PI / 4, 0]}
        width={3.8}
        length={5.0}
        height={1.35}
      />

      {/* Ramp 2: South Open Stunt Ramp */}
      <StuntRamp
        position={[14, 0, 24]}
        rotation={[0, -Math.PI / 6, 0]}
        width={3.4}
        length={4.5}
        height={1.2}
      />

      {/* =========================================================================
          7. TOY BOWLING PIN TRIANGLE (CRASH STUNT AREA)
      ========================================================================= */}
      <group position={[-18, 0, 8]}>
        {/* Row 1 */}
        <BowlingPin position={[0, 0.35, 0]} />
        {/* Row 2 */}
        <BowlingPin position={[-0.45, 0.35, 0.8]} />
        <BowlingPin position={[0.45, 0.35, 0.8]} />
        {/* Row 3 */}
        <BowlingPin position={[-0.9, 0.35, 1.6]} />
        <BowlingPin position={[0, 0.35, 1.6]} />
        <BowlingPin position={[0.9, 0.35, 1.6]} />
      </group>

      {/* =========================================================================
          8. MINIMALIST LOW-POLY TREES (FRAMING GROVES)
      ========================================================================= */}
      {trees.map((t, i) => (
        <StylizedTree
          key={`tree-${i}`}
          position={t.pos}
          scale={t.scale}
          foliageColor={t.color}
          type={t.type}
        />
      ))}

      {/* =========================================================================
          9. STYLIZED WHITE & LIGHT-GREY ROCKS
      ========================================================================= */}
      {rocks.map((r, i) => (
        <StylizedRock
          key={`rock-${i}`}
          position={r.pos}
          scale={r.scale}
          rotation={r.rot}
          color={r.color}
        />
      ))}

      {/* =========================================================================
          10. STONE WALLS & WOODEN FENCES (TRACK BORDERS)
      ========================================================================= */}
      {/* Stone walls around spawn roundabout */}
      <StoneWall position={[-12, 0, 18]} rotation={[0, Math.PI / 4, 0]} length={4.2} />
      <StoneWall position={[12, 0, 18]} rotation={[0, -Math.PI / 4, 0]} length={4.2} />

      {/* Wooden fences along tracks */}
      <WoodenFence position={[-20, 0, -4]} rotation={[0, Math.PI / 3, 0]} length={4.5} />
      <WoodenFence position={[12, 0, -14]} rotation={[0, -Math.PI / 3, 0]} length={4.5} />
      <WoodenFence position={[-6, 0, 26]} rotation={[0, 0, 0]} length={4.5} />
      <WoodenFence position={[6, 0, 26]} rotation={[0, 0, 0]} length={4.5} />
    </group>
  );
}
