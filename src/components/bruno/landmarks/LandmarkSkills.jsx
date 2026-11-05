import React, { useState, useMemo } from 'react';
import { Text, Float } from '@react-three/drei';
import { RigidBody, CuboidCollider, CylinderCollider } from '@react-three/rapier';
import LandmarkBeacon from './LandmarkBeacon';
import { carAudio } from '../CarAudio';

export default function LandmarkSkills({ onEnter, onLeave, isDiscovered, isNight }) {
  const [resetCount, setResetCount] = useState(0);
  const position = [38, 0, -4];

  // Specific skills from Nitish's stack
  const skillLabels = [
    'JAVA', 'PYTHON', 'C', 'C++',
    'REACT', 'FLUTTER', 'FASTAPI', 'FLASK',
    'MYSQL', 'TENSORFLOW', 'SCIKIT-LEARN', 'GIT',
    'GITHUB', 'CHROMADB', 'GEMINI AI', 'DOCKER'
  ];

  // 4 rows x 4 columns of physical smashable bricks
  const brickConfigs = useMemo(() => {
    const list = [];
    let idx = 0;
    const origin = [position[0] - 2, 0, position[2] - 8];
    const width = 2.0;
    const height = 0.9;
    const depth = 0.9;

    for (let row = 0; row < 4; row++) {
      const cols = row % 2 === 0 ? 4 : 3;
      const xOffset = row % 2 === 0 ? 0 : width / 2;

      for (let col = 0; col < cols; col++) {
        const x = origin[0] + (col - 1.5) * (width + 0.1) + xOffset;
        const y = 0.5 + row * (height + 0.05);
        const z = origin[2];

        list.push({
          id: `sk-brick-${resetCount}-${idx}`,
          label: skillLabels[idx % skillLabels.length],
          size: [width, height, depth],
          position: [x, y, z],
          color: ['#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'][idx % 5]
        });
        idx++;
      }
    }
    return list;
  }, [resetCount, position]);

  // 10 Bowling pins
  const pinConfigs = useMemo(() => {
    const pins = [];
    const origin = [position[0] + 6, 0, position[2] + 12];
    const rows = 3;
    let pinId = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c <= r; c++) {
        const x = origin[0] + (c - r * 0.5) * 1.5;
        const z = origin[2] + r * 1.8;
        pins.push({
          id: `sk-pin-${resetCount}-${pinId++}`,
          position: [x, 0.9, z]
        });
      }
    }
    return pins;
  }, [resetCount, position]);

  // Floating 3D technology icon pedestals
  const floatingIcons = [
    { name: 'JAVA', color: '#EA580C', offset: [-6, 2.5, -4] },
    { name: 'PYTHON', color: '#3B82F6', offset: [-6, 2.5, 4] },
    { name: 'REACT', color: '#06B6D4', offset: [8, 2.5, -4] },
    { name: 'AI / ML', color: '#A855F7', offset: [8, 2.5, 4] }
  ];

  return (
    <group position={position}>
      {/* Interactive Beacon Trigger in Center of Skills Plaza */}
      <LandmarkBeacon
        id="skills"
        name="SKILLS SHOWCASE"
        position={[0, 0, 2]}
        color="#EC4899"
        radius={7.0}
        onEnter={onEnter}
        onLeave={onLeave}
        isDiscovered={isDiscovered}
      />

      {/* Floating 3D Technology Emblems */}
      {floatingIcons.map((ic, i) => (
        <Float key={i} speed={2} rotationIntensity={0.4} floatIntensity={0.5}>
          <group position={ic.offset}>
            {/* Hexagonal / Octahedral Crystal */}
            <mesh castShadow>
              <octahedronGeometry args={[0.9, 0]} />
              <meshStandardMaterial
                color={ic.color}
                emissive={ic.color}
                emissiveIntensity={1.2}
                roughness={0.2}
              />
            </mesh>
            <Text
              position={[0, 1.4, 0]}
              fontSize={0.38}
              color="#FFFFFF"
              anchorX="center"
              anchorY="middle"
              fontWeight="bold"
            >
              {ic.name}
            </Text>
          </group>
        </Float>
      ))}

      {/* Smashable Brick Wall (Rapier Dynamic RigidBodies) */}
      {brickConfigs.map((b) => (
        <RigidBody
          key={b.id}
          position={b.position}
          type="dynamic"
          colliders={false}
          mass={8}
          linearDamping={0.4}
          angularDamping={0.8}
        >
          <CuboidCollider
            args={[b.size[0] / 2, b.size[1] / 2, b.size[2] / 2]}
            friction={0.4}
            restitution={0.1}
          />
          <mesh castShadow receiveShadow>
            <boxGeometry args={b.size} />
            <meshStandardMaterial color={b.color} roughness={0.35} />
          </mesh>
          <Text
            position={[0, 0, b.size[2] / 2 + 0.02]}
            fontSize={0.28}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            {b.label}
          </Text>
          <Text
            position={[0, 0, -b.size[2] / 2 - 0.02]}
            rotation={[0, Math.PI, 0]}
            fontSize={0.28}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            {b.label}
          </Text>
        </RigidBody>
      ))}

      {/* Bowling Pins (Rapier Dynamic Bodies) */}
      {pinConfigs.map((pin) => (
        <RigidBody
          key={pin.id}
          position={pin.position}
          type="dynamic"
          colliders={false}
          mass={4}
          linearDamping={0.3}
          angularDamping={0.6}
        >
          <CylinderCollider args={[0.8, 0.3]} friction={0.3} restitution={0.15} />
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.2, 0.32, 1.6, 12]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.23, 0.24, 0.12, 12]} />
            <meshStandardMaterial color="#EF4444" />
          </mesh>
          <mesh position={[0, 0.52, 0]}>
            <cylinderGeometry args={[0.21, 0.22, 0.1, 12]} />
            <meshStandardMaterial color="#EF4444" />
          </mesh>
        </RigidBody>
      ))}

      {/* Reset Pad */}
      <group position={[0, 0.03, 10]}>
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          onClick={() => {
            carAudio.playChime();
            setResetCount((c) => c + 1);
          }}
        >
          <circleGeometry args={[2.0, 32]} />
          <meshStandardMaterial color="#10B981" transparent opacity={0.6} />
        </mesh>
        <Text
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.02, 0]}
          fontSize={0.35}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          RESET WALL & PINS
        </Text>
      </group>
    </group>
  );
}
