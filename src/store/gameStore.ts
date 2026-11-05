import { create } from 'zustand';
import * as THREE from 'three';

export interface Mission {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  description: string;
  targetCoords: [number, number, number]; // [x, y, z]
  landmarkId: string;
  rewardText: string;
  badge: string;
}

export interface Crystal {
  id: string;
  name: string;
  category: string;
  color: string;
  emissive: string;
  position: [number, number, number];
  description: string;
}

export interface GameAchievement {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  rewardXP: number;
  conditionDescription: string;
}

export interface AchievementToast {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const MISSIONS: Mission[] = [
  {
    id: 'mission-01',
    order: 1,
    title: 'Discover About Me',
    subtitle: 'Who is Nitish Priyan?',
    description: 'Drive to the About Me Pavilion to uncover developer origins, education, and career vision.',
    targetCoords: [-34, 1.2, 25],
    landmarkId: 'about',
    rewardText: 'Unlocks Developer Story & +100 XP',
    badge: '👤'
  },
  {
    id: 'mission-02',
    order: 2,
    title: 'Explore Technical Skills',
    subtitle: 'Core Tech Stack',
    description: 'Navigate to the Skills Playground to inspect languages, frameworks, AI libraries, and tools.',
    targetCoords: [38, 1.2, -2],
    landmarkId: 'skills',
    rewardText: 'Unlocks Skills Matrix & +100 XP',
    badge: '⚡'
  },
  {
    id: 'mission-03',
    order: 3,
    title: 'Discover My Projects',
    subtitle: 'Flagship Creations',
    description: 'Visit the Projects Exhibition to inspect Lexora, AI Govt Scheme Recommender, and Project Zero.',
    targetCoords: [0, 1.2, -36],
    landmarkId: 'projects',
    rewardText: 'Unlocks Project Repositories & +150 XP',
    badge: '🚀'
  },
  {
    id: 'mission-04',
    order: 4,
    title: 'Unlock Achievements',
    subtitle: 'Honors & Credentials',
    description: 'Head to Experience & Honors to review Oracle Java SE 17 certification and hackathon awards.',
    targetCoords: [34, 1.2, 31],
    landmarkId: 'experience',
    rewardText: 'Unlocks Credentials Archive & +150 XP',
    badge: '🏆'
  },
  {
    id: 'mission-05',
    order: 5,
    title: 'Find My Resume',
    subtitle: 'Curriculum Vitae',
    description: 'Drive over to the Resume Archives to preview and download the professional developer resume.',
    targetCoords: [36, 1.2, -31],
    landmarkId: 'resume',
    rewardText: 'Unlocks Downloadable CV & +150 XP',
    badge: '📄'
  },
  {
    id: 'mission-06',
    order: 6,
    title: 'Visit Contact Station',
    subtitle: 'Transmission Hub',
    description: 'Reach the Contact Station to transmit a message or connect via GitHub, LinkedIn, and Email.',
    targetCoords: [-42, 1.2, -8],
    landmarkId: 'contact',
    rewardText: 'Unlocks Transmission Link & +200 XP',
    badge: '📡'
  }
];

export const CRYSTALS: Crystal[] = [
  {
    id: 'crystal-java',
    name: 'Java Crystal',
    category: 'Languages',
    color: '#F59E0B',
    emissive: '#F59E0B',
    position: [0, 1.3, 14],
    description: 'Represents Oracle Java SE 17 certification and robust backend algorithms.'
  },
  {
    id: 'crystal-python',
    name: 'Python Crystal',
    category: 'AI / Data',
    color: '#10B981',
    emissive: '#10B981',
    position: [16, 1.3, 44],
    description: 'Powers AI/ML models, OpenCV computer vision, and rapid prototyping.'
  },
  {
    id: 'crystal-aiml',
    name: 'AI/ML Crystal',
    category: 'Intelligence',
    color: '#A855F7',
    emissive: '#A855F7',
    position: [14, 1.3, -34],
    description: 'Fuel for NLP semantic search, ChromaDB vector indexing, and neural networks.'
  },
  {
    id: 'crystal-frontend',
    name: 'Frontend Crystal',
    category: 'UI/UX',
    color: '#06B6D4',
    emissive: '#06B6D4',
    position: [34, 1.3, -12],
    description: 'Drives React.js, Three.js 3D web experiences, and responsive styling.'
  },
  {
    id: 'crystal-backend',
    name: 'Backend Crystal',
    category: 'Architecture',
    color: '#3B82F6',
    emissive: '#3B82F6',
    position: [-16, 1.3, -40],
    description: 'Architecting high-throughput REST APIs with FastAPI, Flask, and Node.js.'
  },
  {
    id: 'crystal-database',
    name: 'Database Crystal',
    category: 'Storage',
    color: '#F97316',
    emissive: '#F97316',
    position: [42, 1.3, 24],
    description: 'Structured MySQL relational tables and high-dimensional ChromaDB embeddings.'
  },
  {
    id: 'crystal-devops',
    name: 'DevOps Crystal',
    category: 'Tooling',
    color: '#EC4899',
    emissive: '#EC4899',
    position: [-38, 1.3, 8],
    description: 'Git source control, automated build pipelines, and cloud deployment.'
  }
];

export const ACHIEVEMENTS: GameAchievement[] = [
  {
    id: 'first-drive',
    title: 'First Drive',
    subtitle: 'Ignition',
    description: 'Took control of the off-road car and set out on the island exploration.',
    icon: '🚗',
    rewardXP: 50,
    conditionDescription: 'Drive more than 15 meters on the island circuit'
  },
  {
    id: 'island-explorer',
    title: 'Island Explorer',
    subtitle: 'Wayfarer',
    description: 'Discovered at least 3 distinct portfolio landmarks across the terrain.',
    icon: '🧭',
    rewardXP: 100,
    conditionDescription: 'Visit 3 landmarks'
  },
  {
    id: 'project-hunter',
    title: 'Project Hunter',
    subtitle: 'Builder of Things',
    description: 'Explored the Projects Exhibition to inspect real-world full-stack and AI software.',
    icon: '💻',
    rewardXP: 150,
    conditionDescription: 'Inspect the Projects Exhibition landmark'
  },
  {
    id: 'skill-collector',
    title: 'Skill Collector',
    subtitle: 'Knowledge Seeker',
    description: 'Collected at least 3 glowing Technology Crystals or inspected the Skills Playground.',
    icon: '💎',
    rewardXP: 150,
    conditionDescription: 'Collect 3 crystals or inspect Skills Playground'
  },
  {
    id: 'achievement-hunter',
    title: 'Achievement Hunter',
    subtitle: 'Proven Credibility',
    description: 'Reviewed verified honors: Oracle Java SE 17 certification & hackathons.',
    icon: '🏆',
    rewardXP: 150,
    conditionDescription: 'Inspect the Experience & Honors landmark'
  },
  {
    id: 'resume-finder',
    title: 'Resume Finder',
    subtitle: 'Career Dossier',
    description: 'Discovered the Resume Archives and previewed the professional CV.',
    icon: '📄',
    rewardXP: 150,
    conditionDescription: 'Inspect the Resume Archives landmark'
  },
  {
    id: 'portfolio-master',
    title: 'Portfolio Master',
    subtitle: 'Island Champion',
    description: 'Completed all 6 missions and gathered all 7 technology crystals.',
    icon: '👑',
    rewardXP: 500,
    conditionDescription: 'Complete all 6 missions & collect all 7 crystals'
  }
];

const STORAGE_KEY = 'nitish_portfolio_game_v2.0';

interface SavedState {
  completedMissions: string[];
  currentMissionId: string;
  collectedCrystals: string[];
  unlockedAchievements: string[];
  discoveredLandmarks: Record<string, boolean>;
  timeOfDay: 'day' | 'sunset' | 'night';
  weather: 'clear' | 'rain' | 'mist';
  vehicleColor: string;
  audioEnabled: boolean;
  xp: number;
}

const getDefaultState = (): SavedState => ({
  completedMissions: [],
  currentMissionId: 'mission-01',
  collectedCrystals: [],
  unlockedAchievements: [],
  discoveredLandmarks: {},
  timeOfDay: 'night', // signature dark purple neon aesthetic by default
  weather: 'clear',
  vehicleColor: '#DC2626',
  audioEnabled: false,
  xp: 0
});

const loadInitialState = (): SavedState => {
  if (typeof window === 'undefined') return getDefaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    const parsed = JSON.parse(raw);
    return {
      completedMissions: Array.isArray(parsed.completedMissions) ? parsed.completedMissions : [],
      currentMissionId: parsed.currentMissionId || 'mission-01',
      collectedCrystals: Array.isArray(parsed.collectedCrystals) ? parsed.collectedCrystals : [],
      unlockedAchievements: Array.isArray(parsed.unlockedAchievements) ? parsed.unlockedAchievements : [],
      discoveredLandmarks: parsed.discoveredLandmarks || {},
      timeOfDay: ['day', 'sunset', 'night'].includes(parsed.timeOfDay) ? parsed.timeOfDay : 'night',
      weather: ['clear', 'rain', 'mist'].includes(parsed.weather) ? parsed.weather : 'clear',
      vehicleColor: parsed.vehicleColor || '#DC2626',
      audioEnabled: Boolean(parsed.audioEnabled),
      xp: typeof parsed.xp === 'number' ? parsed.xp : 0
    };
  } catch (e) {
    console.warn('Failed to parse saved game progress, falling back to defaults:', e);
    return getDefaultState();
  }
};

