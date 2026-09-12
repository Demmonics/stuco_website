import React, { useState } from 'react';
import { ARCHIVE_YEARS, type ArchiveYear } from '../../content/archiveYears';
import { Film } from 'lucide-react';
import { BlurText } from '../reactbits';

export const ArchiveSection: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(2025);

  const activeArchive: ArchiveYear =
    ARCHIVE_YEARS.find((a) => a.year === selectedYear) || ARCHIVE_YEARS[0];

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
  };

  return (
    <section id="archive" className="relative w-full py-32 px-6 max-w-7xl mx-auto space-y-16">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center space-y-3">
        <span className="font-mono text-[10px] text-zinc-500 tracking-[0.25em] uppercase">
          05 // ARCHIVES & HISTORICAL RECORD
        </span>
        <div className="inline-block border-b border-white/20 pb-1">
          <h2 className="font-serif text-4xl sm:text-5xl text-neutral-100 tracking-widest font-normal">
            Legacy & Editions
          </h2>
        </div>
        <div className="max-w-2xl mx-auto">
          <BlurText
            text="Official archival festival aftermovies and historical chronicles from past editions of Abhiyantriki (2017, 2018, 2019, 2025)."
            delay={60}
            stepDuration={0.25}
            direction="top"
            className="font-serif italic text-zinc-300 text-sm sm:text-base leading-relaxed font-light text-center justify-center"
          />
        </div>
      </div>

      {/* Sleek Minimalist Timeline Scrubber (Replacing bulky yellow pill buttons) */}
      <div className="w-full max-w-4xl mx-auto">
        <div className="relative border-b border-white/10 pb-4 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none px-4">
          {ARCHIVE_YEARS.map((a) => {
            const isSelected = a.year === selectedYear;
            return (
              <button
                key={a.year}
                onClick={() => handleYearSelect(a.year)}
                className="group relative flex flex-col items-center gap-2 py-2 px-3 transition-colors shrink-0"
              >
                <span
                  className={`font-mono text-xs sm:text-sm tracking-wider transition-colors ${
                    isSelected
                      ? 'text-white font-medium'
                      : 'text-zinc-500 group-hover:text-zinc-300'
                  }`}
                >
                  {a.year}
                </span>

                {/* Subtle timeline scrubber tick */}
                <div
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    isSelected
                      ? 'bg-white scale-125 shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                      : 'bg-zinc-700 group-hover:bg-zinc-500'
                  }`}
                />

                {/* Active Underline Indicator */}
                {isSelected && (
                  <div className="absolute -bottom-4 left-0 right-0 h-[1px] bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Year Archive Display */}
      <div className="glass-panel p-6 sm:p-10 rounded-2xl border border-white/[0.08] grid lg:grid-cols-12 gap-10 items-center">
        {/* Left Video Embed or Cover */}
        <div className="lg:col-span-7 rounded-xl overflow-hidden border border-white/10 aspect-video bg-neutral-950 relative flex items-center justify-center">
          {activeArchive.youtubeVideoId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${activeArchive.youtubeVideoId}?rel=0`}
              title={`Abhiyantriki ${activeArchive.year} Aftermovie`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 space-y-3">
              <Film className="w-10 h-10 text-zinc-500" />
              <div className="font-serif text-lg text-white">
                Archival Records // {activeArchive.year}
              </div>
              <p className="text-xs text-zinc-400 max-w-sm font-mono leading-relaxed">
                {activeArchive.summary}
              </p>
            </div>
          )}
        </div>

        {/* Right Details & Highlights */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-1.5">
            <span className="font-mono text-[10px] text-zinc-500 tracking-[0.2em] uppercase">
              EDITION // {activeArchive.year}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
              {activeArchive.themeTitle}
            </h3>
          </div>

          <p className="font-serif italic text-zinc-300 text-sm leading-relaxed font-light">
            "{activeArchive.summary}"
          </p>

          <div className="space-y-3 pt-2">
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">
              Historical Milestones
            </div>
            <div className="space-y-2">
              {activeArchive.highlights.map((h, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 text-xs text-zinc-300 p-3 rounded-lg bg-neutral-900/40 border border-white/[0.06]"
                >
                  <span className="font-mono text-[10px] text-zinc-500 shrink-0">
                    0{i + 1}
                  </span>
                  <span className="font-light">{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
