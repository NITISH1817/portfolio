import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 1. SETU: Interconnected Nodes
function SetuWorld() {
  const pointsRef = useRef();
  const linesRef = useRef();
  
  const { positions, linePositions } = useMemo(() => {
    const pCount = 50;
    const pos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 10;
    }
    
    // Connect some nodes
    const lPos = [];
    for (let i = 0; i < pCount; i++) {
      for (let j = i + 1; j < pCount; j++) {
        const dist = Math.hypot(
          pos[i*3] - pos[j*3],
          pos[i*3+1] - pos[j*3+1],
          pos[i*3+2] - pos[j*3+2]
        );
        if (dist < 3.5) {
          lPos.push(pos[i*3], pos[i*3+1], pos[i*3+2]);
          lPos.push(pos[j*3], pos[j*3+1], pos[j*3+2]);
        }
      }
    }
    return { positions: pos, linePositions: new Float32Array(lPos) };
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) pointsRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    if (linesRef.current) linesRef.current.rotation.y = clock.getElapsedTime() * 0.1;
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.1} color="#1A2FFB" transparent opacity={0.8} />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={linePositions.length / 3} array={linePositions} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#000000" transparent opacity={0.3} />
      </lineSegments>
    </group>
  );
}

// 2. Diabetic Retinopathy: Neural Network / Point Cloud Scanning
function DRWorld() {
  const pointsRef = useRef();
  const scanlineRef = useRef();
  
  const positions = useMemo(() => {
    const pCount = 1000;
    const pos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.x = t * 0.05;
      pointsRef.current.rotation.y = t * 0.1;
    }
    if (scanlineRef.current) {
      scanlineRef.current.position.y = Math.sin(t * 2) * 4;
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#1A2FFB" transparent opacity={0.6} />
      </points>
      <mesh ref={scanlineRef} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial color="#1A2FFB" transparent opacity={0.2} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

// 3. Student Performance: Data Stream
function SPWorld() {
  const groupRef = useRef();
  const cubes = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 50; i++) {
      temp.push({
        position: [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10],
        scale: Math.random() * 0.5 + 0.1,
        speed: Math.random() * 2 + 1
      });
    }
    return temp;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        child.position.y += 0.01 * cubes[i].speed;
        if (child.position.y > 5) child.position.y = -5;
        child.rotation.x = t * 0.5;
        child.rotation.y = t * 0.5;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {cubes.map((c, i) => (
        <mesh key={i} position={c.position} scale={c.scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color={i % 3 === 0 ? "#1A2FFB" : "#000000"} wireframe transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

// 4. Project Zero: Self-Organizing Particles
function ZeroWorld() {
  const pointsRef = useRef();
  
  const pCount = 2000;
  const positions = useMemo(() => new Float32Array(pCount * 3).map(() => (Math.random() - 0.5) * 10), []);
  const targetPositions = useMemo(() => {
    const t = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const radius = 3 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      t[i*3] = radius * Math.sin(phi) * Math.cos(theta);
      t[i*3+1] = radius * Math.sin(phi) * Math.sin(theta);
      t[i*3+2] = radius * Math.cos(phi);
    }
    return t;
  }, []);

  useFrame(() => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position.array;
    for (let i = 0; i < pos.length; i++) {
      pos[i] += (targetPositions[i] - pos[i]) * 0.02;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y += 0.005;
    pointsRef.current.rotation.z += 0.002;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={pCount} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#1A2FFB" transparent opacity={0.8} />
    </points>
  );
}

export default function ProjectWorlds({ activeProject }) {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.lerp(new THREE.Vector3(0, 0, 0), 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      {activeProject === 1 && <SetuWorld />}
      {activeProject === 2 && <DRWorld />}
      {activeProject === 3 && <SPWorld />}
      {activeProject === 4 && <ZeroWorld />}
    </group>
  );
}
