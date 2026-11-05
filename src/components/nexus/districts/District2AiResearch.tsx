import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';

interface DistrictProps {
  onEnter?: (district: any) => void;
  onLeave?: (id: string) => void;
  onInteract?: (id: string) => void;
}

export default function District2AiResearch({ onEnter, onLeave, onInteract }: DistrictProps) {
  const neuralCoreRef = useRef<THREE.Group>(null);
  const nodesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (neuralCoreRef.current) {
      neuralCoreRef.current.rotation.y = t * 0.6;
    }
    if (nodesRef.current) {
      nodesRef.current.rotation.x = Math.sin(t * 0.5) * 0.15;
    }
  });

  // Neural network nodes layout
  const nodes = React.useMemo(() => [
    { pos: [0, 1.2, 0], color: '#38BDF8' },
    { pos: [-1.4, 0.4, 0.8], color: '#A855F7' },
    { pos: [1.4, 0.4, 0.8], color: '#38BDF8' },
    { pos: [-1.2, -0.6, -0.9], color: '#FF70A6' },
    { pos: [1.2, -0.6, -0.9], color: '#38BDF8' },
    { pos: [0, -1.2, 0.4], color: '#A855F7' }
  ], []);

  return (
    <group position={[-42, 0, 38]}>
      {/* Interactive Trigger Beacon */}
      <mesh
        visible={false}
        onPointerOver={() => onEnter && onEnter({ id: 'ai', name: 'DISTRICT 02 — AI RESEARCH ZONE' })}
        onPointerOut={() => onLeave && onLeave('ai')}
        onClick={() => onInteract && onInteract('skills')}
      >
        <sphereGeometry args={[9.5, 16, 16]} />
      </mesh>

      <RigidBody type="fixed" colliders={false} position={[0, 0, 0]}>
        <CuboidCollider args={[5.0, 5.0, 5.0]} position={[0, 5.0, 0]} />

        {/* Circular Lab Foundation */}
        <mesh position={[0, 0.25, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[8.5, 9.2, 0.5, 16]} />
          <meshStandardMaterial color="#0A0F1E" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Glass Dome Structure */}
        <mesh position={[0, 4.5, 0]} castShadow>
          <cylinderGeometry args={[6.2, 7.8, 8.5, 12]} />
          <meshStandardMaterial
            color="#080D1A"
            roughness={0.15}
            metalness={0.8}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* 4 Corner Coolant Pylons */}
        {[[-5.5, -5.5], [5.5, -5.5], [-5.5, 5.5], [5.5, 5.5]].map(([x, z], i) => (
          <group key={i} position={[x, 0, z]}>
            <mesh position={[0, 3.2, 0]} castShadow>
              <cylinderGeometry args={[0.35, 0.45, 6.4, 8]} />
              <meshStandardMaterial color="#1E293B" metalness={0.8} />
            </mesh>
            <mesh position={[0, 6.6, 0]}>
              <sphereGeometry args={[0.4, 8, 8]} />
              <meshStandardMaterial color="#38BDF8" emissive="#38BDF8" emissiveIntensity={3.0} />
            </mesh>
          </group>
        ))}

        {/* Holographic Neural Network Core Hovering Inside Dome */}
        <Float speed={2.5} rotationIntensity={0.5} floatIntensity={0.8}>
          <group ref={neuralCoreRef} position={[0, 12.5, 0]}>
            {/* Central Vector Hub */}
            <mesh>
              <icosahedronGeometry args={[1.6, 1]} />
              <meshStandardMaterial
                color="#38BDF8"
                emissive="#38BDF8"
                emissiveIntensity={2.2}
                wireframe
              />
            </mesh>

            {/* Pulsing Synapse Nodes */}
            <group ref={nodesRef}>
              {nodes.map((node, i) => (
                <mesh key={i} position={node.pos as [number, number, number]}>
                  <sphereGeometry args={[0.25, 12, 12]} />
                  <meshStandardMaterial
                    color={node.color}
                    emissive={node.color}
                    emissiveIntensity={3.5}
                  />
                </mesh>
              ))}
            </group>
          </group>
        </Float>

        {/* District Signage Banner */}
        <Text
          position={[0, 4.8, 5.8]}
          fontSize={0.55}
          color="#F8FAFC"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          AI RESEARCH ZONE
        </Text>
        <Text
          position={[0, 4.0, 5.8]}
          fontSize={0.28}
          color="#38BDF8"
          anchorX="center"
          anchorY="middle"
        >
          DISTRICT 02 // NEURAL & RAG LABS
        </Text>
      </RigidBody>
    </group>
  );
}

