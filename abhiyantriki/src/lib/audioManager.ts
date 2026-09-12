import { useUIStore } from '../store/useUIStore';

class AudioManager {
  private cache: Map<string, HTMLAudioElement> = new Map();

  private getAudio(url: string): HTMLAudioElement {
    if (!this.cache.has(url)) {
      const audio = new Audio(url);
      audio.preload = 'auto';
      this.cache.set(url, audio);
    }
    return this.cache.get(url)!;
  }

  play(soundName: 'eating' | 'eatghost' | 'siren' | 'die' | 'opening' | 'extraLives' | 'pill', volume = 0.5) {
    const isMuted = useUIStore.getState().isMuted;
    if (isMuted) return;

    const fileMap: Record<string, string> = {
      eating: '/audio/eating.mp3',
      eatghost: '/audio/eatghost.mp3',
      siren: '/audio/siren.mp3',
      die: '/audio/die.mp3',
      opening: '/audio/opening_song.mp3',
      extraLives: '/audio/extra lives.mp3',
      pill: '/audio/eatpill.mp3'
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
