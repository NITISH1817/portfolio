import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import LandmarkBeacon from '../landmarks/LandmarkBeacon';
import { projects } from '../../../data/portfolio';

interface BrunoZonesProps {
  onEnterZone: (zone: any) => void;
  onLeaveZone: (zoneId: string) => void;
  onSelectProject: (project: any) => void;
  discoveredLandmarks: Record<string, boolean>;
}

export default function BrunoZones({
  onEnterZone,
  onLeaveZone,
  onSelectProject,
  discoveredLandmarks = {}
}: BrunoZonesProps) {
  const isLandmarkDiscovered = (id: string) => Boolean(discoveredLandmarks && discoveredLandmarks[id]);
  return (
    <group>
      {/* =========================================================================
          LOCATION 1: DEVELOPER HOME & BIO PAVILION (SPAWN PLAZA)
      ========================================================================= */}
      <group position={[14, 0, 22]} rotation={[0, -Math.PI / 4, 0]}>
        <LandmarkBeacon
          id="about"
          name="DEVELOPER HOME"
          position={[0, 0, 0]}
          color="#FF9A45"
          radius={7.0}
          onEnter={onEnterZone}
          onLeave={onLeaveZone}
          isDiscovered={isLandmarkDiscovered('about')}
        />

        {/* Physical Kiosk Collider */}
        <RigidBody type="fixed" colliders={false} position={[0, 0, 0]}>
          <CuboidCollider args={[4, 2.5, 0.5]} position={[0, 2.5, -2]} />
        </RigidBody>

        {/* Modern Headquarters Architectural Canopy */}
        <mesh position={[0, 4.5, -2]} castShadow>
          <boxGeometry args={[8.5, 0.4, 3.5]} />
          <meshStandardMaterial color="#1E2333" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Support Pillars */}
        {[-3.8, 3.8].map((x, i) => (
          <mesh key={i} position={[x, 2.2, -2]} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 4.4, 8]} />
            <meshStandardMaterial color="#FF9A45" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}

        {/* Bio Marquee Billboard */}
        <mesh position={[0, 2.4, -1.8]} receiveShadow>
          <boxGeometry args={[7.2, 2.8, 0.2]} />
          <meshStandardMaterial color="#0B0F19" roughness={0.9} />
        </mesh>
        <Text
          position={[0, 3.3, -1.68]}
          fontSize={0.38}
          color="#FF9A45"
          anchorX="center"
          anchorY="middle"
        >
          NITISH PRIYAN R S
        </Text>
        <Text
          position={[0, 2.75, -1.68]}
          fontSize={0.22}
          color="#61A5FF"
          anchorX="center"
          anchorY="middle"
        >
          FULL STACK DEVELOPER • AI / ML ENGINEER
        </Text>
        <Text
          position={[0, 2.1, -1.68]}
          fontSize={0.16}
          color="#CBD5E1"
          maxWidth={6.4}
          lineHeight={1.4}
          anchorX="center"
          anchorY="middle"
        >
          Passionate CSE undergraduate (CGPA 7.79) engineering scalable AI agents,
          full-stack cloud applications, and immersive interactive web experiences.
        </Text>
      </group>

      {/* =========================================================================
          LOCATION 2: SKILL LAB PLAYGROUND (10 INTERACTIVE TECH PILLARS)
      ========================================================================= */}
      <group position={[36, 2.0, 14]}>
        <LandmarkBeacon
          id="skills"
          name="SKILL LAB"
          position={[0, 0, 0]}
          color="#61A5FF"
          radius={8.5}
          onEnter={onEnterZone}
          onLeave={onLeaveZone}
          isDiscovered={isLandmarkDiscovered('skills')}
        />

        {/* 10 Interactive 3D Skill Pillars */}
        {[
          { name: 'Java SE 17', tag: 'Core Backend', color: '#F59E0B', pos: [-5, 0, -4] },
          { name: 'Python', tag: 'AI / Models', color: '#10B981', pos: [-2, 0, -5] },
          { name: 'C / C++', tag: 'Systems & DSA', color: '#3B82F6', pos: [2, 0, -5] },
          { name: 'React.js', tag: 'Modern Frontend', color: '#06B6D4', pos: [5, 0, -4] },
          { name: 'Node.js', tag: 'Event-Driven', color: '#22C55E', pos: [-6, 0, 0] },
          { name: 'FastAPI', tag: 'High-Speed API', color: '#0EA5E9', pos: [6, 0, 0] },
          { name: 'Machine Learning', tag: 'Scikit & XGBoost', color: '#A855F7', pos: [-5, 0, 4] },
          { name: 'Deep Learning', tag: 'PyTorch / CNN', color: '#EC4899', pos: [-2, 0, 5] },
          { name: 'NLP & LLMs', tag: 'Gemini / Vector', color: '#8B5CF6', pos: [2, 0, 5] },
          { name: 'Three.js / WebGL', tag: '3D Graphics', color: '#FF70A6', pos: [5, 0, 4] }
        ].map((skill, idx) => (
          <group key={idx} position={skill.pos as [number, number, number]}>
            <RigidBody type="fixed" colliders={false}>
              <CuboidCollider args={[0.7, 1.2, 0.7]} position={[0, 1.2, 0]} />
            </RigidBody>
            {/* Pedestal Base */}
            <mesh position={[0, 0.6, 0]} castShadow>
              <cylinderGeometry args={[0.55, 0.65, 1.2, 8]} />
              <meshStandardMaterial color="#1E2333" roughness={0.7} />
            </mesh>
            {/* Glowing Crystal Cap */}
            <mesh position={[0, 1.45, 0]} castShadow>
              <octahedronGeometry args={[0.42, 0]} />
              <meshStandardMaterial color={skill.color} emissive={skill.color} emissiveIntensity={2.5} />
            </mesh>
            {/* Skill Name Floating Tag */}
            <Text
              position={[0, 2.1, 0]}
              fontSize={0.24}
              color="#FFFFFF"
              outlineWidth={0.02}
              outlineColor="#0F172A"
              anchorX="center"
              anchorY="middle"
            >
              {skill.name}
            </Text>
          </group>
        ))}
      </group>

      {/* =========================================================================
          LOCATION 3: PROJECT EXHIBITION PLAZA (7+ VERIFIED PAVILIONS)
      ========================================================================= */}
      <group position={[-36, 0, -20]}>
        <LandmarkBeacon
          id="projects"
          name="PROJECT EXHIBITION"
          position={[0, 0, 0]}
          color="#3B82F6"
          radius={12.0}
          onEnter={onEnterZone}
          onLeave={onLeaveZone}
          isDiscovered={isLandmarkDiscovered('projects')}
        />

        {/* Circular Arrangement of Verified Projects */}
        {projects.slice(0, 8).map((proj, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const radius = 13.5;
          const px = Math.cos(angle) * radius;
          const pz = Math.sin(angle) * radius;

          return (
            <group
              key={proj.id}
              position={[px, 0, pz]}
              rotation={[0, -angle + Math.PI / 2, 0]}
            >
              <RigidBody type="fixed" colliders={false}>
                <CuboidCollider args={[2.8, 2.4, 0.4]} position={[0, 2.4, 0]} />
              </RigidBody>

              {/* Pavilion Glass Billboard */}
              <mesh position={[0, 2.4, 0]} receiveShadow castShadow>
                <boxGeometry args={[5.2, 3.6, 0.3]} />
                <meshStandardMaterial color="#0F1424" metalness={0.6} roughness={0.3} />
              </mesh>

              {/* Neon Border Trim */}
              <mesh position={[0, 4.25, 0]}>
                <boxGeometry args={[5.2, 0.1, 0.32]} />
                <meshStandardMaterial color="#61A5FF" emissive="#61A5FF" emissiveIntensity={2.5} />
              </mesh>

              {/* Project Title */}
              <Text
                position={[0, 3.6, 0.18]}
                fontSize={0.32}
                color="#FF9A45"
                anchorX="center"
                anchorY="middle"
              >
                {proj.title.toUpperCase()}
              </Text>

              {/* Category Pill */}
              <Text
                position={[0, 3.15, 0.18]}
                fontSize={0.16}
                color="#A855F7"
                anchorX="center"
                anchorY="middle"
              >
                {proj.category}
              </Text>

              {/* Click / Approach Trigger Plate */}
              <group
                position={[0, 0.1, 1.8]}
                onClick={() => onSelectProject(proj)}
              >
                <mesh receiveShadow>
                  <boxGeometry args={[3.2, 0.15, 1.2]} />
                  <meshStandardMaterial color="#2563EB" emissive="#1D4ED8" emissiveIntensity={1.8} />
                </mesh>
              </group>
            </group>
          );
        })}
      </group>

      {/* =========================================================================
          LOCATION 4: ACHIEVEMENT ARENA (ELEVATED HILL: +2.8m)
      ========================================================================= */}
      <group position={[28, 2.8, -32]}>
        <LandmarkBeacon
          id="experience"
          name="ACHIEVEMENT ARENA"
          position={[0, 0, 0]}
          color="#A855F7"
          radius={8.0}
          onEnter={onEnterZone}
          onLeave={onLeaveZone}
          isDiscovered={isLandmarkDiscovered('experience')}
        />

        {/* Triumphal Archway Pillars */}
        {[-3.5, 3.5].map((x, i) => (
          <group key={i} position={[x, 0, 0]}>
            <RigidBody type="fixed" colliders={false}>
              <CuboidCollider args={[0.5, 2.5, 0.5]} position={[0, 2.5, 0]} />
            </RigidBody>
            <mesh position={[0, 2.5, 0]} castShadow>
              <cylinderGeometry args={[0.45, 0.55, 5.0, 8]} />
              <meshStandardMaterial color="#23283E" metalness={0.7} roughness={0.3} />
            </mesh>
          </group>
        ))}

        {/* Arch Beam */}
        <mesh position={[0, 5.2, 0]} castShadow>
          <boxGeometry args={[8.0, 0.6, 1.0]} />
          <meshStandardMaterial color="#1E2333" metalness={0.7} />
        </mesh>
        <Text
          position={[0, 5.2, 0.52]}
          fontSize={0.36}
          color="#A855F7"
          anchorX="center"
          anchorY="middle"
        >
          HONORS & CREDENTIALS
        </Text>

        {/* Central LeetCode 170+ DSA Milestone Obelisk */}
        <group position={[0, 0, -3]}>
          <RigidBody type="fixed" colliders={false}>
            <CuboidCollider args={[0.8, 1.8, 0.8]} position={[0, 1.8, 0]} />
          </RigidBody>
          <mesh position={[0, 1.8, 0]} castShadow>
            <cylinderGeometry args={[0.6, 0.8, 3.6, 6]} />
            <meshStandardMaterial color="#F59E0B" emissive="#D97706" emissiveIntensity={1.5} />
          </mesh>
          <Text
            position={[0, 3.2, 0.85]}
            fontSize={0.24}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
          >
            170+ LEETCODE DSA
          </Text>
        </group>

        {/* Verified Credential Badges */}
        {[
          { title: 'Oracle Java SE 17', org: 'Oracle Certified Associate', color: '#EF4444', pos: [-4, 0, 3] },
          { title: 'AWS Cloud Practitioner', org: 'Amazon Web Services', color: '#F59E0B', pos: [4, 0, 3] },
          { title: 'SIH 2025 Finalist', org: 'Smart India Hackathon', color: '#10B981', pos: [0, 0, 4] }
        ].map((badge, idx) => (
          <group key={idx} position={badge.pos as [number, number, number]}>
            <mesh position={[0, 1.2, 0]} castShadow>
              <boxGeometry args={[2.2, 2.0, 0.2]} />
              <meshStandardMaterial color="#0B0F19" />
            </mesh>
            <mesh position={[0, 2.25, 0]}>
              <boxGeometry args={[2.2, 0.1, 0.22]} />
              <meshStandardMaterial color={badge.color} emissive={badge.color} emissiveIntensity={2.5} />
            </mesh>
            <Text
              position={[0, 1.2, 0.12]}
              fontSize={0.2}
              color="#FFFFFF"
              anchorX="center"
              anchorY="middle"
            >
              {badge.title}
            </Text>
          </group>
        ))}
      </group>

      {/* =========================================================================
          LOCATION 5: EDUCATION CENTER (BANNARI AMMAN, CGPA 7.79)
      ========================================================================= */}
      <group position={[38, 0, -6]}>
        <LandmarkBeacon
          id="resume"
          name="EDUCATION CENTER"
          position={[0, 0, 0]}
          color="#10B981"
          radius={7.0}
          onEnter={onEnterZone}
          onLeave={onLeaveZone}
          isDiscovered={isLandmarkDiscovered('resume')}
        />

        <RigidBody type="fixed" colliders={false} position={[0, 0, -4]}>
          <CuboidCollider args={[3.5, 2.2, 0.4]} position={[0, 2.2, 0]} />
        </RigidBody>

        <mesh position={[0, 2.2, -4]} receiveShadow castShadow>
          <boxGeometry args={[6.5, 3.2, 0.3]} />
          <meshStandardMaterial color="#0B0F19" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[0, 3.85, -4]}>
          <boxGeometry args={[6.5, 0.1, 0.32]} />
          <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={2.5} />
        </mesh>

        <Text
          position={[0, 3.2, -3.8]}
          fontSize={0.28}
          color="#10B981"
          anchorX="center"
          anchorY="middle"
        >
          BANNARI AMMAN INSTITUTE OF TECHNOLOGY
        </Text>
        <Text
          position={[0, 2.65, -3.8]}
          fontSize={0.2}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          B.E. COMPUTER SCIENCE & ENGINEERING
        </Text>
        <Text
          position={[0, 2.2, -3.8]}
          fontSize={0.24}
          color="#FF9A45"
          anchorX="center"
          anchorY="middle"
        >
          CGPA: 7.79 / 10.0 • EXPECTED MAY 2028
        </Text>
      </group>

      {/* =========================================================================
          LOCATION 6: CONTACT STATION & TRANSMISSION TOWER
      ========================================================================= */}
      <group position={[-32, 0, 36]}>
        <LandmarkBeacon
          id="contact"
          name="CONTACT TRANSMISSION"
          position={[0, 0, 0]}
          color="#EC4899"
          radius={7.5}
          onEnter={onEnterZone}
          onLeave={onLeaveZone}
          isDiscovered={isLandmarkDiscovered('contact')}
        />

        {/* Transmission Tower Lattice Pole */}
        <RigidBody type="fixed" colliders={false} position={[0, 0, -4]}>
          <CuboidCollider args={[0.5, 4.0, 0.5]} position={[0, 4.0, 0]} />
        </RigidBody>
        <mesh position={[0, 4.0, -4]} castShadow>
          <cylinderGeometry args={[0.2, 0.6, 8.0, 6]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Rotating Radar Dish */}
        <group position={[0, 7.8, -4]}>
          <mesh rotation={[0.4, 0, 0]}>
            <sphereGeometry args={[1.2, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
            <meshStandardMaterial color="#EC4899" emissive="#EC4899" emissiveIntensity={1.8} side={THREE.DoubleSide} />
          </mesh>
        </group>

        {/* Interactive Contact Kiosk */}
        <mesh position={[0, 1.5, -2]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 2.4, 0.3]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
        <Text
          position={[0, 2.2, -1.82]}
          fontSize={0.28}
          color="#EC4899"
          anchorX="center"
          anchorY="middle"
        >
          CONNECT WITH NITISH
        </Text>
        <Text
          position={[0, 1.4, -1.82]}
          fontSize={0.2}
          color="#61A5FF"
          anchorX="center"
          anchorY="middle"
        >
          nitishpriyan1807@gmail.com
        </Text>
      </group>
    </group>
  );
}
