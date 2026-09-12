export interface FestEvent {
  id: string;
  title: string;
  category: 'Defense & Space' | 'Robotics' | 'Expos' | 'Ideate' | 'Competitions & Coding';
  subtitle?: string;
  description: string;
  partner?: string;
  highlights?: string[];
  google_form_url?: string | null; // Optional external Google Form, null defaults to native registration
  registration_open: boolean;
  venue?: string;
  badge?: string;
}

export const FEST_EVENTS: FestEvent[] = [
  // --- DEFENSE & SPACE ---
  {
    id: "defense-isro",
    title: "ISRO Propulsion & Rocketry Keynote",
    category: "Defense & Space",
    subtitle: "37-Year Veteran Liquid Engine Fabrication Showcase",
    description: "Keynote lecture and technical breakdown delivered by a former ISRO Deputy General Manager with 37 years of specialized liquid rocket engine fabrication experience.",
    partner: "Indian Space Research Organisation (ISRO)",
    highlights: ["Liquid Propulsion Systems", "Cryogenic Stage Fabrication", "Chandrayaan/GSLV Insights"],
    registration_open: true,
    google_form_url: null,
    badge: "Keynote"
  },
  {
    id: "defense-nsg",
    title: "National Security Guard (NSG) Precision Showcase",
    category: "Defense & Space",
    subtitle: "Tactical Weaponry & Special Ops Showcase",
    description: "Elite counter-terrorism tactical weaponry demonstration and precision drills conducted live by Black Cat Commandos.",
    partner: "National Security Guard (NSG)",
    highlights: ["Live Sniper Systems", "Tactical Mobility", "Special Action Protocol"],
    registration_open: true,
    google_form_url: null,
    badge: "Live Drill"
  },
  {
    id: "defense-army",
    title: "Indian Army Infantry Gear Expo",
    category: "Defense & Space",
    subtitle: "Frontline Military Combat Hardware",
    description: "A comprehensive walk-through of state-of-the-art infantry combat systems, soldier protection rigs, and battlefield telemetry equipment.",
    partner: "Indian Army",
    highlights: ["Combat Small Arms", "Night Vision Telemetry", "Battlefield Comms"],
    registration_open: true,
    google_form_url: null
  },
  {
    id: "defense-iaf",
    title: "Indian Air Force Aeronautical R&D Showcase",
    category: "Defense & Space",
    subtitle: "Aviation Systems & Combat Jet Avionic Displays",
    description: "Aeronautical research models, ejection telemetry, and advanced radar avionics displayed directly by IAF flight engineers.",
    partner: "Indian Air Force",
    highlights: ["Avionics Simulators", "Turbofan Sectionals", "Air Defense Radars"],
    registration_open: true,
    google_form_url: null
  },
  {
    id: "defense-bdds",
    title: "BDDS Explosive Disposal Seminar & Demos",
    category: "Defense & Space",
    subtitle: "Live Bomb Detection and Disposal Squad Equipment",
    description: "Technical seminar and active inspection of robotic bomb disposal crawlers, containment vessels, and X-ray scanner rigs.",
    partner: "Bomb Detection and Disposal Squad (BDDS)",
    highlights: ["Remotely Operated Vehicles", "Bomb Suits", "Disruption Mechanisms"],
    registration_open: true,
    google_form_url: null
  },
  {
    id: "defense-raf",
    title: "Rapid Action Force (RAF) Tactical Protocols",
    category: "Defense & Space",
    subtitle: "Riot Control Logistics & Crowd Defense",
    description: "Non-lethal crowd management technologies, tactical armor, and live rapid response protocol presentations.",
    partner: "Rapid Action Force (RAF)",
    highlights: ["Specialized Tactical Vehicles", "Rapid Response Grid", "Protective Gear"],
    registration_open: true,
    google_form_url: null
  },
  {
    id: "defense-imd",
    title: "IMD Atmospheric & Climate Telemetry",
    category: "Defense & Space",
    subtitle: "Meteorological Radars & Cyclone Tracking",
    description: "Direct demonstration of real-time Doppler radar telemetry, meteorological balloon payloads, and predictive weather computing models.",
    partner: "India Meteorological Department (IMD)",
    highlights: ["Doppler Weather Radars", "Cyclone Tracking Models", "Seismic Sensors"],
    registration_open: true,
    google_form_url: null
  },

  // --- ROBOTICS ---
  {
    id: "robotics-indro",
    title: "INDRO 5.0 Humanoid Robot",
    category: "Robotics",
    subtitle: "India's Tallest 8-Axis ML-Powered Humanoid",
    description: "Live demonstration of INDRO 5.0, an 8-axis machine-learning humanoid capable of human torque replication, autonomous motion, and industrial manipulation.",
    partner: "INDRO Technologies",
    highlights: ["8-Axis Arm Kinematics", "Real-Time Machine Vision", "Payload Manipulation"],
    registration_open: true,
    google_form_url: null,
    badge: "Featured Tech"
  },
  {
    id: "robotics-mitra",
    title: "MITRA Concierge Humanoid",
    category: "Robotics",
    subtitle: "Autonomous Commercial Service Humanoid",
    description: "Made-in-Bengaluru commercial assistant robot featuring contextual conversational AI, facial recognition, and obstacle traversal.",
    partner: "Invento Robotics",
    highlights: ["Facial Biometrics", "Contextual Dialogue", "Autonomous Navigation"],
    registration_open: true,
    google_form_url: null
  },
  {
    id: "robotics-shalu",
    title: "Shalu 47-Language Humanoid",
    category: "Robotics",
    subtitle: "Recycled-Material Multilingual AI Humanoid",
    description: "World-renowned social humanoid built entirely from recycled plastic and e-waste, fluent in 47 international and regional languages.",
    partner: "Dinesh Kunwar Patel",
    highlights: ["47 Languages", "100% Upcycled Materials", "Conversational NLP"],
    registration_open: true,
    google_form_url: null
  },

  // --- EXPOS ---
  {
    id: "expo-auto",
    title: "Auto Expo 2026: Supercars & Superbikes",
    category: "Expos",
    subtitle: "Hyper-Performance Automotive Engineering",
    description: "An awe-inspiring line-up of precision-engineered superbikes and performance cars: BMW M5, Honda Goldwing, Honda Repsol 1000cc, and BMW S1000RR.",
    highlights: ["BMW M5", "Honda Goldwing", "BMW S1000RR", "Repsol 1000cc"],
    registration_open: true,
    google_form_url: null,
    badge: "Must Visit"
  },
  {
    id: "expo-tech",
    title: "Tech Expo: All-India Collegiate Showcase",
    category: "Expos",
    subtitle: "Groundbreaking Research Prototypes",
    description: "Inter-college engineering project expo showcasing cutting-edge prototypes, IoT systems, biotech inventions, and patents from top Indian colleges.",
    registration_open: true,
    google_form_url: null
  },
  {
    id: "expo-internship",
    title: "Hybrid Internship Expo",
    category: "Expos",
    subtitle: "Direct On-Campus Recruiting & Speed Interviews",
    description: "Resume pre-screening, digital Zoom assessment rounds, and dedicated on-campus interview booths with leading engineering tech companies.",
    registration_open: true,
    google_form_url: null
  },
  {
    id: "expo-startup",
    title: "Startup Expo & Pitch Arena",
    category: "Expos",
    subtitle: "Live VC & Angel Investor Pitch Rounds",
    description: "Student founders pitch their scalable technology startups directly to angel investors, venture funds, and incubation accelerators.",
    registration_open: true,
    google_form_url: null
  },

  // --- IDEATE ---
  {
    id: "ideate-flagship",
    title: "IDEATE: National Industry Challenge",
    category: "Ideate",
    subtitle: "Real Problems. Real Industry Sponsors. Real Impact.",
    description: "Abhiyantriki's marquee engineering hackathon and problem-solving competition presenting real-world challenges formulated directly with research bodies and corporate giants.",
    highlights: [
      "UNL: Hyper-accurate microlocation API",
      "NRDC: Marine & coastal threat defense",
      "MSRTC: Road accident prevention telemetry",
      "BARC: Reversing global warming thermodynamics",
      "TCS: Scalable customer experience systems",
      "NRSC: Land-cover mapping via Artificial Neural Networks",
      "AICRA: Self-learning autonomous robots",
      "MPCB: Multilayer industrial plastic recycling",
      "NIF: Flood and pothole hazard detection"
    ],
    registration_open: true,
    google_form_url: null,
    badge: "Flagship Competition"
  },

  // --- COMPETITIONS & CODING ---
  {
    id: "comp-robowars",
    title: "RoboWars: Heavyweight Clash",
    category: "Competitions & Coding",
    subtitle: "High-Octane Armored Robot Combat",
    description: "Custom-built destructive combat robots clash inside a reinforced polycarbonate arena in a battle of torque, kinetic weapons, and armor.",
    registration_open: true,
    google_form_url: null
  },
  {
    id: "comp-hackathon",
    title: "Abhiyantriki 24H Hackathon",
    category: "Competitions & Coding",
    subtitle: "Non-Stop High-Velocity Product Sprint",
    description: "24 hours to conceive, code, and deploy solutions across Web3, Generative AI, Cyber-Defense, and Spatial Computing.",
    registration_open: true,
    google_form_url: null
  },
  {
    id: "comp-drone",
    title: "FPV Drone Racing League",
    category: "Competitions & Coding",
    subtitle: "Precision High-Speed Obstacle Track",
    description: "First-Person View drone pilots race across an illuminated multi-tier indoor obstacle course at speeds exceeding 80 km/h.",
    registration_open: true,
    google_form_url: null
  },
  {
    id: "comp-gaming",
    title: "Esports Arena",
    category: "Competitions & Coding",
    subtitle: "Valorant, CS2, FIFA & BGMI Showdowns",
    description: "Competitive LAN tournament spanning leading competitive titles with pro casters, live stage matches, and leaderboards.",
    registration_open: true,
    google_form_url: null
  }
];
