export interface ArchiveYear {
  year: number;
  themeTitle: string;
  summary: string;
  highlights: string[];
  youtubeVideoId: string; // YouTube embed ID
  youtubeUrl: string;
  coverImage?: string;
}

export const ARCHIVE_YEARS: ArchiveYear[] = [
  {
    year: 2025,
    themeTitle: "Aerospace Frontiers & Defense Pinnacle",
    summary: "The landmark edition featuring ISRO propulsion stages, advanced rocketry demonstrations, national robotics arenas, and military defense pavilions.",
    highlights: [
      "ISRO cryogenic stage & propulsion engineering showcases",
      "National Hackathon & Ideate Innovation Grand Finale",
      "Over 25,000 student attendees across 120+ institutions"
    ],
    youtubeVideoId: "xFc8_o2UC9I",
    youtubeUrl: "https://www.youtube.com/watch?v=xFc8_o2UC9I"
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
    youtubeVideoId: "IzmjWvcHSrU",
    youtubeUrl: "https://www.youtube.com/watch?v=IzmjWvcHSrU"
  },
  {
    year: 2017,
    themeTitle: "The Quantum Leap",
    summary: "Foundational year of the modern Abhiyantriki scale, hosting military defense tech, ISRO scientists, and nationwide student innovators.",
    highlights: [
      "ISRO satellite tracking demo on campus",
      "Over 75 competitive technical events",
      "Launch of the National Ideate Innovation Challenge"
    ],
    youtubeVideoId: "OUIRPBjbjis",
    youtubeUrl: "https://www.youtube.com/watch?v=OUIRPBjbjis"
  }
];