const persistState = (state: SavedState) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        completedMissions: state.completedMissions,
        currentMissionId: state.currentMissionId,
        collectedCrystals: state.collectedCrystals,
        unlockedAchievements: state.unlockedAchievements,
        discoveredLandmarks: state.discoveredLandmarks,
        timeOfDay: state.timeOfDay,
        weather: state.weather,
        vehicleColor: state.vehicleColor,
        audioEnabled: state.audioEnabled,
        xp: state.xp
      })
    );
  } catch (e) {
    console.warn('Failed to persist game state:', e);
  }
};

export interface GameStoreState {
  // Saved data
  completedMissions: string[];
  currentMissionId: string;
  collectedCrystals: string[];
  unlockedAchievements: string[];
  discoveredLandmarks: Record<string, boolean>;
  timeOfDay: 'day' | 'sunset' | 'night';
  weather: 'clear' | 'rain' | 'mist';
  vehicleColor: string;
  audioEnabled: boolean;
  xp: number;

  // Real-time Vehicle & Gameplay state (ephemeral)
  nitroEnergy: number; // 0 - 100
  isNitroActive: boolean;
  isDrifting: boolean;
  headlightsOn: boolean;
  distanceDriven: number;
  activeToast: AchievementToast | null;
  crystalToast: string | null;
  missionToast: string | null;
  isAchievementsModalOpen: boolean;

