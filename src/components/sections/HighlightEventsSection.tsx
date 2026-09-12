import React, { useState } from 'react';
import { FEST_EVENTS, type FestEvent } from '../../content/events';
import { GOOGLE_FORM_URL } from '../../content/festConfig';
import { useCMSStore } from '../../store/useCMSStore';
import { Shield, Bot, Flame, Cpu, Gamepad2, ArrowRight } from 'lucide-react';
import { soundFx } from '../../lib/audioManager';
import { EchoText, Shuffle } from '../reactbits';

type CategoryTab = 'Defense & Space' | 'Robotics' | 'Expos' | 'Ideate' | 'Competitions & Coding';

export const HighlightEventsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CategoryTab>('Defense & Space');
  const googleFormUrl = useCMSStore((state) => state.googleFormUrl);

  const tabs: { id: CategoryTab; label: string; icon: React.ReactNode }[] = [
    { id: 'Defense & Space', label: 'Defense & Space', icon: <Shield className="w-3.5 h-3.5" /> },
    { id: 'Robotics', label: 'Robotics & Humanoids', icon: <Bot className="w-3.5 h-3.5" /> },
    { id: 'Expos', label: 'Auto & Tech Expos', icon: <Flame className="w-3.5 h-3.5" /> },
    { id: 'Ideate', label: 'Ideate Challenge', icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'Competitions & Coding', label: 'Competitions & Coding', icon: <Gamepad2 className="w-3.5 h-3.5" /> },
  ];

  const filteredEvents = FEST_EVENTS.filter((e) => e.category === activeTab);

  const handleTabChange = (tab: CategoryTab) => {
    setActiveTab(tab);
    soundFx.play('pill', 0.4);
  };

  return (
    <section id="events" className="relative w-full py-32 px-6 max-w-7xl mx-auto space-y-16">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center space-y-4">
        <span className="font-mono text-[10px] text-zinc-500 tracking-[0.25em] uppercase">
          03 // HEADLINERS & INSTALLATIONS
        </span>

        {/* Marquee Highlights with EchoText React Bits component */}
        <div className="inline-block border-b border-white/20 pb-2">
          <EchoText
            text="Marquee Highlights"
            echoes={8}
            lag={0.2}
            offset={24}
            direction="right"
            fade={0.7}
            blur={2.5}
            tint="#38bdf8"
            mode="both"
            cursorRadius={300}
            duration={800}
            fontSize="clamp(2.2rem, 5vw, 3.8rem)"
            fontWeight={400}
            color="#f8fafc"
            className="font-serif tracking-widest uppercase"
          />
        </div>

        {/* Subtitle with Shuffle React Bits component */}
        <div className="max-w-2xl mx-auto">
          <Shuffle
            text="Explore tactical military drills, humanoid robotics demonstrations, high-performance automotive engineering, and national hackathons."
            shuffleDirection="right"
            duration={0.35}
            animationMode="evenodd"
            shuffleTimes={1}
            ease="power3.out"
            stagger={0.02}
            threshold={0.1}
            triggerOnce={true}
            triggerOnHover={true}
            tag="p"
            className="font-serif italic text-zinc-300 text-sm sm:text-base leading-relaxed font-light text-center"
          />
        </div>
      </div>

      {/* Sleek Category Filter Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 z-10 relative">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs transition-all duration-200 border ${
                isActive
                  ? 'bg-neutral-850 text-white font-medium border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  : 'bg-neutral-950/40 text-zinc-400 border-white/[0.08] hover:border-white/20 hover:text-white'
              }`}
            >
              {tab.icon}
              <span className="tracking-wider">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Highlight Spotlight Card (Minimal Monochrome Design, No Duplicate Canvas) */}
      {activeTab === 'Expos' && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/[0.08] grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.2em]">
              AUTO EXPO 2026 // PAVILION
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-neutral-100 font-normal">
              Supercars & Superbikes Arena
            </h3>
            <p className="font-serif italic text-zinc-300 text-sm leading-relaxed font-light">
              "Experience the bleeding edge of precision mechanical engineering up close. Showcasing elite racing and touring machinery including the BMW M5, Honda Goldwing, Honda Repsol 1000cc, and the iconic BMW S1000RR."
            </p>
          </div>
          <div className="lg:col-span-6 grid grid-cols-2 gap-3 font-mono text-xs text-zinc-300">
            <div className="p-3.5 rounded-lg bg-neutral-900/40 border border-white/[0.06] flex items-center justify-between">
              <span>BMW M5</span>
              <span className="text-zinc-500 text-[10px]">V8 BITURBO</span>
            </div>
            <div className="p-3.5 rounded-lg bg-neutral-900/40 border border-white/[0.06] flex items-center justify-between">
              <span>Goldwing 1800cc</span>
              <span className="text-zinc-500 text-[10px]">FLAT-SIX</span>
            </div>
            <div className="p-3.5 rounded-lg bg-neutral-900/40 border border-white/[0.06] flex items-center justify-between">
              <span>BMW S1000RR</span>
              <span className="text-zinc-500 text-[10px]">SUPERBIKE</span>
            </div>
            <div className="p-3.5 rounded-lg bg-neutral-900/40 border border-white/[0.06] flex items-center justify-between">
              <span>Repsol 1000cc</span>
              <span className="text-zinc-500 text-[10px]">MOTOGP</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Ideate' && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/[0.08] grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.2em]">
              FLAGSHIP INNOVATION // JURY CHALLENGES
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-neutral-100 font-normal">
              IDEATE: 9 Real-World Industry Challenges
            </h3>
            <p className="font-serif italic text-zinc-300 text-sm leading-relaxed font-light">
              "Formulated directly with India's premier research and corporate organizations. Student teams compete with novel engineering solutions evaluated directly by industry juries."
            </p>
          </div>
          <div className="lg:col-span-6 grid grid-cols-2 gap-3 font-mono text-[11px] text-zinc-300">
            <div className="p-3 rounded-lg bg-neutral-900/40 border border-white/[0.06]">
              <div className="text-zinc-400 font-medium">UNL Global</div>
              <div className="text-zinc-500 text-[10px]">Microlocation Infrastructure</div>
            </div>
            <div className="p-3 rounded-lg bg-neutral-900/40 border border-white/[0.06]">
              <div className="text-zinc-400 font-medium">BARC Research</div>
              <div className="text-zinc-500 text-[10px]">Thermodynamic Modeling</div>
            </div>
            <div className="p-3 rounded-lg bg-neutral-900/40 border border-white/[0.06]">
              <div className="text-zinc-400 font-medium">NRDC India</div>
              <div className="text-zinc-500 text-[10px]">Marine Defense Systems</div>
            </div>
            <div className="p-3 rounded-lg bg-neutral-900/40 border border-white/[0.06]">
              <div className="text-zinc-400 font-medium">TCS Research</div>
              <div className="text-zinc-500 text-[10px]">Enterprise CX Architectures</div>
            </div>
          </div>
        </div>
      )}

      {/* Events Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event: FestEvent) => (
          <div
            key={event.id}
            className="group glass-panel p-6 rounded-xl border border-white/[0.08] hover:border-white/20 transition-all duration-300 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                  {event.partner || event.category}
                </span>
                {event.badge && (
                  <span className="font-mono text-[9px] px-2 py-0.5 rounded border border-white/10 text-zinc-400">
                    {event.badge}
                  </span>
                )}
              </div>

              <h3 className="font-serif text-xl text-white font-normal group-hover:text-zinc-200 transition-colors">
                {event.title}
              </h3>

              {event.subtitle && (
                <div className="text-[11px] font-mono text-zinc-400">
                  {event.subtitle}
                </div>
              )}

              <p className="text-xs text-zinc-400 leading-relaxed font-light font-sans">
                {event.description}
              </p>

              {event.highlights && (
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {event.highlights.map((h, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] font-mono px-2 py-0.5 rounded bg-neutral-900/60 border border-white/[0.05] text-zinc-500"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <span className="font-mono text-[10px] text-zinc-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                <span>ACTIVE ARENA</span>
              </span>

              <a
                href={googleFormUrl || GOOGLE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundFx.play('pill', 0.5)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-900/80 hover:bg-white text-zinc-300 hover:text-black font-mono text-xs transition-all border border-white/15 hover:border-white active:scale-95 cursor-pointer"
              >
                <span>Register</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
