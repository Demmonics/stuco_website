import React, { useEffect, useState } from 'react';
import { useUIStore } from '../../store/useUIStore';
import { soundFx } from '../../lib/audioManager';
import { Volume2, VolumeX } from 'lucide-react';
import { LetterGlitch } from '../reactbits';

export const PacmanLoader: React.FC = () => {
  const { isLoading, loadingProgress, finishLoading, skipLoading, isMuted, toggleMute } = useUIStore();
  const [internalProgress, setInternalProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Smooth progress interpolator
  useEffect(() => {
    let animFrame: number;
    const updateProgress = () => {
      setInternalProgress((prev) => {
        const target = Math.max(loadingProgress, prev + 0.6);
        if (target >= 100) {
          return 100;
        }
        return prev + (target - prev) * 0.12;
      });
      animFrame = requestAnimationFrame(updateProgress);
    };
    animFrame = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animFrame);
  }, [loadingProgress]);

  // Handle completion
  useEffect(() => {
    if (internalProgress >= 100 && !isFadingOut) {
      setIsFadingOut(true);
      soundFx.play('pill', 0.5);
      const timer = setTimeout(() => {
        finishLoading();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [internalProgress, isFadingOut, finishLoading]);

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#08090a] flex flex-col justify-between p-6 sm:p-10 font-mono select-none overflow-hidden transition-opacity duration-700 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Matrix Letter Glitch Canvas */}
      <div className="absolute inset-0 z-0 opacity-40">
        <LetterGlitch
          glitchColors={['#27272a', '#52525b', '#a1a1aa', '#f4f4f5']}
          glitchSpeed={45}
          smooth={true}
          centerVignette={true}
          outerVignette={true}
          backgroundColor="#08090a"
        />
      </div>

      {/* Top Telemetry Header */}
      <div className="relative z-10 flex items-center justify-between text-[10px] sm:text-xs text-zinc-400">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span className="text-zinc-200 font-semibold tracking-[0.2em] uppercase">
            ABHIYANTRIKI 2026 // IGNITION SEQUENCE
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleMute}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors px-2 py-1 rounded border border-white/10"
          >
            {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-white" />}
            <span className="text-[10px] tracking-wider">{isMuted ? 'MUTE' : 'AUDIO'}</span>
          </button>
          <span className="text-zinc-500 hidden sm:inline tracking-widest">SYS.DIAG // NOMINAL</span>
        </div>
      </div>

      {/* Center Cinematic Diagnostic Telemetry */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-4 max-w-xl mx-auto">
        <div className="font-serif text-3xl sm:text-5xl text-white tracking-[0.2em] font-normal uppercase drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]">
          Abhiyantriki
        </div>
        <div className="text-[11px] sm:text-xs text-zinc-400 font-mono tracking-[0.25em] uppercase">
          KJSSE ANNUAL TECHNICAL FESTIVAL • MUMBAI
        </div>
        <div className="text-[10px] text-zinc-500 font-mono tracking-widest flex items-center gap-2 pt-2">
          <span>INITIALIZING SPATIAL COORD</span>
          <span>•</span>
          <span>19.0760° N, 72.8777° E</span>
        </div>
      </div>

      {/* Bottom Mission Telemetry and Skip Control */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div className="space-y-2 w-full sm:w-auto">
          <div className="text-[10px] text-zinc-400 tracking-[0.2em] uppercase">
            {internalProgress >= 100
              ? 'CORE ENGINE SYNCHRONIZED — LAUNCHING...'
              : 'CALIBRATING NEURAL ARCHITECTURE & ASSETS...'}
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-3xl sm:text-4xl font-normal font-mono text-white tracking-tight">
              {Math.round(internalProgress)}%
            </span>
            <div className="w-48 sm:w-64 h-1 bg-zinc-800 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-white transition-all duration-150 shadow-[0_0_12px_rgba(255,255,255,0.7)]"
                style={{ width: `${internalProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Skip button */}
        <button
          onClick={skipLoading}
          className="group flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 text-[11px] text-zinc-300 hover:text-white hover:border-white transition-all active:scale-95 font-mono tracking-widest uppercase cursor-pointer"
        >
          <span>( Skip Ignition )</span>
          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
        </button>
      </div>
    </div>
  );
};
