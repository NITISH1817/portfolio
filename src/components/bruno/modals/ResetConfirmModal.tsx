import React from 'react';
import { AlertTriangle, RotateCcw, X } from 'lucide-react';
import { useGameStore } from '../../../store/gameStore';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResetConfirmModal({ isOpen, onClose }: ResetConfirmModalProps) {
  const resetProgress = useGameStore((s) => s.resetProgress);

  if (!isOpen) return null;

  const handleConfirm = () => {
    resetProgress();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-red-500/40 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400 mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h3 className="text-lg font-black text-white font-mono uppercase tracking-wide">
          RESET EXPLORATION PROGRESS?
        </h3>

        <p className="text-xs text-slate-300 mt-2 font-sans leading-relaxed">
          This will reset your completed missions, collected technology crystals, unlocked achievements, and world discovery stats.
        </p>

        <div className="flex items-center gap-3 w-full mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold transition-all"
          >
            CANCEL
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            CONFIRM RESET
          </button>
        </div>
      </div>
    </div>
  );
}

