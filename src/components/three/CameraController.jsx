import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { WORLD_POSITIONS } from '../../lib/worldPositions';
import { useWorld } from '../../hooks/useWorld';

export default function CameraController() {
  const { camera } = useThree();
  const { isReducedMotion, setActiveSection } = useWorld();

  useEffect(() => {
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 0, 0);

    if (isReducedMotion) return;

    // Map scroll progress to camera Z position across the full page height
    const masterTL = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
        onUpdate: (self) => {
          // Update active section based on scroll progress
          const p = self.progress;
          if (p < 0.08) setActiveSection('hero');
          else if (p < 0.18) setActiveSection('about');
          else if (p < 0.28) setActiveSection('skills');
          else if (p < 0.40) setActiveSection('projects');
          else if (p < 0.51) setActiveSection('architecture');
          else if (p < 0.61) setActiveSection('journey');
          else if (p < 0.71) setActiveSection('certifications');
          else if (p < 0.81) setActiveSection('dsa');
          else if (p < 0.91) setActiveSection('github');
          else setActiveSection('contact');
        }
      }
    });

    const pos = WORLD_POSITIONS;

    masterTL
      // Hero → About
      .to(camera.position, { x: pos.about.x, y: 1, z: pos.about.z, ease: 'power2.inOut' }, 0.08)
      // About → Skills
      .to(camera.position, { x: pos.skills.x, y: 0, z: pos.skills.z, ease: 'power2.inOut' }, 0.18)
      // Skills → Projects
      .to(camera.position, { x: pos.projects.x, y: 0, z: pos.projects.z, ease: 'power2.inOut' }, 0.28)
      // Projects → Architecture
      .to(camera.position, { x: pos.architecture.x, y: 0, z: pos.architecture.z, ease: 'power2.inOut' }, 0.40)
      // Architecture → Journey
      .to(camera.position, { x: pos.journey.x, y: 0, z: pos.journey.z, ease: 'power2.inOut' }, 0.51)
      // Journey → Certifications
      .to(camera.position, { x: pos.certifications.x, y: 0, z: pos.certifications.z, ease: 'power2.inOut' }, 0.61)
      // Certifications → DSA
      .to(camera.position, { x: pos.dsa.x, y: 0, z: pos.dsa.z, ease: 'power2.inOut' }, 0.71)
      // DSA → GitHub
      .to(camera.position, { x: pos.github.x, y: 0, z: pos.github.z, ease: 'power2.inOut' }, 0.81)
      // GitHub → Contact
      .to(camera.position, { x: pos.contact.x, y: 0, z: pos.contact.z, ease: 'power2.inOut' }, 0.91);

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, [camera, isReducedMotion]);

  return null;
}
