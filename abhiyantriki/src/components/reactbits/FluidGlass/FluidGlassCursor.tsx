import React, { useEffect, useRef, useState } from 'react';

export const FluidGlassCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(() => {
    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;
    let rafId: number;

    const handlePointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!hasMoved) setHasMoved(true);
    };

    const animate = () => {
      // Smooth exponential easing follower
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentX - 32}px, ${currentY - 32}px, 0)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    rafId = requestAnimationFrame(animate);

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
      className="fixed top-0 left-0 w-16 h-16 pointer-events-none z-50 rounded-full transition-opacity duration-500"
      style={{
        opacity: hasMoved ? 1 : 0,
        background: 'radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.01) 100%)',
        backdropFilter: 'blur(3px) contrast(1.1) brightness(1.15)',
        WebkitBackdropFilter: 'blur(3px) contrast(1.1) brightness(1.15)',
        border: '1px solid rgba(255, 255, 255, 0.28)',
        boxShadow: '0 0 16px rgba(255, 255, 255, 0.15), inset 0 0 8px rgba(255, 255, 255, 0.25)',
        mixBlendMode: 'screen',
      }}
    >
      {/* Inner Fluid Specular Core */}
      <div className="absolute inset-2 rounded-full border border-white/20 pointer-events-none" />
      <div className="absolute top-2 left-2 w-2 h-1 rounded-full bg-white/60 blur-[0.5px]" />
    </div>
  );
};

export default FluidGlassCursor;
