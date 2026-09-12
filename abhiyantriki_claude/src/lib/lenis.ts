import Lenis from 'lenis';
import { gsap, ScrollTrigger, MOTION } from './gsap';

/**
 * Free (non-Club-GreenSock) alternative to ScrollSmoother — see spec 03.
 * Drives GSAP's ticker so ScrollTrigger and Lenis never fight over the same rAF loop.
 */
export function setupLenis(): Lenis {
  const lenis = new Lenis({
    lerp: MOTION.lerp,
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return lenis;
}
