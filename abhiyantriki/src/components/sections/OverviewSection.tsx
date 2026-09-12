import React from 'react';
import { GraduationCap, Shield, Download } from 'lucide-react';
import { soundFx } from '../../lib/audioManager';
import { ScrollReveal, SplitFlapText } from '../reactbits';

export const OverviewSection: React.FC = () => {
  return (
    <section id="overview" className="relative w-full py-32 px-6 max-w-7xl mx-auto min-h-[90vh] flex items-center">
      {/* Volumetric Radial Glow behind 3D Model on the Right */}
      <div
        className="absolute top-1/2 right-4 -translate-y-1/2 w-[560px] h-[560px] rounded-full pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(circle at 60% 50%, rgba(255, 255, 255, 0.08) 0%, rgba(140, 150, 170, 0.03) 45%, transparent 75%)',
        }}
      />

      <div className="w-full grid lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Constrained to Left 42% (max-w-md) leaving abundant negative space for 3D Brain on right */}
        <div className="lg:col-span-6 w-full lg:max-w-md space-y-8 pr-0 z-20">
          {/* Telemetry Micro-Stamp with Departure Board Flip Ticker */}
          <div className="space-y-2">
            <div className="font-mono text-[9px] text-zinc-500/70 tracking-[0.25em] uppercase flex items-center gap-2">
              <span>[ SEC.02 // ARCHITECTURE.OVERVIEW ]</span>
              <span className="text-zinc-600">•</span>
              <span>SYS.STAT // NOMINAL</span>
            </div>
            {/* Split Flap Departure Display */}
            <div className="pt-1 overflow-x-auto select-none">
              <SplitFlapText
                words={['45K+ FOOTFALL', '100+ COLLEGES', 'ISRO EXPO', 'ARMY WEAPONRY']}
                fontSize={12}
                tileRadius={3}
                gap={3}
                padTo={13}
                tileColor="#121316"
                textColor="#e2e8f0"
                flipDuration={0.08}
                cycleDelay={2200}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="inline-block border-b border-white/20 pb-1">
              {/* Editorial Title with Silver-White Gradient */}
              <h2 className="font-serif text-4xl sm:text-5xl text-gradient-silver tracking-[0.18em] font-normal">
                About
              </h2>
            </div>
            {/* Scroll-driven word-by-word reveal & unblur */}
            <ScrollReveal
              baseOpacity={0.12}
              enableBlur={true}
              blurStrength={6}
              containerClassName="font-serif italic text-zinc-300 text-sm sm:text-base leading-relaxed font-light"
              textClassName="font-serif"
            >
              "Abhiyantriki is the annual technical festival of K. J. Somaiya School of Engineering (KJSSE), hosted by the Students' Council. It is an all-India platform bringing together student engineers, national defense forces, aerospace research centers, and global technology innovators across two intensive days."
            </ScrollReveal>
          </div>

          {/* Minimalist Categorized Milestones with Hairline Dividers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 font-mono text-xs text-zinc-300 max-w-md">
            {/* Column 1: Institutional Reach */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-zinc-200 font-medium border-b border-white/10 pb-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-zinc-400" />
                <span className="tracking-[0.15em] uppercase text-[10px]">Campus Reach</span>
              </div>
              <ul className="space-y-2 text-[11px] text-zinc-400">
                <li className="space-y-0.5">
                  <div className="text-zinc-200 font-semibold flex items-center gap-1.5">
                    <span>2026</span>
                    <span className="text-zinc-500 font-normal">+</span>
                  </div>
                  <div className="text-zinc-400 font-light text-[10.5px]">45,000+ Footfall Across Western India</div>
                </li>
                <li className="space-y-0.5">
                  <div className="text-zinc-200 font-semibold flex items-center gap-1.5">
                    <span>2025</span>
                    <span className="text-zinc-500 font-normal">+</span>
                  </div>
                  <div className="text-zinc-400 font-light text-[10.5px]">100+ Engineering Colleges</div>
                </li>
                <li className="space-y-0.5">
                  <div className="text-zinc-200 font-semibold flex items-center gap-1.5">
                    <span>2024</span>
                    <span className="text-zinc-500 font-normal">+</span>
                  </div>
                  <div className="text-zinc-400 font-light text-[10.5px]">₹10,00,000+ Grand Prize Pool</div>
                </li>
              </ul>
            </div>

            {/* Column 2: Defense & Research */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-zinc-200 font-medium border-b border-white/10 pb-1.5">
                <Shield className="w-3.5 h-3.5 text-zinc-400" />
                <span className="tracking-[0.15em] uppercase text-[10px]">Defense & Research</span>
              </div>
              <ul className="space-y-2 text-[11px] text-zinc-400">
                <li className="space-y-0.5">
                  <div className="text-zinc-200 font-semibold flex items-center gap-1.5">
                    <span>ISRO</span>
                    <span className="text-zinc-500 font-normal">+</span>
                  </div>
                  <div className="text-zinc-400 font-light text-[10.5px]">Liquid Rocket Engine Showcase</div>
                </li>
                <li className="space-y-0.5">
                  <div className="text-zinc-200 font-semibold flex items-center gap-1.5">
                    <span>INDIAN ARMY</span>
                    <span className="text-zinc-500 font-normal">+</span>
                  </div>
                  <div className="text-zinc-400 font-light text-[10.5px]">Tactical Weaponry & Systems</div>
                </li>
                <li className="space-y-0.5">
                  <div className="text-zinc-200 font-semibold flex items-center gap-1.5">
                    <span>NSG</span>
                    <span className="text-zinc-500 font-normal">+</span>
                  </div>
                  <div className="text-zinc-400 font-light text-[10.5px]">Special Ops & Drills</div>
                </li>
              </ul>
            </div>
          </div>

          {/* Minimalist Outlined Action Link */}
          <div className="pt-4 flex items-center gap-4 border-t border-white/10 max-w-md">
            <a
              href="/brochures/Abhiyantriki-2025.pdf"
              download
              onClick={() => soundFx.play('pill', 0.4)}
              className="px-6 py-2.5 rounded-full border border-white/20 hover:border-white bg-neutral-900/40 hover:bg-white text-zinc-300 hover:text-black font-mono text-[11px] tracking-[0.2em] uppercase transition-all flex items-center gap-2"
            >
              <Download className="w-3 h-3 text-zinc-400" />
              <span>Official Brochure</span>
            </a>
            <div className="font-mono text-[10px] text-zinc-500 tracking-wider hidden sm:block">
              PDF ARCHIVE // 2026
            </div>
          </div>
        </div>

        {/* Right Column: Intentionally open viewport framing for the 3D model (firmly at x: +2.85) */}
        <div className="lg:col-span-6 h-[400px] sm:h-[480px] relative pointer-events-none flex flex-col justify-end items-end p-4">
          <div className="font-mono text-[10px] text-zinc-500/60 uppercase tracking-[0.2em] flex items-center gap-2">
            <span>MODEL // NEURAL INTELLECT</span>
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400/80 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};
