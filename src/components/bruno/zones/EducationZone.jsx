import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as CANNON from 'cannon-es';
import { usePhysics } from '../PhysicsContext';
import { educationList, certificationsList, achievementsList } from '../../../data/portfolio';
import { carAudio } from '../CarAudio';

export default function EducationZone({ onSelectInfo, isNight }) {
  const { world, carState } = usePhysics();
  const triggerCooldown = useRef(0);

  // Static collision bodies for buildings and pedestals
  useEffect(() => {
    const bodies = [];

    // Main Campus Building Body
    const campusBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      position: new CANNON.Vec3(0, 3, 44)
    });
    campusBody.addShape(new CANNON.Box(new CANNON.Vec3(7, 3, 4)));
    world.addBody(campusBody);
    bodies.push(campusBody);

    return () => {
      bodies.forEach((b) => world.removeBody(b));
    };
  }, [world]);

  // Check proximity for interactive popup
  useFrame(() => {
    const carPos = carState.current.position;
    const now = performance.now();

    const dx = carPos.x - 0;
    const dz = carPos.z - 36;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < 4.5 && now - triggerCooldown.current > 3000) {
      triggerCooldown.current = now;
      carAudio.playChime();
      onSelectInfo({
        type: 'education',
        title: 'Education & Honors',
        education: educationList,
        certifications: certificationsList,
        achievements: achievementsList
      });
    }
  });

  return (
    <group position={[0, 0, 42]}>
      {/* Zone Title Banner */}
      <group position={[0, 8.5, -8]}>
        <Text
          fontSize={2.2}
          color={isNight ? '#FBBF24' : '#D97706'}
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          ACADEMICS & CERTIFICATIONS
        </Text>
        <Text
          position={[0, -1.0, 0]}
          fontSize={0.7}
          color={isNight ? '#94A3B8' : '#64748B'}
          anchorX="center"
          anchorY="middle"
        >
          DRIVE CLOSE TO VIEW CREDENTIALS & ACHIEVEMENTS
        </Text>
      </group>

      {/* Low-Poly Campus Building: Bannari Amman Institute of Technology */}
      <group position={[0, 0, 2]}>
        {/* Main Building Base */}
        <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[14, 5, 8]} />
          <meshStandardMaterial color={isNight ? '#1E293B' : '#F1F5F9'} roughness={0.4} />
        </mesh>

        {/* Building Roof / Pediment */}
        <mesh position={[0, 5.8, 0]} castShadow>
          <boxGeometry args={[15, 0.6, 9]} />
          <meshStandardMaterial color="#D97706" />
        </mesh>

        {/* Campus Columns / Pillars */}
        {[-5.5, -2.5, 2.5, 5.5].map((x) => (
          <mesh key={x} position={[x, 2.5, 4.2]} castShadow>
            <cylinderGeometry args={[0.35, 0.45, 5, 12]} />
            <meshStandardMaterial color={isNight ? '#334155' : '#E2E8F0'} />
          </mesh>
        ))}

        {/* Front Signboard */}
        <mesh position={[0, 4.2, 4.1]} castShadow>
          <boxGeometry args={[8.5, 1.2, 0.2]} />
          <meshStandardMaterial color="#1E293B" />
        </mesh>
        <Text
          position={[0, 4.4, 4.25]}
          fontSize={0.38}
          color="#FBBF24"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          BANNARI AMMAN INSTITUTE OF TECH
        </Text>
        <Text
          position={[0, 3.9, 4.25]}
          fontSize={0.28}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          B.E. CSE • BATCH 2028 • CGPA 7.8
        </Text>
      </group>

      {/* 3 Certification Podiums in front */}
      <group position={[0, 0, -8]}>
        {certificationsList.map((cert, i) => (
          <group
            key={cert.id}
            position={[(i - 1) * 7, 0, 0]}
            onClick={() =>
              onSelectInfo({
                type: 'certification',
                title: cert.title,
                issuer: cert.issuer
              })
            }
          >
            {/* Pedestal */}
            <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[1.5, 1.8, 2.0, 16]} />
              <meshStandardMaterial color={isNight ? '#1E293B' : '#CBD5E1'} roughness={0.3} />
            </mesh>
            {/* Golden Trophy on top */}
            <group position={[0, 2.5, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.4, 0.2, 0.7, 12]} />
                <meshStandardMaterial color="#F59E0B" metalness={0.8} roughness={0.2} />
              </mesh>
              <mesh position={[0, 0.5, 0]} castShadow>
                <sphereGeometry args={[0.3, 12, 12]} />
                <meshStandardMaterial color="#FBBF24" metalness={0.9} roughness={0.1} />
              </mesh>
            </group>
            {/* Label */}
            <Text
              position={[0, 0.8, 1.6]}
              fontSize={0.26}
              color={isNight ? '#F8FAFC' : '#0F172A'}
              anchorX="center"
              anchorY="middle"
              fontWeight="bold"
              maxWidth={3.0}
              textAlign="center"
            >
              {cert.title}
            </Text>
          </group>
        ))}
      </group>

      {/* Achievement Blocks: 250+ DSA & SIH 2025 */}
      <group position={[14, 0, 0]}>
        <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.5, 3.6, 3.5]} />
          <meshStandardMaterial color="#10B981" roughness={0.3} />
        </mesh>
        <Text
          position={[0, 2.4, 1.8]}
          fontSize={0.9}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          250+
        </Text>
        <Text
          position={[0, 1.2, 1.8]}
          fontSize={0.28}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          maxWidth={3.0}
          textAlign="center"
          fontWeight="bold"
        >
          DSA PROBLEMS SOLVED IN JAVA
        </Text>
      </group>

      <group position={[-14, 0, 0]}>
        <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.5, 3.6, 3.5]} />
          <meshStandardMaterial color="#8B5CF6" roughness={0.3} />
        </mesh>
        <Text
          position={[0, 2.4, 1.8]}
          fontSize={0.7}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          SIH 2025
        </Text>
        <Text
          position={[0, 1.2, 1.8]}
          fontSize={0.28}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          maxWidth={3.0}
          textAlign="center"
          fontWeight="bold"
        >
          SMART INDIA HACKATHON
        </Text>
      </group>
    </group>
  );
}

