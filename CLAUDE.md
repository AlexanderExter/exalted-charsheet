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

### CI/CD

- `npm run ci:build` - Production build for CI
- `npm run ci:lint` - Run strict linting in CI
- `npm run ci:format` - Check formatting in CI

## Architecture Overview

This is a Next.js 16 application using the App Router pattern with Turbopack for an Exalted: Essence character sheet manager. **This is a desktop-focused application** optimized for larger screens and keyboard/mouse interaction. Deployed as a static export to Vercel.

### Core Architecture Patterns

**State Management**: Zustand store (`hooks/useCharacterStore.ts`) for in-memory state with automatic persistence to IndexedDB via Dexie (`lib/db.ts`). All form components read from and write to Zustand directly — there is no form library. Zod schemas in `lib/character-types.ts` define the data model and are used for validation at system boundaries (import, IndexedDB load).

**Derived Calculations**: `hooks/useCharacterCalculations/` contains memoized hooks for combat, health, social, and dice pool calculations. These depend on `[character]` as a single dependency — do not micro-optimize with individual field dependencies (this caused exhaustive-deps bugs previously).

**Component Structure**:

- `ExaltedCharacterManager` - Main application component handling character selection and management
- `CharacterProvider` - Context provider wrapping character editing functionality and derived calculations
- Tabbed interface with 7 main sections: Core Stats, Combat, Equipment, Powers, Social, Advancement, Rulings
- `ErrorBoundary` - Unified error boundary supporting both full-page and compact (tab-level) error displays

**Data Flow**:

- Character data stored in Zustand store with automatic IndexedDB synchronization
- Auto-save via Zustand store subscription with deep equality change detection
- Save status (`isSaving`, `lastSaved`) tracked in the store for UI feedback
- Schema validation uses `safeParse` on load to gracefully handle corrupted/outdated data
- Import/Export system for JSON character data

### Key Directories

- `app/` - Next.js App Router pages and layout (single route, static export)
- `components/` - React components organized by feature
  - `character-tabs/` - Individual tab components
  - `combat/` - Combat-related components
  - `equipment/` - Weapon and armor management
  - `forms/` - Reusable form components (StatTable, DicePoolEditor, etc.)
  - `common/` - Shared components (GenericList, SortableList)
  - `ui/` - shadcn/ui components (React 19 style, no forwardRef)
- `hooks/` - Custom React hooks
  - `useCharacterStore.ts` - Zustand store with IndexedDB persistence
  - `useCharacterCalculations/` - Memoized derived stat calculations
  - `CharacterContext.tsx` - React context provider
  - `useEntityCRUD.ts` - Generic CRUD operations for nested entities
- `lib/` - Utility functions, types, and game logic
  - `character-types.ts` - Zod schemas and TypeScript types for game mechanics
  - `exalted-utils/` - Pure game-specific calculation functions
  - `db.ts` - Dexie IndexedDB setup
  - `stat-config.ts` - Attribute/ability configuration data

### Styling

**Tailwind CSS 4** with CSS-first configuration. All theme tokens defined in `@theme inline` block in `app/globals.css`. No `tailwind.config.ts` — Tailwind v4 doesn't need one. Colors use oklch color space. No dark mode (light theme only). Game-specific semantic colors: `fortitude`, `finesse`, `force`, `success`, `warning`, `info`.

### Data Model

The character data model in `lib/character-types.ts` represents the complete Exalted: Essence ruleset:

- Attributes (Fortitude, Finesse, Force) and Abilities with base/added/bonus tracking
- Essence system (motes, commitments, anima levels)
- Health tracking with Ox-Body and dramatic injuries
- Equipment system with weapons and armor
- Powers system (Charms and Spells)
- Social mechanics (Virtues, Intimacies, Backgrounds)
- Advancement tracking with milestone system

### Dependencies — Design Decisions

The following dependencies were **intentionally removed** during the architecture audit. Do not re-add them:

- **react-hook-form / @hookform/resolvers**: Removed. All forms use direct Zustand state + Zod validation. One consistent pattern across the app.
- **react-markdown**: Removed. About/Legal content is inline JSX in SiteFooter. Static content doesn't need a runtime markdown parser.
- **@tanstack/react-table**: Removed. StatTable and EquipmentTagReference use simple state-managed sorting/filtering. The tables don't need pagination, virtualization, or column resizing.
- **tailwind.config.ts**: Deleted. Was dead code from incomplete v3→v4 migration (hsl wrapping around oklch values). Tailwind v4 uses `@theme inline` in CSS.

### Code Standards

- **ESLint**: Flat config (ESLint 9) with explicit React 19 version, `@typescript-eslint/no-explicit-any` as warning, `@typescript-eslint/no-unused-vars` with `_` prefix pattern. Config files exempt from `no-console`.
- **TypeScript**: Strict mode enabled. Prefer specific types over `any`. Use `_` prefix for intentionally unused parameters.
- **React 19**: No `forwardRef` (ref is a regular prop). No `displayName` needed.
- **Memoization**: Use `[character]` as the single dependency for calculation hooks. Don't micro-optimize with individual field dependencies — it causes exhaustive-deps bugs and the calculations aren't expensive enough to justify it.
- **Components.json**: `rsc: false` — this is a client-side app with static export. shadcn components should be generated for client components.
