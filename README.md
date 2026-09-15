<div align="center">

<!-- EMBEDDED CYBERPUNK / SWISS EDITORIAL SVG HEADER -->
<p align="center">
  <img src="./assets/header.svg" width="100%" alt="Abhiyantriki Cyberpunk Header" />
</p>


<br/>

<!-- DYNAMIC TYPING SVG SERVICE -->
<a href="https://github.com/Demmonics/stuco_website">
  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=700&size=20&duration=2800&pause=1200&color=00F0FF&center=true&vCenter=true&width=860&lines=NEXT-GEN+TECHNICAL+FESTIVAL+PLATFORM+%2F%2F+KJSSE;INTERACTIVE+THREE.JS+WEBGL+EXPERIENCES;CANONICAL+EVENT+REGISTRATIONS+%2B+SECRETARIAT+SYSTEMS;REACT+19+VITE+%2B+GSAP+LENIS+PRECISION+ENGINE" alt="Typing Tagline" />
</a>

<br/>

<!-- HIGH-IMPACT STATUS & TECH BADGES -->
<p align="center">
  <a href="#-tech-stack-matrix"><img src="https://img.shields.io/badge/REACT_19-05070C?style=for-the-badge&logo=react&logoColor=00F0FF" alt="React 19" /></a>
  <a href="#-tech-stack-matrix"><img src="https://img.shields.io/badge/THREE.JS-05070C?style=for-the-badge&logo=threedotjs&logoColor=FFFFFF" alt="Three.js" /></a>
  <a href="#-tech-stack-matrix"><img src="https://img.shields.io/badge/TYPESCRIPT_6.0-05070C?style=for-the-badge&logo=typescript&logoColor=3178C6" alt="TypeScript" /></a>
  <a href="#-tech-stack-matrix"><img src="https://img.shields.io/badge/VITE_8.3-05070C?style=for-the-badge&logo=vite&logoColor=BD34FE" alt="Vite" /></a>
  <a href="#-tech-stack-matrix"><img src="https://img.shields.io/badge/EXPRESS_4.21-05070C?style=for-the-badge&logo=express&logoColor=00F0FF" alt="Express" /></a>
  <a href="#-tech-stack-matrix"><img src="https://img.shields.io/badge/TAILWIND_CSS-05070C?style=for-the-badge&logo=tailwindcss&logoColor=06B6D4" alt="Tailwind CSS" /></a>
  <a href="#-architecture--runtime-workflow"><img src="https://img.shields.io/badge/PRODUCTION-OPTIMIZED-39FF14?style=for-the-badge&logo=googlecloud&logoColor=05070C" alt="Production" /></a>
</p>

</div>

---

### ◈ THE ARCHITECTURAL MANIFESTO

> *"An avant-garde convergence of kinetic 3D WebGL computing, cyber-brutalist typography, and enterprise-grade event orchestrations built for **K. J. Somaiya College of Engineering (KJSSE)**."*

**Abhiyantriki** serves as the central digital spine for Maharashtra's premier engineering festival. Engineered with uncompromising attention to Swiss editorial precision, hyper-fluid 60 FPS motion dynamics, and hardened enterprise middleware, this platform unifies student governance, technical competitions, keynote summits, and live engagement into a cohesive, immersive web application.

---

### ❖ CORE CAPABILITIES

```
┌───────────────────────────┬───────────────────────────┬───────────────────────────┐
│ 01 // KINETIC 3D CANVAS   │ 02 // EVENT ENGINE        │ 03 // INSTITUTIONAL CORE  │
├───────────────────────────┼───────────────────────────┼───────────────────────────┤
│ • @react-three/fiber      │ • Multi-tier event filter │ • Student council rosters │
│ • GLTF/GLB models         │ • Dynamic search index    │ • Departmental committees │
│ • Smooth camera lerping   │ • Embedded Google Forms   │ • Direct secretariat desk │
│ • Lenis smooth scrolling  │ • Fallback external tab   │ • Zero-lag reactive UI    │
└───────────────────────────┴───────────────────────────┴───────────────────────────┘
```

- **Kinetic Three.js & GLTF Model Engine**: Seamless ambient 3D viewports featuring responsive camera projection, lighting calculations, particle dust fields, and real-time interaction states.
- **Enterprise-Grade Event Command Center**: Comprehensive directory with instant categorical filtering (`All`, `Flagship`, `Hackathons`, `Robotics`, `Competitions`, `Workshops`), real-time modal previews, and canonical Google Form iframe integration.
- **Micro-Interaction & Motion Design**: Custom GPU-accelerated specular button shaders, true-focus chromatic text splitters, and Lenis virtual scroll interpolation.
- **Hardened Perimeter Defense**: Complete security middleware suite with `helmet` CSP headers, MongoDB injection sanitization (`express-mongo-sanitize`), rate limiting, parameter pollution guards (`hpp`), and Google OAuth 2.0 integration.

---

### ⚡ TECH STACK MATRIX

