import React from 'react';
import { Text } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import LandmarkBeacon from './LandmarkBeacon';
import { projects } from '../../../data/portfolio';

export default function LandmarkProjects({
  onEnter,
  onLeave,
  onSelectProject,
  isDiscovered,
  isNight
}) {
  const billboardData = [
    { project: projects[0], pos: [-24, 0, -40], rot: [0, 0.35, 0], color: '#3B82F6' },
    { project: projects[1], pos: [-12, 0, -46], rot: [0, 0.15, 0], color: '#10B981' },
    { project: projects[2], pos: [0, 0, -48], rot: [0, 0, 0], color: '#F59E0B' },
    { project: projects[3], pos: [12, 0, -46], rot: [0, -0.15, 0], color: '#EC4899' },
    { project: projects[4], pos: [24, 0, -40], rot: [0, -0.35, 0], color: '#8B5CF6' }
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

      {/* Billboards with Static Rapier Colliders */}
      {billboardData.map(({ project, pos, rot, color }) => (
        <RigidBody key={project.id} type="fixed" colliders={false} position={pos} rotation={rot}>
          <CuboidCollider args={[4.8, 2.5, 0.4]} position={[0, 2.5, 0]} />
          <ProjectBillboard
            project={project}
            color={color}
            isNight={isNight}
            onSelect={() => onSelectProject(project)}
          />
        </RigidBody>
      ))}
    </group>
  );
}

function ProjectBillboard({ project, color, isNight, onSelect }) {
  return (
    <group onClick={onSelect}>
      {/* Legs */}
      <mesh position={[-3.8, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 3]} />
        <meshStandardMaterial color="#475569" metalness={0.7} />
      </mesh>
      <mesh position={[3.8, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 3]} />
        <meshStandardMaterial color="#475569" metalness={0.7} />
      </mesh>

      {/* Frame */}
      <mesh position={[0, 4.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[9.2, 4.6, 0.4]} />
        <meshStandardMaterial color={isNight ? '#1E293B' : '#0F172A'} roughness={0.3} />
      </mesh>

      {/* Screen Canvas */}
      <mesh position={[0, 4.2, 0.22]}>
        <planeGeometry args={[8.8, 4.2]} />
        <meshStandardMaterial color={isNight ? '#0F172A' : '#1E293B'} roughness={0.2} />
      </mesh>

      {/* Glowing Neon Trim */}
      <mesh position={[0, 6.35, 0.22]}>
        <planeGeometry args={[8.8, 0.1]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
      </mesh>

      {/* Project Metadata */}
      <Text
        position={[-4.0, 5.8, 0.25]}
        fontSize={0.28}
        color={color}
        anchorX="left"
        anchorY="top"
        fontWeight="bold"
      >
        {`PROJECT ${project.number} • ${project.type}`}
      </Text>

      <Text
        position={[-4.0, 5.2, 0.25]}
        fontSize={0.52}
        color="#FFFFFF"
        anchorX="left"
        anchorY="top"
        fontWeight="bold"
        maxWidth={8.0}
      >
        {project.title}
      </Text>

      <Text
        position={[-4.0, 4.2, 0.25]}
        fontSize={0.3}
        color="#CBD5E1"
        anchorX="left"
        anchorY="top"
        maxWidth={8.0}
        lineHeight={1.3}
      >
        {project.description.length > 115
          ? `${project.description.substring(0, 115)}...`
          : project.description}
      </Text>

      {/* Tech Badges */}
      <group position={[-4.0, 2.7, 0.25]}>
        {project.technologies.slice(0, 4).map((tech, i) => (
          <group key={tech} position={[i * 2.1, 0, 0]}>
            <mesh position={[0.9, 0, 0]}>
              <planeGeometry args={[1.9, 0.4]} />
              <meshStandardMaterial color="#334155" />
            </mesh>
            <Text
              position={[0.9, 0, 0.01]}
              fontSize={0.2}
              color="#F8FAFC"
              anchorX="center"
              anchorY="middle"
              fontWeight="600"
            >
              {tech}
            </Text>
          </group>
        ))}
      </group>

      {/* Floor Trigger Pad */}
      <group position={[0, 0.03, 4.5]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2.2, 32]} />
          <meshStandardMaterial color={color} transparent opacity={0.4} />
        </mesh>
        <Text
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.01, 0]}
          fontSize={0.36}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          DRIVE / CLICK TO VIEW
        </Text>
      </group>
    </group>
  );
}
