import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Navigation,
  Compass,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Target,
  Gem,
  Trophy,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Route
} from 'lucide-react';
import { vehicleState } from './VehiclePhysics';
import { carAudio } from './CarAudio';
import { MISSIONS, CRYSTALS, useGameStore } from '../../store/gameStore';

export interface LandmarkData {
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
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Game store data
  const currentMissionId = useGameStore((s) => s.currentMissionId);
  const completedMissions = useGameStore((s) => s.completedMissions);
  const collectedCrystals = useGameStore((s) => s.collectedCrystals);
  const activeMission = MISSIONS.find((m) => m.id === currentMissionId);

  // Authoritative 6 portfolio landmarks with ground-truth coordinates in Folio's 192x192 world
  const landmarks: LandmarkData[] = [
    {
      id: 'landing',
      name: 'Developer City',
      category: 'Identity & Monument',
      worldPos: [39.5, 1.2, 37.8],
      color: '#8B5CF6',
      icon: '🏙️',
      labelOffset: { x: 5, y: 7, align: 'left' },
      description: 'Central plaza, NITISH PRIYAN 3D monument, 3D developer avatar, World Map kiosk, and recruiter dossier terminal.'
    },
    {
      id: 'lab',
      name: 'AI Research Lab',
      category: 'Machine Learning & Vision',
      worldPos: [17.9, 1.2, 18.8],
      color: '#06B6D4',
      icon: '🧪',
      labelOffset: { x: -6, y: -4, align: 'right' },
      description: 'Predictive ML models, Diabetic Retinopathy Vision AI, MLOps drift monitoring, and Gemini AI legal research platform.'
    },
    {
      id: 'projects',
      name: 'Project Universe',
      category: 'Flagship Creations',
      worldPos: [35.8, 1.2, 17.6],
      color: '#3B82F6',
      icon: '🚀',
      labelOffset: { x: 6, y: -4, align: 'left' },
      description: 'GovScheme (Patent Filed), LEXORA AI Legal Research, and Student Performance Prediction MLOps.'
    },
    {
      id: 'career',
      name: 'Engineering District',
      category: 'Java & Systems Stack',
      worldPos: [26.3, 1.2, 9.6],
      color: '#EC4899',
      icon: '⚡',
      labelOffset: { x: 6, y: 0, align: 'left' },
      description: 'Enterprise Java SE 17, 250+ LeetCode DSA, PostgreSQL, Docker, and REST API architectures.'
    },
    {
      id: 'achievements',
      name: 'Achievement Arena',
      category: 'Verified Credentials',
      worldPos: [70.0, 1.2, 20.4],
      color: '#F59E0B',
      icon: '🏆',
      labelOffset: { x: 5, y: 7, align: 'left' },
      description: 'Oracle Certified Associate Java SE 17, AWS Cloud Practitioner, Cisco Cybersecurity, and SIH 2025.'
    },
    {
      id: 'social',
      name: 'Contact Spaceport',
      category: 'Communications & Resume',
      worldPos: [25.7, 1.2, -14.5],
      color: '#10B981',
      icon: '📡',
      labelOffset: { x: -6, y: 0, align: 'right' },
      description: 'Direct communication terminal: Email, GitHub, LinkedIn, and verified resume PDF download.'
    }
  ];

  // Mathematical Coordinate Mapping for Folio 2025 Terrain
  // Terrain size = 192 units ([-96, 96] in X and Z) -> mapped precisely to [0%, 100%]
  const toSvgX = (x: number) => ((x / 192) + 0.5) * 100;
  const toSvgY = (z: number) => ((z / 192) + 0.5) * 100;

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

  // Pan & Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

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

  const handleSetWaypoint = (lm: LandmarkData) => {
    carAudio.playChime();
    window.dispatchEvent(new CustomEvent('set-navigation-waypoint', { detail: lm }));
    onClose();
  };

