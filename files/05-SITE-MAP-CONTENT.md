# Site Map & Content Source

This is the real content, pulled from the two brochures you uploaded, organized into the pages/sections the site needs. Antigravity should treat this as the actual copy source — don't invent facts; use what's here and ask you for anything marked `[NEED]`.

## Public site structure

### 1. Landing / Hero (pinned 3D scroll intro)
- Fest name: **Abhiyantriki 2026** (most recent proposal), with historical continuity back to 2017.
- Tagline direction: two-day annual technical fest of K. J. Somaiya School of Engineering, giving engineering students an all-India platform across coding, robotics, defense-tech demos, and industry challenges.
- Key dates: **14th–15th October** `[NEED: confirm final 2026 dates — brochures show both 2025 and 2026 proposals referencing 14–15 Oct, confirm which year is live]`.
- This is where the Pacman loader → space warp transition happens (see `07-SCROLL-LOADER-ANIMATION-SPEC.md`).

### 2. Overview
- Mission: platform for engineering students to demonstrate technical skills via workshops, hackathons, robotics, and technical challenges.
- Institutional partners badge row: Indian Navy, Indian Army, Indian Air Force, RAF, NSG, ISRO, BARC, IMD, BDDS, HAL.
- Past corporate sponsors badge row: Hitachi, Vivo, Boat, Cadmatic, Grey Atom, British Council, Xiaomi, UPL, Bank of Baroda, Radio Mirchi, OLA, Maharashtra Times, TATA, Oracle Academy, Balaji Wafers, VLCC, Education Times.

### 3. Highlight Events (this is the marquee section — give it the most 3D/visual budget)
Group into sub-sections with icons/3D moments per group:

**Defense & Space**
- ISRO: keynote from a former ISRO Deputy GM (37-year career in liquid rocket engine fabrication).
- NSG: tactical weaponry showcase, precision drills.
- Indian Army: live infantry equipment showcase.
- RAF: riot-control demonstrations, tactical exercises.
- BDDS: explosive disposal seminar, live demo equipment.
- Air Force Expo: aeronautical R&D static exhibits — festival hosts all three armed forces branches.
- IMD: weather-tracking/climate research instruments.

**Robotics**
- INDRO 5.0 — 8-axis humanoid robot (ML-powered).
- MITRA — commercial concierge humanoid (touchscreen, facial recognition, built in Bengaluru).
- Shalu — 47-language multilingual humanoid built from recycled/waste material.

**Expos**
- Tech Expo (inter-college project showcase)
- **Auto Expo** — supercars/superbikes: BMW M5, Honda Goldwing, Repsol 1000cc, BMW S1000RR. *(This is the section needing a vehicle 3D model — see gap note in `00-INDEX.md`.)*
- Internship Expo — hybrid: resume pre-screening + Zoom interviews + on-campus interview booths.
- Startup Expo — VC/angel investor pitching.

**Ideate (flagship competition)** — real industry problem statements:
| Partner | Theme |
|---|---|
| UNL | Hyper-accurate microlocation API |
| NRDC | Marine/coastal threat defense |
| Maharashtra State Transport Ministry | Road accident prevention |
| BARC | Reversing global warming |
| TCS | Scalable customer experience systems |
| NRSC | Land-cover mapping via ANNs |
| AICRA | Self-learning autonomous robots |
| MPCB | Multilayer plastic recycling |
| National Innovation Foundation | Flood/pothole hazard alerts |

**Competitions/Informals**
- Gaming: Drone Racing, Laser Tag, CS/Valorant/CoD Mobile, FIFA, PUBG
- Robotics: Line Follower, Obstacle Avoidance, RoboWars
- Coding: Hackathons, Crack-a-thon, competitive programming
- Panel discussions with founders/tech leaders

### 4. Distinguished Lecture Series (dignitaries)
Present as a grid/wall — this is a huge credibility asset, worth a dedicated pinned scroll moment:
Dr. A.P.J. Abdul Kalam, Dr. Raghuram Rajan, His Holiness the 14th Dalai Lama, Prithviraj Chavan, Dr. Harsh Vardhan, Rohit Suri (VP, Jaguar Land Rover India), Ustad Zakir Hussain, Rajkumar Hirani, Stephen Fleming, Dr. R. Chidambaram, Dr. Jayant Narlikar, Arogyaswami Paulraj, A.S. Kiran Kumar (former ISRO Chairman), Dr. Subramanian Swamy, Sandeep Jain (Founder/CEO, GeeksforGeeks).

### 5. Sponsorship (if this page stays public vs. sponsor-only PDF — your call)
| Tier | Amount |
|---|---|
| Title Sponsor | ₹7,00,000 |
| Co-Sponsor | ₹5,00,000 |
| Co-Powered By | ₹3,50,000 |
| Associate Partner | ₹3,00,000 |

Consider gating the full sponsorship deck PDF behind a "Download Proposal" button rather than inlining all tiers publicly — matches how the brochure itself is positioned (a proposal document sent to specific sponsors).

### 6. Archive — "Abhiyantriki Over the Years" (2017–2025)
This is the **admin-manageable photo gallery** feature you asked for. Structure as a year-selector (timeline UI) pulling from a `events` + `event_photos` DB table (see `08-AUTH-BACKEND-DATABASE.md`), seeded initially with:
- 2024: GSLV Mk III propellant tank engineering stage presentation, cryo-engine stages
- 2023: Live NSG sniper rifle demo, Jaguar sedan display, gaming lounge
- 2022: Red-carpet ceremonial entrance, BDDS explosive-component disassembly models
- 2021: Hybrid online symposium (CitiusTech leadership, IAF wing commanders)
- 2020: Virtual inaugural broadcast ("Abhiyantriki Online")
- 2019: Ducati superbikes, gyroscopic models, naval cadet honors
- Archival video links (embed as YouTube players, not raw links):
  - 2022 Aftermovie: `youtu.be/qU3PzbUawmw`
  - 2019 Aftermovie: `youtube.com/watch?v=uBYmd5kzabM`
  - 2018 Teaser: `youtube.com/watch?v=RUfVZ7JisK4`
  - 2017 Teaser: `youtube.com/watch?v=DMYVNUXh3PQ`
  - 2016 Teaser: `youtube.com/watch?v=_WRzGZKgST8`

### 7. Register (functional page — this is where Google Forms embed + auth live)
See `09-ADMIN-CMS-GOOGLE-FORMS.md`.

### 8. Contact / Social
- Instagram: `@kjscelive`
- Meeting channels: in-person (Mumbai) or Google Meet
- Sign-off/contact person: **Kaveen Shetty, General Secretary, KJSSE Students' Council 2026–27** (confirmed — this supersedes the 2025 brochure's "Harshika Masand," which was the outgoing GS)

## Auth-gated pages (not public nav — see `08-AUTH-BACKEND-DATABASE.md` for roles)
- `/login`, `/register` (student/user accounts)
- `/dashboard` — user's own event registrations, tickets/QR
- `/admin` — council-only: manage gallery photos, manage event listings, manage Google Form links, view registrant lists

## Copy notes
- The General Secretary name conflict is resolved (Kaveen Shetty, confirmed above). The date/edition-year question ("2025" vs "2026" as the live edition) is still open — flagged at the top of this file — don't let Antigravity silently pick one.
