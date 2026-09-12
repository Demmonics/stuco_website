import React from 'react';
import { useUIStore } from '../../store/useUIStore';
import { Bot, Shield, Flame, Cpu, Award, Code, ArrowUpRight } from 'lucide-react';
import { soundFx } from '../../lib/audioManager';
import { BlurText } from '../reactbits';

interface ArenaCard {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  category: string;
}

const ARENAS: ArenaCard[] = [
  {
    id: 'robowars-flagship',
    title: 'Combat Robotics',
    subtitle: 'RoboWars 60kg Combat Bots Arena',
    icon: <Bot className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />,
    category: 'Robotics',
  },
  {
    id: 'defense-isro',
    title: 'Defense & Space',
    subtitle: 'ISRO, NSG & Indian Army Demonstrations',
    icon: <Shield className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />,
    category: 'Defense',
  },
  {
    id: 'auto-expo-flagship',
    title: 'Auto Expo Arena',
    subtitle: 'Superbikes, Supercars & Electric Prototypes',
    icon: <Flame className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />,
    category: 'Expos',
  },
  {
    id: 'ideate-flagship',
    title: 'Ideate Challenge',
    subtitle: 'National Technical Problem Solving & Grants',
    icon: <Cpu className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />,
    category: 'Ideate',
  },
  {
    id: 'dignitaries-keynotes',
    title: 'Distinguished Lectures',
    subtitle: 'Nobel Laureates & Military Commander Keynotes',
    icon: <Award className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />,
    category: 'Keynotes',
  },
  {
    id: 'crack-the-code',
    title: 'Coding & Hackathons',
    subtitle: 'Algorithmic Speed Challenges & Web3 Hackathons',
    icon: <Code className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />,
    category: 'Competitions',
  },
];

export const ArenasServiceSection: React.FC = () => {
  const { openRegistrationModal } = useUIStore();

  return (
    <section id="service" className="relative w-full py-32 px-6 max-w-7xl mx-auto min-h-[90vh] flex items-center">
      <div className="w-full grid lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Arenas & 2x3 Minimalist Cards Grid */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <div className="inline-block border-b border-white/20 pb-1">
              <h2 className="font-serif text-4xl sm:text-5xl text-neutral-100 tracking-widest font-normal">
                Arenas
              </h2>
            </div>
            <BlurText
              text="Discover our technical domains, defense installations, and live competitive proving grounds. Each arena is curated with deep engineering rigor and national industry partnerships."
              delay={50}
              stepDuration={0.25}
              direction="top"
              className="font-serif italic text-zinc-300 text-sm sm:text-base leading-relaxed max-w-xl font-light"
            />
          </div>

          {/* 2x3 Minimalist Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
            {ARENAS.map((arena) => (
              <button
                key={arena.id}
                onClick={() => {
                  soundFx.play('pill', 0.4);
                  openRegistrationModal(arena.id);
                }}
                className="group p-5 rounded-xl text-left bg-neutral-900/40 hover:bg-neutral-800/50 border border-white/[0.08] hover:border-white/25 transition-all duration-300 flex flex-col justify-between h-44 relative"
              >
                <div className="flex items-start justify-between w-full">
                  <div className="p-2.5 rounded-lg bg-neutral-950/60 border border-white/[0.06] group-hover:border-white/20 transition-all">
                    {arena.icon}
                  </div>
                  <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-[0.15em]">
                    {arena.category}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="font-sans font-medium text-sm text-neutral-200 group-hover:text-white transition-colors flex items-center justify-between">
                    <span>{arena.title}</span>
                    <ArrowUpRight className="w-3 h-3 text-zinc-500 group-hover:text-white transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5" />
                  </div>
                  <BlurText
                    text={arena.subtitle}
                    delay={35}
                    stepDuration={0.2}
                    animateBy="words"
                    className="font-mono text-[10px] text-zinc-400 line-clamp-2 leading-relaxed font-light"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Open viewport framing for persistent 3D holographic brain model */}
        <div className="lg:col-span-5 h-[400px] sm:h-[480px] relative pointer-events-none flex flex-col justify-end items-end p-4">
          <div className="font-mono text-[10px] text-zinc-500/60 uppercase tracking-[0.2em] flex items-center gap-2">
            <span>HOLOGRAPHIC CORE // 3D PROJECTION</span>
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400/80 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};
