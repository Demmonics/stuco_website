import { useUIStore } from '../store/useUIStore';

class AudioManager {
  private loaderAudio: HTMLAudioElement | null = null;
  private fadeInterval: any = null;

  startLoaderAudio(volume = 0.55) {
    if (typeof window === 'undefined') return;
    // Audio is strictly limited to when the website is loading
    if (!useUIStore.getState().isLoading) return;

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
          // Autoplay policy prevented immediate playback; will resume on first user gesture during loading
        });
      }
    } catch {
      // Ignore audio failure
    }
  }

  setLoaderMuted(muted: boolean) {
    if (this.loaderAudio) {
      this.loaderAudio.muted = muted;
      if (!muted && this.loaderAudio.paused && useUIStore.getState().isLoading) {
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
      vol = Math.max(0, vol - 0.1);
      audio.volume = vol;
      if (vol <= 0.02) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
        audio.pause();
        audio.currentTime = 0;
      }
    }, 25);
  }

  play(_soundName?: string, _volume = 0.5) {
    // Audio should only be played when the website is loading; do not play it any other time.
    return;
  }
}

export const soundFx = new AudioManager();
