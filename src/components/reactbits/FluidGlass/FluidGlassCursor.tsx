import React, { useEffect, useRef, useState } from 'react';

export const FluidGlassCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(() => {
    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;
    let isRunning = false;
    let rafId: number;

    const animate = () => {
      // Smooth exponential easing follower
      const dx = mouseX - currentX;
      const dy = mouseY - currentY;
      currentX += dx * 0.18;
      currentY += dy * 0.18;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentX - 32}px, ${currentY - 32}px, 0)`;
      }

      // Idle sleep: if cursor caught up to mouse (within 0.1px), stop loop until next movement
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        currentX = mouseX;
        currentY = mouseY;
        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate3d(${currentX - 32}px, ${currentY - 32}px, 0)`;
        }
        isRunning = false;
        return;
      }

      rafId = requestAnimationFrame(animate);
    };

    const handlePointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!hasMoved) setHasMoved(true);

      if (!isRunning) {
        isRunning = true;
        rafId = requestAnimationFrame(animate);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(rafId);
    };
  }, [hasMoved]);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null; // Disable on touch devices
  }

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="fixed top-0 left-0 w-16 h-16 pointer-events-none z-50 rounded-full transition-opacity duration-300 will-change-transform"
      style={{
        opacity: hasMoved ? 1 : 0,
        background: 'radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.04) 50%, transparent 100%)',
        border: '1px solid rgba(255, 255, 255, 0.28)',
        boxShadow: '0 0 16px rgba(255, 255, 255, 0.15), inset 0 0 8px rgba(255, 255, 255, 0.18)',
      }}
    >
      {/* Inner Fluid Specular Core */}
      <div className="absolute inset-2 rounded-full border border-white/20 pointer-events-none" />
      <div className="absolute top-2.5 left-2.5 w-2 h-1 rounded-full bg-white/70 blur-[0.5px]" />
    </div>
  );
};

export default FluidGlassCursor;
