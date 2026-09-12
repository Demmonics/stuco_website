import { useEffect, useState } from 'react';
import { useUIStore } from './store/useUIStore';
import { useAuthStore } from './store/useAuthStore';
import { useCMSStore } from './store/useCMSStore';
import { FEST_CONFIG, GOOGLE_FORM_URL } from './content/festConfig';
import { PacmanLoader } from './components/loader/PacmanLoader';
import { HeroSection } from './components/hero/HeroSection';
import { OverviewSection } from './components/sections/OverviewSection';
import { ArenasServiceSection } from './components/sections/ArenasServiceSection';
import { ProjectsShowcaseSection } from './components/sections/ProjectsShowcaseSection';
import { HighlightEventsSection } from './components/sections/HighlightEventsSection';
import { DignitariesSection } from './components/sections/DignitariesSection';
import { ArchiveSection } from './components/sections/ArchiveSection';
import { SponsorshipSection } from './components/sections/SponsorshipSection';
import { RegistrationModal } from './components/forms/RegistrationModal';
import { AuthModal } from './components/auth/AuthModal';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { AdminPortal } from './components/admin/AdminPortal';
import { Persistent3DScene } from './components/three/Persistent3DScene';
import { ScrollDotsRail } from './components/navigation/ScrollDotsRail';
import { initLenis, scrollToSection } from './lib/lenis';
import { Shield, Ticket, User, LogIn, LogOut, Compass, X } from 'lucide-react';
import { soundFx } from './lib/audioManager';
import { Waves, FluidGlassCursor, OptionWheel } from './components/reactbits';

const SECTIONS = [
  { label: '01 // FEST', view: 'fest' as const, hash: 'hero' },
  { label: '02 // ABOUT', view: 'fest' as const, hash: 'overview' },
  { label: '03 // ARENAS', view: 'fest' as const, hash: 'service' },
  { label: '04 // SHOWCASE', view: 'fest' as const, hash: 'projects' },
  { label: '05 // EVENTS', view: 'fest' as const, hash: 'events' },
  { label: '06 // ARCHIVES', view: 'fest' as const, hash: 'archive' },
  { label: '07 // SPONSORS', view: 'fest' as const, hash: 'sponsors' },
  { label: '08 // PASSES', view: 'dashboard' as const, hash: 'dashboard' },
];

