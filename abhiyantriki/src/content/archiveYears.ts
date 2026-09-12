export interface ArchiveYear {
  year: number;
  themeTitle: string;
  summary: string;
  highlights: string[];
  youtubeVideoId?: string; // YouTube embed ID
  youtubeUrl?: string;
  coverImage?: string;
}

export const ARCHIVE_YEARS: ArchiveYear[] = [
  {
    year: 2024,
    themeTitle: "Aerospace Frontiers & Heavy Rocketry",
    summary: "Historic exhibition featuring GSLV Mk III liquid propellant stages, cryo-engine sections, and all-India robotics finals.",
    highlights: [
      "GSLV Mk III propellant tank engineering presentation",
      "Cryogenic stage full-scale structural cutaways",
      "Over 22,000 students from 110 engineering colleges across India"
    ],
  },
  {
    year: 2023,
    themeTitle: "Defense Mobility & Counter-Terror Grid",
    summary: "Featuring live NSG tactical sniper demonstrations, super luxury automotive engineering, and inter-collegiate esports.",
    highlights: [
      "Live NSG counter-terror weaponry and sniper apparatus",
      "Jaguar high-performance sedan mechanical exhibition",
      "Esports Arena with 1,500+ LAN competitors"
    ],
  },
  {
    year: 2022,
    themeTitle: "The Grand Campus Return",
    summary: "A triumphant return to physical campus grounds with military salutes, BDDS dismantling demos, and red-carpet ceremonies.",
    highlights: [
      "Red-carpet ceremonial inauguration by naval commanders",
      "BDDS explosive-component disassembly robotic models",
      "Live rock and music performance night"
    ],
    youtubeVideoId: "qU3PzbUawmw",
    youtubeUrl: "https://youtu.be/qU3PzbUawmw"
  },
  {
    year: 2021,
    themeTitle: "Hybrid Cyber-Symposium",
    summary: "National hybrid technical symposium uniting corporate leaders, IAF wing commanders, and remote hackathon teams.",
    highlights: [
      "Keynote addresses from CitiusTech executive leadership",
      "IAF Wing Commanders panel on avionics modernization",
      "Digital Hackathon across 18 Indian states"
    ],
  },
  {
    year: 2020,
    themeTitle: "Abhiyantriki Online — The Virtual Shift",
    summary: "An entirely digital live-streamed tech festival maintaining nationwide engagement through virtual exhibits and webinars.",
    highlights: [
      "Virtual inaugural broadcast streamed to 30,000+ viewers",
      "Online Ideate problem statements solved via cloud collaboration",
      "AI & Machine Learning masterclasses"
    ],
  },
  {
    year: 2019,
    themeTitle: "Superbikes & Naval Honor",
    summary: "Massive display of Ducati superbikes, gyroscopic defense models, and full ceremonial honors by naval cadets.",
    highlights: [
      "Ducati and BMW superbike display with engine teardown talks",
      "Gyroscopic defense stabilizer engineering showcases",
      "Indian Naval cadet drill and recruitment pavilion"
    ],
    youtubeVideoId: "uBYmd5kzabM",
    youtubeUrl: "https://www.youtube.com/watch?v=uBYmd5kzabM"
  },
  {
    year: 2018,
    themeTitle: "Autonomous Systems & DLS Legacy",
    summary: "Keynotes by Dr. R. Chidambaram, robotic humanoid showcases, and high-speed autonomous drone tracking.",
    highlights: [
      "Dr. R. Chidambaram keynote on India's atomic scientific achievements",
      "RoboWars heavyweight national championship",
      "Autonomous obstacle-avoidance buggies"
    ],
    youtubeVideoId: "RUfVZ7JisK4",
    youtubeUrl: "https://www.youtube.com/watch?v=RUfVZ7JisK4"
  },
  {
    year: 2017,
    themeTitle: "The Quantum Leap",
    summary: "Foundational year of the modern Abhiyantriki scale, hosting military defense tech and ISRO scientists.",
    highlights: [
      "ISRO satellite tracking demo on campus",
      "Over 75 competitive technical events",
      "Launch of the National Ideate Innovation Challenge"
    ],
    youtubeVideoId: "DMYVNUXh3PQ",
    youtubeUrl: "https://www.youtube.com/watch?v=DMYVNUXh3PQ"
  },
  {
    year: 2016,
    themeTitle: "Origins of Excellence",
    summary: "The inaugural teaser and milestone festival laying the foundation for Mumbai's largest technical festival.",
    highlights: [
      "Establishment of the Distinguished Lecture Series",
      "Inter-college robotics league inception"
    ],
    youtubeVideoId: "_WRzGZKgST8",
    youtubeUrl: "https://www.youtube.com/watch?v=_WRzGZKgST8"
  }
];
