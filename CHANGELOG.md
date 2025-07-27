# Changelog

All notable changes to the Exalted: Essence Character Manager will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

- 📱 **8-Tab Organization** - Core Stats, Combat, Equipment, Powers, Socials, Advancement, Rulings, WIP
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

- 📚 **Comprehensive Documentation** - Complete feature guide and technical details
- 🤝 **Contributing Guide** - Clear guidelines for community contributions
- 📝 **Detailed README** - Installation, usage, and development instructions
- 🎯 **Testing Checklist** - Manual testing procedures for quality assurance

### Quality Assurance

- ✅ **TypeScript Integration** - Fixed all compilation errors
- 🧪 **Build Verification** - Confirmed successful production builds
- 🌐 **Cross-Browser Testing** - Verified functionality across major browsers
- 📱 **Mobile Testing** - Responsive design validation

### Known Limitations

- 🏪 **Storage Constraints** - Limited by browser localStorage capacity
- 📝 **Basic Markdown** - Simple header and paragraph support only
- ⚔️ **Static Combat Steps** - Combat guidance not dynamic
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
