import React, { useState, useEffect } from 'react';
import { X, Navigation, Compass, Sparkles, CheckCircle2, ChevronRight, MapPin } from 'lucide-react';
import { vehicleState } from './VehiclePhysics';
import { carAudio } from './CarAudio';

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200 select-none">
      {/* Main Map Card occupying 85-90% of viewport width */}
      <div className="relative w-[94vw] max-w-5xl h-[88vh] bg-slate-900/95 border-2 border-purple-500/40 rounded-3xl shadow-[0_0_60px_rgba(168,85,247,0.35)] overflow-hidden flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 rounded-full bg-blue-500 animate-ping" />
            <div>
              <h2 className="text-sm md:text-base font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
                WORLD MAP <span className="text-xs text-purple-400 font-sans">[M]</span>
              </h2>
              <p className="text-[11px] text-slate-400 font-sans hidden sm:block">
                Top-down tactical radar • Click any landmark or station to fast-travel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono">
              <Compass className="w-4 h-4 text-orange-400 animate-spin" style={{ animationDuration: '10s' }} />
              EXPLORATION RADAR
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
                <circle cx="50" cy="50" r="8" fill="#21252F" stroke="#61A5FF" strokeWidth="0.8" />

                {/* Wooden Bridge at South */}
                <rect x="47" y="68" width="6" height="3" fill="#78350F" rx="0.5" />

                {/* 7. Cherry Blossom Groves (Pink dots) */}
                {[
                  [37, 65], [34, 69], [40, 70],
                  [61, 35], [66, 33], [68, 38],
                  [27, 30], [24, 34], [72, 65], [76, 68]
                ].map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r="1.5" fill="#FF70A6" opacity="0.9" />
                ))}
              </svg>

              {/* 8. Six Distinct Landmark Pins on the Map */}
              {landmarks.map((lm) => {
                const svgX = toSvgX(lm.worldPos[0]);
                const svgY = toSvgY(lm.worldPos[2]);
                const isDiscovered = !!discoveredLandmarks[lm.id];
                const isSelected = selectedLandmark?.id === lm.id;

                return (
                  <div
                    key={lm.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-transform duration-150 hover:scale-110"
                    style={{ left: `${svgX}%`, top: `${svgY}%` }}
                    onClick={() => {
                      setSelectedLandmark(lm);
                      handleTeleport(lm);
                    }}
                  >
                    {/* Pulsing Target Ring */}
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center animate-ping absolute opacity-60 pointer-events-none"
                      style={{ backgroundColor: lm.color }}
                    />

                    {/* Interactive Marker Pin */}
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shadow-lg text-[9px] font-bold text-white transition-all ${
                        isSelected ? 'border-white scale-125 ring-2 ring-white' : 'border-slate-200'
                      }`}
                      style={{ backgroundColor: lm.color }}
                    >
                      ★
                    </div>

                    {/* Landmark Name Label (Carefully positioned to never overlap other landmarks) */}
                    <div
                      className={`absolute whitespace-nowrap text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow-lg border border-slate-700 bg-slate-900/90 text-white pointer-events-none transition-all ${
                        lm.labelOffset.align === 'center'
                          ? '-translate-x-1/2 left-1/2'
                          : lm.labelOffset.align === 'left'
                          ? 'left-4'
                          : 'right-4'
                      }`}
                      style={{
                        top: `${lm.labelOffset.y * 3.5}px`
                      }}
                    >
                      {lm.name}
                    </div>
                  </div>
                );
              })}

              {/* 9. Live Player Vehicle Position & Heading Indicator */}
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 transition-all duration-75"
                style={{
                  left: `${carCoords.x}%`,
                  top: `${carCoords.y}%`,
                  transform: `translate(-50%, -50%) rotate(${carCoords.heading}rad)`
                }}
              >
                {/* Forward Headlight Cones */}
                <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[24px] border-b-yellow-300/30 -mt-6 -ml-[6px] blur-[1px]" />
                {/* Outer Ping */}
                <div className="w-6 h-6 rounded-full bg-orange-500/40 animate-ping absolute -inset-0.5" />
                {/* Off-Road Car Icon Marker */}
                <div className="w-5 h-5 bg-gradient-to-tr from-red-600 to-orange-500 rounded-md border-2 border-white shadow-[0_0_15px_#FF5722] flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[8px] border-b-white -mt-0.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Landmark Navigation Dock */}
          <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-950/70 p-4 md:p-5 flex flex-col justify-between shrink-0 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Landmark Navigation
                </span>
                <span className="text-[10px] font-mono text-purple-400">
                  {Object.keys(discoveredLandmarks).length} / 6 DISCOVERED
                </span>
              </div>

              {/* Landmark Fast-Travel List */}
              <div className="space-y-2">
                {landmarks.map((lm) => {
                  const isDiscovered = !!discoveredLandmarks[lm.id];

                  return (
                    <button
                      key={lm.id}
                      onClick={() => handleTeleport(lm)}
                      className="w-full group flex items-center justify-between p-2.5 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 hover:border-purple-500/50 text-left transition-all active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 border border-white/10 shadow"
                          style={{ backgroundColor: `${lm.color}30`, borderColor: lm.color }}
                        >
                          {lm.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                            {lm.name}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {lm.category}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isDiscovered ? (
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                            VISITED
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-500">
                            DRIVE
                          </span>
                        )}
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Helper at Bottom */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Press <strong className="text-white">[M]</strong> or <strong className="text-white">[ESC]</strong> to return to driving</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
