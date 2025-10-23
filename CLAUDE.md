# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development

- `npm run dev` - Start development server with Turbopack
- `npm run dev:debug` - Start development server with Node.js inspector
- `npm run dev:port` - Start development server on custom port
- `npm run dev:host` - Start development server accessible from network

### Building

- `npm run build` - Next.js production build (automatically includes static export)
- `npm run build:analyze` - Build with bundle analyzer

### Code Quality

- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run type-check` - Run TypeScript type checking without emit
- `npm run check` - Run both type checking and linting
- `npm run format` - Format code with Prettier
- `npm run validate` - Full validation (type check + lint + build)

### Production

- `npm run start` - Start production server
- `npm run start:port` - Start production server on custom port
- `npm run preview` - Build and start production server

### Maintenance

- `npm run clean` - Remove build artifacts
- `npm run clean:all` - Remove build artifacts and dependencies
- `npm run deps:update` - Update dependencies and run audit
- `npm run deps:check` - Show outdated dependencies
- `npm run deps:audit` - Audit dependencies for vulnerabilities
- `npm run deps:audit:fix` - Fix dependency vulnerabilities

### Utilities

- `npm run postinstall` - Show setup message after install
- `npm run validate` - Run linting/type check and build
- `npm run validate:strict` - Run strict checks and build

### CI/CD

- `npm run ci:build` - Production build for CI
- `npm run ci:lint` - Run strict linting in CI
- `npm run ci:format` - Check formatting in CI

## Architecture Overview

This is a Next.js 16 application using the App Router pattern with Turbopack for an Exalted: Essence character sheet manager.

### Core Architecture Patterns

**State Management**: Uses Zustand with persistence middleware for character data storage in localStorage (`hooks/useCharacterStore.ts`)

**Component Structure**:

- `ExaltedCharacterManager` - Main application component handling character selection and management
- `CharacterProvider` - Context provider wrapping character editing functionality
- Tabbed interface with 7 main sections: Core Stats, Combat, Equipment, Powers, Social, Advancement, Rulings

**Data Flow**:

- Character data stored in Zustand store with localStorage persistence
- Auto-save functionality via `useAutoSave` hook
- Import/Export system for JSON character data
- Real-time calculations for derived stats (defense, soak, health, etc.)

### Key Directories

- `app/` - Next.js App Router pages and layout
- `components/` - React components organized by feature
  - `character-tabs/` - Individual tab components
  - `combat/` - Combat-related components
  - `equipment/` - Weapon and armor management
  - `forms/` - Reusable form components
  - `ui/` - shadcn/ui components
- `hooks/` - Custom React hooks for state management
- `lib/` - Utility functions, types, and game logic
  - `character-types.ts` - Complete TypeScript definitions for game mechanics
  - `exalted-utils/` - Game-specific calculations and utilities

### Data Model

The character data model in `lib/character-types.ts` represents the complete Exalted: Essence ruleset:

- Attributes (Fortitude, Finesse, Force) and Abilities with base/added/bonus tracking
- Essence system (motes, commitments, anima levels)
- Health tracking with Ox-Body and dramatic injuries
- Equipment system with weapons and armor
- Powers system (Charms and Spells)
- Social mechanics (Virtues, Intimacies, Backgrounds)
- Advancement tracking with milestone system

### UI Framework

Built with shadcn/ui components based on Radix UI primitives, styled with Tailwind CSS 4. Uses Geist font family and includes toast notifications via Sonner.
