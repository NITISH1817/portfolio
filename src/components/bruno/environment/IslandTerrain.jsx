import React from 'react';
import { Text } from '@react-three/drei';

export default function IslandTerrain({ isNight }) {
  const grassColor = isNight ? '#0F291E' : '#22C55E';
  const hillColor = isNight ? '#0B2017' : '#16A34A';
  const roadColor = isNight ? '#1E293B' : '#CBD5E1';
  const curbColor = isNight ? '#334155' : '#94A3B8';
  const markingColor = '#FFFFFF';

  return (
    <group position={[0, -0.01, 0]}>
      {/* Main Island Green Base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[72, 48]} />
        <meshStandardMaterial color={grassColor} roughness={0.8} />
      </mesh>

      {/* Low-Poly Rolling Hills on Island Borders */}
      {[
        { pos: [-42, 1.2, 42], scale: [14, 2.5, 12] },
        { pos: [45, 1.5, 45], scale: [16, 3.2, 14] },
        { pos: [-48, 1.0, -35], scale: [12, 2.2, 12] },
        { pos: [52, 1.4, -25], scale: [15, 2.8, 13] },
        { pos: [-20, 0.8, -58], scale: [16, 2.0, 14] },
        { pos: [20, 0.9, -58], scale: [14, 2.2, 12] },
        { pos: [0, 1.2, 58], scale: [18, 2.6, 15] }
      ].map((hill, i) => (
        <mesh key={i} position={hill.pos} scale={hill.scale} castShadow receiveShadow>
          <sphereGeometry args={[1, 7, 6]} />
          <meshStandardMaterial color={hillColor} roughness={0.85} flatShading />
        </mesh>
      ))}

      {/* Grid Floor Overlay for that Bruno Simon Technical Toy Aesthetic */}
      <gridHelper
        args={[140, 70, isNight ? '#334155' : '#94A3B8', isNight ? '#1E293B' : '#E2E8F0']}
        position={[0, 0.005, 0]}
      />

      {/* Center Plaza / Roundabout */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]} receiveShadow>
        <circleGeometry args={[12, 32]} />
        <meshStandardMaterial color={roadColor} roughness={0.7} />
      </mesh>
      {/* Curb ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.014, 0]}>
        <ringGeometry args={[11.6, 12.2, 32]} />
        <meshStandardMaterial color={curbColor} />
      </mesh>

      {/* North-South Main Highway */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[10, 105]} />
        <meshStandardMaterial color={roadColor} roughness={0.7} />
      </mesh>

      {/* East-West Highway */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[105, 10]} />
        <meshStandardMaterial color={roadColor} roughness={0.7} />
      </mesh>

      {/* Diagonal Road to About Me (South-West) */}
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 4]} position={[-20, 0.01, 14]} receiveShadow>
        <planeGeometry args={[8, 38]} />
        <meshStandardMaterial color={roadColor} roughness={0.7} />
      </mesh>

      {/* Diagonal Road to Experience & Honors (South-East) */}
      <mesh rotation={[-Math.PI / 2, 0, -Math.PI / 4]} position={[20, 0.01, 18]} receiveShadow>
        <planeGeometry args={[8, 38]} />
        <meshStandardMaterial color={roadColor} roughness={0.7} />
      </mesh>

      {/* Diagonal Road to Resume Tower (North-East) */}
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 4]} position={[22, 0.01, -22]} receiveShadow>
        <planeGeometry args={[8, 38]} />
        <meshStandardMaterial color={roadColor} roughness={0.7} />
      </mesh>

      {/* Center Dashed Markings */}
      {[-45, -35, -25, -15, 15, 25, 35, 45].map((z) => (
        <mesh key={`dash-z-${z}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, z]}>
          <planeGeometry args={[0.5, 3.2]} />
          <meshStandardMaterial color={markingColor} />
        </mesh>
      ))}
      {[-45, -35, -25, -15, 15, 25, 35, 45].map((x) => (
        <mesh key={`dash-x-${x}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.02, 0]}>
          <planeGeometry args={[3.2, 0.5]} />
          <meshStandardMaterial color={markingColor} />
        </mesh>
      ))}

      {/* Landmark Floor Direction Guides */}
      <group position={[0, 0.03, -15]} rotation={[-Math.PI / 2, 0, 0]}>
        <Text fontSize={1.3} color={isNight ? '#60A5FA' : '#2563EB'} anchorX="center" fontWeight="bold">
          ▲ PROJECTS EXHIBITION ▲
        </Text>
      </group>

      <group position={[20, 0.03, 0]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
        <Text fontSize={1.3} color={isNight ? '#F472B6' : '#DB2777'} anchorX="center" fontWeight="bold">
          ▲ SKILLS PLAYGROUND ▲
        </Text>
      </group>

      <group position={[-20, 0.03, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <Text fontSize={1.3} color={isNight ? '#34D399' : '#059669'} anchorX="center" fontWeight="bold">
          ▲ CONTACT & TRANSMISSION ▲
        </Text>
      </group>

      <group position={[-16, 0.03, 14]} rotation={[-Math.PI / 2, 0, -Math.PI / 4]}>
        <Text fontSize={1.1} color={isNight ? '#A78BFA' : '#7C3AED'} anchorX="center" fontWeight="bold">
          ▲ ABOUT ME ▲
        </Text>
      </group>

      <group position={[16, 0.03, 16]} rotation={[-Math.PI / 2, 0, Math.PI / 4]}>
        <Text fontSize={1.1} color={isNight ? '#FBBF24' : '#D97706'} anchorX="center" fontWeight="bold">
          ▲ EXPERIENCE & AWARDS ▲
        </Text>
      </group>

      <group position={[18, 0.03, -18]} rotation={[-Math.PI / 2, 0, -Math.PI / 4]}>
        <Text fontSize={1.1} color={isNight ? '#38BDF8' : '#0284C7'} anchorX="center" fontWeight="bold">
          ▲ RESUME TOWER ▲
        </Text>
      </group>
    </group>
  );
}

