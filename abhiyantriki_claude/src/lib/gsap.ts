import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Motion tokens from spec 04 — keep every timeline referencing these instead of
 * hardcoding durations/eases so the whole site's motion feel stays consistent.
 */
export const MOTION = {
  sectionEase: 'power3.inOut',
  uiEase: 'power2.out',
  hoverEase: 'power1.out',
  sectionDuration: 1.0,
  hoverDuration: 0.25,
  lerp: 0.1,
};

/**
 * Call once at app root. Respects prefers-reduced-motion by disabling GSAP's
 * default easing/duration globally — per spec 03/07, reduced motion is not optional polish.
 */
export function setupGSAP() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    gsap.globalTimeline.timeScale(100); // effectively instant
    ScrollTrigger.config({ ignoreMobileResize: true });
  }
  return { prefersReduced };
}

export { gsap, ScrollTrigger };
