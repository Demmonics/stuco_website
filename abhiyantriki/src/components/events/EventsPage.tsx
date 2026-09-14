import React, { useState, useMemo } from 'react';
import { FEST_EVENTS, type FestEvent } from '../../content/events';
import { GOOGLE_FORM_URL, FEST_CONFIG } from '../../content/festConfig';
import { useCMSStore } from '../../store/useCMSStore';
import { soundFx } from '../../lib/audioManager';
import {
  Shield,
  Bot,
  Flame,
  Cpu,
  Gamepad2,
  Search,
  ExternalLink,
  ArrowRight,
  Sparkles,
  ArrowLeft,
  X,
  Clock,
  MapPin,
  CheckCircle2,
  Calendar
} from 'lucide-react';

type CategoryFilter = 'All' | 'Defense & Space' | 'Robotics' | 'Expos' | 'Ideate' | 'Competitions & Coding';

interface EventsPageProps {
  onBackToFest: () => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({ onBackToFest }) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyOpenRegistration, setOnlyOpenRegistration] = useState(false);
  const [selectedEventModal, setSelectedEventModal] = useState<FestEvent | null>(null);

  const googleFormUrl = useCMSStore((state) => state.googleFormUrl);
  const registrationUrl = googleFormUrl || GOOGLE_FORM_URL;

  const categories: { id: CategoryFilter; label: string; icon: React.ReactNode }[] = [
    { id: 'All', label: 'All Arenas', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'Defense & Space', label: 'Defense & Space', icon: <Shield className="w-3.5 h-3.5" /> },
    { id: 'Robotics', label: 'Robotics & Humanoids', icon: <Bot className="w-3.5 h-3.5" /> },
    { id: 'Expos', label: 'Auto & Tech Expos', icon: <Flame className="w-3.5 h-3.5" /> },
    { id: 'Ideate', label: 'Ideate Challenge', icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'Competitions & Coding', label: 'Competitions & Coding', icon: <Gamepad2 className="w-3.5 h-3.5" /> },
  ];

  const filteredEvents = useMemo(() => {
    return FEST_EVENTS.filter((event) => {
      // Category filter
      if (selectedCategory !== 'All' && event.category !== selectedCategory) {
        return false;
      }
      // Registration status filter
      if (onlyOpenRegistration && !event.registration_open) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(q);
        const matchesSub = event.subtitle?.toLowerCase().includes(q) ?? false;
        const matchesDesc = event.description.toLowerCase().includes(q);
        const matchesPartner = event.partner?.toLowerCase().includes(q) ?? false;
        const matchesHighlights = event.highlights?.some((h) => h.toLowerCase().includes(q)) ?? false;
        return matchesTitle || matchesSub || matchesDesc || matchesPartner || matchesHighlights;
      }
      return true;
    });
  }, [selectedCategory, searchQuery, onlyOpenRegistration]);

  const handleCategorySelect = (cat: CategoryFilter) => {
    setSelectedCategory(cat);
    soundFx.play('pill', 0.35);
  };

  return (
    <div className="min-h-screen w-full relative pt-24 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Top Breadcrumb & Return Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <button
          onClick={() => {
            soundFx.play('pill', 0.4);
            onBackToFest();
          }}
          className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/60 hover:bg-neutral-800 text-zinc-300 hover:text-white font-mono text-xs border border-white/[0.1] hover:border-white/30 transition-all active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>RETURN TO MAIN STAGE</span>
        </button>

        <div className="flex items-center gap-3 font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE DIRECTORY
          </span>
          <span className="text-zinc-600">•</span>
          <span>{filteredEvents.length} OF {FEST_EVENTS.length} EVENTS</span>
          <span className="text-zinc-600">•</span>
          <span className="text-sky-400">COSMIC SPACE ARENA</span>
        </div>
      </div>

      {/* Hero Headline Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
        <span className="font-mono text-[11px] text-sky-400/90 tracking-[0.3em] uppercase bg-sky-950/40 border border-sky-500/20 px-3 py-1 rounded-full inline-block">
          ABHIYANTRIKI 2026 // EVENTS DIRECTORY
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-white tracking-wide">
          Flagship Events & Keynotes
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 font-light font-serif italic max-w-2xl mx-auto leading-relaxed">
          Immerse yourself in national defense expos, robotics championships, engineering hackathons, and research symposiums. Registration is open to all university students across India.
        </p>

        {/* Global Google Form Register CTA banner */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <a
            href={registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundFx.play('pill', 0.5)}
            className="group px-6 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-black font-mono text-xs tracking-[0.2em] uppercase font-semibold transition-all duration-300 shadow-[0_0_25px_rgba(255,255,255,0.25)] flex items-center gap-2 active:scale-95"
          >
            <span>Register via Google Form</span>
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
          <span className="text-xs font-mono text-zinc-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Unified official registration portal
          </span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="space-y-4 max-w-6xl mx-auto">
        {/* Search Bar + Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-neutral-950/60 p-2 rounded-2xl border border-white/[0.08] backdrop-blur-md">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by event title, defense partner, tech keywords..."
              className="w-full pl-10 pr-4 py-2 bg-transparent text-sm text-white placeholder-zinc-500 font-mono focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 pl-2 sm:pl-0 border-t sm:border-t-0 sm:border-l border-white/[0.08] pt-2 sm:pt-0">
            <button
              onClick={() => {
                setOnlyOpenRegistration(!onlyOpenRegistration);
                soundFx.play('pill', 0.3);
              }}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all flex items-center gap-2 border ${
                onlyOpenRegistration
                  ? 'bg-white/10 text-white border-white/40 shadow-[0_0_10px_rgba(255,255,255,0.1)]'
                  : 'text-zinc-400 border-transparent hover:text-white'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  onlyOpenRegistration ? 'bg-emerald-400' : 'bg-zinc-600'
                }`}
              />
              <span>Open Only</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono text-xs transition-all duration-200 border ${
                  isActive
                    ? 'bg-neutral-800 text-white font-medium border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.15)]'
                    : 'bg-neutral-950/40 text-zinc-400 border-white/[0.08] hover:border-white/20 hover:text-white'
                }`}
              >
                {cat.icon}
                <span className="tracking-wider">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="glass-panel text-center py-20 px-6 rounded-2xl border border-white/[0.08] max-w-xl mx-auto space-y-4">
          <Sparkles className="w-8 h-8 text-zinc-500 mx-auto opacity-60" />
          <h3 className="font-serif text-xl text-white">No matching events found</h3>
          <p className="text-xs font-mono text-zinc-400">
            Try adjusting your search terms or clearing the active filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setOnlyOpenRegistration(false);
            }}
            className="px-4 py-2 rounded-full bg-neutral-900 border border-white/20 text-xs font-mono text-zinc-200 hover:text-white"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredEvents.map((event: FestEvent) => (
            <div
              key={event.id}
              className="group glass-panel p-6 rounded-2xl border border-white/[0.08] hover:border-white/25 transition-all duration-300 flex flex-col justify-between space-y-6 hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur-md relative overflow-hidden"
            >
              {/* Subtle top card glow line */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 group-hover:via-white/30 to-transparent" />

              <div className="space-y-4">
                {/* Header Metadata */}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest truncate max-w-[200px]">
                    {event.partner || event.category}
                  </span>
                  {event.badge && (
                    <span className="font-mono text-[9px] px-2 py-0.5 rounded-full border border-sky-400/30 bg-sky-950/40 text-sky-300 font-semibold tracking-wide shrink-0">
                      {event.badge}
                    </span>
                  )}
                </div>

                {/* Event Title & Subtitle */}
                <div className="space-y-1">
                  <h3 className="font-serif text-xl sm:text-2xl text-white font-normal group-hover:text-zinc-100 transition-colors leading-snug">
                    {event.title}
                  </h3>
                  {event.subtitle && (
                    <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                      {event.subtitle}
                    </p>
                  )}
                </div>

                {/* Event Description */}
                <p className="text-xs text-zinc-400 leading-relaxed font-light font-sans line-clamp-3">
                  {event.description}
                </p>

                {/* Highlights Tags */}
                {event.highlights && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {event.highlights.map((h, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] font-mono px-2 py-0.5 rounded bg-neutral-900/80 border border-white/[0.06] text-zinc-400"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    soundFx.play('pill', 0.3);
                    setSelectedEventModal(event);
                  }}
                  className="text-[11px] font-mono text-zinc-400 hover:text-white underline underline-offset-4 decoration-white/20 hover:decoration-white transition-all"
                >
                  View Details
                </button>

                <a
                  href={registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundFx.play('pill', 0.5)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white text-zinc-200 hover:text-black font-mono text-xs font-medium transition-all border border-white/20 hover:border-white active:scale-95 cursor-pointer shadow-sm"
                  title="Register for this event via Google Form"
                >
                  <span>Register</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Quick Modal */}
      {selectedEventModal && (
        <div className="fixed inset-0 z-50 bg-[#08090a]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-xl w-full rounded-2xl p-6 sm:p-8 border border-white/[0.15] space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedEventModal(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full bg-neutral-900/60 hover:bg-neutral-800 text-zinc-400 hover:text-white border border-white/[0.1] transition-all"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                  {selectedEventModal.category}
                </span>
                {selectedEventModal.badge && (
                  <span className="font-mono text-[9px] px-2 py-0.5 rounded-full border border-sky-400/30 bg-sky-950/40 text-sky-300">
                    {selectedEventModal.badge}
                  </span>
                )}
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                {selectedEventModal.title}
              </h2>
              {selectedEventModal.subtitle && (
                <p className="text-xs font-mono text-zinc-400">
                  {selectedEventModal.subtitle}
                </p>
              )}
            </div>

            {selectedEventModal.partner && (
              <div className="p-3 rounded-xl bg-neutral-950/70 border border-white/[0.08] flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-500">Official Partner:</span>
                <span className="text-zinc-200 font-medium">{selectedEventModal.partner}</span>
              </div>
            )}

            <div className="space-y-2">
              <h4 className="font-mono text-[11px] text-zinc-500 uppercase tracking-wider">
                Event Overview
              </h4>
              <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                {selectedEventModal.description}
              </p>
            </div>

            {selectedEventModal.highlights && selectedEventModal.highlights.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-mono text-[11px] text-zinc-500 uppercase tracking-wider">
                  Key Focus Areas
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedEventModal.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="text-xs font-mono px-2.5 py-1 rounded-lg bg-neutral-900 border border-white/[0.08] text-zinc-300"
                    >
                      • {h}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Event Logistics Info */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-950/50 border border-white/[0.06]">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                <span>{FEST_CONFIG.datesText}</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-950/50 border border-white/[0.06]">
                <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                <span>{FEST_CONFIG.location.college}</span>
              </div>
            </div>

            {/* Registration Action */}
            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-4">
              <span className="font-mono text-[10px] text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                REGISTRATION ACTIVE
              </span>

              <a
                href={registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundFx.play('pill', 0.5)}
                className="px-5 py-2 rounded-full bg-white hover:bg-zinc-200 text-black font-mono text-xs tracking-wider uppercase font-semibold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.2)] active:scale-95"
              >
                <span>Proceed to Google Form</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
