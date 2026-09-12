import React, { useRef, useState } from 'react';
import { FEST_EVENTS } from '../../content/events';
import { GOOGLE_FORM_URL } from '../../content/festConfig';
import { soundFx } from '../../lib/audioManager';
import { ArrowUpRight } from 'lucide-react';

const PROJECT_IMAGES: Record<string, string> = {
  'defense-isro': '/images/projects/isro_propulsion_rocket.jpg',
  'defense-nsg': '/images/projects/nsg_tactical_silhouette.jpg',
  'defense-army': '/images/projects/army_armored_vehicle.jpg',
  'defense-iaf': '/images/projects/iaf_stealth_aircraft.jpg',
};

// Interactive 3D HUD Card with Mouse Move Perspective Tilt & Technical Markers
interface HUDCardProps {
  proj: typeof FEST_EVENTS[0];
  index: number;
}

const HUDProjectCard: React.FC<HUDCardProps> = ({ proj, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: -py * 12, // subtle tilt on X
      y: px * 12,  // subtle tilt on Y
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    soundFx.play('pill', 0.15);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const imgUrl = PROJECT_IMAGES[proj.id] || '/images/projects/isro_propulsion_rocket.jpg';

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col justify-between p-4 rounded-md transition-all duration-300"
      style={{
        perspective: '1000px',
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
      }}
    >
      {/* Outer Ghost Frame with Offset Thin Border Lines */}
      <div className="absolute inset-0 rounded-md border border-white/[0.12] group-hover:border-white/35 transition-colors duration-300 pointer-events-none" />
      
      {/* Ghost offset border shadow */}
      <div
        className="absolute -inset-1 rounded-md border border-white/[0.04] group-hover:border-white/[0.15] transition-all duration-300 pointer-events-none"
        style={{ transform: isHovered ? 'translate(2px, 2px)' : 'translate(0, 0)' }}
      />

      {/* Dark Glass Backing */}
      <div className="absolute inset-0 rounded-md bg-[#121418]/65 backdrop-blur-[8px] pointer-events-none -z-10" />

      {/* Technical Corner Tick Marks (+ or L bracket markers) */}
      <div className="absolute top-1.5 left-1.5 text-zinc-500/70 font-mono text-[9px] pointer-events-none select-none">
        +
      </div>
      <div className="absolute top-1.5 right-1.5 text-zinc-500/70 font-mono text-[9px] pointer-events-none select-none">
        +
      </div>
      <div className="absolute bottom-1.5 left-1.5 text-zinc-500/70 font-mono text-[9px] pointer-events-none select-none">
        +
      </div>
      <div className="absolute bottom-1.5 right-1.5 text-zinc-500/70 font-mono text-[9px] pointer-events-none select-none">
        +
      </div>

      {/* Top Header Badge */}
      <div className="flex items-center justify-between pb-3 pt-1 border-b border-white/[0.08] text-[10px] font-mono">
        <span className="text-zinc-300 font-medium tracking-wider">
          [ 0{index + 1} // PRJ ]
        </span>
        <span className="text-zinc-500 uppercase tracking-widest text-[9px]">
          {proj.partner ? 'DEFENSE' : 'ARENA'}
        </span>
      </div>

      {/* Image Container with Desaturated Default & Hover Lift */}
      <div className="relative w-full h-44 my-3 rounded overflow-hidden border border-white/10 group-hover:border-white/30 transition-all duration-500 bg-neutral-950">
        <img
          src={imgUrl}
          alt={proj.title}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
          style={{
            filter: isHovered
              ? 'grayscale(35%) contrast(1.1) brightness(1.05)'
              : 'grayscale(100%) contrast(1.15) brightness(0.85)',
          }}
        />
        {/* Subtle Dark Vignette & HUD Watermark */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-2.5 pointer-events-none">
          <div className="font-mono text-[9px] text-zinc-400 uppercase tracking-wider">
            {proj.partner || proj.category}
          </div>
        </div>
      </div>

      {/* Project Content */}
      <div className="space-y-2 pt-1 text-left">
        <h3 className="font-serif text-lg text-neutral-100 font-normal tracking-wide group-hover:text-white transition-colors">
          {proj.title}
        </h3>

        <p className="font-serif italic text-zinc-400 text-xs leading-relaxed line-clamp-2 font-light">
          "{proj.description}"
        </p>

        {/* Monospace Tech Tags */}
        <div className="font-mono text-[9.5px] text-zinc-500 tracking-wider flex items-center gap-1.5 pt-1.5">
          <span className="text-zinc-400">{proj.category}</span>
          <span>•</span>
          <span className="text-zinc-500">{proj.badge || 'FLAGSHIP'}</span>
        </div>
      </div>

      {/* Card Action Link */}
      <div className="pt-4 mt-2 border-t border-white/[0.08] flex items-center justify-between">
        <span className="font-mono text-[9px] text-zinc-500/70 tracking-widest uppercase">
          SPEC.0{index + 1}
        </span>
        <a
          href={GOOGLE_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => soundFx.play('pill', 0.4)}
          className="p-2 rounded-full border border-white/20 hover:border-white text-zinc-400 hover:text-white transition-all duration-300 bg-white/[0.04] hover:bg-white/[0.12] active:scale-95 flex items-center gap-1 font-mono text-[10px]"
          title="Register for Arena"
        >
          <span className="px-1 tracking-wider uppercase hidden sm:inline">Register</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};

export const ProjectsShowcaseSection: React.FC = () => {
  const marqueeProjects = FEST_EVENTS.slice(0, 4);

  return (
    <section id="projects" className="relative w-full py-32 px-6 max-w-7xl mx-auto space-y-16">
      {/* Volumetric Radial Glow in Background behind Cards */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.06) 0%, rgba(140, 150, 170, 0.02) 50%, transparent 80%)',
        }}
      />

      {/* Section Header: Left/Center aligned cleanly so upper-right recessed 3D model doesn't occlude */}
      <div className="text-center space-y-4 max-w-2xl mx-auto relative z-20">
        {/* Telemetry Micro-Stamp */}
        <div className="font-mono text-[9px] text-zinc-500/70 tracking-[0.25em] uppercase flex items-center justify-center gap-2">
          <span>[ SEC.04 // DEFENSE.SHOWCASE ]</span>
          <span className="text-zinc-600">•</span>
          <span>GRID // 4-NODE</span>
        </div>

        <div className="inline-block border-b border-white/20 pb-1">
          {/* Editorial Title with Silver-White Gradient */}
          <h2 className="font-serif text-4xl sm:text-5xl text-gradient-silver tracking-[0.18em] font-normal">
            Projects
          </h2>
        </div>

        <p className="font-serif italic text-zinc-300 text-sm sm:text-base leading-relaxed font-light">
          "Check out some of our flagship arenas and competitive showcases. Each one is unique and created with a focus on deep engineering and student innovation."
        </p>
      </div>

      {/* 4 Interactive HUD Project Cards with 3D Perspective Tilt & Ghost Frames */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 relative z-20">
        {marqueeProjects.map((proj, i) => (
          <HUDProjectCard key={proj.id} proj={proj} index={i} />
        ))}
      </div>
    </section>
  );
};
