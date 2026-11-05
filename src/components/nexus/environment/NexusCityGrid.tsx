import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';

export default function NexusCityGrid() {
  const lakeWaveRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (lakeWaveRef.current) {
      const t = state.clock.getElapsedTime();
      (lakeWaveRef.current.material as THREE.MeshStandardMaterial).opacity =
        0.85 + Math.sin(t * 1.5) * 0.08;
    }
  });

  return (
    <group>
      {/* 1. SOLID RAPIER GROUND & PERIMETER BOUNDARY COLLIDERS */}
      {/* Main Ground Collider: 180m x 180m */}
      <CuboidCollider args={[92, 1, 92]} position={[0, -1, 0]} friction={0.55} restitution={0.05} />

      {/* Perimeter Forcefields (North, South, East, West) */}
      <CuboidCollider args={[92, 6, 1.5]} position={[0, 3, 90]} />
      <CuboidCollider args={[92, 6, 1.5]} position={[0, 3, -90]} />
      <CuboidCollider args={[1.5, 6, 92]} position={[90, 3, 0]} />
      <CuboidCollider args={[1.5, 6, 92]} position={[-90, 3, 0]} />

      {/* 2. MAIN OBSIDIAN CITY PLINTH */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[180, 0.1, 180]} />
        <meshStandardMaterial
          color="#090D1A"
          roughness={0.35}
          metalness={0.7}
        />
      </mesh>

      {/* 3. CYBERNETIC ROAD GRID & ARTERIAL HIGHWAYS */}
      {/* Primary North-South Arterial Boulevard */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[16, 172]} />
        <meshStandardMaterial
          color="#0C1222"
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* Primary East-West Arterial Boulevard */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[172, 16]} />
        <meshStandardMaterial
          color="#0C1222"
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* Outer Ring Boulevard (Square Ring Highway) */}
      {[-68, 68].map((offset, i) => (
        <React.Fragment key={`ring-ns-${i}`}>
          <mesh position={[offset, 0.015, 0]} receiveShadow>
            <planeGeometry args={[12, 148]} />
            <meshStandardMaterial color="#0E162A" roughness={0.4} metalness={0.5} />
          </mesh>
          <mesh position={[0, 0.015, offset]} receiveShadow>
            <planeGeometry args={[148, 12]} />
            <meshStandardMaterial color="#0E162A" roughness={0.4} metalness={0.5} />
          </mesh>
        </React.Fragment>
      ))}

      {/* 4. GLOWING NEON ROAD MARKINGS & SPEED CONDUITS */}
      {/* North-South Center Divider (Plasma Orange) */}
      <mesh position={[0, 0.03, 0]}>
        <planeGeometry args={[0.3, 168]} />
        <meshStandardMaterial
          color="#FF8A3D"
          emissive="#FF8A3D"
          emissiveIntensity={2.2}
        />
      </mesh>

      {/* East-West Center Divider (Neon Purple) */}
      <mesh position={[0, 0.03, 0]}>
        <planeGeometry args={[168, 0.3]} />
        <meshStandardMaterial
          color="#A855F7"
          emissive="#A855F7"
          emissiveIntensity={2.2}
        />
      </mesh>

      {/* Outer Electric Blue Road Seams */}
      {[-7.8, 7.8].map((x, idx) => (
        <mesh key={`seam-ns-${idx}`} position={[x, 0.03, 0]}>
          <planeGeometry args={[0.15, 170]} />
          <meshStandardMaterial
            color="#38BDF8"
            emissive="#38BDF8"
            emissiveIntensity={1.8}
          />
        </mesh>
      ))}

      {[-7.8, 7.8].map((z, idx) => (
        <mesh key={`seam-ew-${idx}`} position={[0, 0.03, z]}>
          <planeGeometry args={[170, 0.15]} />
          <meshStandardMaterial
            color="#38BDF8"
            emissive="#38BDF8"
            emissiveIntensity={1.8}
          />
        </mesh>
      ))}

      {/* 5. REFLECTIVE SUBSURFACE CYBER LAKE */}
      <group position={[-38, 0.01, -12]}>
        {/* Dark Reflective Water Plane */}
        <mesh ref={lakeWaveRef} receiveShadow>
          <planeGeometry args={[32, 24]} />
          <meshStandardMaterial
            color="#060914"
            roughness={0.06}
            metalness={0.95}
            transparent
            opacity={0.88}
          />
        </mesh>

        {/* Submerged Glowing Fiber-Optic Grid */}
        <mesh position={[0, -0.05, 0]}>
          <planeGeometry args={[30, 22]} />
          <meshBasicMaterial
            color="#38BDF8"
            wireframe
            transparent
            opacity={0.35}
          />
        </mesh>

        {/* Cyber Lake Perimeter Curb */}
        <mesh position={[0, 0.1, 0]}>
          <ringGeometry args={[14, 15.2, 4]} />
          <meshStandardMaterial
            color="#FF8A3D"
            emissive="#FF8A3D"
            emissiveIntensity={1.4}
          />
        </mesh>
      </group>

      {/* 6. PERIMETER ILLUMINATED PYLONS (INSTANCED LIGHTS) */}
      <PerimeterPylons />
    </group>
  );
}

function PerimeterPylons() {
  const pylonPositions = React.useMemo(() => {
    const list: [number, number, number][] = [];
    // Place glowing security towers along the outer city perimeter
    for (let x = -84; x <= 84; x += 28) {
      list.push([x, 0, 88]);
      list.push([x, 0, -88]);
    }
    for (let z = -84; z <= 84; z += 28) {
      list.push([88, 0, z]);
      list.push([-88, 0, z]);
    }
    return list;
  }, []);

  return (
    <group>
      {pylonPositions.map(([x, y, z], idx) => (
        <group key={idx} position={[x, y, z]}>
          {/* Base */}
          <mesh position={[0, 1.2, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.5, 2.4, 8]} />
            <meshStandardMaterial color="#111827" roughness={0.4} metalness={0.7} />
          </mesh>

          {/* Emissive Vertical Core */}
          <mesh position={[0, 3.2, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 2.0, 8]} />
            <meshStandardMaterial
              color={idx % 2 === 0 ? '#FF8A3D' : '#A855F7'}
              emissive={idx % 2 === 0 ? '#FF8A3D' : '#A855F7'}
              emissiveIntensity={2.5}
            />
          </mesh>

          {/* Light Cap */}
          <mesh position={[0, 4.4, 0]}>
            <cylinderGeometry args={[0.4, 0.1, 0.4, 8]} />
            <meshStandardMaterial color="#1E293B" metalness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

