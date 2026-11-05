import React from 'react';
import { useWorld } from '../../hooks/useWorld';
import CameraController from './CameraController';
import Environment from './Environment';
import EngineeringCore from './EngineeringCore';
import AboutWorld from './AboutWorld';
import SkillWorld from './SkillWorld';
import ProjectWorld from './ProjectWorld';
import ArchitectureWorld from './ArchitectureWorld';
import JourneyWorld from './JourneyWorld';
import CertificationWorld from './CertificationWorld';
import AlgorithmWorld from './AlgorithmWorld';
import GithubWorld from './GithubWorld';
import ContactWorld from './ContactWorld';

export default function World() {
  const { setActiveSkill, setActiveProject } = useWorld();

  return (
    <>
      <CameraController />
      <Environment />
      <EngineeringCore position={[0, 0, 0]} />
      <AboutWorld position={[0, 0, -30]} />
      <SkillWorld position={[20, 0, -60]} onSkillClick={setActiveSkill} />
      <ProjectWorld position={[-20, 0, -100]} onProjectSelect={setActiveProject} />
      <ArchitectureWorld position={[0, 0, -140]} />
      <JourneyWorld position={[25, 0, -180]} />
      <CertificationWorld position={[-25, 0, -220]} />
      <AlgorithmWorld position={[0, 0, -260]} />
      <GithubWorld position={[20, 0, -300]} />
      <ContactWorld position={[0, 0, -340]} />
    </>
  );
}
