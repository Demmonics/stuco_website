/**
 * Confirmed facts only — per spec 05's "don't guess" rule. Anything not sourced from the
 * brochures or explicitly confirmed by the council stays out rather than getting invented
 * (see the fabricated-stats correction earlier in this project).
 */
export const festConfig = {
  name: 'Abhiyantriki',
  edition: 2026,
  tagline: 'Two days. Three armed forces. One campus.',
  dateRange: {
    start: '2026-10-14',
    end: '2026-10-15',
    display: 'October 14–15, 2026',
  },
  institution: 'K. J. Somaiya School of Engineering (KJSSE)',
  generalSecretary: {
    name: 'Kaveen Shetty',
    title: 'General Secretary, KJSSE Students\u2019 Council 2026\u201327',
  },
  social: {
    instagram: '@kjscelive',
  },
  // No footfall/college-count/prize-pool figures here — none exist in either source
  // brochure. Add real ones from the council when available; do not fill with estimates.
} as const;
