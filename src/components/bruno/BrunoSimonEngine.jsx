import React, { useRef, useEffect, useState, useCallback } from 'react';
import LandmarkOverlay from './modals/LandmarkOverlay';
import RecruiterModal from './modals/RecruiterModal';
import { Volume2, VolumeX, FileText, UserCheck, RotateCcw, Compass, ArrowLeft } from 'lucide-react';
import { projects } from '../../data/portfolio';

export default function BrunoSimonEngine({
  onOpenRecruiter,
  onSwitchClassic,
  soundEnabled = true,
  onToggleSound
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const gameRef = useRef(null);

  // Modal states
  const [activeLandmark, setActiveLandmark] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isRecruiterOpen, setIsRecruiterOpen] = useState(false);
  const [isSoundMuted, setIsSoundMuted] = useState(!soundEnabled);
  const [telemetry, setTelemetry] = useState({ speed: 0, gear: '1', nitro: 100 });
  const [showControlsHint, setShowControlsHint] = useState(true);

  // Initialize Bruno Simon Folio 2025 Engine
  useEffect(() => {
    let isMounted = true;
    let animId = null;

    // Load Three.js prototype override first, then instantiate Game
    import('../../engine/folio/threejs-override.js')
      .then(() => import('../../engine/folio/Game/Game.js'))
      .then(({ Game }) => {
        if (!isMounted || !containerRef.current || !canvasRef.current) return;

        // Clean any existing singleton instance
        if (Game.instance) {
          try {
            Game.instance.destroy();
          } catch (e) {
            console.warn('Previous game instance cleanup warning:', e);
          }
        }

        // Instantiate new authentic Folio 2025 engine
        const game = new Game(containerRef.current, canvasRef.current);
        gameRef.current = game;

        // Hook Interactive Points into our React Modals
        if (game.interactivePoints && game.interactivePoints.events) {
          game.interactivePoints.events.on('interact', (item) => {
            if (!item || !item.name) return;
            const name = item.name.toLowerCase();

            // Pause vehicle movement while modal is open
            if (game.inputs?.pause) {
              game.inputs.pause();
            }

            if (name.includes('project')) {
              setSelectedProject(projects[0]);
              setActiveLandmark('projects');
            } else if (name.includes('lab') || name.includes('skill')) {
              setActiveLandmark('skills');
            } else if (name.includes('career') || name.includes('education')) {
              setActiveLandmark('education');
            } else if (name.includes('achievement')) {
              setActiveLandmark('experience');
            } else if (name.includes('social') || name.includes('contact') || name.includes('mail')) {
              setActiveLandmark('contact');
            } else if (name.includes('recruiter')) {
              setIsRecruiterOpen(true);
            } else {
              setActiveLandmark('about');
            }
          });
        }

        // Telemetry updater loop
        const updateTelemetry = () => {
          if (!isMounted) return;
          if (game.physicalVehicle) {
            const rawSpeed = Math.abs(game.physicalVehicle.speed || 0);
            const kmh = Math.round(rawSpeed * 3.6 * 4.5);
            let currentGear = '1';
            if (kmh < 2) currentGear = 'N';
            else if (kmh < 25) currentGear = '1';
            else if (kmh < 50) currentGear = '2';
            else if (kmh < 75) currentGear = '3';
            else if (kmh < 100) currentGear = '4';
            else currentGear = '5';

            if (game.player?.boosting) {
              currentGear = 'NITRO';
            }

            setTelemetry({
              speed: kmh,
              gear: currentGear,
              nitro: Math.round(Math.max(0, 100 - (game.player?.boosting || 0) * 10))
            });
          }
          animId = requestAnimationFrame(updateTelemetry);
        };
        animId = requestAnimationFrame(updateTelemetry);
      })
      .catch((err) => {
        console.error('Failed to initialize Bruno Simon Folio engine:', err);
      });

    // Fade out controls hint after 8 seconds
    const hintTimer = setTimeout(() => {
      setShowControlsHint(false);
    }, 8000);

    return () => {
      isMounted = false;
      cancelAnimationFrame(animId);
      clearTimeout(hintTimer);
      if (gameRef.current?.destroy) {
        try {
          gameRef.current.destroy();
        } catch (e) {
          console.warn('Game teardown error:', e);
        }
        gameRef.current = null;
      }
    };
  }, []);

  // Handle modal close & resume vehicle inputs
  const handleCloseModal = useCallback(() => {
    setActiveLandmark(null);
    setSelectedProject(null);
    setIsRecruiterOpen(false);
    if (gameRef.current?.inputs?.resume) {
      gameRef.current.inputs.resume();
    }
  }, []);

  // Handle audio toggle
  const handleToggleMute = useCallback(() => {
    setIsSoundMuted((prev) => {
      const next = !prev;
      if (gameRef.current?.audio?.mute) {
        if (next) gameRef.current.audio.mute();
        else gameRef.current.audio.unmute();
      }
      if (onToggleSound) onToggleSound();
      return next;
    });
  }, [onToggleSound]);

  // Handle manual respawn
  const handleRespawn = useCallback(() => {
    if (gameRef.current?.reset) {
      gameRef.current.reset();
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="game fixed inset-0 w-full h-full overflow-hidden select-none bg-[#0D111A] touch-none"
    >
      {/* 1. THREE.JS WEBGPU / WEBGL2 CANVAS */}
      <canvas ref={canvasRef} className="js-canvas w-full h-full block cursor-grab active:cursor-grabbing" />

      {/* 2. FOLIO 2025 VIRTUAL TOUCH BUTTONS */}
      <div className="js-touch-buttons touch-buttons pointer-events-none">
        <div className="js-overlay overlay" />
        <div className="list">
          <button data-name="interact" className="js-button interact">Interact</button>
          <button data-name="unstuck" className="js-button unstuck">Unstuck</button>
          <button data-name="previous" className="js-button previous" />
          <button data-name="next" className="js-button next" />
          <button data-name="open" className="js-button open" />
          <button data-name="close" className="js-button close" />
        </div>
      </div>
      <button className="js-menu-trigger menu-trigger hidden" />
      <button className="js-map-trigger map-trigger hidden" />

      {/* 3. RETRO-FUTURISTIC HUD OVERLAY */}
      {/* Top Header Bar */}
      <div className="fixed top-4 left-4 right-4 z-40 flex items-center justify-between pointer-events-none">
        {/* Left: Driver Telemetry & Return */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            onClick={() => {
              if (onSwitchClassic) onSwitchClassic();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0F1424]/85 border border-white/10 hover:border-amber-500/40 text-slate-300 hover:text-white text-xs font-mono backdrop-blur-md transition-all shadow-lg active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
            <span>2D READER</span>
          </button>

          {/* Quick Landmark Jump */}
          <div className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-[#0F1424]/85 border border-white/10 backdrop-blur-md">
            {[
              { id: 'projects', label: 'Projects' },
              { id: 'skills', label: 'Skills' },
              { id: 'experience', label: 'Honors' },
              { id: 'education', label: 'Education' },
              { id: 'contact', label: 'Contact' }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => {
                  if (gameRef.current?.inputs?.pause) gameRef.current.inputs.pause();
                  if (btn.id === 'projects') setSelectedProject(projects[0]);
                  setActiveLandmark(btn.id);
                }}
                className="px-2.5 py-1 rounded-lg text-xs font-mono text-slate-300 hover:text-amber-400 hover:bg-white/5 transition-all cursor-pointer"
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Sound & Recruiter Fast-Track */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={handleToggleMute}
            className="p-2 rounded-xl bg-[#0F1424]/85 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-all backdrop-blur-md shadow-lg active:scale-95 cursor-pointer"
            title={isSoundMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isSoundMuted ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-amber-400" />
            )}
          </button>

          <button
            onClick={handleRespawn}
            className="p-2 rounded-xl bg-[#0F1424]/85 border border-white/10 hover:border-white/20 text-slate-300 hover:text-amber-400 transition-all backdrop-blur-md shadow-lg active:scale-95 cursor-pointer"
            title="Respawn Car (Press R)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (gameRef.current?.inputs?.pause) gameRef.current.inputs.pause();
              if (onOpenRecruiter) onOpenRecruiter();
              else setIsRecruiterOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold font-mono text-xs shadow-lg shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>RECRUITER DOSSIER</span>
          </button>
        </div>
      </div>

      {/* Bottom Telemetry HUD */}
      <div className="fixed bottom-4 left-4 z-40 pointer-events-none">
        <div className="flex items-end gap-3 p-3 rounded-2xl bg-[#0F1424]/90 border border-white/10 backdrop-blur-md shadow-2xl">
          {/* Speed Number */}
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-amber-400/80 tracking-wider">SPEED</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black font-mono text-white tracking-tighter">
                {telemetry.speed}
              </span>
              <span className="text-xs font-mono text-slate-400">KM/H</span>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="w-[1px] h-9 bg-white/10" />

          {/* Gear Indicator */}
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-amber-400/80 tracking-wider">GEAR</span>
            <span className="text-xl font-black font-mono text-amber-400">
              {telemetry.gear}
            </span>
          </div>
        </div>
      </div>

      {/* Floating Controls Hint (First 8 seconds) */}
      {showControlsHint && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none transition-opacity duration-1000">
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-black/80 border border-amber-500/30 text-slate-200 text-xs font-mono backdrop-blur-md shadow-xl animate-pulse">
            <span className="text-amber-400 font-bold">CONTROLS:</span>
            <span>WASD / Arrows to Drive</span>
            <span className="text-white/30">•</span>
            <span>SPACE to Brake</span>
            <span className="text-white/30">•</span>
            <span>SHIFT for Nitro</span>
            <span className="text-white/30">•</span>
            <span>ENTER on Badges</span>
          </div>
        </div>
      )}

      {/* 4. MODALS & SECTION PRESENTERS */}
      <LandmarkOverlay
        activeLandmark={activeLandmark}
        isOpen={!!activeLandmark}
        onClose={handleCloseModal}
        initialProject={selectedProject}
      />

      <RecruiterModal
        isOpen={isRecruiterOpen}
        onClose={handleCloseModal}
        onOpenProject={() => {
          handleCloseModal();
          setSelectedProject(projects[0]);
          setActiveLandmark('projects');
        }}
        onSwitchClassic={() => {
          handleCloseModal();
          if (onSwitchClassic) onSwitchClassic();
        }}
      />
    </div>
  );
}
