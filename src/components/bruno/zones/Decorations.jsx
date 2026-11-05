import React from 'react';
import { RigidBody, CylinderCollider } from '@react-three/rapier';

export default function Decorations({ isNight = false }) {
  // Traffic cones placed along outer road curbs (NOT in the middle of driving lanes)
  const conePositions = [
    [18, 0.4, -18],
    [18, 0.4, -20],
    [-18, 0.4, 18],
    [-18, 0.4, 20],
    [-22, 0.4, -26],
    [-24, 0.4, -28],
    [26, 0.4, 22],
    [28, 0.4, 24]
  ];

  // Tree positions lining the island perimeter and grove margins
  const treePositions = [
    [-28, 0, -28], [-20, 0, -32], [28, 0, -28], [20, 0, -32],
    [-32, 0, 24], [-24, 0, 32], [32, 0, 24], [24, 0, 32],
    [-48, 0, -18], [-48, 0, 18], [55, 0, -18], [55, 0, 18],
    [-12, 0, 52], [12, 0, 52], [0, 0, -56], [-32, 0, -50]
  ];

  // Streetlamps lining outer road curves
  const lampPositions = [
    [-14, 0, -14],
    [14, 0, -14],
    [-14, 0, 14],
    [14, 0, 14],
    [0, 0, -28],
    [0, 0, 28]
  ];

  return (
    <group>
      {/* Trees along outer borders */}
      {treePositions.map((pos, i) => (
        <LowPolyTree key={`tree-${i}`} position={pos} isNight={isNight} scale={0.85 + (i % 3) * 0.25} />
      ))}

      {/* Physics Traffic Cones lining outer curbs */}
      {conePositions.map((pos, i) => (
        <RigidBody
          key={`cone-${i}`}
          position={pos}
          type="dynamic"
          colliders={false}
          mass={2}
          linearDamping={0.4}
          angularDamping={0.8}
        >
          <CylinderCollider args={[0.4, 0.35]} friction={0.4} restitution={0.2} />
          <mesh castShadow receiveShadow>
            <coneGeometry args={[0.35, 0.8, 8]} />
            <meshStandardMaterial color="#FF5722" roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.05, 0]}>
            <cylinderGeometry args={[0.26, 0.29, 0.18, 8]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[0, -0.38, 0]} castShadow>
            <boxGeometry args={[0.7, 0.08, 0.7]} />
            <meshStandardMaterial color="#1E293B" />
          </mesh>
        </RigidBody>
      ))}

      {/* Streetlamps */}
      {lampPositions.map((pos, i) => (
        <StreetLamp key={`lamp-${i}`} position={pos} isNight={isNight} />
      ))}
    </group>
  );
}

function LowPolyTree({ position, scale = 1, isNight = false }) {
  const leafColor = isNight ? '#1E3A2F' : '#15803D';
  const trunkColor = '#78350F';

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.45, 2.4, 8]} />
        <meshStandardMaterial color={trunkColor} roughness={0.8} />
      </mesh>
      <mesh position={[0, 3.2, 0]} castShadow>
        <coneGeometry args={[2.2, 2.6, 7]} />
        <meshStandardMaterial color={leafColor} roughness={0.6} />
      </mesh>
      <mesh position={[0, 4.6, 0]} castShadow>
        <coneGeometry args={[1.7, 2.2, 7]} />
        <meshStandardMaterial color={leafColor} roughness={0.6} />
      </mesh>
    </group>
  );
}

function StreetLamp({ position, isNight = false }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.14, 3.2, 8]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[0, 3.2, 0]} castShadow>
        <sphereGeometry args={[0.25, 8, 8]} />
        <meshStandardMaterial
          color="#FDE047"
          emissive="#FDE047"
          emissiveIntensity={2.5}
        />
      </mesh>
      <pointLight
        position={[0, 3.2, 0]}
        color="#FEF08A"
        intensity={2.2}
        distance={10}
        decay={2}
      />
    </group>
  );
}
