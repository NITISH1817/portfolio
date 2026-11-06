import React from 'react';
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
          ZONE 1: DEVELOPER HOME & PROFILE (SPAWN PLAZA: [0, 0, 16])
      ========================================================================= */}
      <group position={[0, 0, 18]}>
        <LandmarkBeacon
          id="about"
          name="DEVELOPER HOME"
          position={[0, 0, 0]}
          color="#EA580C"
          radius={7.0}
          onEnter={onEnterZone}
          onLeave={onLeaveZone}
          isDiscovered={isLandmarkDiscovered('about')}
        />

        {/* Physical Billboard Collider */}
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[4.2, 2.2, 0.4]} position={[0, 2.2, -3.2]} />
        </RigidBody>

        {/* Clean Low-Poly Wooden Billboard Stand */}
        <mesh position={[0, 2.4, -3.2]} castShadow receiveShadow>
          <boxGeometry args={[7.8, 2.8, 0.22]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
        {/* Warm Orange Border Frame */}
        <mesh position={[0, 2.4, -3.15]}>
          <boxGeometry args={[7.95, 2.95, 0.1]} />
          <meshStandardMaterial color="#EA580C" roughness={0.6} />
        </mesh>
        {/* Support Timber Posts */}
        {[-3.6, 3.6].map((x, i) => (
          <mesh key={i} position={[x, 1.3, -3.2]} castShadow>
            <cylinderGeometry args={[0.16, 0.18, 2.6, 8]} />
            <meshStandardMaterial color="#78543E" roughness={0.9} />
          </mesh>
        ))}

        {/* Billboard Text Content */}
        <Text
          position={[0, 3.2, -3.05]}
          fontSize={0.42}
          color="#1E293B"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          NITISH PRIYAN R S
        </Text>
        <Text
          position={[0, 2.65, -3.05]}
          fontSize={0.24}
          color="#EA580C"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          FULL STACK DEVELOPER • AI / ML ENGINEER
        </Text>
        <Text
          position={[0, 2.05, -3.05]}
          fontSize={0.17}
          color="#475569"
          maxWidth={7.0}
          lineHeight={1.4}
          anchorX="center"
          anchorY="middle"
        >
          B.E. Computer Science & Engineering • CGPA 7.8 (Batch 2024-2028)
          Specializing in Scalable Full-Stack Cloud Apps & Production AI/ML Pipelines.
        </Text>
        <Text
          position={[0, 1.45, -3.05]}
          fontSize={0.15}
          color="#64748B"
          anchorX="center"
          anchorY="middle"
        >
          [ PRESS ENTER TO OPEN FULL PROFILE ]
        </Text>
      </group>

      {/* =========================================================================
          ZONE 2: SKILLS WORKSHOP (WEST PLAZA: [-32, 0, 8])
      ========================================================================= */}
      <group position={[-32, 0, 8]}>
        <LandmarkBeacon
          id="skills"
          name="SKILLS WORKSHOP"
          position={[0, 0, 0]}
          color="#F59E0B"
          radius={8.5}
          onEnter={onEnterZone}
          onLeave={onLeaveZone}
          isDiscovered={isLandmarkDiscovered('skills')}
        />

        {/* 4 Themed Skill Workshop Pedestals */}
        {[
          { title: 'FULL STACK', skills: 'React, Next.js, Node.js, TS', pos: [-4.2, 0, 0], color: '#3B82F6' },
          { title: 'AI & ML', skills: 'PyTorch, LangChain, Transformers', pos: [-1.4, 0, -3.5], color: '#8B5CF6' },
          { title: 'CLOUD & DEVOPS', skills: 'AWS, Docker, CI/CD, Kubernetes', pos: [1.4, 0, -3.5], color: '#10B981' },
          { title: 'SYSTEMS & CORE', skills: 'Java SE 17, Python, PostgreSQL', pos: [4.2, 0, 0], color: '#F59E0B' }
        ].map((cube, i) => (
          <group key={i} position={cube.pos as [number, number, number]}>
            <RigidBody type="fixed" colliders={false}>
              <CuboidCollider args={[1.2, 0.75, 1.2]} position={[0, 0.75, 0]} />
            </RigidBody>

            {/* Toy Skill Workshop Bench */}
            <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
              <boxGeometry args={[2.2, 1.4, 2.2]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
            </mesh>
            <mesh position={[0, 1.45, 0]} castShadow>
              <boxGeometry args={[2.3, 0.12, 2.3]} />
              <meshStandardMaterial color={cube.color} roughness={0.5} />
            </mesh>

            {/* Skill Title & Tags */}
            <Text
              position={[0, 1.8, 0]}
              fontSize={0.24}
              color="#1E293B"
              anchorX="center"
              anchorY="middle"
              fontWeight="bold"
            >
              {cube.title}
            </Text>
            <Text
              position={[0, 1.1, 1.15]}
              fontSize={0.15}
              color="#475569"
              anchorX="center"
              anchorY="middle"
              maxWidth={2.0}
              lineHeight={1.3}
            >
              {cube.skills}
            </Text>
          </group>
        ))}
      </group>

      {/* =========================================================================
          ZONE 3: PROJECT EXHIBITION (NORTHWEST PLAZA: [-28, 0, -32])
      ========================================================================= */}
      <group position={[-28, 0, -32]}>
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
                <CuboidCollider args={[2.6, 2.2, 0.4]} position={[0, 2.2, 0]} />
              </RigidBody>

              {/* Clean White Display Stand */}
              <mesh position={[0, 2.2, 0]} castShadow receiveShadow>
                <boxGeometry args={[4.8, 3.2, 0.25]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.25} />
              </mesh>

              {/* Accent Header Bar */}
              <mesh position={[0, 3.7, 0]}>
                <boxGeometry args={[4.85, 0.2, 0.28]} />
                <meshStandardMaterial color="#3B82F6" roughness={0.4} />
              </mesh>

              {/* Support Legs */}
              {[-2.2, 2.2].map((x, legIdx) => (
                <mesh key={legIdx} position={[x, 1.1, 0]} castShadow>
                  <cylinderGeometry args={[0.08, 0.1, 2.2, 6]} />
                  <meshStandardMaterial color="#94A3B8" roughness={0.7} />
                </mesh>
              ))}

              {/* Project Title */}
              <Text
                position={[0, 3.1, 0.15]}
                fontSize={0.28}
                color="#1E293B"
                anchorX="center"
                anchorY="middle"
                fontWeight="bold"
              >
                {proj.title.toUpperCase()}
              </Text>

              {/* Category Pill */}
              <Text
                position={[0, 2.65, 0.15]}
                fontSize={0.16}
                color="#3B82F6"
                anchorX="center"
                anchorY="middle"
                fontWeight="bold"
              >
                {(proj as any).category || (proj.technologies && proj.technologies[0]) || 'ENGINEERING'}
              </Text>

              {/* Brief Description */}
              <Text
                position={[0, 2.05, 0.15]}
                fontSize={0.14}
                color="#475569"
                anchorX="center"
                anchorY="middle"
                maxWidth={4.2}
                lineHeight={1.3}
              >
                {proj.description?.slice(0, 85)}...
              </Text>

              {/* Click / Approach Trigger Plate */}
              <group
                position={[0, 0.1, 1.6]}
                onClick={() => onSelectProject(proj)}
              >
                <mesh receiveShadow>
                  <boxGeometry args={[2.8, 0.12, 1.0]} />
                  <meshStandardMaterial color="#EA580C" roughness={0.5} />
                </mesh>
                <Text
                  position={[0, 0.08, 0]}
                  rotation={[-Math.PI / 2, 0, 0]}
                  fontSize={0.18}
                  color="#FFFFFF"
                  anchorX="center"
                  anchorY="middle"
                  fontWeight="bold"
                >
                  VIEW SPECS &rarr;
                </Text>
              </group>
            </group>
          );
        })}
      </group>

      {/* =========================================================================
          ZONE 4: ACHIEVEMENT ARENA (ELEVATED HILL: [28, 2.2, -28])
      ========================================================================= */}
      <group position={[28, 2.2, -28]}>
        <LandmarkBeacon
          id="experience"
          name="ACHIEVEMENT ARENA"
          position={[0, 0, 0]}
          color="#EAB308"
          radius={8.0}
          onEnter={onEnterZone}
          onLeave={onLeaveZone}
          isDiscovered={isLandmarkDiscovered('experience')}
        />

        {/* Triumphal White & Gold Archway */}
        <group position={[0, 0, -4.5]}>
          <RigidBody type="fixed" colliders={false}>
            <CuboidCollider args={[4.5, 3.0, 0.6]} position={[0, 3.0, 0]} />
          </RigidBody>

          {/* Left Pillar */}
          <mesh position={[-3.2, 2.4, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.0, 4.8, 1.0]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>
          {/* Right Pillar */}
          <mesh position={[3.2, 2.4, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.0, 4.8, 1.0]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>
          {/* Arch Beam */}
          <mesh position={[0, 5.0, 0]} castShadow>
            <boxGeometry args={[7.8, 0.8, 1.2]} />
            <meshStandardMaterial color="#EAB308" roughness={0.3} metalness={0.4} />
          </mesh>

          {/* Golden Trophy Cup on Center Pedestal */}
          <mesh position={[0, 1.2, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.45, 1.0, 12]} />
            <meshStandardMaterial color="#FDE047" metalness={0.6} roughness={0.2} />
          </mesh>
          <mesh position={[0, 2.0, 0]} castShadow>
            <cylinderGeometry args={[0.55, 0.25, 0.9, 12]} />
            <meshStandardMaterial color="#FDE047" metalness={0.6} roughness={0.2} />
          </mesh>

          {/* Certified Achievements Banner */}
          <Text
            position={[0, 4.2, 0.62]}
            fontSize={0.26}
            color="#1E293B"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            VERIFIED CREDENTIALS & ACHIEVEMENTS
          </Text>
          <Text
            position={[0, 3.65, 0.62]}
            fontSize={0.17}
            color="#CA8A04"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            Oracle Certified Professional: Java SE 17 Developer
          </Text>
          <Text
            position={[0, 3.2, 0.62]}
            fontSize={0.16}
            color="#475569"
            anchorX="center"
            anchorY="middle"
          >
            Smart India Hackathon 2025 Nominee • 250+ LeetCode DSA Solutions
          </Text>
        </group>
      </group>

      {/* =========================================================================
          ZONE 5: EDUCATION CENTER (EAST PLAZA: [34, 0, 10])
      ========================================================================= */}
      <group position={[34, 0, 10]}>
        <LandmarkBeacon
          id="education"
          name="EDUCATION CENTER"
          position={[0, 0, 0]}
          color="#10B981"
          radius={7.0}
          onEnter={onEnterZone}
          onLeave={onLeaveZone}
          isDiscovered={isLandmarkDiscovered('education')}
        />

        {/* Academic Pavilion Structure */}
        <group position={[0, 0, -3.5]}>
          <RigidBody type="fixed" colliders={false}>
            <CuboidCollider args={[3.8, 2.4, 0.5]} position={[0, 2.4, 0]} />
          </RigidBody>

          {/* Clean White Backboard */}
          <mesh position={[0, 2.4, 0]} castShadow receiveShadow>
            <boxGeometry args={[7.2, 2.8, 0.25]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>
          {/* Green Trim */}
          <mesh position={[0, 3.75, 0]}>
            <boxGeometry args={[7.3, 0.15, 0.3]} />
            <meshStandardMaterial color="#10B981" roughness={0.4} />
          </mesh>

          {/* Support Columns */}
          {[-3.3, 3.3].map((x, i) => (
            <mesh key={i} position={[x, 1.4, 0]} castShadow>
              <cylinderGeometry args={[0.14, 0.16, 2.8, 8]} />
              <meshStandardMaterial color="#78543E" roughness={0.9} />
            </mesh>
          ))}

          {/* Education Text */}
          <Text
            position={[0, 3.2, 0.15]}
            fontSize={0.32}
            color="#1E293B"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            BANNARI AMMAN INSTITUTE OF TECHNOLOGY
          </Text>
          <Text
            position={[0, 2.65, 0.15]}
            fontSize={0.20}
            color="#10B981"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            B.E. Computer Science and Engineering (2024 - 2028)
          </Text>
          <Text
            position={[0, 2.1, 0.15]}
            fontSize={0.18}
            color="#475569"
            anchorX="center"
            anchorY="middle"
          >
            Academic Cumulative GPA: 7.8 / 10.0
          </Text>
          <Text
            position={[0, 1.55, 0.15]}
            fontSize={0.15}
            color="#64748B"
            anchorX="center"
            anchorY="middle"
          >
            [ PRESS ENTER TO VIEW ACADEMIC HIGHLIGHTS ]
          </Text>
        </group>
      </group>

      {/* =========================================================================
          ZONE 6: CONTACT STATION (SOUTH PLAZA: [0, 0, 36])
      ========================================================================= */}
      <group position={[0, 0, 36]}>
        <LandmarkBeacon
          id="contact"
          name="CONTACT STATION"
          position={[0, 0, 0]}
          color="#EA580C"
          radius={7.5}
          onEnter={onEnterZone}
          onLeave={onLeaveZone}
          isDiscovered={isLandmarkDiscovered('contact')}
        />

        {/* Radio Communication Mast & Terminal */}
        <group position={[0, 0, 4.0]}>
          <RigidBody type="fixed" colliders={false}>
            <CuboidCollider args={[1.5, 4.0, 1.5]} position={[0, 4.0, 0]} />
          </RigidBody>

          {/* Radio Mast Lattice Tower */}
          <mesh position={[0, 4.5, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.65, 9.0, 6]} />
            <meshStandardMaterial color="#EA580C" metalness={0.4} roughness={0.6} />
          </mesh>
          {/* Top Flashing Aviation Sphere */}
          <mesh position={[0, 9.2, 0]}>
            <sphereGeometry args={[0.25, 12, 12]} />
            <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={3.0} />
          </mesh>

          {/* Mailbox / Dispatch Terminal Box */}
          <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.4, 1.5, 1.4]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>
          <mesh position={[0, 1.55, 0]} castShadow>
            <boxGeometry args={[2.5, 0.12, 1.5]} />
            <meshStandardMaterial color="#EA580C" roughness={0.5} />
          </mesh>

          {/* Contact Details Board */}
          <Text
            position={[0, 2.4, 0]}
            fontSize={0.32}
            color="#1E293B"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            LET'S CONNECT & COLLABORATE
          </Text>
          <Text
            position={[0, 1.0, 0.72]}
            fontSize={0.16}
            color="#EA580C"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            DOWNLOAD CV • RECRUITER DOSSIER • GITHUB • LINKEDIN
          </Text>
        </group>
      </group>
    </group>
  );
}