  // Portfolio 4.0 Interactive Modals & Engines
  isCommandPaletteOpen: boolean;
  isAiAssistantOpen: boolean;
  isDevDashboardOpen: boolean;
  isTechLabOpen: boolean;
  performanceTier: 'high' | 'medium' | 'low';
  reducedMotion: boolean;

  // Actions
  completeMission: (missionId: string) => void;
  setCurrentMission: (missionId: string) => void;
  collectCrystal: (crystalId: string) => void;
  unlockAchievement: (achievementId: string) => void;
  discoverLandmark: (landmarkId: string) => void;
  setTimeOfDay: (time: 'day' | 'sunset' | 'night') => void;
  cycleTimeOfDay: () => void;
  setWeather: (weather: 'clear' | 'rain' | 'mist') => void;
  cycleWeather: () => void;
  setVehicleColor: (color: string) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setAiAssistantOpen: (open: boolean) => void;
  setDevDashboardOpen: (open: boolean) => void;
  setTechLabOpen: (open: boolean) => void;
  setPerformanceTier: (tier: 'high' | 'medium' | 'low') => void;
  setReducedMotion: (rm: boolean) => void;
  setAudioEnabled: (enabled: boolean) => void;
  setNitroEnergy: (energy: number) => void;
  setIsNitroActive: (active: boolean) => void;
  setIsDrifting: (drifting: boolean) => void;
  toggleHeadlights: () => void;
  addDistanceDriven: (meters: number) => void;
  dismissToast: () => void;
  setAchievementsModalOpen: (open: boolean) => void;
  resetProgress: () => void;
}

