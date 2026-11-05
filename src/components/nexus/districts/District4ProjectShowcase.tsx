import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { projects } from '../../../data/portfolio';

interface DistrictProps {
  onEnter?: (district: any) => void;
  onLeave?: (id: string) => void;
  onSelectProject?: (project: any) => void;
}

export default function District4ProjectShowcase({
  onEnter,
  onLeave,
  onSelectProject
}: DistrictProps) {
  // Semi-circular layout for the 8 project pavilions around the district center
  const pedestalLayout = [
    { project: projects.find((p) => p.id === 'proj-setu') || projects[0], pos: [-16, 0, 8], color: '#38BDF8', icon: '🏛️' },
    { project: projects.find((p) => p.id === 'proj-lexora') || projects[1], pos: [-8, 0, 14], color: '#A855F7', icon: '⚖️' },
    { project: projects.find((p) => p.id === 'proj-edu-prediction') || projects[2], pos: [8, 0, 14], color: '#FF8A3D', icon: '📊' },
    { project: projects.find((p) => p.id === 'proj-gov-scheme') || projects[3], pos: [16, 0, 8], color: '#34D399', icon: '📜' },
    { project: projects.find((p) => p.id === 'proj-zero') || projects[4], pos: [16, 0, -8], color: '#FBBF24', icon: '⚡' },
    { project: projects.find((p) => p.id === 'proj-movie') || projects[5], pos: [8, 0, -14], color: '#EC4899', icon: '🎬' },
    { project: projects.find((p) => p.id === 'proj-retinopathy') || projects[6], pos: [-8, 0, -14], color: '#EF4444', icon: '👁️' },
    { project: projects.find((p) => p.id === 'proj-water') || projects[7], pos: [-16, 0, -8], color: '#06B6D4', icon: '💧' }
  ];

  return (
    <group position={[-42, 0, -42]}>
      {/* Interactive Trigger Beacon */}
      <mesh
        visible={false}
        onPointerOver={() => onEnter && onEnter({ id: 'projects', name: 'DISTRICT 04 — PROJECT SHOWCASE' })}
        onPointerOut={() => onLeave && onLeave('projects')}
      >
        <sphereGeometry args={[22, 16, 16]} />
      </mesh>

      {/* Central Exhibition Plaza Plinth */}
      <mesh position={[0, 0.15, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[20, 22, 0.3, 24]} />
        <meshStandardMaterial color="#0A0E1A" roughness={0.35} metalness={0.7} />
      </mesh>

      {/* Central Holographic District Monolith */}
      <mesh position={[0, 4.5, 0]} castShadow>
        <cylinderGeometry args={[1.2, 1.8, 9.0, 12]} />
        <meshStandardMaterial color="#111827" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* District Signage Banner */}
      <Text
        position={[0, 8.2, 0]}
        fontSize={0.65}
        color="#F8FAFC"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        PROJECT SHOWCASE
      </Text>
      <Text
        position={[0, 7.3, 0]}
        fontSize={0.32}
        color="#FF70A6"
        anchorX="center"
        anchorY="middle"
      >
        DISTRICT 04 // 8 ARCHITECTURAL EXHIBITS
      </Text>

      {/* 8 Glass Cyber Project Pedestals */}
      {pedestalLayout.map(({ project, pos, color, icon }, idx) => (
        <RigidBody key={project.id || idx} type="fixed" colliders={false} position={pos as [number, number, number]}>
          <CuboidCollider args={[2.5, 2.5, 0.5]} position={[0, 2.5, 0]} />
          <CyberProjectPedestal
            project={project}
            color={color}
            icon={icon}
            onSelect={() => onSelectProject && onSelectProject(project)}
          />
        </RigidBody>
      ))}
    </group>
  );
}

function CyberProjectPedestal({
  project,
  color,
  icon,
  onSelect
}: {
  project: any;
  color: string;
  icon: string;
  onSelect: () => void;
}) {
  const cubeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (cubeRef.current) {
      const t = state.clock.getElapsedTime();
      cubeRef.current.rotation.y = t * 1.2;
    }
  });

  return (
    <group
      onClick={onSelect}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    >
      {/* Plinth Base */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.6, 0.6, 1.2]} />
        <meshStandardMaterial color="#0B132B" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Chrome Uprights */}
      {[-2.0, 2.0].map((x, i) => (
        <mesh key={i} position={[x, 2.2, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.09, 3.8, 8]} />
          <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.15} />
        </mesh>
      ))}

      {/* Glass Project Frame */}
      <mesh position={[0, 3.2, 0]} castShadow>
        <boxGeometry args={[4.8, 2.8, 0.2]} />
        <meshStandardMaterial
          color="#060914"
          roughness={0.1}
          metalness={0.85}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Neon Edge Highlight */}
      <mesh position={[0, 3.2, 0.12]}>
        <planeGeometry args={[4.6, 2.6]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.25} />
      </mesh>

      {/* Floating Holographic Icon */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
        <mesh ref={cubeRef} position={[0, 5.2, 0]}>
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.5} />
        </mesh>
      </Float>

      {/* Project Title Text */}
      <Text
        position={[0, 3.6, 0.15]}
        fontSize={0.28}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        maxWidth={4.2}
        fontWeight="bold"
      >
        {(project.title ? (project.title.includes('—') ? project.title.split('—')[0] : (project.title.includes('-') ? project.title.split('-')[0] : project.title)) : '').trim()}
      </Text>

      {/* Technology Stack Pill */}
      <Text
        position={[0, 2.9, 0.15]}
        fontSize={0.16}
        color={color}
        anchorX="center"
        anchorY="middle"
        maxWidth={4.2}
      >
        {project.technologies.slice(0, 3).join(' • ')}
      </Text>

      {/* Inspect Prompt */}
      <Text
        position={[0, 2.3, 0.15]}
        fontSize={0.15}
        color="#38BDF8"
        anchorX="center"
        anchorY="middle"
      >
        [CLICK TO INSPECT SPEC &rarr;]
      </Text>
    </group>
  );
}

