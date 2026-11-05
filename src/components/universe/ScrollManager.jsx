import React, { useEffect } from 'react';
import { useStore } from '../../store/useStore';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ScrollManager({ containerRef }) {
  const setCoreState = useStore((state) => state.setCoreState);
  const setScrollProgress = useStore((state) => state.setScrollProgress);

  useEffect(() => {
    if (!containerRef.current) return;

    const sections = containerRef.current.querySelectorAll('.section-container');
    
    // Overall progress
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      }
    });

    // Section specific states
    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onEnter: () => setCoreState(section.id),
        onEnterBack: () => setCoreState(section.id),
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [containerRef, setCoreState, setScrollProgress]);

  return null;
}
