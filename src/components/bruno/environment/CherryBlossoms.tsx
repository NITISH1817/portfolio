import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CherryBlossomsProps {
  treePositions?: [number, number, number][];
}

export default function CherryBlossoms({
  treePositions = [
    [-18, 0, 16],
    [-22, 0, 24],
    [-14, 0, 26],
    [16, 0, -22],
    [22, 0, -26],
    [26, 0, -18],
    [-32, 0, -28],
    [-38, 0, -22],
    [32, 0, 22],
    [38, 0, 26],
    [28, 0, 32],
    [4, 0, 22],
    [-4, 0, 24],
    [-45, 0, 8],
    [45, 0, -8]
  ]
}: CherryBlossomsProps) {
  // Falling sakura petals particle system
  const petalsCount = 120;
  const petalsMeshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const petalsData = useMemo(() => {
    return Array.from({ length: petalsCount }, () => ({
      x: (Math.random() - 0.5) * 120,
      y: 2 + Math.random() * 14,
      z: (Math.random() - 0.5) * 120,
      rotX: Math.random() * Math.PI,
      rotY: Math.random() * Math.PI,
      rotZ: Math.random() * Math.PI,
      speedY: 0.6 + Math.random() * 0.8,
      speedX: (Math.random() - 0.3) * 0.8,
      speedZ: (Math.random() - 0.3) * 0.8,
      rotSpeed: 0.5 + Math.random() * 1.5,
      scale: 0.12 + Math.random() * 0.14
    }));
  }, []);

  useFrame((state, delta) => {
    if (!petalsMeshRef.current) return;
    const dt = Math.min(delta, 0.05);

    petalsData.forEach((p, i) => {
      p.y -= p.speedY * dt;
      p.x += Math.sin(state.clock.elapsedTime * 0.8 + p.z) * p.speedX * dt;
      p.z += Math.cos(state.clock.elapsedTime * 0.8 + p.x) * p.speedZ * dt;
      p.rotX += p.rotSpeed * dt;
      p.rotZ += p.rotSpeed * 0.6 * dt;

      // Wrap around when falling to ground
      if (p.y < 0.2) {
        p.y = 12 + Math.random() * 6;
        p.x = (Math.random() - 0.5) * 110;
        p.z = (Math.random() - 0.5) * 110;
      }

      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(p.rotX, p.rotY, p.rotZ);
      dummy.scale.set(p.scale, p.scale * 0.4, p.scale);
      dummy.updateMatrix();
      petalsMeshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    petalsMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* Cherry Blossom Trees */}
      {treePositions.map((pos, idx) => (
        <CherryTree key={idx} position={pos} scale={0.85 + (idx % 3) * 0.2} seed={idx} />
      ))}

      {/* Instanced Falling Sakura Petals */}
      <instancedMesh
        ref={petalsMeshRef}
        args={[undefined, undefined, petalsCount]}
        frustumCulled={false}
      >
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#FF70A6"
          emissive="#FF70A6"
          emissiveIntensity={0.4}
          side={THREE.DoubleSide}
          roughness={0.5}
        />
      </instancedMesh>
    </group>
  );
}

// Low-poly Stylized Cherry Blossom Tree
function CherryTree({ position, scale = 1, seed = 0 }: { position: [number, number, number]; scale?: number; seed?: number }) {
  const trunkColor = '#5C3826';
  const blossomPink1 = '#FF70A6';
  const blossomPink2 = '#F472B6';
  const blossomPink3 = '#FDA4AF';

  return (
    <group position={position} scale={scale}>
      {/* Dark stylized trunk */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.55, 2.8, 7]} />
        <meshStandardMaterial color={trunkColor} roughness={0.85} flatShading />
      </mesh>
      {/* Branch lean */}
      <mesh position={[0.4, 2.6, 0.2]} rotation={[0.2, 0, -0.3]} castShadow>
        <cylinderGeometry args={[0.18, 0.28, 1.6, 6]} />
        <meshStandardMaterial color={trunkColor} roughness={0.85} flatShading />
      </mesh>

      {/* Tiered Foliage Blobs in Vibrant Stylized Pinks */}
      <mesh position={[0, 3.6, 0]} castShadow>
        <dodecahedronGeometry args={[2.2, 1]} />
        <meshStandardMaterial color={blossomPink1} roughness={0.6} flatShading />
      </mesh>
      <mesh position={[1.2, 4.2, 0.6]} castShadow>
        <dodecahedronGeometry args={[1.7, 1]} />
        <meshStandardMaterial color={blossomPink2} roughness={0.6} flatShading />
      </mesh>
      <mesh position={[-1.0, 4.4, -0.5]} castShadow>
        <dodecahedronGeometry args={[1.6, 1]} />
        <meshStandardMaterial color={blossomPink3} roughness={0.6} flatShading />
      </mesh>
      <mesh position={[0, 5.2, 0]} castShadow>
        <dodecahedronGeometry args={[1.4, 1]} />
        <meshStandardMaterial color={blossomPink1} roughness={0.6} flatShading />
      </mesh>
    </group>
  );
}

