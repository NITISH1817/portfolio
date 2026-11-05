import React, { createContext, useContext, useState, useRef } from 'react';

const WorldContext = createContext(null);

export function WorldProvider({ children }) {
  const [activeSection, setActiveSection] = useState('hero');
  const [activeSkill, setActiveSkill] = useState(null);
  const [activeProject, setActiveProject] = useState(null);
  const [introComplete, setIntroComplete] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );
  const cameraRef = useRef(null);

  return (
    <WorldContext.Provider value={{
      activeSection, setActiveSection,
      activeSkill, setActiveSkill,
      activeProject, setActiveProject,
      introComplete, setIntroComplete,
      isReducedMotion,
      cameraRef,
    }}>
      {children}
    </WorldContext.Provider>
  );
}

export function useWorld() {
  return useContext(WorldContext);
}
