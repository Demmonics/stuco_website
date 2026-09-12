import { useUIStore } from '../store/useUIStore';

class AudioManager {
  private cache: Map<string, HTMLAudioElement> = new Map();
  private loaderAudio: HTMLAudioElement | null = null;
  private fadeInterval: any = null;

  private getAudio(url: string): HTMLAudioElement {
    if (!this.cache.has(url)) {
      const audio = new Audio(url);
      audio.preload = 'auto';
      this.cache.set(url, audio);
    }
    return this.cache.get(url)!;
  }

  startLoaderAudio(volume = 0.55) {
    if (typeof window === 'undefined') return;
    try {
      if (this.fadeInterval) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
      }
      if (!this.loaderAudio) {
        this.loaderAudio = new Audio('/audio/freesound_community-playing-pac-man-6783.mp3');
        this.loaderAudio.preload = 'auto';
        this.loaderAudio.loop = true;
      }
      const isMuted = useUIStore.getState().isMuted;
      this.loaderAudio.muted = isMuted;
      this.loaderAudio.volume = volume;

      const playPromise = this.loaderAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay policy prevented immediate playback; will resume on first user interaction
        });
      }
    } catch {
      // Ignore audio failure
    }
  }

  setLoaderMuted(muted: boolean) {
    if (this.loaderAudio) {
      this.loaderAudio.muted = muted;
      if (!muted && this.loaderAudio.paused) {
        this.loaderAudio.play().catch(() => {});
      }
    }
  }

  stopLoaderAudio(fadeOut = true) {
    if (!this.loaderAudio) return;
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }
    if (!fadeOut) {
      this.loaderAudio.pause();
      this.loaderAudio.currentTime = 0;
      return;
    }

    const audio = this.loaderAudio;
    let vol = audio.volume;
    this.fadeInterval = setInterval(() => {
      vol = Math.max(0, vol - 0.08);
      audio.volume = vol;
      if (vol <= 0.02) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
        audio.pause();
        audio.currentTime = 0;
      }
    }, 30);
  }

  play(soundName: 'eating' | 'eatghost' | 'siren' | 'die' | 'opening' | 'extraLives' | 'pill' | 'pacmanPlaying', volume = 0.5) {
    const isMuted = useUIStore.getState().isMuted;
    if (isMuted) return;

    const fileMap: Record<string, string> = {
      eating: '/audio/eating.mp3',
      eatghost: '/audio/eatghost.mp3',
      siren: '/audio/siren.mp3',
      die: '/audio/die.mp3',
      opening: '/audio/opening_song.mp3',
      extraLives: '/audio/extra lives.mp3',
      pill: '/audio/eatpill.mp3',
      pacmanPlaying: '/audio/freesound_community-playing-pac-man-6783.mp3'
    };

    const url = fileMap[soundName];
    if (!url) return;

    try {
      const audio = this.getAudio(url);
      audio.volume = volume;
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Handled silently for browser auto-play restrictions
      });
    } catch {
      // Ignore audio failure
    }
  }
}

export const soundFx = new AudioManager();
