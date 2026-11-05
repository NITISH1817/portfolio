import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const sections = [
  { id: 'hero', name: 'HOME' },
  { id: 'about', name: 'IDENTITY' },
  { id: 'capabilities', name: 'CAPABILITIES' },
  { id: 'projects', name: 'SELECTED WORK' },
  { id: 'education', name: 'EDUCATION' },
  { id: 'certifications', name: 'CERTIFICATIONS' },
  { id: 'achievements', name: 'ACHIEVEMENTS' },
  { id: 'resume', name: 'RESUME' },
  { id: 'contact', name: 'CONTACT' },
];

export default function SectionProgress() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    sections.forEach((section, index) => {
      ScrollTrigger.create({
        trigger: `#${section.id}`,
        start: 'top center',
        end: 'bottom center',
        onToggle: self => {
          if (self.isActive) {
            setActiveIndex(index);
          }
        }
      });
    });
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed right-6 md:right-12 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50 mix-blend-difference hidden md:flex">
      {sections.map((section, idx) => (
        <div 
          key={section.id} 
          className="group relative flex items-center justify-end cursor-pointer"
          onClick={() => scrollTo(section.id)}
          data-cursor="menu"
        >
          <span 
            className={`absolute right-8 text-[9px] font-bold tracking-widest uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pr-2 ${activeIndex === idx ? 'text-[var(--accent)]' : 'text-white'}`}
          >
            {section.name}
          </span>
          <div className="w-6 flex justify-end">
             <span className={`text-[10px] font-bold transition-colors duration-300 ${activeIndex === idx ? 'text-[var(--accent)]' : 'text-gray-500 hover:text-white'}`}>
               0{idx + 1}
             </span>
          </div>
        </div>
      ))}
    </div>
  );
}
