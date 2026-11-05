import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

const GITHUB_URL = 'https://github.com/NITISH1817';

export default function GithubWorld({ position = [20, 0, -300] }) {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    fetch('https://api.github.com/users/NITISH1817/repos?sort=updated&per_page=6')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setRepos(data.slice(0, 6));
      })
      .catch(() => setRepos([]));
  }, []);

  return (
    <group position={position}>
      <Text fontSize={0.5} color="#3B82F6" anchorX="center" anchorY="middle" position={[0, 5, 0]}>
        GITHUB UNIVERSE
      </Text>
      {repos.length === 0 && (
        <Text fontSize={0.25} color="#6B7280" anchorX="center" anchorY="middle" position={[0, 0, 0]}>
          NITISH1817 / Loading...
        </Text>
      )}
      {repos.map((repo, i) => {
        const angle = (i / repos.length) * Math.PI * 2;
        const radius = 4;
        return (
          <RepoCard key={repo.id} repo={repo} index={i}
            position={[Math.cos(angle) * radius, Math.sin(i) * 1.5, Math.sin(angle) * radius]} />
        );
      })}
      {/* Center Hub */}
      <mesh onClick={() => window.open(GITHUB_URL, '_blank')}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshPhysicalMaterial color="#1e40af" emissive="#3B82F6" emissiveIntensity={0.5} roughness={0.1} metalness={0.8} />
      </mesh>
      <Text fontSize={0.2} color="#F5F7FA" anchorX="center" anchorY="middle" position={[0, 1.2, 0]}>
        NITISH1817
      </Text>
    </group>
  );
}

function RepoCard({ repo, position, index }) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 0.5 + index) * 0.3;
  });
  return (
    <group ref={ref} position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => window.open(repo.html_url, '_blank')}>
      <mesh>
        <boxGeometry args={[2.5, 1.2, 0.06]} />
        <meshPhysicalMaterial color="#0f172a" emissive="#3B82F6" emissiveIntensity={hovered ? 0.2 : 0.04} roughness={0.1} metalness={0.9} />
      </mesh>
      <Text fontSize={0.18} color="#F5F7FA" anchorX="center" anchorY="middle" position={[0, 0.25, 0.04]} maxWidth={2.2}>
        {repo.name}
      </Text>
      <Text fontSize={0.13} color="#6B7280" anchorX="center" anchorY="middle" position={[0, -0.1, 0.04]} maxWidth={2.2}>
        {repo.language || 'Code'}  ★{repo.stargazers_count}
      </Text>
    </group>
  );
}
