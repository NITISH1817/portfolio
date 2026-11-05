import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { skills as skillsData } from '../../data/skills';

const SKILL_GROUPS = Object.entries(skillsData || {
  'LANGUAGES': ['Java','Python','C','C++','SQL'],
  'AI/ML': ['Scikit-learn','PyTorch','XGBoost','MLflow'],
  'FRAMEWORKS': ['FastAPI','React','Next.js','Docker'],
  'DATABASES': ['MySQL','SQLite','ChromaDB'],
  'TOOLS': ['Git','GitHub','Docker','CI/CD'],
  'CORE CS': ['DSA','OOP','DBMS','MLOps'],
});

const GROUP_COLORS = ['#3B82F6','#8B5CF6','#10B981','#F59E0B','#EF4444','#EC4899'];

function SkillNode({ skill, position, color, onClick }) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.y = position[1] + Math.sin(t * 0.8 + position[0]) * 0.3;
    const scale = hovered ? 1.4 : 1;
    ref.current.scale.lerp(new (require('three').Vector3)(scale, scale, scale), 0.1);
  });

  return (
    <group ref={ref} position={position} onClick={onClick}
      onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.8 : 0.3} roughness={0.1} metalness={0.6} />
      </mesh>
      <Text fontSize={0.18} color={hovered ? '#fff' : '#9CA3AF'} anchorX="center" anchorY="bottom" position={[0, 0.28, 0]}>
        {skill}
      </Text>
    </group>
  );
}

export default function SkillWorld({ position = [20, 0, -60], onSkillClick }) {
  const nodes = [];
  SKILL_GROUPS.forEach(([group, skills], gi) => {
    const groupAngle = (gi / SKILL_GROUPS.length) * Math.PI * 2;
    const groupRadius = 4;
    skills.forEach((skill, si) => {
      const skillAngle = (si / skills.length) * Math.PI * 2;
      nodes.push({
        skill,
        position: [
          Math.cos(groupAngle) * groupRadius + Math.cos(skillAngle) * 1.5,
          Math.sin(skillAngle) * 1.2,
          Math.sin(groupAngle) * groupRadius + Math.sin(skillAngle) * 1.5,
        ],
        color: GROUP_COLORS[gi],
      });
    });
  });

  return (
    <group position={position}>
      {/* Center */}
      <mesh>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshPhysicalMaterial color="#1e40af" emissive="#3B82F6" emissiveIntensity={0.5} roughness={0.1} metalness={0.8} />
      </mesh>
      <Text fontSize={0.35} color="#F5F7FA" anchorX="center" anchorY="middle" position={[0, 1.2, 0]}>TECH STACK</Text>
      {nodes.map(n => (
        <SkillNode key={n.skill} {...n} onClick={() => onSkillClick?.(n.skill)} />
      ))}
    </group>
  );
}
