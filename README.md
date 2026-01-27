# Daggerheart Tools

The complete companion web app for **Daggerheart**, the collaborative fantasy TTRPG by Darrington Press. Build characters, run campaigns, track battles, and browse the full SRD—all from your phone or desktop.

Built with React 19, TypeScript, Vite, Tailwind, TanStack Router, and Supabase.

---

## ✨ Features

### 🎭 Character Builder

Create and manage your Daggerheart characters with a guided, mobile-first experience.

- **Guided Onboarding** — Step-by-step character creation with ancestry, community, class, and subclass selection
- **Quick View Dashboard** — See your entire character at a glance: stats, abilities, and resources
- **Cloud Sync** — Auto-save with Supabase authentication; access characters from any device
- **Level-Up Progression** — Track experience and advance through tiers with proper domain card unlocks

### ⚔️ Combat Tools

Handle the heat of battle with precision.

- **Damage Calculator** — Calculate incoming damage with armor reduction and threshold tracking
- **HP/Stress Thresholds** — Visual threshold bars with major/severe tracking
- **Armor Slot Management** — Track armor sacrifice and slot recovery
- **Conditions & Status Effects** — Apply and track all Daggerheart conditions

### 🏕️ Session Management

Track your adventures between sessions.

- **Rest System** — Short rests, long rests, and respite with automatic HP, stress, and hope recovery
- **Downtime Moves** — Execute downtime activities with proper resource tracking
- **Session Notes** — Log adventures with timestamped session entries
- **Countdown Tracker** — Track campaign countdowns and narrative timers
- **Death Move Resolution** — Handle death moves with dramatic outcomes and scar tracking

### 🐺 Companion System

For Beastmasters and animal companions.

- **Companion Stat Blocks** — Full stat tracking for animal companions
- **Training Progression** — Advance companion abilities over time
- **Companion Stress** — Track companion stress and actions separately

### 🎒 Equipment & Inventory

Organize your entire loadout.

- **Weapons & Armor** — Browse and equip gear by tier
- **Domain Card Deck** — Manage your domain cards with recall cost tracking
- **Gold & Resources** — Track currency and consumables
- **Inventory Organization** — Categorized item storage with search

### 📖 Reference Database

Browse the complete Daggerheart SRD with powerful search and filtering.

- **Equipment** (100+ items) — Weapons, armor, and combat wheelchairs
- **Classes** (9) — All classes with subclasses, features, and progression
- **Ancestries** (17) — Unique traits and characteristics
- **Communities** (9) — Backgrounds, bonds, and community features
- **Domain Cards** (189) — Searchable by domain, tier, and keyword
- **Inventory Items** (80+) — Consumables, relics, and crafting recipes
- **Adversaries** — Roles, tiers, and traits for encounter building
- **Environments** — Scene tags and hazards for world-building

### 📜 Rules Guide

Friendly rule breakdowns for quick reference.

- **Core Mechanics** — Action rolls, hope, fear, and the duality dice system
- **Combat** — Turn order, attacks, reactions, and damage
- **Character Creation** — Step-by-step creation guide
- **Downtime & Advancement** — Respite, experience, and leveling
- **GM Guide** — Running sessions, adversary design, and campaign pacing
- **Campaign Frames** — Pre-built campaign structures and themes
- **Adversaries & Environments** — Building encounters and scenes

---

## 🎲 GM Tools

A complete suite for Game Masters to run Daggerheart campaigns.

### 📁 Campaign Management

Create and manage full campaigns with persistent storage.

- **Campaign Frames** — Start with pre-built frames (Witherwild, Five Banners, etc.) or create custom campaigns
- **Campaign Overview** — Track pitch, themes, tones, and distinctions
- **Session Zero** — Built-in discussion questions for session zero prep
- **Session Tracking** — Log sessions with notes, summaries, and highlights

### 🗺️ World Building

Bring your world to life with structured content management.

