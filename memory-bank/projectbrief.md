# Project Brief - Daggerheart Tools

## Core Purpose

Build a comprehensive web-based toolkit for the Daggerheart tabletop RPG system, providing character creation, management, and gameplay tools for players and GMs.

## Project Goals

### Primary Objectives

- **Character Creation & Management**: Full featured character sheet creation and editing
- **Domain Card System**: Complete implementation of all 9 domains with 200+ domain cards
- **Class System**: All 9 classes with subclasses, progression, and multiclassing support
- **Game Mechanics**: Level-up system, experience tracking, and character progression
- **Data Validation**: Robust schema validation using Zod for all game data

### Secondary Objectives

- **Export/Import**: Character data portability
- **Campaign Tools**: GM-focused features for managing sessions
- **Reference System**: Quick lookup for rules, spells, and abilities
- **Responsive Design**: Mobile-friendly interface for table use

## Technology Stack

- **Frontend**: React 19+ with TypeScript
- **Routing**: TanStack Router
- **Styling**: Tailwind CSS with Shadcn/ui components
- **Build Tool**: Vite
- **Package Manager**: pnpm with workspaces
- **Validation**: Zod schemas for type safety
- **Testing**: Vitest with coverage reporting

## Source Material

All game content is based on the official Daggerheart System Reference Document (SRD) v1.0, ensuring accuracy and completeness of the rule system.

## Project Structure

- `/src/lib/schemas/` - Zod validation schemas for all game systems
- `/src/lib/domains/` - Complete domain card implementations
- `/src/routes/` - Application pages and routing
- `/SRD/` - Source reference documents and extracted content

## Success Criteria

1. Complete character creation flow from ancestry to level 10
2. All 9 domains implemented with full card details
3. Level-up system with point allocation and multiclassing
4. Type-safe data models with comprehensive validation
5. Mobile-responsive interface suitable for tabletop use
