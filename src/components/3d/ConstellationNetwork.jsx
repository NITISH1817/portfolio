import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { capabilities, projects } from '../../data/portfolio';

export default function ConstellationNetwork() {
  const groupRef = useRef();

  // Generate nodes from unique technologies across all projects and capabilities
  const { nodes, edges } = useMemo(() => {
    const tempNodes = [];
    const tempEdges = [];
    
    const allTechs = new Set();
    capabilities.forEach(c => c.technologies.forEach(t => allTechs.add(t)));
    projects.forEach(p => p.technologies.forEach(t => allTechs.add(t)));
    
    const allSkills = Array.from(allTechs);
    const radius = 5;
    
    // Create node positions
    allSkills.forEach((skill, i) => {
      const phi = Math.acos(-1 + (2 * i) / allSkills.length);
      const theta = Math.sqrt(allSkills.length * Math.PI) * phi;
      
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      
      tempNodes.push({ id: skill, position: [x, y, z] });
    });

    // Create edges based on shared projects or capabilities
    for (let i = 0; i < allSkills.length; i++) {
      for (let j = i + 1; j < allSkills.length; j++) {
        const s1 = allSkills[i];
        const s2 = allSkills[j];
        
        let shareProject = projects.some(p => p.technologies.includes(s1) && p.technologies.includes(s2));
        let shareCapability = capabilities.some(c => c.technologies.includes(s1) && c.technologies.includes(s2));

        if (shareProject || shareCapability) {
          tempEdges.push({ start: tempNodes[i].position, end: tempNodes[j].position });
        }
      }
    }

    return { nodes: tempNodes, edges: tempEdges };
  }, []);

  useFrame(({ clock, mouse }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      groupRef.current.rotation.y = t * 0.1;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, (mouse.y * Math.PI) / 4, 0.05);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, (mouse.x * Math.PI) / 4, 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Edges */}
      {edges.map((edge, i) => (
        <line key={`e-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([...edge.start, ...edge.end])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#1A2FFB" transparent opacity={0.2} />
        </line>
      ))}

      {/* Nodes */}
      {nodes.map((node) => (
        <group key={node.id} position={node.position}>
          <mesh>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <Text
            position={[0, 0.3, 0]}
            fontSize={0.2}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {node.id}
          </Text>
        </group>
      ))}
    </group>
  );
}
