# Changelog

All notable changes to the Exalted: Essence Character Manager will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- ⬆️ **Dependency Updates**
  - Next.js 16.0.10 → 16.1.6 (security fix)
  - Resolved all npm audit vulnerabilities (0 remaining)

### Added

- 🏗️ **Architecture Audit** - Comprehensive codebase quality overhaul
  - Unified state management: all forms use Zustand + Zod directly
  - Simplified memoization strategy: `[character]` single dependency for all calculation hooks
  - Schema validation with `safeParse` on IndexedDB load for graceful error handling
  - Comprehensive `CLAUDE.md` documenting architecture decisions and code standards

### Removed

- ❌ **Dependency Cleanup** - Removed underutilized libraries
  - Removed `react-hook-form` and `@hookform/resolvers` (replaced by direct Zustand state)
  - Removed `react-markdown` (about/legal content inlined as JSX)
  - Removed `@tanstack/react-table` (replaced by simple state-managed sorting)
  - Removed `components/ui/form.tsx` (shadcn form wrapper for react-hook-form)
  - Deleted `tailwind.config.ts` (dead code from incomplete v3→v4 migration)
  - Removed dark mode (`.dark` selectors, CSS variables, `dark:` classes)
  - Deleted `public/content/about.md` and `public/content/legal.md` (content moved inline)
  - Deleted `IMPROVEMENTS.md` (entirely obsolete after audit)

### Fixed

- 🔧 **ESLint Configuration** - Complete rewrite for ESLint 9 flat config with React 19 version detection
- 🔧 **Tailwind CSS 4** - Removed dead `tailwind.config.ts`; `@theme inline` in globals.css is the sole config
- 🔧 **React 19** - Removed `forwardRef` from all shadcn UI components (ref is a regular prop)
- 🔧 **components.json** - Set `rsc: false` (static export has no RSC runtime)
- 🐛 **Memoization** - Fixed exhaustive-deps issues caused by micro-optimized dependency arrays
- 🐛 **Double memoization** - Removed redundant memoization in DicePoolSummary
- 🐛 **Type safety** - Replaced `any` types in SideCharacterEditor, ExaltedCharacterManager, useEntityCRUD
- 🐛 **sync-version script** - Removed reference to deleted `public/content/about.md`
- 📚 **Documentation** - Updated README, CHANGELOG, CONTRIBUTING to reflect current architecture

## [0.0.6] - 2025-08-11

### Added

- Persist imported characters to Dexie sequentially with export support
- Script to sync documentation versions with package.json

### Fixed

- Guard Dexie usage for server environments

## [0.0.5-alpha] - 2025-01-26

### Added

- ✨ **Initial Public Release** - Complete character sheet manager for Exalted: Essence
- 🎯 **Multi-Character Management** - Create, switch, and manage multiple characters
- 📊 **Complete Character Tracking** - All Exalted: Essence mechanics implemented
- 💾 **Data Persistence** - Automatic IndexedDB saving via Dexie
- 📤 **Import/Export System** - JSON-based character data portability
- ⚔️ **Combat Support** - Integrated dice pools, weapon stats, and power tracking
- 👥 **Social System** - Virtues and intimacies with resolve calculation
- 📚 **About & Legal Content** - Information modals in site footer
- 🛡️ **Production Security** - Clean error handling, no exposed secrets or debug code
- 🚀 **Static Export Deployment** - Optimized 162KB bundle ready for any hosting platform

### Game Mechanics

- ⚡ **Attributes & Abilities** - Full 5-dot system (Fortitude, Finesse, Force + 14 abilities)
- 🔮 **Essence Management** - Mote tracking, commitments, anima levels, rating progression
- ❤️ **Health System** - Damage tracking with Ox Body integration and penalty calculation
- 🛡️ **Static Values** - Auto-calculated Defense, Evasion, Parry, Resolve, Soak, Hardness
- 📈 **Advancement System** - Milestone tracking with detailed progression log
- ⚔️ **Equipment Management** - Comprehensive armor and weapon tracking with tags
- ✨ **Powers System** - Charms and spells with step tracking and descriptions
- 🗣️ **Social Mechanics** - Major/Minor virtue system and intimacy management

### User Interface

- 📱 **7-Tab Organization** - Core Stats, Combat, Equipment, Powers, Social, Advancement, Rulings
- 🎨 **Intuitive Interface** - Follows game terminology and logical organization
- ⚡ **Real-Time Calculations** - All derived values update automatically
- 🛡️ **Data Validation** - Prevents invalid inputs and provides helpful feedback

### Technical Features

- ⚛️ **React 19** - Modern functional components with hooks and concurrent features
- ⚡ **Next.js 16** - App Router with Turbopack and static export
- 🔷 **TypeScript** - Strict type safety and enhanced development experience
- 🎨 **Tailwind CSS 4** - Latest utility-first styling with CSS variables
- 🎨 **Desktop-Focused** - Optimized for larger screens with shadcn/ui components
- 🛠️ **Developer Tools** - Process monitoring scripts and comprehensive dev commands

### Documentation

- 🤝 **Contributing Guide** - Clear guidelines for community contributions
- 📝 **Detailed README** - Installation, usage, and development instructions

### Quality Assurance

- ✅ **TypeScript Integration** - Fixed all compilation errors
- 🧪 **Build Verification** - Confirmed successful production builds
- 🌐 **Cross-Browser Testing** - Verified functionality across major browsers
- 🖥️ **Desktop Testing** - Verified on major browsers

### Known Limitations

- 🏪 **Storage Constraints** - Limited by browser IndexedDB capacity
- 🎯 **Edge Case Handling** - Some scenarios handled via text fields

---

## Release Notes Format

### Categories

- **Added** - New features
- **Changed** - Changes in existing functionality
- **Deprecated** - Soon-to-be removed features
- **Removed** - Now removed features
- **Fixed** - Bug fixes
- **Security** - Vulnerability fixes

### Emojis Legend

- ✨ New features
- 🐛 Bug fixes
- 📚 Documentation
- 🔧 Technical improvements
- 🎨 UI/UX changes
- ⚡ Performance improvements
- 🛡️ Security updates
- 📱 UI improvements
