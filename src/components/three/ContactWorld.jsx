import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { profile } from '../../data/profile';

const CONTACT_NODES = [
  { label: 'EMAIL',    icon: '✉', href: `mailto:${profile.contact.email}`,         color: '#3B82F6', pos: [-3, 2, 0] },
  { label: 'PHONE',    icon: '📞', href: `tel:${profile.contact.phone}`,             color: '#10B981', pos: [3, 2, 0] },
  { label: 'LINKEDIN', icon: '💼', href: profile.contact.linkedin,                   color: '#8B5CF6', pos: [-3, -2, 0] },
  { label: 'GITHUB',   icon: '⬡', href: profile.contact.github,                     color: '#F59E0B', pos: [3, -2, 0] },
];

function ContactNode({ label, href, color, pos }) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = pos[1] + Math.sin(clock.getElapsedTime() * 0.7 + pos[0]) * 0.3;
    const s = hovered ? 1.3 : 1;
    ref.current.scale.setScalar(ref.current.scale.x + (s - ref.current.scale.x) * 0.1);
  });
  return (
    <group ref={ref} position={pos}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => window.location.href = href}>
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.8 : 0.3} roughness={0.1} metalness={0.6} />
      </mesh>
      <Text fontSize={0.22} color="#F5F7FA" anchorX="center" anchorY="bottom" position={[0, 0.7, 0]}>{label}</Text>
    </group>
  );
}

export default function ContactWorld({ position = [0, 0, -340] }) {
  return (
    <group position={position}>
      {/* Center hub */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial color="#1e40af" emissive="#3B82F6" emissiveIntensity={0.5} roughness={0.1} metalness={0.8} />
      </mesh>
      <Text fontSize={0.4} color="#F5F7FA" anchorX="center" anchorY="middle" position={[0, 1.8, 0]}>NITISH.DEV</Text>
      <Text fontSize={0.22} color="#6B7280" anchorX="center" anchorY="middle" position={[0, -1.6, 0]}>CONTACT STATION</Text>
      {CONTACT_NODES.map(node => <ContactNode key={node.label} {...node} />)}
      {/* Connection lines to center */}
      {CONTACT_NODES.map(node => (
        <line key={node.label + '-line'}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position"
              args={[new Float32Array([0,0,0, ...node.pos]), 3]} />
          </bufferGeometry>
          <lineBasicMaterial color={node.color} transparent opacity={0.3} />
        </line>
      ))}
    </group>
  );
}
