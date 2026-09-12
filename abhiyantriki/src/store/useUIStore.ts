import { create } from 'zustand';

export interface UIState {
  // Loader state
  isLoading: boolean;
  loadingProgress: number;
  hasLoadedOnce: boolean;
  setLoadingProgress: (progress: number) => void;
  finishLoading: () => void;
  skipLoading: () => void;

  // Audio state
  isMuted: boolean;
  toggleMute: () => void;
  setMuted: (muted: boolean) => void;

  // Navigation and scroll state
  activeSection: string;
  setActiveSection: (sectionId: string) => void;

  // Performance and 3D device controls
  prefersReducedMotion: boolean;
  lowEndDeviceFallback: boolean;
  active3DScene: string | null;
  setPrefersReducedMotion: (reduced: boolean) => void;
  setLowEndDeviceFallback: (fallback: boolean) => void;
  setActive3DScene: (sceneName: string | null) => void;

  // Registration modal state
  selectedEventForRegistration: string | null;
  openRegistrationModal: (eventId: string) => void;
  closeRegistrationModal: () => void;
}

export const useUIStore = create<UIState>((set) => {
  // Check session storage for repeat visits
  const sessionHasLoaded = typeof window !== 'undefined' && sessionStorage.getItem('abhi_loaded_once') === 'true';

  return {
    isLoading: !sessionHasLoaded,
    loadingProgress: 0,
    hasLoadedOnce: sessionHasLoaded,

    setLoadingProgress: (progress: number) => set({ loadingProgress: Math.min(100, Math.max(0, progress)) }),

    finishLoading: () => {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('abhi_loaded_once', 'true');
      }
      set({ isLoading: false, hasLoadedOnce: true, loadingProgress: 100 });
    },

    skipLoading: () => {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('abhi_loaded_once', 'true');
      }
      set({ isLoading: false, hasLoadedOnce: true, loadingProgress: 100 });
    },

    isMuted: false, // Default unmuted so loading audio plays as requested
    toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
    setMuted: (muted: boolean) => set({ isMuted: muted }),

    activeSection: 'hero',
    setActiveSection: (sectionId: string) => set({ activeSection: sectionId }),

    prefersReducedMotion: false,
    lowEndDeviceFallback: false,
    active3DScene: 'space-warp',
    setPrefersReducedMotion: (reduced: boolean) => set({ prefersReducedMotion: reduced }),
    setLowEndDeviceFallback: (fallback: boolean) => set({ lowEndDeviceFallback: fallback }),
    setActive3DScene: (sceneName: string | null) => set({ active3DScene: sceneName }),

    selectedEventForRegistration: null,
    openRegistrationModal: (eventId: string) => set({ selectedEventForRegistration: eventId }),
    closeRegistrationModal: () => set({ selectedEventForRegistration: null }),
  };
});
