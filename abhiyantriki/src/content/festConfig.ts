export const GOOGLE_FORM_URL = "https://forms.gle/y81No241PDAsHmBCA";

export interface FestConfig {
  name: string;
  year: number;
  edition: string;
  tagline: string;
  datesText: string;
  dates: {
    start: string; // ISO format
    end: string;
  };
  location: {
    college: string;
    campus: string;
    city: string;
    mapUrl: string;
  };
  council: {
    bodyName: string;
    generalSecretary: string;
    generalSecretaryTitle: string;
    creativeHead: string;
    creativeHeadTitle: string;
    email: string;
    phone?: string;
  };
  socials: {
    instagram: string;
    youtube: string;
    linkedin?: string;
  };
  facts: {
    armedForcesBranches: string;
    defensePartnersCount: string;
    dignitariesCount: string;
    ideateChallengesCount: string;
  };
}

export const FEST_CONFIG: FestConfig = {
  name: "Abhiyantriki",
  year: 2026,
  edition: "2026 Edition",
  tagline: "KJSSE's Premier Annual Technical Festival",
  datesText: "October 14 – 15, 2026",
  dates: {
    start: "2026-10-14T09:00:00+05:30",
    end: "2026-10-15T18:00:00+05:30",
  },
  location: {
    college: "K. J. Somaiya School of Engineering",
    campus: "Somaiya Vidyavihar University Campus, Vidyavihar (East)",
    city: "Mumbai, Maharashtra 400077",
    mapUrl: "https://maps.google.com/?q=K.+J.+Somaiya+College+of+Engineering+Mumbai",
  },
  council: {
    bodyName: "Students' Council, KJSSE",
    // Confirmed by User: Kaveen Shetty
    generalSecretary: "Kaveen Shetty",
    generalSecretaryTitle: "General Secretary, KJSSE Students' Council 2026–27",
    creativeHead: "Yoosha Abbas",
    creativeHeadTitle: "Creative Head, KJSSE Students' Council",
    email: "abhiyantriki@somaiya.edu",
  },
  socials: {
    instagram: "https://instagram.com/kjscelive",
    youtube: "https://youtube.com/@kjslive",
  },
  // Sourced strictly from 05-SITE-MAP-CONTENT.md
  facts: {
    armedForcesBranches: "3 Armed Forces Branches", // Navy, Army, Air Force (Spec 05 §2 & §3)
    defensePartnersCount: "10 Research & Defense Partners", // Navy, Army, IAF, RAF, NSG, ISRO, BARC, IMD, BDDS, HAL (Spec 05 §2)
    dignitariesCount: "15 Distinguished Dignitaries", // Dr. Kalam, Dalai Lama, Dr. Rajan, etc. (Spec 05 §4)
    ideateChallengesCount: "9 National Industry Challenges", // UNL, NRDC, MSRTC, BARC, TCS, NRSC, AICRA, MPCB, NIF (Spec 05 §3)
  },
};
