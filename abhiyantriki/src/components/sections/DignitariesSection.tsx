import React, { useState } from 'react';
import { DIGNITARIES, type Dignitary } from '../../content/dignitaries';
import { Award, Star } from 'lucide-react';
import { soundFx } from '../../lib/audioManager';

export const DignitariesSection: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section id="dignitaries" className="relative w-full py-32 px-6 max-w-7xl mx-auto space-y-16">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center space-y-3">
        <span className="font-mono text-[10px] text-zinc-500 tracking-[0.25em] uppercase">
          04 // DISTINGUISHED LECTURE SERIES
        </span>
        <div className="inline-block border-b border-white/20 pb-1">
          <h2 className="font-serif text-4xl sm:text-5xl text-neutral-100 tracking-widest font-normal">
            Global Luminaries
          </h2>
        </div>
        <p className="font-serif italic text-zinc-300 text-sm sm:text-base max-w-2xl leading-relaxed font-light">
          "The DLS Hall of Fame — inspiring generations of engineers with keynotes from Bharat Ratna laureates, Nobel Peace Prize winners, and pioneering scientific luminaries."
        </p>
      </div>

      {/* Minimalist Constellation Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
        {DIGNITARIES.map((dignitary: Dignitary, index: number) => {
          const isHovered = hoveredIdx === index;
          return (
            <div
              key={index}
              onMouseEnter={() => {
                setHoveredIdx(index);
                soundFx.play('pill', 0.2);
              }}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`glass-panel p-6 rounded-xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between space-y-5 ${
                isHovered
                  ? 'border-white/30 bg-neutral-850/70 -translate-y-1'
                  : 'border-white/[0.08] hover:border-white/20'
              }`}
            >
              {/* Star Marker */}
              <div className="flex items-center justify-between font-mono text-[10px] text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <Star className={`w-3 h-3 ${isHovered ? 'text-white fill-white' : 'text-zinc-500'}`} />
                  <span>DLS // 0{index + 1}</span>
                </span>
                <span className="tracking-widest">HONORIS</span>
              </div>

              {/* Dignitary Name & Credentials */}
              <div className="space-y-2">
                <h3 className="font-serif text-xl sm:text-2xl text-white font-normal">
                  {dignitary.name}
                </h3>
                <div className="text-xs font-mono text-zinc-400 font-normal">
                  {dignitary.role}
                </div>
                {dignitary.affiliation && (
                  <p className="text-xs text-zinc-500 leading-relaxed font-light">
                    {dignitary.affiliation}
                  </p>
                )}
              </div>

              {/* Notable Recognition Badge */}
              {dignitary.notable && (
                <div className="pt-3 border-t border-white/[0.06] flex items-center gap-2 text-[11px] font-mono text-zinc-300">
                  <Award className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="font-light">{dignitary.notable}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default DignitariesSection;
