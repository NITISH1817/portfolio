import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Compass,
  User,
  Cpu,
  FolderGit2,
  Trophy,
  FileText,
  Radio,
  Map,
  Bot,
  Activity,
  Layers,
  Palette,
  CloudRain,
  Sun,
  Volume2,
  VolumeX,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Sparkles,
  Command,
  Briefcase
} from 'lucide-react';
import { useGameStore } from '../../../store/gameStore';
import { carAudio } from '../CarAudio';

export default function CommandPalette({
  isOpen,
  onClose,
  onOpenLandmark,
  onToggleMap,
  isClassicMode,
  setIsClassicMode
}) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const cycleTimeOfDay = useGameStore((s) => s.cycleTimeOfDay);
  const cycleWeather = useGameStore((s) => s.cycleWeather);
  const setVehicleColor = useGameStore((s) => s.setVehicleColor);
  const setAiAssistantOpen = useGameStore((s) => s.setAiAssistantOpen);
  const setDevDashboardOpen = useGameStore((s) => s.setDevDashboardOpen);
  const setTechLabOpen = useGameStore((s) => s.setTechLabOpen);
  const setRecruiterModalOpen = useGameStore((s) => s.setRecruiterModalOpen);
  const audioEnabled = useGameStore((s) => s.audioEnabled);
  const setAudioEnabled = useGameStore((s) => s.setAudioEnabled);

  // Global Ctrl + K / Cmd + K and Escape listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          window.dispatchEvent(new CustomEvent('open-command-palette'));
        }
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input upon open
  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const commandList = [
    {
      id: 'cmd-recruiter',
      category: 'FAST-TRACK',
      title: 'Open Recruiter Fast-Track Brief',
      description: 'Quick-review executive summary, resume download, contact, and competencies',
      icon: <Briefcase className="w-4 h-4 text-amber-400" />,
      action: () => {
        onClose();
        setRecruiterModalOpen(true);
      }
    },
    {
      id: 'cmd-about',
      category: 'NAVIGATION',
      title: 'Open Identity Archive',
      description: 'About Nitish Priyan: Bio, origins, and career objectives',
      icon: <User className="w-4 h-4 text-cyan-400" />,
      action: () => {
        onClose();
        onOpenLandmark('about');
      }
    },
    {
      id: 'cmd-skills',
      category: 'NAVIGATION',
      title: 'Open Tech Laboratory (Skills)',
      description: 'Technical capability matrix across 6 engineering modules',
      icon: <Cpu className="w-4 h-4 text-pink-400" />,
      action: () => {
        onClose();
        onOpenLandmark('skills');
      }
    },
    {
      id: 'cmd-projects',
      category: 'NAVIGATION',
      title: 'Open Projects Exhibition',
      description: 'Flagship creations: LEXORA, Govt Scheme, Project Zero',
      icon: <FolderGit2 className="w-4 h-4 text-blue-400" />,
      action: () => {
        onClose();
        onOpenLandmark('projects');
      }
    },
    {
      id: 'cmd-achievements',
      category: 'NAVIGATION',
      title: 'Open Honors Vault',
      description: 'Oracle Java SE 17 certification, degrees, and SIH hackathons',
      icon: <Trophy className="w-4 h-4 text-amber-400" />,
      action: () => {
        onClose();
        onOpenLandmark('experience');
      }
    },
    {
      id: 'cmd-resume',
      category: 'NAVIGATION',
      title: 'Open Dossier Archive (Resume)',
      description: 'Official curriculum vitae and instant document download',
      icon: <FileText className="w-4 h-4 text-cyan-300" />,
      action: () => {
        onClose();
        onOpenLandmark('resume');
      }
    },
    {
      id: 'cmd-contact',
      category: 'NAVIGATION',
      title: 'Open Transmission Station (Contact)',
      description: 'Establish direct connection via Email, LinkedIn, or GitHub',
      icon: <Radio className="w-4 h-4 text-emerald-400" />,
      action: () => {
        onClose();
        onOpenLandmark('contact');
      }
    },
    {
      id: 'cmd-map',
      category: 'NAVIGATION',
      title: 'Toggle Tactical World Map',
      description: 'Full-island overhead radar with instant teleportation',
      icon: <Map className="w-4 h-4 text-purple-400" />,
      action: () => {
        onClose();
        onToggleMap();
      }
    },
    {
      id: 'cmd-ai',
      category: 'AI & INTELLIGENCE',
      title: 'Launch NEXUS AI Assistant',
      description: 'Contextual RAG assistant to answer technical portfolio questions',
      icon: <Bot className="w-4 h-4 text-cyan-300" />,
      badge: 'AI RAG',
      action: () => {
        onClose();
        setAiAssistantOpen(true);
      }
    },
    {
      id: 'cmd-dash',
      category: 'AI & INTELLIGENCE',
      title: 'Open Live Developer Dashboard',
      description: 'Live GitHub repository analytics & LeetCode DSA progress',
      icon: <Activity className="w-4 h-4 text-pink-400" />,
      badge: 'ANALYTICS',
      action: () => {
        onClose();
        setDevDashboardOpen(true);
      }
    },
    {
      id: 'cmd-techlab',
      category: 'AI & INTELLIGENCE',
      title: 'Launch Interactive Technology Lab',
      description: 'Hands-on Java, Python, AI/ML, SQL, and DSA sorting visualizers',
      icon: <Layers className="w-4 h-4 text-orange-400" />,
      badge: 'SIMULATOR',
      action: () => {
        onClose();
        setTechLabOpen(true);
      }
    },
    {
      id: 'cmd-color-red',
      category: 'VEHICLE CUSTOMIZATION',
      title: 'Paint Vehicle: Crimson Red',
      description: 'Switch off-roader body color to Classic Crimson Red',
      icon: <Palette className="w-4 h-4 text-rose-500" />,
      action: () => {
        setVehicleColor('#DC2626');
        onClose();
      }
    },
    {
      id: 'cmd-color-cyan',
      category: 'VEHICLE CUSTOMIZATION',
      title: 'Paint Vehicle: Cyber Neon Cyan',
      description: 'Switch off-roader body color to Electric Cyber Cyan',
      icon: <Palette className="w-4 h-4 text-cyan-400" />,
      action: () => {
        setVehicleColor('#06B6D4');
        onClose();
      }
    },
    {
      id: 'cmd-color-purple',
      category: 'VEHICLE CUSTOMIZATION',
      title: 'Paint Vehicle: Neon Purple',
      description: 'Switch off-roader body color to Cyberpunk Neon Purple',
      icon: <Palette className="w-4 h-4 text-purple-400" />,
      action: () => {
        setVehicleColor('#A855F7');
        onClose();
      }
    },
    {
      id: 'cmd-color-orange',
      category: 'VEHICLE CUSTOMIZATION',
      title: 'Paint Vehicle: Sunset Orange',
      description: 'Switch off-roader body color to Vibrant Sunset Orange',
      icon: <Palette className="w-4 h-4 text-orange-400" />,
      action: () => {
        setVehicleColor('#FF6B00');
        onClose();
      }
    },
    {
      id: 'cmd-weather',
      category: 'ENVIRONMENT',
      title: 'Cycle Weather (Clear / Rain / Mist)',
      description: 'Toggle dynamic atmospheric weather and rain particle streaks',
      icon: <CloudRain className="w-4 h-4 text-cyan-400" />,
      action: () => {
        cycleWeather();
        onClose();
      }
    },
    {
      id: 'cmd-time',
      category: 'ENVIRONMENT',
      title: 'Cycle Time of Day (Day / Sunset / Night)',
      description: 'Shift dynamic sun position, ambient lighting, and sky color',
      icon: <Sun className="w-4 h-4 text-amber-400" />,
      action: () => {
        cycleTimeOfDay();
        onClose();
      }
    },
    {
      id: 'cmd-sound',
      category: 'ENVIRONMENT',
      title: 'Toggle Audio & Sound Effects',
      description: 'Mute or unmute synthesized Web Audio engine sounds',
      icon: <Volume2 className="w-4 h-4 text-purple-300" />,
      action: () => {
        const muted = carAudio.toggleMute();
        setAudioEnabled(!muted);
        onClose();
      }
    },
    {
      id: 'cmd-reader',
      category: 'ENVIRONMENT',
      title: 'Toggle 2D Accessible Reader Mode',
      description: 'Switch between interactive 3D driving and 2D document view',
      icon: <BookOpen className="w-4 h-4 text-emerald-400" />,
      action: () => {
        setIsClassicMode(!isClassicMode);
        onClose();
      }
    },
    {
      id: 'cmd-reset',
      category: 'ENVIRONMENT',
      title: 'Reset Vehicle Position',
      description: 'Teleport off-roader back to the central Spawn Plaza',
      icon: <RotateCcw className="w-4 h-4 text-rose-400" />,
      action: () => {
        window.dispatchEvent(new CustomEvent('car-teleport', { detail: [0, 1.2, 0] }));
        onClose();
      }
    }
  ];

  // Fuzzy filter
  const filtered = commandList.filter((cmd) => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    return (
      cmd.title.toLowerCase().includes(query) ||
      cmd.description.toLowerCase().includes(query) ||
      cmd.category.toLowerCase().includes(query)
    );
  });

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      data-modal-active="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(7, 4, 13, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)'
      }}
      className="p-4 sm:p-6 select-none font-inter animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        style={{
          width: 'min(720px, 94vw)',
          maxHeight: '78vh',
          borderRadius: '20px'
        }}
        className="relative bg-[#120B22] text-slate-100 shadow-[0_0_60px_rgba(56,189,248,0.25),0_25px_60px_rgba(0,0,0,0.9)] border border-cyan-400/50 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-5 py-4 border-b border-purple-500/25 bg-[#0C0717]">
          <Search className="w-5 h-5 text-cyan-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search portfolio..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-none text-white text-base md:text-lg placeholder-purple-300/40 focus:outline-none font-inter"
          />
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-950/70 border border-purple-500/30 text-[10px] font-mono text-purple-300 shrink-0">
            <span>ESC TO EXIT</span>
          </div>
        </div>

        {/* Command Results List */}
        <div className="p-3 overflow-y-auto game-modal-scroll max-h-[58vh] space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm font-inter">
              No matching commands found for "{search}".
            </div>
          ) : (
            filtered.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => cmd.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? 'bg-linear-to-r from-purple-900/60 to-cyan-950/40 border border-cyan-400/50 shadow-md translate-x-1'
                      : 'hover:bg-purple-950/40 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                        isSelected
                          ? 'bg-cyan-500/20 border-cyan-400/50 scale-105'
                          : 'bg-purple-950/50 border-purple-500/30'
                      }`}
                    >
                      {cmd.icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-space font-bold text-sm text-white truncate">
                          {cmd.title}
                        </span>
                        {cmd.badge && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                            {cmd.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-purple-300/80 truncate font-inter">
                        {cmd.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-2 shrink-0">
                    <span className="text-[10px] font-mono font-semibold uppercase text-purple-400/70 hidden sm:inline">
                      {cmd.category}
                    </span>
                    <ArrowRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? 'text-cyan-300 translate-x-1' : 'text-purple-500 opacity-40'
                      }`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-purple-500/20 bg-[#0C0717] text-[11px] font-mono text-purple-300/80">
          <div className="flex items-center gap-3">
            <span>&uarr;&darr; Navigate</span>
            <span>&crarr; Select</span>
            <span>Esc Close</span>
          </div>
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>COMMAND CENTER 4.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
