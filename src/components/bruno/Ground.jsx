import React from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

export default function Ground({ isNight = false }) {
  const groundColor = isNight ? '#11151D' : '#E8EEF5';
  const roadColor = isNight ? '#1A202C' : '#CBD5E1';
  const markingColor = isNight ? '#4A5568' : '#FFFFFF';
  const accentColor = '#3B82F6';

  return (
    <group position={[0, -0.01, 0]}>
      {/* Infinite/Large Base Floor receiving shadows */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[180, 180]} />
        <meshStandardMaterial color={groundColor} roughness={0.8} />
      </mesh>

      {/* Grid Floor Lines for subtle playground feel */}
      <gridHelper
        args={[160, 80, isNight ? '#2D3748' : '#CBD5E1', isNight ? '#1E2533' : '#E2E8F0']}
        position={[0, 0.005, 0]}
      />

      {/* Main Center Crossroads & Roundabout */}
      {/* North-South Road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[10, 120]} />
        <meshStandardMaterial color={roadColor} roughness={0.7} />
      </mesh>
      {/* East-West Road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[120, 10]} />
        <meshStandardMaterial color={roadColor} roughness={0.7} />
      </mesh>

      {/* Center Roundabout / Plaza Circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]} receiveShadow>
        <circleGeometry args={[12, 32]} />
        <meshStandardMaterial color={roadColor} roughness={0.7} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry args={[11.5, 12, 32]} />
        <meshStandardMaterial color={markingColor} roughness={0.5} />
      </mesh>

      {/* Spawn Grid Area */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial
          color={isNight ? '#1E293B' : '#E2E8F0'}
          roughness={0.5}
        />
      </mesh>

      {/* Dashed Road Lines - North */}
      {[-35, -25, -15, 15, 25, 35, 45].map((z) => (
        <mesh
          key={`dashed-z-${z}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.02, z]}
        >
          <planeGeometry args={[0.6, 3]} />
          <meshStandardMaterial color={markingColor} />
        </mesh>
      ))}

      {/* Dashed Road Lines - East/West */}
      {[-45, -35, -25, -15, 15, 25, 35, 45].map((x) => (
        <mesh
          key={`dashed-x-${x}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[x, 0.02, 0]}
        >
          <planeGeometry args={[3, 0.6]} />
          <meshStandardMaterial color={markingColor} />
        </mesh>
      ))}

      {/* Directional Floor Guidance Text & Arrows (Bruno Simon Style!) */}
      <group position={[0, 0.03, 11]} rotation={[-Math.PI / 2, 0, 0]}>
        <Text
          fontSize={1.2}
          color={isNight ? '#94A3B8' : '#64748B'}
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          ▲ START HERE ▲
        </Text>
      </group>

      <group position={[0, 0.03, -15]} rotation={[-Math.PI / 2, 0, 0]}>
        <Text
          fontSize={1.4}
          color={isNight ? '#60A5FA' : '#2563EB'}
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          ▲ PROJECTS ▲
        </Text>
      </group>

      <group position={[20, 0.03, 0]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
        <Text
          fontSize={1.4}
          color={isNight ? '#F472B6' : '#DB2777'}
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          ▲ SKILLS PLAYGROUND ▲
        </Text>
      </group>

      <group position={[-20, 0.03, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <Text
          fontSize={1.4}
          color={isNight ? '#34D399' : '#059669'}
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          ▲ CONTACT & SOCIALS ▲
        </Text>
      </group>

      <group position={[0, 0.03, 22]} rotation={[-Math.PI / 2, 0, Math.PI]}>
        <Text
          fontSize={1.4}
          color={isNight ? '#FBBF24' : '#D97706'}
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          ▲ EDUCATION & AWARDS ▲
        </Text>
      </group>
    </group>
  );
}

