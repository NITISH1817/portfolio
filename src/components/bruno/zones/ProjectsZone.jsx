import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { usePhysics } from '../PhysicsContext';
import { projects } from '../../../data/portfolio';
import { carAudio } from '../CarAudio';

export default function ProjectsZone({ onSelectProject, isNight }) {
  const { world, carState } = usePhysics();
  const triggerCooldown = useRef({});

  // Layout positions for the 4 project billboards
  const billboardConfigs = [
    { project: projects[0], pos: [-18, 0, -42], rot: [0, 0.25, 0], color: '#3B82F6' },
    { project: projects[1], pos: [-6, 0, -46], rot: [0, 0.08, 0], color: '#EC4899' },
    { project: projects[2], pos: [6, 0, -46], rot: [0, -0.08, 0], color: '#10B981' },
    { project: projects[3], pos: [18, 0, -42], rot: [0, -0.25, 0], color: '#8B5CF6' }
  ];

  // Static collision bodies for billboard frames
  useEffect(() => {
    const bodies = [];
    billboardConfigs.forEach(({ pos, rot }) => {
      const boardBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        position: new CANNON.Vec3(pos[0], 2.5, pos[1] ? pos[2] : pos[2])
      });
      boardBody.quaternion.setFromEuler(rot[0], rot[1], rot[2]);
      boardBody.addShape(new CANNON.Box(new CANNON.Vec3(4.8, 2.5, 0.5)));
      world.addBody(boardBody);
      bodies.push(boardBody);
    });

    return () => {
      bodies.forEach((b) => world.removeBody(b));
    };
  }, [world]);

  // Check proximity of car to each project pad
  useFrame(() => {
    const carPos = carState.current.position;
    const now = performance.now();

    billboardConfigs.forEach(({ project, pos }) => {
      // Trigger pad is 3.5 units in front of the billboard
      const padX = pos[0];
      const padZ = pos[2] + 4.5;
      const dx = carPos.x - padX;
      const dz = carPos.z - padZ;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < 3.2) {
        if (!triggerCooldown.current[project.id] || now - triggerCooldown.current[project.id] > 2500) {
          triggerCooldown.current[project.id] = now;
          carAudio.playChime();
          onSelectProject(project);
        }
      }
    });
  });

  return (
    <group>
      {/* Zone Title Banner */}
      <group position={[0, 7.5, -34]}>
        <Text
          fontSize={2.2}
          color={isNight ? '#60A5FA' : '#1D4ED8'}
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          FEATURED PROJECTS
        </Text>
        <Text
          position={[0, -1.0, 0]}
          fontSize={0.7}
          color={isNight ? '#94A3B8' : '#64748B'}
          anchorX="center"
          anchorY="middle"
        >
          DRIVE ONTO A PAD OR BUMP TO INSPECT
        </Text>
      </group>

      {/* Billboards */}
      {billboardConfigs.map(({ project, pos, rot, color }) => (
        <BillboardItem
          key={project.id}
          project={project}
          position={pos}
          rotation={rot}
          color={color}
          isNight={isNight}
          onSelect={() => onSelectProject(project)}
        />
      ))}
    </group>
  );
}

function BillboardItem({ project, position, rotation, color, isNight, onSelect }) {
  const padRef = useRef();

  useFrame((state) => {
    if (padRef.current) {
      const t = state.clock.getElapsedTime();
      padRef.current.scale.setScalar(1 + Math.sin(t * 3) * 0.06);
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Billboard Support Legs */}
      <mesh position={[-3.8, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 3]} />
        <meshStandardMaterial color="#475569" metalness={0.7} />
      </mesh>
      <mesh position={[3.8, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 3]} />
        <meshStandardMaterial color="#475569" metalness={0.7} />
      </mesh>

      {/* Main Board Frame */}
      <mesh position={[0, 4.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[9.2, 4.6, 0.4]} />
        <meshStandardMaterial color={isNight ? '#1E293B' : '#0F172A'} roughness={0.3} />
      </mesh>

      {/* Inner Screen Canvas */}
      <mesh position={[0, 4.2, 0.22]}>
        <planeGeometry args={[8.8, 4.2]} />
        <meshStandardMaterial color={isNight ? '#0F172A' : '#1E293B'} roughness={0.2} />
      </mesh>

      {/* Accent Neon Border */}
      <mesh position={[0, 6.35, 0.22]}>
        <planeGeometry args={[8.8, 0.1]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
      </mesh>

      {/* Project Content Text */}
      <Text
        position={[-4.0, 5.8, 0.25]}
        fontSize={0.32}
        color={color}
        anchorX="left"
        anchorY="top"
        fontWeight="bold"
      >
        {`PROJECT ${project.number} • ${project.type}`}
      </Text>

      <Text
        position={[-4.0, 5.1, 0.25]}
        fontSize={0.62}
        color="#FFFFFF"
        anchorX="left"
        anchorY="top"
        fontWeight="bold"
        maxWidth={8.0}
      >
        {project.title}
      </Text>

      <Text
        position={[-4.0, 4.1, 0.25]}
        fontSize={0.32}
        color="#CBD5E1"
        anchorX="left"
        anchorY="top"
        maxWidth={8.0}
        lineHeight={1.3}
      >
        {project.description.length > 110
          ? `${project.description.substring(0, 110)}...`
          : project.description}
      </Text>

      {/* Tech Badges Row */}
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

      {/* Interactive Trigger Pad on the Floor */}
      <group position={[0, 0.03, 4.5]}>
        {/* Outer Pulsing Ring */}
        <mesh ref={padRef} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.5, 2.8, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1.2}
            transparent
            opacity={0.8}
          />
        </mesh>
        {/* Inner Pad Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} onClick={onSelect}>
          <circleGeometry args={[2.4, 32]} />
          <meshStandardMaterial
            color={isNight ? '#1E293B' : '#E2E8F0'}
            roughness={0.4}
            transparent
            opacity={0.6}
          />
        </mesh>
        {/* Pad Instruction */}
        <Text
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.01, 0]}
          fontSize={0.4}
          color={color}
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          DRIVE HERE
        </Text>
      </group>
    </group>
  );
}

