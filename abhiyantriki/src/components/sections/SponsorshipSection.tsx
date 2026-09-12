import React from 'react';
import { Download, Mail, Check } from 'lucide-react';
import { soundFx } from '../../lib/audioManager';
import { TrueFocus, BlurText } from '../reactbits';
import { FEST_CONFIG } from '../../content/festConfig';

interface OpportunityPillar {
  title: string;
  category: string;
  description: string;
  highlights: string[];
}

const OPPORTUNITY_PILLARS: OpportunityPillar[] = [
  {
    title: 'Title & Arena Presenting Rights',
    category: 'MARQUEE BRANDING',
    description: 'Premier brand integration across flagship arenas including RoboWars, Auto Expo, and main stage installations with exclusive campus-wide physical presence.',
    highlights: [
      'Naming rights for headline arenas & main stage',
      'Exclusive on-ground experiential pavilion zones',
      'VIP front-row access to Distinguished Lecture Series',
    ],
  },
  {
    title: 'Industry Innovation Challenges',
    category: 'IDEATE & HACKATHONS',
    description: 'Formulate proprietary problem statements for 2,500+ national competitors, evaluating bleeding-edge solutions directly with your engineering leadership.',
    highlights: [
      'Custom corporate problem tracks & jury seats',
      'Direct pipeline to top engineering finalists',
      'Intellectual property showcase & pilot grants',
    ],
  },
  {
    title: 'Campus Reach & Experiential Stalls',
    category: 'STUDENT TALENT',
    description: 'Direct physical and programmatic engagement with 45,000+ visitors and participants representing over 100 premier engineering institutions across India.',
    highlights: [
      'High-footfall tech expo booth spaces',
      'Direct recruitment & developer relations outreach',
      'Keynote keynote speaking slots in main auditoriums',
    ],
  },
  {
    title: 'Digital & Media Amplification',
    category: 'NATIONAL VISIBILITY',
    description: 'Extensive digital amplification across the Somaiya Vidyavihar University network, national engineering college circuits, and press releases.',
    highlights: [
      'Branded digital festival credentials & tickets',
      'Social media campaigns reaching 500,000+ impressions',
      'Archival aftermovie & post-event report co-branding',
    ],
  },
];

export const SponsorshipSection: React.FC = () => {
  return (
    <section id="sponsors" className="relative w-full py-32 px-6 max-w-7xl mx-auto space-y-16">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center space-y-3">
        <span className="font-mono text-[10px] text-zinc-500 tracking-[0.25em] uppercase">
          06 // STRATEGIC ALLIANCES & INDUSTRY PARTNERSHIPS
        </span>
        <div className="inline-block border-b border-white/20 pb-1">
          <h2 className="sr-only">Partnership Opportunities</h2>
          <TrueFocus
            sentence="PARTNERSHIP OPPORTUNITIES"
            manualMode={false}
            blurAmount={4}
            borderColor="rgba(255, 255, 255, 0.75)"
            glowColor="rgba(255, 255, 255, 0.25)"
            animationDuration={0.6}
            pauseBetweenAnimations={1.5}
            className="font-serif text-3xl sm:text-5xl text-neutral-100 tracking-widest font-normal uppercase py-1"
          />
        </div>
        <div className="max-w-2xl mx-auto">
          <BlurText
            text="Align your organization with India's premier collegiate technology ecosystem. Engage directly with over 45,000 student innovators, defense research partners, and tomorrow's engineering leaders."
            delay={60}
            stepDuration={0.25}
            direction="top"
            className="font-serif italic text-zinc-300 text-sm sm:text-base leading-relaxed font-light text-center justify-center"
          />
        </div>
      </div>

      {/* 4 Clean Value Proposition Pillars (No Monetary Costs Visible) */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {OPPORTUNITY_PILLARS.map((pillar, index) => (
          <div
            key={index}
            className="glass-panel p-6 rounded-xl border border-white/[0.08] hover:border-white/20 transition-all duration-300 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-[0.2em]">
                {pillar.category}
              </span>
              <h3 className="font-serif text-xl text-white font-normal">
                {pillar.title}
              </h3>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                {pillar.description}
              </p>

              <div className="pt-3 border-t border-white/[0.06] space-y-2">
                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                  Key Deliverables
                </div>
                <ul className="space-y-2">
                  {pillar.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11px] text-zinc-300 font-light">
                      <Check className="w-3 h-3 text-zinc-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Elegant Focused Inquiry Action Card */}
      <div className="glass-panel p-8 sm:p-10 rounded-2xl border border-white/15 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left bg-neutral-950/60">
        <div className="space-y-2">
          <h3 className="font-serif text-2xl text-white font-normal">
            Request Custom Partnership Dossier
          </h3>
          <p className="text-xs font-mono text-zinc-400 max-w-md">
            Custom engagement plans, experiential booth specifications, and institutional branding slots curated for your enterprise objectives.
          </p>
          <div className="text-[11px] font-mono text-zinc-500 pt-1">
            SECRETARIAT // <span className="text-zinc-300">{FEST_CONFIG.council.email}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <a
            href={`mailto:${FEST_CONFIG.council.email}?subject=Abhiyantriki%20Partnership%20Inquiry`}
            onClick={() => soundFx.play('pill', 0.5)}
            className="px-6 py-3 rounded-full bg-white text-black font-mono text-xs uppercase tracking-[0.2em] font-medium hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Inquire Dossier</span>
          </a>

          <a
            href="/brochures/abhiyantriki-general-proposal.pdf"
            download
            onClick={() => soundFx.play('pill', 0.4)}
            className="p-3 rounded-full border border-white/20 hover:border-white text-zinc-400 hover:text-white transition-all"
            title="Download General Proposal PDF"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