- **NPCs** — Create and track non-player characters with motivations, secrets, and connections
- **Locations** — Build a world map with connected locations and points of interest
- **Quests** — Manage quest hooks, objectives, and consequences
- **Campaign Mechanics** — Define custom rules and principles for your campaign

### ⚔️ Battle Tracker

Run combat encounters with real-time updates.

- **Roster Management** — Add player characters, adversaries, and environments to the battlefield
- **Adversary Builder** — Create custom adversaries or select from the SRD
- **Fight Builder Wizard** — Quickly set up balanced encounters
- **GM Resources Bar** — Track Fear and action tokens in real-time
- **Auto-Save** — Battles persist automatically to your campaign
- **Spotlight History** — Track turn order and spotlight progression

### 👥 Player Features _(Coming Soon)_

- **Invite Players** — Share campaign links with your party
- **Character Integration** — View and track player character sheets
- **Party Resources** — Manage shared inventory and resources

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

`ash

# Clone the repository

git clone https://github.com/darthinvader/daggerheart-tools.git
cd daggerheart-tools

# Install dependencies

pnpm install

# Start development server

pnpm dev
`

### Available Scripts

| Command           | Description                         |
| ----------------- | ----------------------------------- |
| `pnpm dev`        | Start development server            |
| `pnpm build`      | Type-check and build for production |
| `pnpm preview`    | Preview production build locally    |
| `pnpm test`       | Run test suite                      |
| `pnpm lint`       | Run ESLint                          |
| `pnpm type-check` | Run TypeScript type checking        |

---

## 📱 Mobile-First Design

Daggerheart Tools is built mobile-first with responsive design:

- **Bottom Drawers** — Edit sections in full-height drawers with safe-area padding
- **Touch-Friendly** — Large tap targets and swipe gestures
- **Offline-Ready** — Local storage backup when offline
- **PWA Support** — Install as an app on mobile devices

---

## 🏗️ Tech Stack

- **React 19** — Latest React with concurrent features
- **TypeScript** — Full type safety
- **Vite** — Lightning-fast development and builds
- **TanStack Router** — Type-safe file-based routing
- **Tailwind CSS v4** — Utility-first styling
- **shadcn/ui** — Beautiful, accessible components
- **Supabase** — Authentication and cloud storage
- **Radix UI** — Accessible primitives

---

## 🌐 Deployment

This project is deployed as a client-side SPA on Vercel.

### Vercel Configuration

1. Build Command: `pnpm build`
2. Install Command: `pnpm install --frozen-lockfile`
3. Output Directory: `dist`

The `vercel.json` handles SPA routing by rewriting all routes to `/index.html`.

### Local Production Preview

`ash
pnpm build
pnpm preview --host
`

---

## 📂 Project Structure

`src/
├── components/          # React components organized by feature
│   ├── battle-tracker/  # GM battle tracking components
│   ├── campaign-detail/ # Campaign management views
│   ├── character-sheet/ # Character sheet components
│   ├── references/      # SRD reference browsers
│   └── ui/              # Shared UI primitives
├── features/            # Feature-specific logic
├── hooks/               # Custom React hooks
├── lib/                 # Data schemas and utilities
├── routes/              # TanStack Router file-based routes
│   ├── character/       # Character routes
│   ├── gm/              # GM tools routes
│   ├── references/      # Reference database routes
│   └── rules/           # Rules guide routes
└── utils/               # Utility functions`

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

---

## 📄 License

This project is a fan-made tool for Daggerheart. Daggerheart is a trademark of Darrington Press. This project is not affiliated with or endorsed by Darrington Press or Critical Role.

---

## 🔗 Links

- [Live App](https://daggerheart-tools.vercel.app)
- [Daggerheart Official](https://darringtonpress.com/daggerheart/)
- [Daggerheart SRD](https://darringtonpress.com/daggerheart-srd/)
