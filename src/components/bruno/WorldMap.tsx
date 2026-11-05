import React, { useState, useEffect } from 'react';
import { X, Navigation, Compass, Sparkles, CheckCircle2, ChevronRight, MapPin, Target, Gem, Trophy } from 'lucide-react';
import { vehicleState } from './VehiclePhysics';
import { carAudio } from './CarAudio';
import { MISSIONS, CRYSTALS, useGameStore } from '../../store/gameStore';

interface LandmarkData {
  id: string;
  name: string;
  category: string;
  worldPos: [number, number, number];
  color: string;
  icon: string;
  labelOffset: { x: number; y: number; align: 'left' | 'right' | 'center' };
  description: string;
}

interface WorldMapProps {
  isOpen: boolean;
  onClose: () => void;
  onTeleportTo: (coords: [number, number, number]) => void;
  discoveredLandmarks?: Record<string, boolean>;
}

export default function WorldMap({
  isOpen,
  onClose,
  onTeleportTo,
  discoveredLandmarks = {}
}: WorldMapProps) {
  const [carCoords, setCarCoords] = useState({ x: 50, y: 50, heading: 0 });
  const [selectedLandmark, setSelectedLandmark] = useState<LandmarkData | null>(null);
  const [activeTab, setActiveTab] = useState<'landmarks' | 'missions' | 'crystals'>('landmarks');

  // Game store data
  const currentMissionId = useGameStore((s) => s.currentMissionId);
  const completedMissions = useGameStore((s) => s.completedMissions);
  const collectedCrystals = useGameStore((s) => s.collectedCrystals);
  const activeMission = MISSIONS.find((m) => m.id === currentMissionId);

  // Authoritative 6 portfolio landmarks with exact 3D coordinates & non-overlapping label alignments
  const landmarks: LandmarkData[] = [
    {
      id: 'projects',
      name: 'Projects Exhibition',
      category: 'Featured Apps',
      worldPos: [0, 1.2, -36],
      color: '#3B82F6',
      icon: '🚀',
      labelOffset: { x: 0, y: -8, align: 'center' },
      description: 'Lexora, Govt Scheme Recommender, Project Zero, Movie Rec, WaterGrievance.'
    },
    {
      id: 'resume',
      name: 'Resume Archives',
      category: 'Credentials',
      worldPos: [36, 1.2, -31],
      color: '#06B6D4',
      icon: '📄',
      labelOffset: { x: 5, y: -7, align: 'left' },
      description: 'Full developer CV, educational background, and downloadable resume PDF.'
    },
    {
      id: 'skills',
      name: 'Skills Playground',
      category: 'Technical Stack',
      worldPos: [38, 1.2, -2],
      color: '#EC4899',
      icon: '⚡',
      labelOffset: { x: 6, y: 0, align: 'left' },
      description: 'Interactive Java, Python, C++, React, FastAPI, ML & smashable skill blocks.'
    },
    {
      id: 'experience',
      name: 'Experience & Honors',
      category: 'Achievements',
      worldPos: [34, 1.2, 31],
      color: '#F59E0B',
      icon: '🏆',
      labelOffset: { x: 5, y: 7, align: 'left' },
      description: 'Oracle Java SE 17 Certified, IoT Hackathon 3rd Place, 170+ DSA Problems.'
    },
    {
      id: 'about',
      name: 'About Me Pavilion',
      category: 'Identity',
      worldPos: [-34, 1.2, 25],
      color: '#8B5CF6',
      icon: '👤',
      labelOffset: { x: -5, y: 7, align: 'right' },
      description: 'Career journey, engineering philosophy, problem solving & ambitions.'
    },
    {
      id: 'contact',
      name: 'Contact Station',
      category: 'Communication',
      worldPos: [-42, 1.2, -8],
      color: '#10B981',
      icon: '📡',
      labelOffset: { x: -6, y: 0, align: 'right' },
      description: 'Transmission terminal with direct email, GitHub, LinkedIn & live contact form.'
    }
  ];

  // Map world coordinate [-70, 70] into 0-100% SVG coordinates
  const toSvgX = (x: number) => ((x + 70) / 140) * 100;
  const toSvgY = (z: number) => ((z + 70) / 140) * 100;

  // Real-time Vehicle Position Synchronization
  useEffect(() => {
    if (!isOpen) return;

    let animId: number;
    const update = () => {
      const curX = vehicleState.position.x || 0;
      const curZ = vehicleState.position.z || 0;
      const curHeading = vehicleState.heading || 0;

      setCarCoords({
        x: toSvgX(curX),
        y: toSvgY(curZ),
        heading: curHeading
      });

      animId = requestAnimationFrame(update);
    };

    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [isOpen]);

  // Key listeners to close map
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'm' || e.key === 'M' || e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleTeleport = (lm: LandmarkData) => {
    carAudio.playChime();
    onTeleportTo(lm.worldPos);
    onClose();
  };

  const handleTeleportCoords = (coords: [number, number, number]) => {
    carAudio.playChime();
    onTeleportTo(coords);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200 select-none">
      {/* Main Map Card occupying 94vw / max-w-5xl */}
      <div className="relative w-[94vw] max-w-5xl h-[88vh] bg-slate-900/95 border-2 border-purple-500/40 rounded-3xl shadow-[0_0_60px_rgba(168,85,247,0.35)] overflow-hidden flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 rounded-full bg-blue-500 animate-ping" />
            <div>
              <h2 className="text-sm md:text-base font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
                TACTICAL RADAR & MAP <span className="text-xs text-purple-400 font-sans">[M]</span>
              </h2>
              <p className="text-[11px] text-slate-400 font-sans hidden sm:block">
                Top-down tactical radar • Click any landmark, mission waypoint or crystal to fast-travel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-xl bg-slate-800/80 p-1 border border-slate-700 text-xs font-mono">
              <button
                onClick={() => setActiveTab('landmarks')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'landmarks'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Landmarks
              </button>
              <button
                onClick={() => setActiveTab('missions')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'missions'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Missions
              </button>
              <button
                onClick={() => setActiveTab('crystals')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'crystals'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Crystals ({collectedCrystals.length}/7)
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all active:scale-95 border border-slate-700"
              title="Close Map (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Map Body: Split into Interactive SVG Map (Left/Center) and Navigation Panel (Right) */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-[#171222]">
          {/* Main SVG Radar Map Viewport */}
          <div className="relative flex-1 flex items-center justify-center p-3 sm:p-5 bg-gradient-to-b from-[#171222] to-[#0F0B18] overflow-hidden">
            {/* SVG Map Canvas */}
            <div className="relative w-full h-full max-w-[560px] aspect-square rounded-2xl overflow-hidden border border-purple-500/30 shadow-2xl bg-[#0B1522]">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* 1. Surrounding Deep Ocean */}
                <rect width="100" height="100" fill="#0C1B2E" />

                {/* Subtle Radar Concentric Rings */}
                <circle cx="50" cy="50" r="15" fill="none" stroke="#61A5FF" strokeWidth="0.2" opacity="0.2" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="#61A5FF" strokeWidth="0.2" opacity="0.2" />
                <circle cx="50" cy="50" r="44" fill="none" stroke="#61A5FF" strokeWidth="0.3" opacity="0.3" />

                {/* 2. Main Stylized Island Landmass (Warm Orange & Peach) */}
                <circle cx="50" cy="50" r="44" fill="#FF9A45" />
                <circle cx="50" cy="50" r="34" fill="#FFB66D" />

                {/* 3. Glowing Neon Blue & Purple Perimeter Border */}
                <circle cx="50" cy="44" r="44" fill="none" stroke="#61A5FF" strokeWidth="1.2" />
                <circle cx="50" cy="50" r="44" fill="none" stroke="#61A5FF" strokeWidth="1.2" />
                <circle cx="50" cy="50" r="43.2" fill="none" stroke="#A855F7" strokeWidth="0.8" opacity="0.8" />

                {/* 4. Green Vegetation Areas */}
                <circle cx="34" cy="62" r="7" fill="#22C55E" opacity="0.85" />
                <circle cx="68" cy="38" r="8" fill="#22C55E" opacity="0.85" />
                <circle cx="32" cy="34" r="7" fill="#22C55E" opacity="0.85" />
                <circle cx="64" cy="66" r="7.5" fill="#22C55E" opacity="0.85" />

                {/* 5. Stylized Lakes (Cyan Water with Glowing Shoreline) */}
                <circle cx="36" cy="37" r="6" fill="#38BDF8" stroke="#61A5FF" strokeWidth="0.8" />
                <circle cx="63" cy="61" r="5.5" fill="#38BDF8" stroke="#61A5FF" strokeWidth="0.8" />

                {/* 6. Racing Circuit Road Network */}
                {/* Outer Ring Boulevard */}
                <circle cx="50" cy="50" r="26" fill="none" stroke="#21252F" strokeWidth="7" />
                {/* Red-White Track Border Dashes */}
                <circle cx="50" cy="50" r="29.2" fill="none" stroke="#EF4444" strokeWidth="0.8" strokeDasharray="1.5, 1.5" />
                <circle cx="50" cy="50" r="22.8" fill="none" stroke="#FFFFFF" strokeWidth="0.8" strokeDasharray="1.5, 1.5" />

                {/* North-South & East-West Avenues */}
                <line x1="50" y1="12" x2="50" y2="88" stroke="#21252F" strokeWidth="7" />
                <line x1="12" y1="50" x2="88" y2="50" stroke="#21252F" strokeWidth="7" />

                {/* Center Plaza Roundabout */}
                <circle cx="50" cy="50" r="9" fill="#21252F" stroke="#334155" strokeWidth="1" />
                <circle cx="50" cy="50" r="4.5" fill="#FF9A45" stroke="#61A5FF" strokeWidth="0.8" />

                {/* 7. Cherry Blossom Trees (Pink Groves) */}
                <circle cx="48" cy="22" r="3.2" fill="#FF70A6" opacity="0.95" />
                <circle cx="52" cy="23" r="2.8" fill="#FF70A6" opacity="0.95" />
                <circle cx="50" cy="78" r="3.5" fill="#FF70A6" opacity="0.95" />
                <circle cx="78" cy="48" r="3.2" fill="#FF70A6" opacity="0.95" />
                <circle cx="22" cy="52" r="3.2" fill="#FF70A6" opacity="0.95" />

                {/* 8. Active Mission Waypoint Pulse Ring */}
                {activeMission && (
                  <g>
                    <circle
                      cx={toSvgX(activeMission.targetCoords[0])}
                      cy={toSvgY(activeMission.targetCoords[2])}
                      r="6.5"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="1.2"
                      className="animate-ping"
                      style={{ transformOrigin: `${toSvgX(activeMission.targetCoords[0])}px ${toSvgY(activeMission.targetCoords[2])}px` }}
                    />
                    <circle
                      cx={toSvgX(activeMission.targetCoords[0])}
                      cy={toSvgY(activeMission.targetCoords[2])}
                      r="3.5"
                      fill="#F59E0B"
                      stroke="#FFFFFF"
                      strokeWidth="0.8"
                    />
                  </g>
                )}

                {/* 9. Technology Crystals Markers */}
                {CRYSTALS.map((crystal) => {
                  const cx = toSvgX(crystal.position[0]);
                  const cy = toSvgY(crystal.position[2]);
                  const isCol = collectedCrystals.includes(crystal.id);
                  return (
                    <g key={crystal.id} className="cursor-pointer" onClick={() => handleTeleportCoords(crystal.position)}>
                      {isCol ? (
                        <circle cx={cx} cy={cy} r="1.4" fill="#22C55E" stroke="#FFFFFF" strokeWidth="0.4" opacity="0.8" />
                      ) : (
                        <g>
                          <polygon
                            points={`${cx},${cy - 2.2} ${cx + 1.8},${cy} ${cx},${cy + 2.2} ${cx - 1.8},${cy}`}
                            fill={crystal.color}
                            stroke="#FFFFFF"
                            strokeWidth="0.5"
                          />
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* 10. Six Authoritative Landmark Pins & Labels */}
                {landmarks.map((lm) => {
                  const cx = toSvgX(lm.worldPos[0]);
                  const cy = toSvgY(lm.worldPos[2]);
                  const isDiscovered = !!discoveredLandmarks[lm.id];
                  const isSelected = selectedLandmark?.id === lm.id;

                  const textAnchor =
                    lm.labelOffset.align === 'center'
                      ? 'middle'
                      : lm.labelOffset.align === 'left'
                      ? 'start'
                      : 'end';

                  return (
                    <g
                      key={lm.id}
                      className="cursor-pointer group"
                      onClick={() => setSelectedLandmark(lm)}
                    >
                      {/* Pulsing selection aura */}
                      {isSelected && (
                        <circle
                          cx={cx}
                          cy={cy}
                          r="6"
                          fill="none"
                          stroke={lm.color}
                          strokeWidth="1.2"
                          strokeDasharray="2, 2"
                          className="animate-spin"
                          style={{ transformOrigin: `${cx}px ${cy}px` }}
                        />
                      )}

                      {/* Landmark Ground Pin */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r="3.6"
                        fill={lm.color}
                        stroke="#FFFFFF"
                        strokeWidth="1.0"
                        className="transition-transform duration-200 group-hover:scale-125"
                        style={{ transformOrigin: `${cx}px ${cy}px` }}
                      />

                      {/* Icon Glyph in Pin */}
                      <text
                        x={cx}
                        y={cy + 1.2}
                        textAnchor="middle"
                        fontSize="2.4"
                        fill="#FFFFFF"
                        className="pointer-events-none select-none font-bold"
                      >
                        {lm.icon}
                      </text>

                      {/* Landmark Name Label */}
                      <text
                        x={cx + lm.labelOffset.x}
                        y={cy + lm.labelOffset.y}
                        textAnchor={textAnchor}
                        fontSize="2.6"
                        fontWeight="bold"
                        fill="#FFFFFF"
                        stroke="#0F172A"
                        strokeWidth="0.8"
                        paintOrder="stroke fill"
                        className="pointer-events-none select-none font-sans drop-shadow-md tracking-wide"
                      >
                        {lm.name}
                      </text>
                    </g>
                  );
                })}

                {/* 11. Real-Time Player Vehicle Marker & Heading Pointer */}
                <g
                  transform={`translate(${carCoords.x}, ${carCoords.y}) rotate(${(carCoords.heading * 180) / Math.PI})`}
                  style={{ transition: 'transform 0.05s linear' }}
                >
                  {/* Subtle Pulse Halo */}
                  <circle cx="0" cy="0" r="4.2" fill="#38BDF8" opacity="0.3" className="animate-ping" />

                  {/* Red Car Representation */}
                  <rect
                    x="-1.6"
                    y="-2.4"
                    width="3.2"
                    height="4.8"
                    rx="0.8"
                    fill="#EF4444"
                    stroke="#FFFFFF"
                    strokeWidth="0.6"
                  />

                  {/* Forward Heading Direction Cone */}
                  <polygon points="0,3.8 -1.2,1.8 1.2,1.8" fill="#FACC15" />
                  {/* Windshield */}
                  <rect x="-1.1" y="-0.8" width="2.2" height="1.2" rx="0.3" fill="#38BDF8" opacity="0.9" />
                </g>
              </svg>

              {/* Live Coordinates Readout Overlay */}
              <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-700/60 backdrop-blur-md text-[10px] font-mono text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                POS: [X: {vehicleState.position.x.toFixed(1)}, Z: {vehicleState.position.z.toFixed(1)}]
              </div>
            </div>
          </div>

          {/* Right Navigation / Fast-Travel Inspection Sidebar */}
          <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-950/70 p-4 md:p-5 flex flex-col justify-between overflow-y-auto">
            {activeTab === 'landmarks' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                    SELECT DESTINATION
                  </h3>
                  <span className="text-[11px] font-mono text-purple-400">
                    {Object.keys(discoveredLandmarks).length}/6 DISCOVERED
                  </span>
                </div>

                {/* Landmark Selection List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                  {landmarks.map((lm) => {
                    const isSelected = selectedLandmark?.id === lm.id;
                    const isDiscovered = !!discoveredLandmarks[lm.id];

                    return (
                      <button
                        key={lm.id}
                        onClick={() => setSelectedLandmark(lm)}
                        className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between group ${
                          isSelected
                            ? 'bg-purple-950/40 border-purple-500/70 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                            style={{ backgroundColor: `${lm.color}25`, color: lm.color }}
                          >
                            {lm.icon}
                          </span>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white truncate group-hover:text-purple-300 transition-colors">
                              {lm.name}
                            </h4>
                            <p className="text-[10px] text-slate-400 truncate">{lm.category}</p>
                          </div>
                        </div>

                        {isDiscovered ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Selected Landmark Details Card */}
                {selectedLandmark ? (
                  <div className="mt-3 p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{selectedLandmark.icon}</span>
                      <div>
                        <h4 className="text-sm font-bold text-white">{selectedLandmark.name}</h4>
                        <span className="text-[10px] font-mono text-purple-300 uppercase">
                          {selectedLandmark.category}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {selectedLandmark.description}
                    </p>
                    <button
                      onClick={() => handleTeleport(selectedLandmark)}
                      className="w-full mt-2 py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      FAST TRAVEL TO LOCATION
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400">
                    Click any marker on the radar or list above to preview and fast-travel.
                  </div>
                )}
              </div>
            )}

            {activeTab === 'missions' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                    EXPLORATION MISSIONS
                  </h3>
                  <span className="text-[11px] font-mono text-blue-400">
                    {completedMissions.length}/6 COMPLETED
                  </span>
                </div>

                <div className="space-y-2">
                  {MISSIONS.map((mission) => {
                    const isDone = completedMissions.includes(mission.id);
                    const isCurrent = currentMissionId === mission.id;

                    return (
                      <div
                        key={mission.id}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isCurrent
                            ? 'bg-blue-950/40 border-blue-500/70 shadow-md'
                            : isDone
                            ? 'bg-emerald-950/20 border-emerald-500/40 opacity-80'
                            : 'bg-slate-900/60 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono font-bold text-slate-400 flex items-center gap-1.5">
                            {mission.badge} MISSION 0{mission.order}
                          </span>
                          {isDone ? (
                            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> DONE
                            </span>
                          ) : isCurrent ? (
                            <span className="text-[10px] font-mono text-amber-400 animate-pulse flex items-center gap-1">
                              <Target className="w-3 h-3" /> ACTIVE
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-slate-500">QUEUED</span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-white">{mission.title}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{mission.description}</p>
                        <button
                          onClick={() => handleTeleportCoords(mission.targetCoords)}
                          className="mt-2 text-[10px] font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1"
                        >
                          <Navigation className="w-3 h-3" /> Drive / Fast-Travel to Mission &rarr;
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'crystals' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                    TECH CRYSTALS
                  </h3>
                  <span className="text-[11px] font-mono text-amber-400">
                    {collectedCrystals.length}/7 COLLECTED
                  </span>
                </div>

                <div className="space-y-2">
                  {CRYSTALS.map((crystal) => {
                    const isCollected = collectedCrystals.includes(crystal.id);
                    return (
                      <div
                        key={crystal.id}
                        className={`p-2 rounded-xl border flex items-center justify-between ${
                          isCollected
                            ? 'bg-emerald-950/30 border-emerald-500/40'
                            : 'bg-slate-900/60 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
                            style={{ backgroundColor: `${crystal.color}25`, color: crystal.color }}
                          >
                            💎
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-white">{crystal.name}</h4>
                            <p className="text-[10px] text-slate-400">{crystal.category}</p>
                          </div>
                        </div>

                        {isCollected ? (
                          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> FOUND
                          </span>
                        ) : (
                          <button
                            onClick={() => handleTeleportCoords(crystal.position)}
                            className="text-[10px] font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1"
                          >
                            Locate &rarr;
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom Footer Teleport Tip */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-blue-400" />
                Press [M] to return to vehicle
              </span>
              <span className="text-purple-400">UPGRADE 2.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
