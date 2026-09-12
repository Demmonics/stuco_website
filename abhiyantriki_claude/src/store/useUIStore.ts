import { create } from 'zustand';

/**
 * Client-only UI state — the stuff GSAP ScrollTrigger callbacks and R3F useFrame loops
 * need to read/write WITHOUT going through React's render cycle (see spec 03's rationale
 * for Zustand over Context here). Server data (events, gallery, auth) lives in React Query,
 * not here — keep that boundary clean.
 */
interface UIState {
  /** Has the Pacman loader sequence finished? Gates mounting the main scroll experience. */
  loaderComplete: boolean;
  setLoaderComplete: (v: boolean) => void;

  /** Real asset-load progress (0-100), driven by the loader — NOT a fake timer, per spec 07. */
  loadProgress: number;
  setLoadProgress: (v: number) => void;

  /** Muted by default — loader/arcade SFX must never autoplay with sound, per spec 06. */
  audioMuted: boolean;
  toggleAudio: () => void;

  /** Which section is currently in view — drives sidebar nav highlighting. */
  activeSection: string;
  setActiveSection: (id: string) => void;

  /** prefers-reduced-motion / low-end-device fallback flag, per spec 03. */
  reducedMotion: boolean;
  setReducedMotion: (v: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  loaderComplete: false,
  setLoaderComplete: (v) => set({ loaderComplete: v }),

  loadProgress: 0,
  setLoadProgress: (v) => set({ loadProgress: v }),

  audioMuted: true,
  toggleAudio: () => set((s) => ({ audioMuted: !s.audioMuted })),

  activeSection: 'hero',
  setActiveSection: (id) => set({ activeSection: id }),

  reducedMotion:
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  setReducedMotion: (v) => set({ reducedMotion: v }),
}));
