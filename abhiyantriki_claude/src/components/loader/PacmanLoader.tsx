import { useEffect, useRef, useState } from 'react';
import { useUIStore } from '@/store/useUIStore';

/**
 * Loading sequence per spec 07 (Part A).
 *
 * IMPORTANT — why this is drawn with plain canvas shapes instead of the licensed
 * pacman.glb / space_boi.glb models: both are CC-BY-NC-4.0 (No Commercial Use), which
 * conflicts with a fest site carrying paid sponsorship tiers (see spec 06's licensing
 * table). Only `ghost-inky.glb` (CC-BY-4.0) is commercial-safe for 3D use. This component
 * draws an original chomping-circle "muncher" + a rounded ghost shape procedurally — a
 * generic arcade-loader pattern, not a reproduction of any specific licensed character art
 * or texture. The real ghost-inky.glb model is reserved for the one 3D "dissolve" beat at
 * the very end, handed off to the hero scene.
 *
 * Progress is tied to real asset loading (see onProgress prop), not a fake timer.
 */

interface PacmanLoaderProps {
  /** 0–100, driven by real R3F/asset loading progress upstream */
  progress: number;
  onComplete: () => void;
}

export function PacmanLoader({ progress, onComplete }: PacmanLoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [skipped, setSkipped] = useState(false);
  const audioMuted = useUIStore((s) => s.audioMuted);
  const toggleAudio = useUIStore((s) => s.toggleAudio);

  const reducedMotion = useUIStore((s) => s.reducedMotion);

  useEffect(() => {
    if (skipped) return;
    if (reducedMotion) {
      // Reduced-motion / slow-connection fallback: static bar, no animation loop at all.
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let mouthPhase = 0;
    const W = canvas.width;
    const H = canvas.height;
    const trackY = H / 2;

    function draw() {
      ctx!.clearRect(0, 0, W, H);

      // Position along the track is driven by real progress, not elapsed time.
      const t = Math.min(progress, 100) / 100;
      const muncherX = 60 + t * (W - 160);
      const ghostX = muncherX + 70; // ghost stays a fixed distance ahead, "fleeing"

      mouthPhase += 0.15;
      const mouthOpen = (Math.sin(mouthPhase) + 1) / 2; // 0..1
      const mouthAngle = 0.15 + mouthOpen * 0.25;

      // --- Muncher (original chomping-circle shape, not licensed character art) ---
      ctx!.fillStyle = '#EEE638'; // signal-yellow token
      ctx!.beginPath();
      ctx!.moveTo(muncherX, trackY);
      ctx!.arc(muncherX, trackY, 24, mouthAngle * Math.PI, (2 - mouthAngle) * Math.PI);
      ctx!.closePath();
      ctx!.fill();

      // --- Ghost (rounded body + wavy skirt, distinct from any specific licensed design) ---
      ctx!.fillStyle = '#0DB8D3'; // cyan-400 token
      ctx!.beginPath();
      ctx!.arc(ghostX, trackY, 20, Math.PI, 0);
      ctx!.lineTo(ghostX + 20, trackY + 22);
      for (let i = 0; i < 4; i++) {
        const gx = ghostX + 20 - i * (40 / 4);
        ctx!.quadraticCurveTo(gx - 5, trackY + 12, gx - 10, trackY + 22);
      }
      ctx!.closePath();
      ctx!.fill();
      // eyes
      ctx!.fillStyle = '#0A1622';
      ctx!.beginPath();
      ctx!.arc(ghostX - 7, trackY - 4, 3, 0, Math.PI * 2);
      ctx!.arc(ghostX + 7, trackY - 4, 3, 0, Math.PI * 2);
      ctx!.fill();

      if (progress < 100) {
        raf = requestAnimationFrame(draw);
      }
    }

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [progress, skipped, reducedMotion]);

  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(onComplete, reducedMotion ? 50 : 600); // brief "catch" beat, skipped if reduced-motion
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete, reducedMotion]);

  if (skipped) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-space-950">
      {reducedMotion ? (
        <div className="w-64">
          <div className="mb-3 text-center font-mono-data text-sm text-cyan-400">
            Loading Abhiyantriki…
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-space-900">
            <div
              className="h-full bg-signal-yellow transition-all duration-200"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      ) : (
        <canvas ref={canvasRef} width={480} height={120} className="mb-6" />
      )}

      <div className="font-mono-data text-sm text-cyan-400/80">
        {Math.min(Math.round(progress), 100)}%
      </div>

      <button
        onClick={() => {
          setSkipped(true);
          onComplete();
        }}
        className="absolute bottom-6 right-6 font-mono-data text-xs text-white/40 transition-colors hover:text-cyan-400"
      >
        Skip →
      </button>

      <button
        onClick={toggleAudio}
        className="absolute bottom-6 left-6 font-mono-data text-xs text-white/40 transition-colors hover:text-cyan-400"
        aria-label={audioMuted ? 'Unmute' : 'Mute'}
      >
        {audioMuted ? '🔇 SFX Off' : '🔊 SFX On'}
      </button>
    </div>
  );
}
