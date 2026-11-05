import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import LandmarkBeacon from './LandmarkBeacon';
import { projects } from '../../../data/portfolio';

export default function LandmarkProjects({
  onEnter,
  onLeave,
  onSelectProject,
  isDiscovered
}) {
  const pedestalData = [
    { project: projects[0], pos: [-24, 0, -40], rot: [0, 0.35, 0], color: '#3B82F6', icon: '⚖️' },
    { project: projects[1], pos: [-12, 0, -46], rot: [0, 0.15, 0], color: '#10B981', icon: '🏛️' },
    { project: projects[2], pos: [0, 0, -48], rot: [0, 0, 0], color: '#F59E0B', icon: '⚡' },
    { project: projects[3], pos: [12, 0, -46], rot: [0, -0.15, 0], color: '#EC4899', icon: '🎬' },
    { project: projects[4], pos: [24, 0, -40], rot: [0, -0.35, 0], color: '#8B5CF6', icon: '💧' }
  ];

  return (
    <group>
      {/* Central Interactive Beacon */}
      <LandmarkBeacon
        id="projects"
        name="PROJECTS EXHIBITION"
        position={[0, 0, -36]}
        color="#3B82F6"
        radius={7.5}
        onEnter={onEnter}
        onLeave={onLeave}
        isDiscovered={isDiscovered}
      />

      {/* Futuristic 3D Glass Holographic Project Pedestals */}
      {pedestalData.map(({ project, pos, rot, color, icon }) => (
        <RigidBody key={project.id} type="fixed" colliders={false} position={pos} rotation={rot}>
          <CuboidCollider args={[4.8, 2.5, 0.4]} position={[0, 2.5, 0]} />
          <HolographicProjectDisplay
            project={project}
            color={color}
            icon={icon}
            onSelect={() => onSelectProject(project)}
          />
        </RigidBody>
      ))}
    </group>
  );
}

function HolographicProjectDisplay({ project, color, icon, onSelect }) {
  const holoCubeRef = useRef(null);

  useFrame((state) => {
    if (holoCubeRef.current) {
      const t = state.clock.getElapsedTime();
      holoCubeRef.current.rotation.y = t * 1.4;
      holoCubeRef.current.position.y = 7.1 + Math.sin(t * 2.0) * 0.15;
    }
  });

  return (
    <group onClick={onSelect} className="cursor-pointer">
      {/* Chrome Architectural Stems */}
      <mesh position={[-3.8, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.14, 2.8, 12]} />
        <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[3.8, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.14, 2.8, 12]} />
        <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Polished Charcoal Base Plinth */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[8.6, 0.3, 1.2]} />
        <meshStandardMaterial color="#0F172A" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Main Glass Display Frame */}
      <mesh position={[0, 4.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[9.2, 4.6, 0.25]} />
        <meshStandardMaterial
          color="#0F172A"
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Semi-Transparent Glass Display Canvas */}
      <mesh position={[0, 4.3, 0.15]}>
        <planeGeometry args={[8.8, 4.2]} />
        <meshStandardMaterial
          color="#0B132B"
          roughness={0.08}
          metalness={0.7}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Glowing Neon Accent Border */}
      <mesh position={[0, 6.45, 0.16]}>
        <planeGeometry args={[8.8, 0.08]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.5} />
      </mesh>

      {/* Floating 3D Holographic Cube Icon */}
      <mesh ref={holoCubeRef} position={[0, 7.1, 0.3]} castShadow>
        <octahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2.8}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Top Banner Tag */}
      <Text
        position={[-4.0, 5.9, 0.18]}
        fontSize={0.28}
        color={color}
        anchorX="left"
        anchorY="top"
        fontWeight="bold"
      >
        {`PROJECT ${project.number} • ${project.type}`}
      </Text>

      {/* Project Title */}
      <Text
        position={[-4.0, 5.3, 0.18]}
        fontSize={0.54}
        color="#FFFFFF"
        anchorX="left"
        anchorY="top"
        fontWeight="bold"
        maxWidth={7.8}
      >
        {project.title}
      </Text>

      {/* Subtitle / Description excerpt */}
      <Text
        position={[-4.0, 4.35, 0.18]}
        fontSize={0.3}
        color="#94A3B8"
        anchorX="left"
        anchorY="top"
        maxWidth={7.8}
        lineHeight={1.25}
      >
        {project.subtitle}
      </Text>

      {/* Tech Stack Pills */}
      <group position={[-4.0, 3.1, 0.18]}>
        {project.technologies.slice(0, 4).map((tech, i) => (
          <Text
            key={i}
            position={[i * 1.95, 0, 0]}
            fontSize={0.24}
            color="#E2E8F0"
            anchorX="left"
            anchorY="top"
            fontWeight="bold"
          >
            {`[ ${tech} ]`}
          </Text>
        ))}
      </group>

      {/* Click To Inspect Prompt Button */}
      <group position={[3.8, 2.7, 0.18]}>
        <Text
          fontSize={0.26}
          color={color}
          anchorX="right"
          anchorY="top"
          fontWeight="bold"
        >
          CLICK TO INSPECT &rarr;
        </Text>
      </group>
    </group>
  );
}