| Layer | Technologies & Ecosystem |
| :--- | :--- |
| **Frontend Framework** | `React 19.2` · `TypeScript 6.0` · `Vite 8.3` · `Zustand 5.0` · `TanStack Query 5` |
| **Graphics & Motion** | `Three.js 0.186` · `@react-three/fiber 9.7` · `@react-three/drei 10.7` · `GSAP 3.15` · `Lenis 1.3` |
| **Styling & Design System** | `Tailwind CSS 3.4` · Custom Glassmorphism · Cyberpunk Shaders · Swiss Grid System |
| **Backend & Ingestion** | `Node.js 24 LTS` · `Express 4.21` · `Mongoose 8.12` · `@supabase/supabase-js 2.116` |
| **Security & Auditing** | `Helmet 8.0` · `Express Rate Limit 7.5` · `Express Mongo Sanitize` · `Zod 4.6` · `Oxlint` |

---

### ⚙ ARCHITECTURE & RUNTIME WORKFLOW

```mermaid
graph TD
    subgraph CLIENT [KINETIC FRONTEND // BROWSER]
        UI[React 19 Concurrent Root]
        Canvas[Three.js / WebGL Viewport]
        Nav[Virtual Routing & State]
        Form[Canonical Google Forms Frame]
    end

    subgraph ENGINE [STATE & MOTION LAYER]
        Zustand[Zustand Store]
        Lenis[Lenis Smooth Scroll Engine]
        GSAP[GSAP Timeline Choreographer]
    end

    subgraph DEFENSE [SECURITY PERIMETER]
        Helmet[Helmet Security Headers]
        RateLimit[Express Rate Limiter]
        Sanitize[NoSQL Injection Sanitizer]
        CORS[Configured CORS Whitelist]
    end

    subgraph BACKEND [SERVICES & STORAGE]
        Server[Express 4 Application]
        MongoDB[(MongoDB Atlas / Document Store)]
        OAuth[Google OAuth 2.0 Provider]
        Supabase[(Supabase DB / Edge Engine)]
    end

    UI --> Canvas
    UI --> Lenis
    UI --> Zustand
    Canvas --> GSAP
    UI --> Form
    UI -->|HTTPS / REST| Helmet
    Helmet --> RateLimit
    RateLimit --> Sanitize
    Sanitize --> CORS
    CORS --> Server
    Server --> MongoDB
    Server --> OAuth
    Server --> Supabase
```

---

### 📁 REPOSITORY BLUEPRINT

```ascii
abhiyantriki/
├── public/
│   ├── models/                  # Interactive 3D assets (GLTF / GLB scenes)
│   ├── Council/                 # Somaiya Student Council heritage assets
│   └── favicon.ico              # Institutional brand icon
├── src/
│   ├── components/
│   │   ├── events/              # Event Directory, Modal, Registration Engine
│   │   ├── forms/               # Embedded Google Forms with external tab failover
│   │   ├── hero/                # Cyberpunk Hero viewport with glowing typographic split
│   │   ├── reactbits/           # Custom hardware-accelerated shaders (Specular, TrueFocus)
│   │   ├── sections/            # About, Flagships, Council Secretariat, Showcases
│   │   └── three/               # Persistent WebGL canvas & 3D space scene
│   ├── lib/                     # Supabase & client configurations
│   ├── types/                   # Strict TypeScript contracts & domain models
│   ├── App.tsx                  # Root orchestration & dynamic scene state switching
│   └── main.tsx                 # React concurrent root entrypoint
├── server/                      # Hardened Express API & middleware stack
├── server.js                    # Production entrypoint & static proxy
└── vite.config.ts               # Ultra-fast bundler configuration
```

---

### 🚀 QUICKSTART & LOCAL PROVISIONING

#### 1. Clone & Access
```bash
git clone https://github.com/Demmonics/stuco_website.git
cd stuco_website/abhiyantriki
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Configure Environment
Create a `.env` file in `abhiyantriki/`:
```env
PORT=5000
NODE_ENV=development
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### 4. Launch Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173` to experience the 3D kinetic workspace.

#### 5. Build for Production
```bash
npm run build
npm start
```

---

### 📊 TELEMETRY & REPOSITORY INSIGHTS

<div align="center">
  <table border="0">
    <tr>
      <td align="center">
        <img src="https://github-readme-stats.vercel.app/api?username=Demmonics&show_icons=true&theme=tokyonight&hide_border=true&bg_color=05070c&title_color=00f0ff&icon_color=ff007f&text_color=8e9bb0" width="410" alt="GitHub Stats" />
      </td>
      <td align="center">
        <img src="https://github-readme-streak-stats.herokuapp.com/?user=Demmonics&theme=tokyonight&hide_border=true&background=05070c&stroke=00f0ff&ring=ff007f&fire=00f0ff&currStreakLabel=00f0ff" width="410" alt="Streak Stats" />
      </td>
    </tr>
  </table>
</div>

---

### 🏛 CREATIVE DIRECTION & CREDITS

<div align="center">

```
Designed & Engineered with Swiss Modernism & Cyber-Brutalist aesthetics.
```

**Creative Lead & Fullstack Architect:** **Yoosha Abbas** ([@Demmonics](https://github.com/Demmonics))  
**Governing Body:** **K.J. Somaiya College of Engineering Student Council**  
**Official Secretariat Inquiries:** `secretary.council.engg@somaiya.edu`

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=1,6,11,20&height=100&section=footer&animation=twinkling" width="100%"/>
</p>

</div>
