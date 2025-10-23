# Changelog

All notable changes to the Exalted: Essence Character Manager will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- ⬆️ **Major Dependency Updates** - Updated all dependencies to latest stable versions
  - Next.js 15.5.6 → 16.0.0 (Turbopack now default bundler)
  - React 19.1.0 → 19.2.0
  - @hookform/resolvers 3.x → 5.x (type inference from Zod schemas)
  - @dnd-kit/sortable 7.x → 10.x
  - react-markdown 9.x → 10.x
  - All supporting dependencies updated to latest stable

### Removed

- ❌ **Backwards Compatibility Cleanup** - Removed technical debt
  - Removed custom type definitions for @hookform/resolvers (v5 exports proper types)
  - Removed deprecated npm scripts (`export`, `build:production`)
  - Removed Next.js experimental.esmExternals flag
  - Cleaned up .gitignore duplicates and unused framework entries

### Fixed

- 🔧 **ESLint Configuration** - Updated for Next.js 16 flat config format
- 🐛 **TypeScript Configuration** - Enabled skipLibCheck for better performance
- 📚 **Documentation** - Updated all version badges, technical stack, and prerequisites

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
- 💾 **Data Persistence** - Automatic localStorage saving with migration support
- 📤 **Import/Export System** - JSON-based character data portability
- ⚔️ **Combat Support** - Integrated dice pools, weapon stats, and power tracking
- 👥 **Social System** - Virtues and intimacies with resolve calculation
- 📚 **About & Legal Content** - Comprehensive markdown-based information modals
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
- 📱 **Mobile-Responsive Design** - Works across devices and screen sizes
- 🎨 **Intuitive Interface** - Follows game terminology and logical organization
- ⚡ **Real-Time Calculations** - All derived values update automatically
- 🛡️ **Data Validation** - Prevents invalid inputs and provides helpful feedback

### Technical Features

- ⚛️ **React 19** - Modern functional components with hooks and concurrent features
- ⚡ **Next.js 15** - App Router with Turbopack for development and static export
- 🔷 **TypeScript** - Strict type safety and enhanced development experience
- 🎨 **Tailwind CSS 4** - Latest utility-first styling with CSS variables
- 📱 **Responsive Design** - Mobile-first approach with shadcn/ui components
- 🔧 **Performance Optimized** - 63 React.memo/useCallback/useMemo optimizations
- 🛠️ **Developer Tools** - Process monitoring scripts and comprehensive dev commands

### Documentation

- 🤝 **Contributing Guide** - Clear guidelines for community contributions
- 📝 **Detailed README** - Installation, usage, and development instructions

### Quality Assurance

- ✅ **TypeScript Integration** - Fixed all compilation errors
- 🧪 **Build Verification** - Confirmed successful production builds
- 🌐 **Cross-Browser Testing** - Verified functionality across major browsers
- 📱 **Mobile Testing** - Responsive design validation

### Known Limitations

- 🏪 **Storage Constraints** - Limited by browser localStorage capacity
- 📝 **Basic Markdown** - Simple header and paragraph support only
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
- 📱 Mobile improvements
