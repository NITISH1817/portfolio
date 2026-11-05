import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { usePhysics } from '../PhysicsContext';
import { capabilities } from '../../../data/portfolio';
import { carAudio } from '../CarAudio';

export default function SkillsPlayground({ onSelectSkill, isNight }) {
  const { world, addBody, removeBody, carState } = usePhysics();
  const [resetCount, setResetCount] = useState(0);

  // Brick Skill labels
  const skillLabels = [
    'JAVA', 'PYTHON', 'PYTORCH', 'DOCKER',
    'FASTAPI', 'REACT', 'DSA', 'OOP',
    'MLOPS', 'REST APIs', 'NEXT.JS', 'C++',
    'MYSQL', 'CI/CD', 'GEMINI AI', 'SYSTEM DESIGN'
  ];

  // Brick Wall configurations (4 rows x 4 columns)
  const brickConfigs = useMemo(() => {
    const list = [];
    let idx = 0;
    const origin = [38, 0, -8];
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
          id: `brick-${resetCount}-${idx}`,
          label: skillLabels[idx % skillLabels.length],
          size: [width, height, depth],
          position: [x, y, z],
          color: ['#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'][idx % 5]
        });
        idx++;
      }
    }
    return list;
  }, [resetCount]);

  // Bowling pins setup
  const pinConfigs = useMemo(() => {
    const pins = [];
    const origin = [42, 0, 15];
    const rows = 3;
    let pinId = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c <= r; c++) {
        const x = origin[0] + (c - r * 0.5) * 1.5;
        const z = origin[2] + r * 1.8;
        pins.push({
          id: `pin-${resetCount}-${pinId++}`,
          position: [x, 0.9, z]
        });
      }
    }
    return pins;
  }, [resetCount]);

  return (
    <group>
      {/* Zone Title Banner */}
      <group position={[38, 7, -20]} rotation={[0, -Math.PI / 2, 0]}>
        <Text
          fontSize={2.2}
          color={isNight ? '#F472B6' : '#DB2777'}
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          SKILLS & DESTRUCTION ZONE
        </Text>
        <Text
          position={[0, -1.0, 0]}
          fontSize={0.7}
          color={isNight ? '#94A3B8' : '#64748B'}
          anchorX="center"
          anchorY="middle"
        >
          RAM INTO THE WALL OR KNOCK DOWN THE BOWLING PINS!
        </Text>
      </group>

      {/* Smashable Brick Wall */}
      {brickConfigs.map((b) => (
        <PhysicsBrick key={b.id} config={b} isNight={isNight} />
      ))}

      {/* Bowling Pins */}
      {pinConfigs.map((pin) => (
        <PhysicsBowlingPin key={pin.id} position={pin.position} isNight={isNight} />
      ))}

      {/* Wall Rebuild / Reset Pad */}
      <group position={[38, 0.03, -1]}>
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          onClick={() => {
            carAudio.playChime();
            setResetCount((c) => c + 1);
          }}
        >
          <circleGeometry args={[2.2, 32]} />
          <meshStandardMaterial color="#10B981" transparent opacity={0.6} />
        </mesh>
        <Text
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.02, 0]}
          fontSize={0.4}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          RESET WALL & PINS
        </Text>
      </group>

      {/* Capability Showcase Podiums along the side */}
      <group position={[48, 0, -5]} rotation={[0, -Math.PI / 2, 0]}>
        {capabilities.slice(0, 4).map((cap, i) => (
          <group
            key={cap.id}
            position={[(i - 1.5) * 6, 0, 0]}
            onClick={() => onSelectSkill(cap)}
          >
            {/* Pedestal */}
            <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[1.6, 1.8, 2.0, 16]} />
              <meshStandardMaterial color={isNight ? '#1E293B' : '#E2E8F0'} roughness={0.4} />
            </mesh>
            {/* Glowing Accent Top */}
            <mesh position={[0, 2.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[1.5, 16]} />
              <meshStandardMaterial color="#38BDF8" emissive="#38BDF8" emissiveIntensity={0.8} />
            </mesh>
            <Text
              position={[0, 2.8, 0]}
              fontSize={0.35}
              color={isNight ? '#F8FAFC' : '#0F172A'}
              anchorX="center"
              anchorY="middle"
              fontWeight="bold"
              maxWidth={3.0}
              textAlign="center"
            >
              {cap.title.replace(/^\d+\s*—\s*/, '')}
            </Text>
          </group>
        ))}
      </group>
    </group>
  );
}

// Individual Dynamic Physics Brick
function PhysicsBrick({ config, isNight }) {
  const { world, addBody, removeBody } = usePhysics();
  const meshRef = useRef();

  useEffect(() => {
    const half = config.size.map((v) => v / 2);
    const body = new CANNON.Body({
      mass: 8,
      position: new CANNON.Vec3(...config.position),
      linearDamping: 0.15,
      angularDamping: 0.25,
      material: world.defaultContactMaterial
    });
    body.addShape(new CANNON.Box(new CANNON.Vec3(...half)));

    addBody(meshRef, body, () => {});

    return () => {
      removeBody(body);
    };
  }, [config, world, addBody, removeBody]);

  return (
    <group ref={meshRef} position={config.position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={config.size} />
        <meshStandardMaterial
          color={config.color}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
      {/* Front Label */}
      <Text
        position={[0, 0, config.size[2] / 2 + 0.02]}
        fontSize={0.28}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {config.label}
      </Text>
      {/* Back Label */}
      <Text
        position={[0, 0, -config.size[2] / 2 - 0.02]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.28}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {config.label}
      </Text>
    </group>
  );
}

// Individual Bowling Pin with Physics
function PhysicsBowlingPin({ position, isNight }) {
  const { world, addBody, removeBody } = usePhysics();
  const meshRef = useRef();

  useEffect(() => {
    const body = new CANNON.Body({
      mass: 4,
      position: new CANNON.Vec3(...position),
      linearDamping: 0.15,
      angularDamping: 0.25,
      material: world.defaultContactMaterial
    });
    // Cylinder shape approximation
    body.addShape(new CANNON.Cylinder(0.25, 0.35, 1.6, 8));

    addBody(meshRef, body, () => {});

    return () => {
      removeBody(body);
    };
  }, [position, world, addBody, removeBody]);

  return (
    <group ref={meshRef} position={position}>
      {/* Pin Body */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.32, 1.6, 12]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
      </mesh>
      {/* Red stripes on bowling pin */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.23, 0.24, 0.12, 12]} />
        <meshStandardMaterial color="#EF4444" />
      </mesh>
      <mesh position={[0, 0.52, 0]}>
        <cylinderGeometry args={[0.21, 0.22, 0.1, 12]} />
        <meshStandardMaterial color="#EF4444" />
      </mesh>
    </group>
  );
}

