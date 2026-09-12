import React, { useRef, useEffect } from 'react';
import { FEST_CONFIG, GOOGLE_FORM_URL } from '../../content/festConfig';
import { gsap, ScrollTrigger } from '../../lib/lenis';
import { soundFx } from '../../lib/audioManager';
import { ParticleText, TextType, SpecularButton } from '../reactbits';

export const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hudRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=120%',
        scrub: 0.6,
        onUpdate: (self) => {
          if (hudRef.current) {
            const opacity = Math.max(0, 1 - self.progress * 1.5);
            const scale = 1 - self.progress * 0.08;
            const translateY = self.progress * -50;
            hudRef.current.style.opacity = opacity.toString();
            hudRef.current.style.transform = `scale(${scale}) translateY(${translateY}px)`;
          }
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full h-screen min-h-[750px] flex items-center justify-center overflow-hidden select-none"
    >
      {/* Top Radiant White Celestial Star Flare (Gustavo Batista Hero) */}
      <div className="absolute top-[12%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
        <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_80px_25px_rgba(255,255,255,0.85),0_0_150px_60px_rgba(140,146,157,0.2)] animate-pulse" />
      </div>

      {/* Floating Binary / Coordinate Micro-Labels (Gustavo Batista Aesthetics) */}
      <div className="absolute top-28 left-16 hidden lg:block font-mono text-[10px] text-zinc-500/50 leading-relaxed pointer-events-none select-none">
        <div>01100</div>
        <div>10110</div>
        <div>11110</div>
      </div>

      <div className="absolute bottom-28 right-20 hidden lg:block font-mono text-[10px] text-zinc-500/50 leading-relaxed text-right pointer-events-none select-none">
        <div>01100</div>
        <div>10110</div>
        <div>11110</div>
      </div>

      <div className="absolute top-36 right-24 hidden md:block font-mono text-[9px] text-zinc-500/40 uppercase tracking-[0.2em] pointer-events-none select-none">
        SYS.LOC // 19.0760° N, 72.8777° E
      </div>

      {/* Central Hero Content - Exactly Centered */}
      <div
        ref={hudRef}
        className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-6 will-change-transform pt-8 flex flex-col items-center justify-center"
      >
        {/* Dynamic Typewriter Sub-label with wide letter spacing */}
        <div className="inline-flex items-center justify-center min-h-[24px]">
          <TextType
            text={[
              `${FEST_CONFIG.edition} // ${FEST_CONFIG.dates.start} - ${FEST_CONFIG.dates.end}`,
              "OCTOBER 2026 // MUMBAI, INDIA",
              "ANNUAL TECHNICAL FESTIVAL // KJSSE"
            ]}
            typingSpeed={55}
            pauseDuration={2400}
            deletingSpeed={28}
            loop={true}
            className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.28em] text-zinc-400 indent-[0.28em]"
            cursorCharacter="▮"
          />
        </div>

        {/* Interactive Particle Text Title with high-contrast particles & cursor repel */}
        <div className="w-full flex items-center justify-center overflow-visible">
          <h1 className="sr-only">ABHIYANTRIKI 2026</h1>
          <ParticleText
            text="ABHIYANTRIKI"
            particleSize={2.0}
            density={3}
            color="#ffffff"
            highlightColor="#b0b7c4"
            scatter={140}
            gatherDuration={1400}
            stagger={300}
            pointerRepel={40}
            repelRadius={120}
            idleDrift={0.4}
            trigger="mount"
            fontSize="clamp(2.5rem, 8vw, 6.5rem)"
            fontWeight={400}
            fontFamily="'Cinzel', serif"
            glow={true}
            className="w-full flex items-center justify-center"
          />
        </div>

        {/* Subtitle Divider with Vertical Pipes */}
        <div className="font-mono text-xs sm:text-[13px] text-zinc-400 tracking-[0.25em] uppercase indent-[0.25em] flex items-center justify-center">
          | &nbsp; A N N U A L &nbsp; T E C H N I C A L &nbsp; F E S T I V A L &nbsp; |
        </div>

        {/* Specular Shader Pill Action Button */}
        <div className="pt-4 flex items-center justify-center gap-4 relative z-50">
          <a
            href={GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundFx.play('pill', 0.5)}
            className="inline-block group no-underline"
          >
            <SpecularButton
              size="lg"
              radius={9999}
              lineColor="#ffffff"
              baseColor="#3f3f46"
              intensity={1.3}
              tint="#ffffff"
              tintOpacity={0.06}
              blur={12}
              className="font-mono text-xs tracking-[0.25em] uppercase"
            >
              ( Register Now )
            </SpecularButton>
          </a>
        </div>
      </div>

      {/* Bottom Center Minimalist Scroll Pill Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none opacity-60">
        <div className="w-5 h-8 rounded-full border border-white/25 flex items-start justify-center p-1.5">
          <div className="w-1 h-2 rounded-full bg-white animate-bounce" />
        </div>
      </div>
    </section>
  );
};
