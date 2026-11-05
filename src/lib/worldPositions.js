// World coordinate positions for the GSAP camera journey
export const WORLD_POSITIONS = {
  hero:          { x: 0,   y: 0, z: 8   },
  about:         { x: 0,   y: 0, z: -22  },
  skills:        { x: 20,  y: 0, z: -52  },
  projects:      { x: -20, y: 0, z: -92  },
  architecture:  { x: 0,   y: 0, z: -132 },
  journey:       { x: 25,  y: 0, z: -172 },
  certifications:{ x: -25, y: 0, z: -212 },
  dsa:           { x: 0,   y: 0, z: -252 },
  github:        { x: 20,  y: 0, z: -292 },
  contact:       { x: 0,   y: 0, z: -332 },
};

// Total scroll depth (in "world units", we map via scrollHeight)
export const TOTAL_WORLD_DEPTH = 340;

// Section order for nav
export const SECTIONS = [
  'hero','about','skills','projects','architecture',
  'journey','certifications','dsa','github','contact'
];
