import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { projects } from '../../data/projects';

const BUILDING_COLORS = ['#3B82F6','#8B5CF6','#10B981'];

function ProjectBuilding({ project, position, color, index, onSelect }) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  const height = 2.5 + index * 0.5;

  useFrame(() => {
    if (!ref.current) return;
    const targetY = hovered ? position[1] + 0.5 : position[1];
    ref.current.position.y += (targetY - ref.current.position.y) * 0.08;
  });

  return (
    <group ref={ref} position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => onSelect?.(project)}>
      {/* Base platform */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[2.5, 0.15, 2.5]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      {/* Building body */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[1.8, height, 1.8]} />
        <meshPhysicalMaterial color="#0f172a" roughness={0.2} metalness={0.8}
          emissive={color} emissiveIntensity={hovered ? 0.15 : 0.05} />
      </mesh>
      {/* Glowing windows */}
      {[...Array(4)].map((_, i) => (
        <mesh key={i} position={[(i % 2 === 0 ? -0.5 : 0.5), 0.5 + Math.floor(i / 2) * 0.9, 0.91]}>
          <planeGeometry args={[0.4, 0.4]} />
          <meshBasicMaterial color={color} transparent opacity={hovered ? 0.9 : 0.4} />
        </mesh>
      ))}
      {/* Number label */}
      <Text fontSize={0.22} color={color} anchorX="center" anchorY="bottom" position={[0, height + 0.4, 0]}>
        {`0${index + 1}`}
      </Text>
      <Text fontSize={0.28} color="#F5F7FA" anchorX="center" anchorY="bottom" position={[0, height + 0.1, 0]} maxWidth={3}>
        {project.title}
      </Text>
      {/* Road connector */}
      <mesh position={[0, -0.22, 2]}>
        <boxGeometry args={[0.3, 0.05, 4]} />
        <meshBasicMaterial color="#1d2535" />
      </mesh>
    </group>
  );
}

export default function ProjectWorld({ position = [-20, 0, -100], onProjectSelect }) {
  const projectList = projects || [];
  return (
    <group position={position}>
      {projectList.map((project, i) => (
        <ProjectBuilding
          key={project.id}
          project={project}
          index={i}
          color={BUILDING_COLORS[i % BUILDING_COLORS.length]}
          position={[(i - 1) * 5.5, 0, 0]}
          onSelect={onProjectSelect}
        />
      ))}
    </group>
  );
}
