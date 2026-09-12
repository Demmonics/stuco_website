const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = 'C:\\STUCO\\Website';

function getCommitMessage(relPath) {
  const norm = relPath.replace(/\\/g, '/');
  const filename = path.basename(norm);
  const ext = path.extname(norm).toLowerCase();

  // Root files
  if (norm === '.gitignore') return 'chore: add root .gitignore to exclude dependencies and build caches';
  if (norm === 'Logos-20260911T093437Z-1-001.zip') return 'assets: add festival and university branding logos archive archive (.zip)';
  if (norm === 'files.zip') return 'assets: add student council resources archive (.zip)';

  // 3D Models
  if (norm.startsWith('3d Models/')) {
    if (ext === '.glb' || ext === '.gltf') return `3d: add 3D model asset ${filename}`;
    if (ext === '.bin') return `3d: add 3D model binary geometry data for ${filename}`;
    if (ext === '.png' || ext === '.jpg') return `3d: add texture map ${filename} for 3D holographic models`;
    if (ext === '.zip') return `3d: add source archive package ${filename}`;
    if (filename.toLowerCase().includes('license')) return `legal: add open-source license for 3D model ${path.dirname(norm)}`;
    return `3d: add 3D resource ${filename}`;
  }

  // Abyantriki Documents
  if (norm.startsWith('Abyantriki Documents/')) {
    if (ext === '.pdf') return `docs: add festival pitch deck presentation document (${filename})`;
    if (ext === '.docx' || ext === '.doc') return `docs: add official technical documentation (${filename})`;
    return `docs: add festival document resource (${filename})`;
  }

  // Council
  if (norm.startsWith('Council/')) {
    return `council: add student council institutional asset (${filename})`;
  }

  // Inspo
  if (norm.startsWith('Inspo/')) {
    return `design: add creative visual design inspiration asset (${filename})`;
  }

  // Logos
  if (norm.startsWith('Logos-20260911T093437Z-1-001/')) {
    return `branding: add official festival and council vector/raster logo (${filename})`;
  }

  // files
  if (norm.startsWith('files/')) {
    return `assets: add festival event resource file (${filename})`;
  }

  // pacman
  if (norm.startsWith('pacman/')) {
    return `animation: add retro Pacman ignition loader asset (${filename})`;
  }

  // abhiyantriki and abhiyantriki_claude
  const isClaude = norm.startsWith('abhiyantriki_claude/');
  const prefix = isClaude ? 'abhiyantriki_claude' : 'abhiyantriki';

  if (filename === 'package.json') return `${prefix}: configure project dependencies and scripts in package.json`;
  if (filename === 'package-lock.json') return `${prefix}: lock npm dependency tree in package-lock.json`;
  if (filename === 'vite.config.ts' || filename === 'vite.config.js') return `${prefix}: configure Vite bundler and dev server`;
  if (filename === 'tailwind.config.js' || filename === 'tailwind.config.ts') return `${prefix}: configure Tailwind CSS theme and design tokens`;
  if (filename === 'postcss.config.js') return `${prefix}: configure PostCSS plugins and Tailwind processor`;
  if (filename.startsWith('tsconfig')) return `${prefix}: configure TypeScript compiler options (${filename})`;
  if (filename === 'index.html') return `${prefix}: set up HTML entry point, SEO metadata, and fonts`;
  if (filename === 'README.md') return `${prefix}: add project documentation and developer guide`;
  if (filename === '.gitignore') return `${prefix}: configure git ignore rules for build and dependencies`;
  if (filename === '.oxlintrc.json') return `${prefix}: configure oxlint linter rules`;

  // React Bits
  if (norm.includes('/components/reactbits/')) {
    const compName = norm.split('/components/reactbits/')[1].split('/')[0];
    if (ext === '.css') return `${prefix}: add styling for React Bits <${compName} /> component`;
    if (filename === 'index.ts') return `${prefix}: export React Bits animated UI components`;
    return `${prefix}: implement React Bits <${compName} /> component (${filename})`;
  }

  // Sections
  if (norm.includes('/components/sections/')) {
    return `${prefix}: add ${filename.replace('.tsx', '')} page section component`;
  }

  // Hero
  if (norm.includes('/components/hero/')) {
    return `${prefix}: add Hero section component with particle typography (${filename})`;
  }

  // Three
  if (norm.includes('/components/three/')) {
    return `${prefix}: implement Three.js 3D WebGL scene component (${filename})`;
  }

  // Navigation
  if (norm.includes('/components/navigation/')) {
    return `${prefix}: add navigation component (${filename})`;
  }

  // Loader
  if (norm.includes('/components/loader/')) {
    return `${prefix}: add interactive Pacman sequence preloader (${filename})`;
  }

  // Auth / Dashboard / Admin / Forms
  if (norm.includes('/components/auth/')) return `${prefix}: add authentication modal component (${filename})`;
  if (norm.includes('/components/dashboard/')) return `${prefix}: add student dashboard component (${filename})`;
  if (norm.includes('/components/admin/')) return `${prefix}: add council admin portal component (${filename})`;
  if (norm.includes('/components/forms/')) return `${prefix}: add event registration modal component (${filename})`;

  // Content
  if (norm.includes('/content/')) {
    return `${prefix}: add festival content data definition (${filename})`;
  }

  // Lib
  if (norm.includes('/lib/')) {
    return `${prefix}: add helper utility library module (${filename})`;
  }

  // Store
  if (norm.includes('/store/')) {
    return `${prefix}: add Zustand global state store (${filename})`;
  }

  // Public assets
  if (norm.includes('/public/')) {
    return `${prefix}: add public static asset (${filename})`;
  }

  // Core App
  if (filename === 'App.tsx') return `${prefix}: implement main application orchestrator and continuous scroll journey`;
  if (filename === 'App.css') return `${prefix}: add application styling in App.css`;
  if (filename === 'index.css') return `${prefix}: add global design system, typography, and cinematic film grain styles`;
  if (filename === 'main.tsx') return `${prefix}: render React root entry point into DOM`;

  return `${prefix}: add ${filename}`;
}

// Ensure .gitignore is committed first
try {
  execSync('git add .gitignore', { cwd: rootDir });
  execSync('git commit -m "chore: add root .gitignore to exclude dependencies and build caches"', { cwd: rootDir });
  console.log('Committed .gitignore');
} catch (e) {
  // Already committed or staged
}

// Get list of all untracked/modified files
const statusOutput = execSync('git status --porcelain -uall', { cwd: rootDir, encoding: 'utf-8' });
const lines = statusOutput.split('\n').filter(l => l.trim().length > 0);

console.log(`Found ${lines.length} files to commit individually.`);

let count = 0;
for (const line of lines) {
  const filePath = line.substring(3).trim().replace(/^"|"$/g, '');
  if (!filePath) continue;

  const msg = getCommitMessage(filePath);
  try {
    execSync(`git add "${filePath}"`, { cwd: rootDir });
    execSync(`git commit -m "${msg.replace(/"/g, '\\"')}"`, { cwd: rootDir });
    count++;
    if (count % 25 === 0 || count === lines.length) {
      console.log(`Progress: [${count}/${lines.length}] committed: ${filePath}`);
    }
  } catch (err) {
    console.error(`Error on ${filePath}:`, err.message);
  }
}

console.log(`Successfully committed ${count} files individually!`);
