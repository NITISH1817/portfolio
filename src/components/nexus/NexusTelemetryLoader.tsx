import React, { useState, useEffect } from 'react';
import { Cpu, Zap, Shield, ArrowLeft, FileText } from 'lucide-react';

interface NexusTelemetryLoaderProps {
  onCancel?: () => void;
  onSwitchClassic?: () => void;
}

export default function NexusTelemetryLoader({
  onCancel,
  onSwitchClassic
}: NexusTelemetryLoaderProps) {
  const [progress, setProgress] = useState(15);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Initializing WebGL Canvas & HDR Pipeline...',
    'Compiling Rapier 3D WASM Physics Engine...',
    'Streaming NEXUS 6 Cyber City Districts...',
    'Calibrating Cyber Interceptor Suspension & Telemetry...'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        const next = prev + Math.floor(Math.random() * 18) + 8;
        return Math.min(next, 95);
      });
    }, 280);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress < 30) setCurrentStep(0);
    else if (progress < 60) setCurrentStep(1);
    else if (progress < 85) setCurrentStep(2);
    else setCurrentStep(3);
  }, [progress]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080A12] text-white font-mono">
      {/* Background Cyber Grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #38BDF8 1px, transparent 1px),
            linear-gradient(to bottom, #A855F7 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#0F1424] border border-cyan-500/40 shadow-[0_0_80px_rgba(56,189,248,0.2)] space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-500/25">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF8A3D] to-[#A855F7] p-[1px]">
              <div className="w-full h-full bg-[#080A12] rounded-[11px] flex items-center justify-center">
                <Cpu className="w-4 h-4 text-[#FF8A3D] animate-pulse" />
              </div>
            </div>
            <div>
              <div className="font-space font-bold text-sm text-white">NEXUS SYSTEM STREAM</div>
              <div className="text-[10px] text-purple-300">CALIBRATING 3D CITY ENGINE</div>
            </div>
          </div>

          <div className="text-right">
            <span className="font-space font-extrabold text-lg text-cyan-400">{progress}%</span>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-2.5 rounded-full bg-[#080A12] border border-cyan-500/30 overflow-hidden p-[1px]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#FF8A3D] via-[#FF70A6] to-[#38BDF8] transition-all duration-300 shadow-[0_0_15px_rgba(56,189,248,0.6)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="text-cyan-300">
              STEP 0{currentStep + 1} / 04: {steps[currentStep]}
            </span>
          </div>
        </div>

        {/* Telemetry Diagnostics Output */}
        <div className="p-3.5 rounded-xl bg-[#080A12] border border-purple-500/30 space-y-1 text-[10px] text-slate-400 font-mono">
          <div className="text-purple-300 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>&gt; WASM Engine: Initializing isolated memory heap...</span>
          </div>
          <div className="text-cyan-300 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>&gt; Shaders: Compiling multi-tier obsidian city textures...</span>
          </div>
          <div className="text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>&gt; Telemetry: Calibrating dual laser projectors & camber...</span>
          </div>
        </div>

        {/* Fallback & Cancel Navigation */}
        <div className="flex items-center justify-between pt-2 border-t border-purple-500/25">
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Terminal
            </button>
          )}

          {onSwitchClassic && (
            <button
              onClick={onSwitchClassic}
              className="text-xs text-purple-300 hover:text-white flex items-center gap-1.5 hover:underline"
            >
              <FileText className="w-3.5 h-3.5" /> Open 2D Reader Instead
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

