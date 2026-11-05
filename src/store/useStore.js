import { create } from 'zustand';

export const useStore = create((set) => ({
  coreState: 'idle',
  setCoreState: (state) => set({ coreState: state }),
  
  cursorState: 'default',
  setCursorState: (state) => set({ cursorState: state }),
  
  isMenuOpen: false,
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  
  activeProject: null,
  setActiveProject: (project) => set({ activeProject: project }),

  scrollProgress: 0,
  setScrollProgress: (progress) => set({ scrollProgress: progress })
}));
