import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function DeveloperAvatar3D({ mouseTracking = true }: { mouseTracking?: boolean }) {
  const avatarRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const chestRef = useRef<THREE.Group>(null);
  const hologramRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // 1. Natural idle breathing
    if (avatarRef.current) {
      avatarRef.current.position.y = Math.sin(t * 1.6) * 0.035;
    }
    if (chestRef.current) {
      chestRef.current.scale.set(
        1 + Math.sin(t * 1.6) * 0.015,
        1 + Math.sin(t * 1.6) * 0.02,
        1 + Math.sin(t * 1.6) * 0.025
      );
    }

    // 2. Head tracking mouse cursor smoothly
    if (headRef.current && mouseTracking) {
      const targetRotY = state.pointer.x * 0.45;
      const targetRotX = -state.pointer.y * 0.35;
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRotY, delta * 3.5);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRotX, delta * 3.5);
    }

    // 3. Subtle arm & hand gesturing
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = -0.55 + Math.sin(t * 2) * 0.04;
      rightArmRef.current.rotation.z = 0.2 + Math.cos(t * 1.5) * 0.03;
    }
    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = -0.45 + Math.cos(t * 1.8) * 0.03;
    }

    // 4. Levitating Hologram & Rotating Cyber Rings
    if (hologramRef.current) {
      hologramRef.current.position.y = 1.08 + Math.sin(t * 2.2) * 0.045;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.8;
      ring1Ref.current.rotation.x += delta * 0.3;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.6;
      ring2Ref.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group position={[0, -1.05, 0]}>
      {/* Root Avatar Body */}
      <group ref={avatarRef}>
        
        {/* ===================== HEAD & FACE ===================== */}
        <group ref={headRef} position={[0, 1.48, 0]}>
          {/* Head Cranium */}
          <mesh castShadow receiveShadow position={[0, 0, 0]}>
            <boxGeometry args={[0.34, 0.4, 0.34]} />
            <meshStandardMaterial color="#F2C29E" roughness={0.6} />
          </mesh>

          {/* Low-Poly Styled Hair */}
          <group position={[0, 0.14, -0.02]}>
            {/* Top Hair Volume */}
            <mesh castShadow>
              <boxGeometry args={[0.38, 0.2, 0.38]} />
              <meshStandardMaterial color="#191526" roughness={0.8} />
            </mesh>
            {/* Front Fringe / Quiff */}
            <mesh castShadow position={[0, 0.07, 0.16]} rotation={[0.2, 0, 0]}>
              <boxGeometry args={[0.36, 0.12, 0.12]} />
              <meshStandardMaterial color="#211C33" roughness={0.7} />
            </mesh>
            {/* Back Hair Fade */}
            <mesh castShadow position={[0, -0.1, -0.16]}>
              <boxGeometry args={[0.36, 0.18, 0.1]} />
              <meshStandardMaterial color="#161221" roughness={0.9} />
            </mesh>
          </group>

          {/* Futuristic Developer Smart Glasses */}
          <group position={[0, 0.02, 0.18]}>
            {/* Left Frame */}
            <mesh position={[-0.09, 0, 0]}>
              <boxGeometry args={[0.13, 0.08, 0.02]} />
              <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={0.6} roughness={0.2} />
            </mesh>
            {/* Right Frame */}
            <mesh position={[0.09, 0, 0]}>
              <boxGeometry args={[0.13, 0.08, 0.02]} />
              <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={0.6} roughness={0.2} />
            </mesh>
            {/* Bridge */}
            <mesh position={[0, 0.01, 0]}>
              <boxGeometry args={[0.06, 0.02, 0.02]} />
              <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={0.8} />
            </mesh>
            {/* Glowing Lenses */}
            <mesh position={[-0.09, 0, 0.005]}>
              <planeGeometry args={[0.11, 0.06]} />
              <meshBasicMaterial color="#00E5FF" transparent opacity={0.4} />
            </mesh>
            <mesh position={[0.09, 0, 0.005]}>
              <planeGeometry args={[0.11, 0.06]} />
              <meshBasicMaterial color="#00E5FF" transparent opacity={0.4} />
            </mesh>
          </group>

          {/* Over-Ear Wireless Developer Headphones (Resting on neck/shoulders) */}
          <group position={[0, -0.22, 0]}>
            {/* Headphone Arch */}
            <mesh rotation={[Math.PI * 0.5, 0, 0]}>
              <torusGeometry args={[0.26, 0.03, 8, 24, Math.PI]} />
              <meshStandardMaterial color="#2D2742" roughness={0.4} metalness={0.7} />
            </mesh>
            {/* Left Earcup */}
            <mesh position={[-0.26, 0.03, 0]} rotation={[0, 0, Math.PI * 0.5]}>
              <cylinderGeometry args={[0.07, 0.07, 0.06, 16]} />
              <meshStandardMaterial color="#1F1A30" roughness={0.3} metalness={0.8} />
            </mesh>
            <mesh position={[-0.295, 0.03, 0]} rotation={[0, 0, Math.PI * 0.5]}>
              <ringGeometry args={[0.03, 0.055, 16]} />
              <meshBasicMaterial color="#8B5CF6" />
            </mesh>
            {/* Right Earcup */}
            <mesh position={[0.26, 0.03, 0]} rotation={[0, 0, Math.PI * 0.5]}>
              <cylinderGeometry args={[0.07, 0.07, 0.06, 16]} />
              <meshStandardMaterial color="#1F1A30" roughness={0.3} metalness={0.8} />
            </mesh>
            <mesh position={[0.295, 0.03, 0]} rotation={[0, 0, Math.PI * 0.5]}>
              <ringGeometry args={[0.03, 0.055, 16]} />
              <meshBasicMaterial color="#00F0FF" />
            </mesh>
          </group>
        </group>

        {/* Neck */}
        <mesh position={[0, 1.25, 0]}>
          <cylinderGeometry args={[0.09, 0.1, 0.12, 12]} />
          <meshStandardMaterial color="#E8AF8A" roughness={0.6} />
        </mesh>

        {/* ===================== TORSO & HOODIE ===================== */}
        <group ref={chestRef} position={[0, 0.95, 0]}>
          {/* Main Hoodie Body */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.54, 0.55, 0.32]} />
            <meshStandardMaterial color="#161324" roughness={0.75} />
          </mesh>

          {/* Hoodie Front Zipper Accent (Cyan Neon) */}
          <mesh position={[0, 0.02, 0.165]}>
            <boxGeometry args={[0.02, 0.52, 0.01]} />
            <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={0.6} />
          </mesh>

          {/* Amber Accent Stripes */}
          <mesh position={[-0.25, 0.02, 0.08]}>
            <boxGeometry args={[0.025, 0.45, 0.18]} />
            <meshStandardMaterial color="#FF7A29" roughness={0.5} />
          </mesh>
          <mesh position={[0.25, 0.02, 0.08]}>
            <boxGeometry args={[0.025, 0.45, 0.18]} />
            <meshStandardMaterial color="#FF7A29" roughness={0.5} />
          </mesh>

          {/* Developer Badge / Logo on Left Chest */}
          <mesh position={[-0.14, 0.14, 0.165]}>
            <planeGeometry args={[0.08, 0.05]} />
            <meshBasicMaterial color="#00F0FF" />
          </mesh>

          {/* Folded Hood on Upper Back */}
          <mesh position={[0, 0.22, -0.16]} rotation={[0.4, 0, 0]}>
            <boxGeometry args={[0.42, 0.18, 0.14]} />
            <meshStandardMaterial color="#1E1933" roughness={0.8} />
          </mesh>
        </group>

        {/* ===================== ARMS & HANDS ===================== */}
        {/* Left Arm (Relaxed forward holding side of tablet) */}
        <group ref={leftArmRef} position={[-0.32, 1.15, 0]}>
          {/* Upper Arm */}
          <mesh castShadow position={[0, -0.18, 0.05]} rotation={[0.4, 0, 0.15]}>
            <capsuleGeometry args={[0.07, 0.24, 8, 12]} />
            <meshStandardMaterial color="#161324" roughness={0.75} />
          </mesh>
          {/* Forearm */}
          <mesh castShadow position={[0.05, -0.38, 0.2]} rotation={[0.85, 0, -0.2]}>
            <capsuleGeometry args={[0.065, 0.22, 8, 12]} />
            <meshStandardMaterial color="#1B172C" roughness={0.7} />
          </mesh>
          {/* Left Hand */}
          <mesh position={[0.08, -0.48, 0.32]}>
            <boxGeometry args={[0.07, 0.09, 0.04]} />
            <meshStandardMaterial color="#F2C29E" roughness={0.6} />
          </mesh>
        </group>

        {/* Right Arm (Gesturing towards floating holographic display) */}
        <group ref={rightArmRef} position={[0.32, 1.15, 0]}>
          {/* Upper Arm */}
          <mesh castShadow position={[0, -0.18, 0.05]} rotation={[0.45, 0, -0.15]}>
            <capsuleGeometry args={[0.07, 0.24, 8, 12]} />
            <meshStandardMaterial color="#161324" roughness={0.75} />
          </mesh>
          {/* Forearm */}
          <mesh castShadow position={[-0.05, -0.36, 0.24]} rotation={[1.05, 0, 0.25]}>
            <capsuleGeometry args={[0.065, 0.22, 8, 12]} />
            <meshStandardMaterial color="#1B172C" roughness={0.7} />
          </mesh>
          {/* Right Hand */}
          <mesh position={[-0.08, -0.44, 0.38]}>
            <boxGeometry args={[0.07, 0.09, 0.04]} />
            <meshStandardMaterial color="#F2C29E" roughness={0.6} />
          </mesh>
        </group>

        {/* ===================== LEGS & SNEAKERS ===================== */}
        {/* Tech Pants / Joggers */}
        <group position={[0, 0.45, 0]}>
          {/* Left Leg */}
          <mesh castShadow receiveShadow position={[-0.14, -0.25, 0]}>
            <capsuleGeometry args={[0.09, 0.42, 8, 12]} />
            <meshStandardMaterial color="#1E192E" roughness={0.8} />
          </mesh>
          {/* Right Leg */}
          <mesh castShadow receiveShadow position={[0.14, -0.25, 0]}>
            <capsuleGeometry args={[0.09, 0.42, 8, 12]} />
            <meshStandardMaterial color="#1E192E" roughness={0.8} />
          </mesh>
        </group>

        {/* Modern Designer Sneakers */}
        {/* Left Sneaker */}
        <group position={[-0.14, 0.08, 0.04]}>
          {/* Sneaker Sole */}
          <mesh position={[0, -0.04, 0.03]}>
            <boxGeometry args={[0.14, 0.05, 0.26]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>
          {/* Neon Sole Trim */}
          <mesh position={[0, -0.055, 0.03]}>
            <boxGeometry args={[0.145, 0.015, 0.265]} />
            <meshBasicMaterial color="#00F0FF" />
          </mesh>
          {/* Upper Body */}
          <mesh position={[0, 0.02, 0.02]}>
            <boxGeometry args={[0.13, 0.08, 0.22]} />
            <meshStandardMaterial color="#1A1629" roughness={0.6} />
          </mesh>
        </group>

        {/* Right Sneaker */}
        <group position={[0.14, 0.08, 0.04]}>
          {/* Sneaker Sole */}
          <mesh position={[0, -0.04, 0.03]}>
            <boxGeometry args={[0.14, 0.05, 0.26]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>
          {/* Neon Sole Trim */}
          <mesh position={[0, -0.055, 0.03]}>
            <boxGeometry args={[0.145, 0.015, 0.265]} />
            <meshBasicMaterial color="#00F0FF" />
          </mesh>
          {/* Upper Body */}
          <mesh position={[0, 0.02, 0.02]}>
            <boxGeometry args={[0.13, 0.08, 0.22]} />
            <meshStandardMaterial color="#1A1629" roughness={0.6} />
          </mesh>
        </group>

        {/* ===================== FLOATING HOLOGRAPHIC TECH TERMINAL ===================== */}
        <group ref={hologramRef} position={[0, 1.08, 0.38]}>
          {/* Hologram Glass Screen */}
          <mesh rotation={[-0.25, 0, 0]}>
            <planeGeometry args={[0.48, 0.3]} />
            <meshStandardMaterial
              color="#00E5FF"
              emissive="#0077B6"
              emissiveIntensity={0.6}
              transparent
              opacity={0.55}
              roughness={0.1}
              metalness={0.8}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Cyan Glowing Border Frame */}
          <mesh rotation={[-0.25, 0, 0]}>
            <ringGeometry args={[0.26, 0.27, 4]} />
            <meshBasicMaterial color="#00F0FF" wireframe />
          </mesh>

          {/* Simulated Code Lines */}
          <group position={[0, 0, 0.01]} rotation={[-0.25, 0, 0]}>
            <mesh position={[-0.08, 0.09, 0]}>
              <planeGeometry args={[0.24, 0.018]} />
              <meshBasicMaterial color="#38BDF8" />
            </mesh>
            <mesh position={[0.02, 0.05, 0]}>
              <planeGeometry args={[0.34, 0.016]} />
              <meshBasicMaterial color="#A855F7" />
            </mesh>
            <mesh position={[-0.04, 0.01, 0]}>
              <planeGeometry args={[0.28, 0.016]} />
              <meshBasicMaterial color="#34D399" />
            </mesh>
            <mesh position={[0.05, -0.03, 0]}>
              <planeGeometry args={[0.22, 0.016]} />
              <meshBasicMaterial color="#F59E0B" />
            </mesh>
            <mesh position={[-0.06, -0.07, 0]}>
              <planeGeometry args={[0.26, 0.016]} />
              <meshBasicMaterial color="#38BDF8" />
            </mesh>
          </group>

          {/* Rotating Cyber Ring 1 */}
          <mesh ref={ring1Ref} position={[0, 0, 0]}>
            <torusGeometry args={[0.34, 0.008, 8, 32]} />
            <meshBasicMaterial color="#00F0FF" transparent opacity={0.6} />
          </mesh>

          {/* Rotating Cyber Ring 2 */}
          <mesh ref={ring2Ref} position={[0, 0, 0]}>
            <torusGeometry args={[0.38, 0.006, 8, 32]} />
            <meshBasicMaterial color="#A855F7" transparent opacity={0.5} />
          </mesh>
        </group>

      </group>

      {/* ===================== FUTURISTIC CYBER PEDESTAL ===================== */}
      <group position={[0, 0, 0]}>
        {/* Main Base */}
        <mesh receiveShadow position={[0, 0.015, 0]}>
          <cylinderGeometry args={[0.65, 0.72, 0.05, 32]} />
          <meshStandardMaterial color="#0C0A17" roughness={0.5} metalness={0.7} />
        </mesh>
        {/* Outer Glowing Neon Ring */}
        <mesh position={[0, 0.042, 0]} rotation={[-Math.PI * 0.5, 0, 0]}>
          <ringGeometry args={[0.62, 0.65, 32]} />
          <meshBasicMaterial color="#00F0FF" />
        </mesh>
        {/* Inner Glowing Ring */}
        <mesh position={[0, 0.043, 0]} rotation={[-Math.PI * 0.5, 0, 0]}>
          <ringGeometry args={[0.42, 0.44, 32]} />
          <meshBasicMaterial color="#FF7A29" />
        </mesh>
        {/* Center Grid Core */}
        <mesh position={[0, 0.044, 0]} rotation={[-Math.PI * 0.5, 0, 0]}>
          <circleGeometry args={[0.24, 16]} />
          <meshBasicMaterial color="#1E1838" wireframe />
        </mesh>
      </group>
    </group>
  );
}