  // Filter landmarks
  const filteredLandmarks = landmarks.filter((lm) =>
    lm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lm.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Live distance calculation to selected landmark
  const liveDistance = selectedLandmark
    ? Math.round(
        Math.hypot(
          selectedLandmark.worldPos[0] - (vehicleState.position.x || 0),
          selectedLandmark.worldPos[2] - (vehicleState.position.z || 0)
        )
      )
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200 select-none">
      {/* Main Map Modal Window */}
      <div className="relative w-[95vw] max-w-5xl h-[88vh] bg-slate-900/95 border-2 border-purple-500/40 rounded-3xl shadow-[0_0_60px_rgba(168,85,247,0.35)] overflow-hidden flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 animate-ping" />
            <div>
              <h2 className="text-sm md:text-base font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
                TACTICAL WORLD MAP & GPS RADAR <span className="text-xs text-purple-400 font-sans">[M]</span>
              </h2>
              <p className="text-[11px] text-slate-400 font-sans hidden sm:block">
                Top-down orthographic satellite world • Live GPS navigation • 6 Portfolio Districts
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
                Districts ({landmarks.length})
              </button>
              <button
                onClick={() => setActiveTab('missions')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'missions'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Missions ({completedMissions.length}/6)
              </button>
              <button
                onClick={() => setActiveTab('crystals')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'crystals'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Crystals ({collectedCrystals.length}/6)
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
          <div
            className="relative flex-1 flex items-center justify-center p-3 sm:p-5 bg-linear-to-b from-[#171222] to-[#0F0B18] overflow-hidden cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {/* SVG Map Canvas with authentic /folio-assets/ui/map/map-day.webp texture */}
            <div
              className="relative w-full h-full max-w-[620px] aspect-square rounded-2xl overflow-hidden border border-purple-500/30 shadow-2xl bg-[#0B1522] transition-transform duration-75"
              style={{
                transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`
              }}
            >
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* 1. Deep Oceanic Blue Base */}
                <rect width="100" height="100" fill="#0C1B2E" />

                {/* 2. Authentic High-Resolution Orthographic World Map Texture */}
                <image
                  href="/folio-assets/ui/map/map-day.webp"
                  x="0"
                  y="0"
                  width="100"
                  height="100"
                  preserveAspectRatio="none"
                  className="opacity-95"
                />

                {/* 3. Tactical Radar Grid Overlay */}
                <circle cx="50" cy="50" r="16" fill="none" stroke="#61A5FF" strokeWidth="0.25" opacity="0.25" />
                <circle cx="50" cy="50" r="32" fill="none" stroke="#61A5FF" strokeWidth="0.25" opacity="0.25" />
                <circle cx="50" cy="50" r="48" fill="none" stroke="#61A5FF" strokeWidth="0.25" opacity="0.25" />
                <line x1="50" y1="0" x2="50" y2="100" stroke="#61A5FF" strokeWidth="0.15" opacity="0.2" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="#61A5FF" strokeWidth="0.15" opacity="0.2" />

                {/* 4. Active Navigation Route Line (from car to selected landmark) */}
                {selectedLandmark && (
                  <g>
                    <line
                      x1={carCoords.x}
                      y1={carCoords.y}
                      x2={toSvgX(selectedLandmark.worldPos[0])}
                      y2={toSvgY(selectedLandmark.worldPos[2])}
                      stroke="#00F0FF"
                      strokeWidth="0.9"
                      strokeDasharray="2, 2"
                      strokeLinecap="round"
                      className="animate-pulse"
                    />
                    {/* Destination Target Pulse Ring */}
                    <circle
                      cx={toSvgX(selectedLandmark.worldPos[0])}
                      cy={toSvgY(selectedLandmark.worldPos[2])}
                      r="7.5"
                      fill="none"
                      stroke="#00F0FF"
                      strokeWidth="1.2"
                      className="animate-ping"
                      style={{
                        transformOrigin: `${toSvgX(selectedLandmark.worldPos[0])}px ${toSvgY(
                          selectedLandmark.worldPos[2]
                        )}px`
                      }}
                    />
                  </g>
                )}

                {/* 5. Active Mission Waypoint Ring */}
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
                      style={{
                        transformOrigin: `${toSvgX(activeMission.targetCoords[0])}px ${toSvgY(
                          activeMission.targetCoords[2]
                        )}px`
                      }}
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

                {/* 6. Technology Crystals Markers */}
                {CRYSTALS.map((crystal) => {
                  const cx = toSvgX(crystal.position[0]);
                  const cy = toSvgY(crystal.position[2]);
                  const isCol = collectedCrystals.includes(crystal.id);
                  return (
                    <g
                      key={crystal.id}
                      className="cursor-pointer"
                      onClick={() => handleTeleportCoords(crystal.position)}
                    >
                      {isCol ? (
                        <circle cx={cx} cy={cy} r="1.4" fill="#22C55E" stroke="#FFFFFF" strokeWidth="0.4" opacity="0.8" />
                      ) : (
                        <polygon
                          points={`${cx},${cy - 2.2} ${cx + 1.8},${cy} ${cx},${cy + 2.2} ${cx - 1.8},${cy}`}
                          fill={crystal.color}
                          stroke="#FFFFFF"
                          strokeWidth="0.5"
                        />
                      )}
                    </g>
                  );
                })}

                {/* 7. Six Authoritative Landmark Pins & Labels */}
                {landmarks.map((lm) => {
                  const cx = toSvgX(lm.worldPos[0]);
                  const cy = toSvgY(lm.worldPos[2]);
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
                          r="6.5"
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
                        r="3.8"
                        fill={lm.color}
                        stroke="#FFFFFF"
                        strokeWidth="1.1"
                        className="transition-transform duration-200 group-hover:scale-125"
                        style={{ transformOrigin: `${cx}px ${cy}px` }}
                      />

                      {/* Icon Glyph in Pin */}
                      <text
                        x={cx}
                        y={cy + 1.3}
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
                        fontSize="2.7"
                        fontWeight="bold"
                        fill="#FFFFFF"
                        stroke="#0F172A"
                        strokeWidth="0.9"
                        paintOrder="stroke fill"
                        className="pointer-events-none select-none font-sans drop-shadow-md tracking-wide"
                      >
                        {lm.name}
                      </text>
                    </g>
                  );
                })}

                {/* 8. Real-Time Player Vehicle Marker & Heading Arrow */}
                <g
                  transform={`translate(${carCoords.x}, ${carCoords.y}) rotate(${(carCoords.heading * 180) / Math.PI})`}
                  style={{ transition: 'transform 0.05s linear' }}
                >
                  {/* Subtle Pulse Halo */}
                  <circle cx="0" cy="0" r="4.5" fill="#00F0FF" opacity="0.35" className="animate-ping" />

                  {/* Player Vehicle Pin Icon */}
                  <image
                    href="/folio-assets/ui/map/player.webp"
                    x="-2.8"
                    y="-2.8"
                    width="5.6"
                    height="5.6"
                  />

                  {/* Forward Heading Direction Cone */}
                  <polygon points="0,4.2 -1.4,2.2 1.4,2.2" fill="#FACC15" />
                </g>
              </svg>

              {/* Live Coordinates Readout Overlay */}
              <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-slate-950/85 border border-slate-700/60 backdrop-blur-md text-[10px] font-mono text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                GPS: [X: {(vehicleState.position.x || 0).toFixed(1)}, Z: {(vehicleState.position.z || 0).toFixed(1)}]
              </div>
            </div>

            {/* Floating Zoom & Pan Controls */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-slate-700/60 backdrop-blur-md text-slate-300 shadow-xl">
              <button
                onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-all"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.25))}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-all"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={resetView}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-all"
                title="Reset View"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Navigation / Fast-Travel Inspection Sidebar */}
          <div className="w-full lg:w-84 border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-950/70 p-4 md:p-5 flex flex-col justify-between overflow-y-auto">
            {activeTab === 'landmarks' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                    SELECT DESTINATION
                  </h3>
                  <span className="text-[11px] font-mono text-purple-400">
                    6 PORTFOLIO REGIONS
                  </span>
                </div>

                {/* Quick Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search district or tech..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-purple-500 font-sans"
                  />
                </div>

                {/* Landmark Selection List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1">
                  {filteredLandmarks.map((lm) => {
                    const isSelected = selectedLandmark?.id === lm.id;
                    const isDiscovered = !!discoveredLandmarks[lm.id];

                    return (
                      <button
                        key={lm.id}
                        onClick={() => setSelectedLandmark(lm)}
                        className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between group cursor-pointer ${
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{selectedLandmark.icon}</span>
                        <div>
                          <h4 className="text-sm font-bold text-white">{selectedLandmark.name}</h4>
                          <span className="text-[10px] font-mono text-purple-300 uppercase">
                            {selectedLandmark.category}
                          </span>
                        </div>
                      </div>
                      {liveDistance !== null && (
                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-cyan-300">{liveDistance}m</span>
                          <div className="text-[9px] font-mono text-slate-400">DISTANCE</div>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {selectedLandmark.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <button
                        onClick={() => handleSetWaypoint(selectedLandmark)}
                        className="py-2 px-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg transition-all active:scale-95 cursor-pointer"
                        title="Set in-game navigation route marker"
                      >
                        <Route className="w-3.5 h-3.5" />
                        NAVIGATE
                      </button>
                      <button
                        onClick={() => handleTeleport(selectedLandmark)}
                        className="py-2 px-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg transition-all active:scale-95 cursor-pointer"
                        title="Fast-travel immediately"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        FAST TRAVEL
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400">
                    Click any marker on the tactical map or list above to preview, calculate route and fast-travel.
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

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
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
                          className="mt-2 text-[10px] font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
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
                    {collectedCrystals.length}/6 COLLECTED
                  </span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
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
                            className="text-[10px] font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
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

            {/* Bottom Footer Tip */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-blue-400" />
                Press [M] to return to vehicle
              </span>
              <span className="text-purple-400">FOLIO 6.0 GPS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
