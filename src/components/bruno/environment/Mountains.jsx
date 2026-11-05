import React from 'react';

export default function Mountains() {
  const mountainColor = '#251D38';
  const snowColor = '#581C87';

  // Ring of low-poly distant mountains
  const peaks = [
    { pos: [0, 8, -95], scale: [28, 22, 28] },
    { pos: [-45, 6, -85], scale: [24, 18, 24] },
    { pos: [45, 7, -85], scale: [26, 20, 26] },
    { pos: [-85, 9, -35], scale: [30, 24, 30] },
    { pos: [85, 8, -35], scale: [28, 22, 28] },
    { pos: [-90, 7, 25], scale: [26, 20, 26] },
    { pos: [90, 6, 25], scale: [25, 18, 25] },
    { pos: [-50, 8, 85], scale: [28, 22, 28] },
    { pos: [50, 7, 85], scale: [26, 20, 26] },
    { pos: [0, 9, 95], scale: [32, 25, 32] }
  ];

  return (
    <group position={[0, -2, 0]}>
      {peaks.map((p, i) => (
        <group key={i} position={p.pos} scale={p.scale}>
          {/* Mountain base pyramid */}
          <mesh castShadow receiveShadow>
            <coneGeometry args={[1, 1, 6]} />
            <meshStandardMaterial color={mountainColor} roughness={0.8} flatShading />
          </mesh>
          {/* Peak accent */}
          <mesh position={[0, 0.35, 0]}>
            <coneGeometry args={[0.32, 0.35, 6]} />
            <meshStandardMaterial color={snowColor} roughness={0.6} flatShading />
          </mesh>
        </group>
      ))}
    </group>
  );
}