export function App() {
  const { isMuted, toggleMute } = useUIStore();
  const { user, isAuthenticated, openAuthModal, signOut, checkSession } = useAuthStore();
  const { registrations, googleFormUrl, fetchGoogleFormConfig } = useCMSStore();

  useEffect(() => {
    fetchGoogleFormConfig();
    checkSession();
  }, [fetchGoogleFormConfig, checkSession]);

  const [view, setView] = useState<'fest' | 'dashboard' | 'admin'>('fest');
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [showNavWheel, setShowNavWheel] = useState(false);
  const [credits, setCredits] = useState<any[]>([]);

  // Count user registrations
  const userRegistrationCount = registrations.filter(
    (r) => r.userId === user?.id || (user && r.email.toLowerCase() === user.email.toLowerCase())
  ).length;

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = initLenis();
    return () => {
      lenis.destroy();
    };
  }, []);

  // Hash change detection
  useEffect(() => {
    const handleHash = () => {
      const rawHash = window.location.hash;
      const cleanHash = rawHash.replace(/^#/, '');
      if (cleanHash === 'admin') {
        setView('admin');
      } else if (cleanHash === 'dashboard') {
        setView('dashboard');
      } else {
        setView('fest');
        if (cleanHash && cleanHash !== 'hero') {
          setTimeout(() => {
            scrollToSection(cleanHash);
          }, 80);
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Keyboard shortcut (Cmd+K / Ctrl+K) for spatial option wheel directory
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowNavWheel((prev) => !prev);
        soundFx.play('pill', 0.4);
      } else if (e.key === 'Escape' && showNavWheel) {
        setShowNavWheel(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showNavWheel]);

  useEffect(() => {
    fetch('/credits.json')
      .then((res) => res.json())
      .then((data) => setCredits(data))
      .catch(() => {});
  }, []);


  const handleNavigate = (targetView: 'fest' | 'dashboard' | 'admin', hashTarget?: string) => {
    soundFx.play('pill', 0.35);
    const wasDifferentView = view !== targetView;
    setView(targetView);
    if (hashTarget) {
      window.location.hash = hashTarget;
      if (targetView === 'fest') {
        setTimeout(() => {
          scrollToSection(hashTarget);
        }, wasDifferentView ? 90 : 0);
      }
    } else {
      window.location.hash = targetView === 'fest' ? 'hero' : targetView;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#08090a] text-neutral-200 relative overflow-x-hidden flex flex-col font-sans selection:bg-white/20 selection:text-white">
      {/* Fluid Specular Glass Cursor Lens */}
      <FluidGlassCursor />

      {/* 1. Full-Viewport 35mm SVG Film Grain Overlay (Gustavo Batista Reference) */}
      <div className="film-grain" />

      {/* 2. Soft Volumetric Radial Spotlights (Kills Flat Black) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-[22%] right-[8%] w-[680px] h-[680px] rounded-full volumetric-spotlight-right opacity-85" />
        <div className="absolute top-[60%] left-[5%] w-[620px] h-[620px] rounded-full volumetric-spotlight-center opacity-45" />
      </div>

      {/* 2b. Subtle Ambient Perlin Noise Waves (Low Opacity Backdrop Layer) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true" style={{ opacity: 0.6 }}>
        <Waves
          lineColor="rgba(255, 255, 255, 0.07)"
          backgroundColor="transparent"
          waveSpeedX={0.01}
          waveSpeedY={0.004}
          waveAmpX={28}
          waveAmpY={14}
          xGap={32}
          yGap={40}
          friction={0.925}
          tension={0.006}
          maxCursorMove={80}
        />
      </div>

      {/* 3. Single Persistent 3D WebGL Background Scene across Entire Journey */}
      <Persistent3DScene />

      {/* 4. Minimalist Technical Telemetry & Corner Crosshairs */}
      <div className="fixed top-3 left-4 text-zinc-600/60 font-mono text-[10px] pointer-events-none z-30 select-none hidden sm:block">
        +
      </div>
      <div className="fixed top-3 right-4 text-zinc-600/60 font-mono text-[10px] pointer-events-none z-30 select-none hidden sm:block">
        +
      </div>
      <div className="fixed bottom-4 left-6 text-zinc-500/50 font-mono text-[9px] pointer-events-none z-30 select-none hidden md:flex items-center gap-3 uppercase tracking-[0.2em]">
        <span>COORD // 19.0760° N, 72.8777° E</span>
        <span className="text-zinc-700">•</span>
        <span>SOMAIYA TECH FEST</span>
      </div>
      <div className="fixed bottom-4 right-8 text-zinc-500/50 font-mono text-[9px] pointer-events-none z-30 select-none hidden md:flex items-center gap-3 uppercase tracking-[0.2em]">
        <span>SYS.STAT // NOMINAL</span>
        <span className="text-zinc-700">•</span>
        <span>EDITION // 2026</span>
      </div>

      {/* 4. Right-Rail Vertical Navigation Dots with Embedded Spatial INDEX Trigger */}
      {view === 'fest' && <ScrollDotsRail onOpenIndex={() => setShowNavWheel(true)} />}

      {/* Floating Right-Side INDEX Trigger for Mobile & Tablet Viewports */}
      <button
        onClick={() => {
          setShowNavWheel((prev) => !prev);
          soundFx.play('pill', 0.4);
        }}
        className="fixed right-4 top-16 z-40 px-3 py-1.5 rounded-full bg-[#08090a]/90 hover:bg-neutral-800 text-zinc-300 hover:text-white text-xs flex items-center gap-1.5 border border-white/20 hover:border-white/60 transition-all font-mono shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-md active:scale-95 md:hidden"
        title="Spatial Directory Wheel (⌘K)"
      >
        <Compass className="w-3.5 h-3.5 text-sky-400" />
        <span className="text-[10px] tracking-widest font-mono">INDEX</span>
      </button>

      {/* 5. Pacman Loading Ignition Sequence */}
      <PacmanLoader />

      {/* 6. Floating Minimalist Top Navigation Header (Hairline Monochromatic Style) */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#08090a]/50 backdrop-blur-md border-b border-white/[0.08] px-4 sm:px-8 py-3.5 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => handleNavigate('fest', 'hero')}
            className="flex items-center gap-3 text-left focus:outline-none group"
          >
            <img
              src="/brand/logo-mark.png"
              alt="Abhiyantriki Mark"
              className="w-6 h-6 object-contain opacity-75 group-hover:opacity-100 transition-opacity"
            />
            <span className="font-serif text-sm sm:text-base tracking-[0.25em] text-white font-normal uppercase">
              Abhiyantriki
            </span>
          </button>

          {/* Center navigation links */}
          <nav className="hidden lg:flex items-center gap-8 text-[11px] font-mono text-zinc-400 tracking-[0.15em]">
            <button
              onClick={() => handleNavigate('fest', 'hero')}
              className={`hover:text-white transition-colors ${
                view === 'fest' ? 'text-white font-medium underline underline-offset-8 decoration-white/40' : ''
              }`}
            >
              01 // FEST
            </button>
            <button
              onClick={() => handleNavigate('fest', 'overview')}
              className="hover:text-white transition-colors"
            >
              02 // ABOUT
            </button>
            <button
              onClick={() => handleNavigate('fest', 'service')}
              className="hover:text-white transition-colors"
            >
              03 // ARENAS
            </button>
            <button
              onClick={() => handleNavigate('fest', 'projects')}
              className="hover:text-white transition-colors"
            >
              04 // SHOWCASE
            </button>
            <button
              onClick={() => handleNavigate('dashboard')}
              className={`hover:text-white transition-colors flex items-center gap-1.5 ${
                view === 'dashboard' ? 'text-white font-medium underline underline-offset-8 decoration-white/40' : ''
              }`}
            >
              <Ticket className="w-3 h-3 text-zinc-400" />
              05 // PASSES
              {userRegistrationCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-white text-[9px] text-black font-bold">
                  {userRegistrationCount}
                </span>
              )}
            </button>

            {/* Admin link visible to council admins and super admins */}
            {isAuthenticated && (user?.role === 'council_admin' || user?.role === 'super_admin') && (
              <button
                onClick={() => handleNavigate('admin')}
                className={`hover:text-white transition-colors flex items-center gap-1 ${
                  view === 'admin' ? 'text-white font-bold' : 'text-zinc-400'
                }`}
              >
                <Shield className="w-3 h-3 text-zinc-400" />
                06 // ADMIN
              </button>
            )}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">

            {/* Audio Mute / Unmute Button */}
            <button
              onClick={() => {
                toggleMute();
                soundFx.setLoaderMuted(!isMuted);
              }}
              className="px-2.5 py-1.5 rounded-full text-zinc-400 hover:text-white text-xs flex items-center gap-2 border border-white/[0.08] hover:border-white/30 transition-all font-mono"
              title={isMuted ? 'Unmute audio' : 'Mute audio'}
            >
              <div className="relative flex items-center justify-center w-3 h-3">
                <div className={`w-2.5 h-2.5 rounded-full border border-zinc-400 ${isMuted ? 'opacity-40' : 'animate-ping'}`} />
                <div className={`w-1 h-1 rounded-full ${isMuted ? 'bg-zinc-500' : 'bg-white'}`} />
              </div>
              <span className="text-[10px] tracking-widest hidden sm:inline">
                {isMuted ? 'AUDIO OFF' : 'AUDIO ON'}
              </span>
            </button>

            {/* User Profile / Auth Action */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavigate('dashboard')}
                  className="px-3 py-1.5 rounded-full border border-white/[0.08] hover:border-white/30 text-xs font-mono flex items-center gap-1.5 text-zinc-300"
                  title="View Student Dashboard"
                >
                  <User className="w-3 h-3 text-zinc-400" />
                  <span className="max-w-[80px] truncate hidden sm:inline">{user.fullName.split(' ')[0]}</span>
                </button>

                <button
                  onClick={() => signOut()}
                  className="p-1.5 rounded-full text-zinc-400 hover:text-white border border-white/[0.08] hover:border-white/20"
                  title="Sign Out"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('signin')}
                className="px-3.5 py-1.5 rounded-full border border-white/[0.08] hover:border-white/40 text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1.5"
              >
                <LogIn className="w-3 h-3" />
                <span>Sign In</span>
              </button>
            )}

            {/* Register Outlined Pill CTA (High Visibility & Google Form Link) */}
            <a
              href={googleFormUrl || GOOGLE_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFx.play('pill', 0.5)}
              className="relative z-50 px-4 py-1.5 rounded-full border border-white/40 hover:border-white text-white hover:text-black font-mono text-[11px] tracking-[0.2em] uppercase transition-all duration-300 bg-white/10 hover:bg-white shadow-[0_0_15px_rgba(255,255,255,0.15)] active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              Register
            </a>
          </div>
        </div>
      </header>

      {/* Main Continuous Single-Scroll Container */}
      <main className="flex-1 w-full relative z-10">
        {view === 'fest' && (
          <div className="space-y-12">
            {/* 1. Hero Section */}
            <HeroSection />

            {/* 2. Overview Section (About + Editorial Milestones) */}
            <OverviewSection />

            {/* 3. Arenas Section (2x3 Minimalist Service Grid) */}
            <ArenasServiceSection />

            {/* 4. Projects Showcase Section (3D Wireframe Perspective Frames) */}
            <ProjectsShowcaseSection />

            {/* 5. Highlight Events & Expos Detail Section */}
            <HighlightEventsSection />

            {/* 6. Distinguished Lecture Series */}
            <DignitariesSection />

            {/* 7. Archive Timeline 2017-2025 */}
            <ArchiveSection />

            {/* 8. Corporate Sponsorship Tiers */}
            <SponsorshipSection />
          </div>
        )}

        {view === 'dashboard' && (
          <StudentDashboard
            onBackToFest={() => handleNavigate('fest', 'hero')}
            onBrowseEvents={() => handleNavigate('fest', 'projects')}
          />
        )}

        {view === 'admin' && (
          <AdminPortal onBackToFest={() => handleNavigate('fest', 'hero')} />
        )}
      </main>

      {/* Interactive Registration Modal */}
      <RegistrationModal onOpenDashboard={() => handleNavigate('dashboard')} />

      {/* Interactive Authentication Modal */}
      <AuthModal />

      {/* Footer with Institutional Co-Branding */}
      <footer className="border-t border-white/[0.08] bg-[#08090a]/80 backdrop-blur-md py-12 px-6 relative z-10 mt-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src="/brand/kjsse.png"
              alt="KJSSE"
              className="h-9 object-contain opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
            />
            <div className="h-6 w-px bg-white/[0.08]" />
            <img
              src="/brand/somaiya-trust.svg"
              alt="Somaiya Trust"
              className="h-8 object-contain opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
            />
          </div>

          <div className="text-xs text-zinc-500 text-center md:text-right font-mono space-y-1">
            <p>© 2026 {FEST_CONFIG.council.bodyName}. All rights reserved.</p>
            <p>
              {FEST_CONFIG.council.generalSecretaryTitle}: {FEST_CONFIG.council.generalSecretary} •{' '}
              <button
                onClick={() => setShowCreditsModal(true)}
                className="text-zinc-400 hover:text-white underline underline-offset-4 decoration-white/20"
              >
                Attributions & 3D Licenses
              </button>
            </p>
            <p className="pt-1.5 text-[11px] text-zinc-400">
              Made by Creative Head <span className="text-white font-medium tracking-wide">{FEST_CONFIG.council.creativeHead}</span>
            </p>
          </div>
        </div>
      </footer>

      {/* 3D Model Credits Modal */}
      {showCreditsModal && (
        <div className="fixed inset-0 z-50 bg-[#08090a]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-xl p-6 border border-white/[0.12] space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="font-serif text-lg font-normal text-white">
                3D Model Attribution & Licenses
              </h3>
              <button
                onClick={() => setShowCreditsModal(false)}
                className="text-zinc-400 hover:text-white px-2 py-1 rounded font-mono text-sm"
              >
                ✕ Close
              </button>
            </div>
            <div className="space-y-3">
              {credits.map((c, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-neutral-900/40 border border-white/[0.06] text-xs space-y-1"
                >
                  <div className="font-medium text-white">{c.model}</div>
                  <div className="text-zinc-400">
                    Author:{' '}
                    <a
                      href={c.authorUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-zinc-200 underline"
                    >
                      {c.author}
                    </a>{' '}
                    • License:{' '}
                    <a
                      href={c.licenseUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-zinc-200 underline"
                    >
                      {c.license}
                    </a>
                  </div>
                  <div className="text-zinc-500 text-[11px] font-mono">{c.notes}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3D OptionWheel Spatial Directory Modal */}
      {showNavWheel && (
        <div className="fixed inset-0 z-50 bg-[#08090a]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full rounded-2xl p-6 sm:p-8 border border-white/20 space-y-6 relative shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-zinc-300" />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-300">
                  INDEX DIRECTORY // SPATIAL SELECTOR
                </span>
              </div>
              <button
                onClick={() => setShowNavWheel(false)}
                className="text-zinc-400 hover:text-white p-1 rounded font-mono text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="h-[280px] w-full flex items-center justify-center relative select-none">
              <OptionWheel
                items={SECTIONS.map((s) => s.label)}
                onChange={(index) => {
                  const sec = SECTIONS[index];
                  if (sec) {
                    handleNavigate(sec.view, sec.hash);
                  }
                }}
                fontSize={1.4}
                spacing={1.4}
                curve={0.9}
                tilt={6}
                blur={1.8}
                fade={0.3}
                textColor="#71717a"
                activeColor="#ffffff"
                className="w-full h-full"
              />
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 border-t border-white/10 pt-3">
              <span>DRAG / SCROLL TO ORBIT</span>
              <span>[ESC] TO CLOSE</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
