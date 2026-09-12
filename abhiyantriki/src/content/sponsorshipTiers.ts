export interface SponsorshipTier {
  title: string;
  amount: string;
  deliverables: string[];
  recommended?: boolean;
}

export const SPONSORSHIP_TIERS: SponsorshipTier[] = [
  {
    title: "Title Sponsor",
    amount: "₹7,00,000",
    deliverables: [
      "Naming rights: 'Abhiyantriki presented by [Brand]'",
      "Prime marquee banner and main entrance arch branding",
      "Exclusive prime stage slot during opening and closing ceremonies",
      "Premium on-ground experiential stall in central college quadrangle",
      "Full digital integration across website, app, aftermovie, and press releases",
      "Direct database distribution of recruitment collateral to 25,000+ attendees"
    ],
    recommended: true,
  },
  {
    title: "Co-Sponsor",
    amount: "₹5,00,000",
    deliverables: [
      "Co-branding across all digital hoardings and event backdrops",
      "Large dedicated demo kiosk in the main expo arena",
      "Official sponsorship of 2 marquee competitions (e.g. RoboWars or Hackathon)",
      "Dedicated social media spotlight reels and founder/executive interview",
      "Branded delegate passes and VIP seating for company executives"
    ]
  },
  {
    title: "Co-Powered By",
    amount: "₹3,50,000",
    deliverables: [
      "Branding across event certificates, badges, and official fest merchandise",
      "On-ground canopy in prime footfall corridor",
      "Sponsorship of 1 major workshop / challenge track",
      "Prominent logo placement on all event posters across 100+ Mumbai colleges"
    ]
  },
  {
    title: "Associate Partner",
    amount: "₹3,00,000",
    deliverables: [
      "Logo presence on official website and registration portal",
      "Display banner inside the auditorium during the Distinguished Lecture Series",
      "Promotion across student mailers and college social media handles",
      "Access to fest resume database for recruitment"
    ]
  }
];
