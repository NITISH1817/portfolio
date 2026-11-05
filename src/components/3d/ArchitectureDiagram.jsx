import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// Procedural Flowchart Node
function ArchNode({ position, label }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[2, 1, 0.2]} />
        <meshBasicMaterial color="#000000" wireframe transparent opacity={0.8} />
      </mesh>
      <Text
        position={[0, 0, 0.15]}
        fontSize={0.2}
        color="#ffffff"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

// Procedural Connection Line
function ArchEdge({ start, end }) {
  const points = useMemo(() => [new THREE.Vector3(...start), new THREE.Vector3(...end)], [start, end]);
  const lineGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial color="#1A2FFB" transparent opacity={0.6} />
    </line>
  );
}

export default function ArchitectureDiagram({ activeProject }) {
  const groupRef = useRef();

  useFrame(({ clock, mouse }) => {
    if (groupRef.current) {
      // Gentle floating and mouse parallax
      const t = clock.getElapsedTime();
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.2;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, (mouse.y * Math.PI) / 10, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, (mouse.x * Math.PI) / 10, 0.05);
    }
  });

  // Example architectures based on active project
  let nodes = [];
  let edges = [];

  if (activeProject === 1) {
    // SETU
    nodes = [
      { id: 1, pos: [0, 2, 0], label: "API Gateway" },
      { id: 2, pos: [-2, 0, 0], label: "Auth Service" },
      { id: 3, pos: [2, 0, 0], label: "Integration Bus" },
      { id: 4, pos: [0, -2, 0], label: "Core Database" }
    ];
    edges = [
      { start: [0, 1.5, 0], end: [-2, 0.5, 0] },
      { start: [0, 1.5, 0], end: [2, 0.5, 0] },
      { start: [-2, -0.5, 0], end: [0, -1.5, 0] },
      { start: [2, -0.5, 0], end: [0, -1.5, 0] },
    ];
  } else if (activeProject === 2) {
    // Diabetic Retinopathy
    nodes = [
      { id: 1, pos: [-3, 0, 0], label: "Input Images" },
      { id: 2, pos: [0, 0, 0], label: "ResNet-50 Classifier" },
      { id: 3, pos: [3, 0, 0], label: "Severity Prediction" }
    ];
    edges = [
      { start: [-2, 0, 0], end: [-1, 0, 0] },
      { start: [1, 0, 0], end: [2, 0, 0] },
    ];
  } else {
    // Default abstract arch
    nodes = [
      { id: 1, pos: [0, 1.5, 0], label: "Client" },
      { id: 2, pos: [0, 0, 0], label: "Server" },
      { id: 3, pos: [0, -1.5, 0], label: "Database" }
    ];
    edges = [
      { start: [0, 1, 0], end: [0, 0.5, 0] },
      { start: [0, -0.5, 0], end: [0, -1, 0] },
    ];
  }

  return (
    <group ref={groupRef}>
      {nodes.map(n => <ArchNode key={n.id} position={n.pos} label={n.label} />)}
      {edges.map((e, i) => <ArchEdge key={i} start={e.start} end={e.end} />)}
    </group>
  );
}
