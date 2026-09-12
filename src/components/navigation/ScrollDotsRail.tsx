import React, { useEffect, useState } from 'react';
import { scrollToSection } from '../../lib/lenis';
import { Compass } from 'lucide-react';

interface SectionDot {
  id: string;
  label: string;
}

const SECTIONS: SectionDot[] = [
  { id: 'hero', label: '01 // LAUNCH' },
  { id: 'overview', label: '02 // ABOUT' },
  { id: 'service', label: '03 // ARENAS' },
  { id: 'projects', label: '04 // SHOWCASE' },
  { id: 'events', label: '05 // HIGHLIGHTS' },
  { id: 'dignitaries', label: '06 // DLS' },
  { id: 'archive', label: '07 // ARCHIVES' },
  { id: 'sponsors', label: '08 // PARTNERS' },
];

export interface ScrollDotsRailProps {
  onOpenIndex?: () => void;
}

export const ScrollDotsRail: React.FC<ScrollDotsRailProps> = ({ onOpenIndex }) => {
  const [activeSection, setActiveSection] = useState<string>('hero');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDotClick = (id: string) => {
    scrollToSection(id);
  };

  return (
    <aside
      aria-label="Section Navigation"
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-5 pointer-events-auto"
    >
      {/* Right Side Index Directory Trigger Button */}
      {onOpenIndex && (
        <button
          onClick={onOpenIndex}
          className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#08090a]/85 border border-white/20 hover:border-white/60 text-zinc-300 hover:text-white transition-all font-mono text-[9px] tracking-[0.2em] shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-md mb-2 active:scale-95"
          title="Spatial Index Directory (⌘K)"
        >
          <Compass className="w-3 h-3 text-sky-400 group-hover:rotate-45 transition-transform" />
          <span>INDEX</span>
        </button>
      )}

      {/* Thin connector hairline */}
      <div className="absolute top-12 bottom-2 w-[1px] bg-white/[0.08] pointer-events-none" />

      {SECTIONS.map((sec) => {
        const isActive = activeSection === sec.id;
        return (
          <button
            key={sec.id}
            onClick={() => handleDotClick(sec.id)}
            className="group relative flex items-center justify-end z-10"
            title={sec.label}
          >
            {/* Hover Tooltip Label */}
            <span className="absolute right-6 px-2.5 py-1 rounded bg-neutral-900/95 border border-white/10 text-[10px] font-mono text-zinc-300 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-lg">
              {sec.label}
            </span>

            {/* Navigation Dot */}
            <div
              className={`transition-all duration-300 rounded-full ${
                isActive
                  ? 'w-2 h-2 bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)] scale-125'
                  : 'w-1.5 h-1.5 bg-zinc-600 group-hover:bg-zinc-300 group-hover:scale-110'
              }`}
            />
          </button>
        );
      })}
    </aside>
  );
};

export default ScrollDotsRail;
