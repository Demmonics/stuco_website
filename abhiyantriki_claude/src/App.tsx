import { useEffect, useState } from 'react';
import { PacmanLoader } from '@/components/loader/PacmanLoader';
import { HeroScene } from '@/components/three/HeroScene';
import { useUIStore } from '@/store/useUIStore';
import { setupGSAP } from '@/lib/gsap';
import { setupLenis } from '@/lib/lenis';
import { festConfig } from '@/content/festConfig';

export default function App() {
  const loaderComplete = useUIStore((s) => s.loaderComplete);
  const setLoaderComplete = useUIStore((s) => s.setLoaderComplete);
  const loadProgress = useUIStore((s) => s.loadProgress);
  const setLoadProgress = useUIStore((s) => s.setLoadProgress);
  const setReducedMotion = useUIStore((s) => s.setReducedMotion);

  const [gsapReady, setGsapReady] = useState(false);

  useEffect(() => {
    const { prefersReduced } = setupGSAP();
    setReducedMotion(prefersReduced);
    setGsapReady(true);

    // Once the loader has handed off, wire up smooth scroll for the main experience.
    let lenis: ReturnType<typeof setupLenis> | undefined;
    if (loaderComplete) {
      lenis = setupLenis();
    }
    return () => lenis?.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaderComplete]);

  // Placeholder progress driver: in the full build this reads @react-three/drei's
  // useProgress (real asset-loading progress) once the actual model set is in /public/models.
  // Simulated here only so the loader is visibly functional in this standalone scaffold.
  useEffect(() => {
    if (loaderComplete) return;
    const id = setInterval(() => {
      setLoadProgress(Math.min(100, loadProgress + Math.random() * 12));
    }, 150);
    return () => clearInterval(id);
  }, [loadProgress, loaderComplete, setLoadProgress]);

  if (!gsapReady) return null;

  if (!loaderComplete) {
    return (
      <PacmanLoader progress={loadProgress} onComplete={() => setLoaderComplete(true)} />
    );
  }

  return (
    <main className="relative min-h-screen">
      <nav className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between px-6 py-4 md:px-12">
        <img src="/brand/logo-mark.png" alt="Abhiyantriki" className="h-8 w-8" />
        <div className="section-label hidden gap-8 md:flex">
          <span>Overview</span>
          <span>Events</span>
          <span>Ideate</span>
          <span>Dignitaries</span>
          <span>Archive</span>
          <span>Partners</span>
        </div>
        <button className="btn-cta text-sm">Register</button>
      </nav>

      <section className="grain-overlay relative flex h-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <HeroScene />
        </div>

        <div className="glass-panel relative z-10 mx-6 max-w-2xl p-8 md:p-12">
          <span className="badge-live mb-4">
            <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-signal-green" />
            Council Verified · {festConfig.generalSecretary.name}
          </span>
          <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">
            {festConfig.tagline.split('. ').map((line, i) => (
              <span key={i} className={i === 1 ? 'text-glow text-cyan-400' : ''}>
                {line}
                {i < 1 ? '. ' : ''}
                <br />
              </span>
            ))}
          </h1>
          <p className="mt-4 text-white/70">
            {festConfig.institution}'s premier annual technical festival. Hosting the Indian
            Navy, Army, Air Force, NSG, ISRO, BARC, alongside national robotics
            championships, Auto Expo, and the Distinguished Lecture Series.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 font-mono-data text-sm text-cyan-400">
            <span>📅 {festConfig.dateRange.display}</span>
            <span>📍 {festConfig.institution}</span>
          </div>
          <div className="mt-8 flex gap-4">
            <button className="btn-cta">Register Now</button>
            <button className="btn-ghost">Explore Events</button>
          </div>
        </div>
      </section>

      {/* Remaining sections (Overview, Highlight Events, Dignitaries, Archive, Register)
          per spec 07's choreography table are not built in this scaffold — see the
          accompanying README for exactly what's real here vs. still to build. */}
    </main>
  );
}