const initial = loadInitialState();

export const useGameStore = create<GameStoreState>((set, get) => ({
  ...initial,
  nitroEnergy: 100,
  isNitroActive: false,
  isDrifting: false,
  headlightsOn: true,
  distanceDriven: 0,
  activeToast: null,
  crystalToast: null,
  missionToast: null,
  isAchievementsModalOpen: false,

  // Portfolio 4.0 Interactive Modals & Engines
  isCommandPaletteOpen: false,
  isAiAssistantOpen: false,
  isDevDashboardOpen: false,
  isTechLabOpen: false,
  performanceTier: 'high',
  reducedMotion: false,

  completeMission: (missionId: string) => {
    const { completedMissions, currentMissionId } = get();
    if (completedMissions.includes(missionId)) return;

    const mission = MISSIONS.find((m) => m.id === missionId);
    const newCompleted = [...completedMissions, missionId];
    
    // Determine next mission
    const currentIndex = MISSIONS.findIndex((m) => m.id === missionId);
    const nextMission = MISSIONS[currentIndex + 1];
    const newCurrentId = nextMission ? nextMission.id : currentMissionId;

    const newXP = get().xp + 100;
    const newState: SavedState = {
      completedMissions: newCompleted,
      currentMissionId: newCurrentId,
      collectedCrystals: get().collectedCrystals,
      unlockedAchievements: get().unlockedAchievements,
      discoveredLandmarks: get().discoveredLandmarks,
      timeOfDay: get().timeOfDay,
      audioEnabled: get().audioEnabled,
      xp: newXP
    };
    persistState(newState);

    set({
      completedMissions: newCompleted,
      currentMissionId: newCurrentId,
      xp: newXP,
      missionToast: mission ? `🎯 Mission Completed: ${mission.title}!` : '🎯 Mission Completed!'
    });

    // Check portfolio master
    if (newCompleted.length >= 6 && get().collectedCrystals.length >= 7) {
      get().unlockAchievement('portfolio-master');
    }

    setTimeout(() => {
      set((s) => (s.missionToast ? { missionToast: null } : s));
    }, 4500);
  },

  setCurrentMission: (missionId: string) => {
    set({ currentMissionId: missionId });
    persistState({
      completedMissions: get().completedMissions,
      currentMissionId: missionId,
      collectedCrystals: get().collectedCrystals,
      unlockedAchievements: get().unlockedAchievements,
      discoveredLandmarks: get().discoveredLandmarks,
      timeOfDay: get().timeOfDay,
      audioEnabled: get().audioEnabled,
      xp: get().xp
    });
  },

  collectCrystal: (crystalId: string) => {
    const { collectedCrystals } = get();
    if (collectedCrystals.includes(crystalId)) return;

    const crystal = CRYSTALS.find((c) => c.id === crystalId);
    const newCollected = [...collectedCrystals, crystalId];
    const newXP = get().xp + 50;

    const newState: SavedState = {
      completedMissions: get().completedMissions,
      currentMissionId: get().currentMissionId,
      collectedCrystals: newCollected,
      unlockedAchievements: get().unlockedAchievements,
      discoveredLandmarks: get().discoveredLandmarks,
      timeOfDay: get().timeOfDay,
      audioEnabled: get().audioEnabled,
      xp: newXP
    };
    persistState(newState);

    set({
      collectedCrystals: newCollected,
      xp: newXP,
      crystalToast: crystal
        ? `💎 Collected: ${crystal.name} (${newCollected.length}/7)`
        : `💎 Crystal Collected (${newCollected.length}/7)`
    });

    // Check skill collector achievement (3 crystals or skills visited)
    if (newCollected.length >= 3) {
      get().unlockAchievement('skill-collector');
    }

    // Check portfolio master
    if (get().completedMissions.length >= 6 && newCollected.length >= 7) {
      get().unlockAchievement('portfolio-master');
    }

    setTimeout(() => {
      set((s) => (s.crystalToast ? { crystalToast: null } : s));
    }, 3800);
  },

  unlockAchievement: (achievementId: string) => {
    const { unlockedAchievements } = get();
    if (unlockedAchievements.includes(achievementId)) return;

    const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
    if (!achievement) return;

    const newUnlocked = [...unlockedAchievements, achievementId];
    const newXP = get().xp + achievement.rewardXP;

    const newState: SavedState = {
      completedMissions: get().completedMissions,
      currentMissionId: get().currentMissionId,
      collectedCrystals: get().collectedCrystals,
      unlockedAchievements: newUnlocked,
      discoveredLandmarks: get().discoveredLandmarks,
      timeOfDay: get().timeOfDay,
      audioEnabled: get().audioEnabled,
      xp: newXP
    };
    persistState(newState);

    set({
      unlockedAchievements: newUnlocked,
      xp: newXP,
      activeToast: {
        id: achievement.id,
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon
      }
    });

    setTimeout(() => {
      set((s) => (s.activeToast?.id === achievementId ? { activeToast: null } : s));
    }, 5000);
  },

  discoverLandmark: (landmarkId: string) => {
    const { discoveredLandmarks, unlockedAchievements } = get();
    if (discoveredLandmarks[landmarkId]) return;

    const newDiscovered = { ...discoveredLandmarks, [landmarkId]: true };
    const count = Object.keys(newDiscovered).length;

    const newState: SavedState = {
      completedMissions: get().completedMissions,
      currentMissionId: get().currentMissionId,
      collectedCrystals: get().collectedCrystals,
      unlockedAchievements,
      discoveredLandmarks: newDiscovered,
      timeOfDay: get().timeOfDay,
      audioEnabled: get().audioEnabled,
      xp: get().xp + 25
    };
    persistState(newState);
    set({ discoveredLandmarks: newDiscovered, xp: get().xp + 25 });

    // Check explorer achievement
    if (count >= 3) {
      get().unlockAchievement('island-explorer');
    }

    // Landmark-specific achievements
    if (landmarkId === 'projects') get().unlockAchievement('project-hunter');
    if (landmarkId === 'skills') get().unlockAchievement('skill-collector');
    if (landmarkId === 'experience') get().unlockAchievement('achievement-hunter');
    if (landmarkId === 'resume') get().unlockAchievement('resume-finder');

    // Auto-complete corresponding mission upon visiting landmark
    const matchingMission = MISSIONS.find((m) => m.landmarkId === landmarkId);
    if (matchingMission) {
      get().completeMission(matchingMission.id);
    }
  },

  setTimeOfDay: (time: 'day' | 'sunset' | 'night') => {
    set({ timeOfDay: time });
    persistState({
      completedMissions: get().completedMissions,
      currentMissionId: get().currentMissionId,
      collectedCrystals: get().collectedCrystals,
      unlockedAchievements: get().unlockedAchievements,
      discoveredLandmarks: get().discoveredLandmarks,
      timeOfDay: time,
      audioEnabled: get().audioEnabled,
      xp: get().xp
    });
  },

  cycleTimeOfDay: () => {
    const current = get().timeOfDay;
    const next = current === 'day' ? 'sunset' : current === 'sunset' ? 'night' : 'day';
    get().setTimeOfDay(next);
  },

  setAudioEnabled: (enabled: boolean) => {
    set({ audioEnabled: enabled });
    persistState({
      completedMissions: get().completedMissions,
      currentMissionId: get().currentMissionId,
      collectedCrystals: get().collectedCrystals,
      unlockedAchievements: get().unlockedAchievements,
      discoveredLandmarks: get().discoveredLandmarks,
      timeOfDay: get().timeOfDay,
      audioEnabled: enabled,
      xp: get().xp
    });
  },

  setNitroEnergy: (energy: number) => {
    set({ nitroEnergy: Math.max(0, Math.min(100, energy)) });
  },

  setIsNitroActive: (active: boolean) => {
    set({ isNitroActive: active });
  },

  setIsDrifting: (drifting: boolean) => {
    set({ isDrifting: drifting });
  },

  toggleHeadlights: () => {
    set((s) => ({ headlightsOn: !s.headlightsOn }));
  },

  addDistanceDriven: (meters: number) => {
    const newDist = get().distanceDriven + meters;
    set({ distanceDriven: newDist });
    if (newDist >= 15) {
      get().unlockAchievement('first-drive');
    }
  },

  dismissToast: () => set({ activeToast: null, crystalToast: null, missionToast: null }),

  setAchievementsModalOpen: (open: boolean) => set({ isAchievementsModalOpen: open }),

  setWeather: (weather: 'clear' | 'rain' | 'mist') => {
    set({ weather });
    persistState({
      completedMissions: get().completedMissions,
      currentMissionId: get().currentMissionId,
      collectedCrystals: get().collectedCrystals,
      unlockedAchievements: get().unlockedAchievements,
      discoveredLandmarks: get().discoveredLandmarks,
      timeOfDay: get().timeOfDay,
      weather,
      vehicleColor: get().vehicleColor,
      audioEnabled: get().audioEnabled,
      xp: get().xp
    });
  },

  cycleWeather: () => {
    const current = get().weather;
    const next = current === 'clear' ? 'rain' : current === 'rain' ? 'mist' : 'clear';
    get().setWeather(next);
  },

  setVehicleColor: (vehicleColor: string) => {
    set({ vehicleColor });
    persistState({
      completedMissions: get().completedMissions,
      currentMissionId: get().currentMissionId,
      collectedCrystals: get().collectedCrystals,
      unlockedAchievements: get().unlockedAchievements,
      discoveredLandmarks: get().discoveredLandmarks,
      timeOfDay: get().timeOfDay,
      weather: get().weather,
      vehicleColor,
      audioEnabled: get().audioEnabled,
      xp: get().xp
    });
  },

  setCommandPaletteOpen: (open: boolean) => set({ isCommandPaletteOpen: open }),
  setAiAssistantOpen: (open: boolean) => set({ isAiAssistantOpen: open }),
  setDevDashboardOpen: (open: boolean) => set({ isDevDashboardOpen: open }),
  setTechLabOpen: (open: boolean) => set({ isTechLabOpen: open }),
  setPerformanceTier: (tier: 'high' | 'medium' | 'low') => set({ performanceTier: tier }),
  setReducedMotion: (rm: boolean) => set({ reducedMotion: rm }),

  resetProgress: () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.warn('Failed to clear storage:', e);
      }
    }
    const fresh = getDefaultState();
    set({
      ...fresh,
      nitroEnergy: 100,
      isNitroActive: false,
      isDrifting: false,
      distanceDriven: 0,
      activeToast: null,
      crystalToast: null,
      missionToast: null,
      isAchievementsModalOpen: false,
      isCommandPaletteOpen: false,
      isAiAssistantOpen: false,
      isDevDashboardOpen: false,
      isTechLabOpen: false,
      performanceTier: 'high',
      reducedMotion: false
    });
  }
}));

