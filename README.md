# Exalted: Essence Character Manager

[![Version](https://img.shields.io/badge/version-0.0.6-orange.svg)](https://github.com/AlexanderExter/exalted-charsheet/releases)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://react.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-16.0.0-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)

> **🎲 A comprehensive digital character sheet manager for the Exalted: Essence tabletop RPG system**

---

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Tab Overview](#tab-overview)
- [Data Management](#data-management)
- [Storage](#storage)
- [Documentation](#documentation)
- [Technical Stack](#technical-stack)
- [Contributing](#contributing)
- [Changelog](#changelog)
- [Known Issues](#known-issues)
- [License](#license)
- [Acknowledgments](#acknowledgments)
- [Support](#support)

---

## ✨ Features

### Core Functionality

- **Multi-Character Management**: Create, switch, and manage multiple characters
- **Complete Character Tracking**: All Exalted: Essence mechanics supported
- **Persistent Storage**: Dexie-backed IndexedDB auto-save
- **Import/Export**: Full data portability via JSON
- **Combat Support**: Dice pools, weapon stats, power tracking
- **Social System**: Virtues, intimacies, resolve calculation

### Game Mechanics

- ⚡ **Attributes & Abilities**: Full 5-dot system, calculated totals
- 🔮 **Essence Management**: Motes, commitments, anima levels
- ❤️ **Health System**: Damage tracking, Ox Body integration
- 🛡️ **Static Values**: Auto Defense, Soak, Hardness, Resolve
- 📈 **Advancement**: Milestone and progression log
- ⚔️ **Equipment**: Armor and weapon management
- ✨ **Powers**: Charms, spells, step tracking
- 👥 **Social Mechanics**: Virtues, intimacies

### User Experience

- Organized tabbed interface
- Mobile-responsive design
- Real-time calculations
- Game-accurate terminology
- Data validation and error prevention

---

## 🚀 Quick Start

**Prerequisites:**

- Node.js 20.9+ (required for Next.js 16)
- npm 9+ or yarn

---

## 📋 Tab Overview

| Tab             | Description            | Key Features                      |
| --------------- | ---------------------- | --------------------------------- |
| **Core Stats**  | Primary character info | Attributes, Abilities, Essence    |
| **Combat**      | Battle mechanics       | Health, Dice pools, Static values |
| **Equipment**   | Gear management        | Weapons, Armor, Tag references    |
| **Powers**      | Magical abilities      | Charms, Spells, Descriptions      |
| **Social**      | Social mechanics       | Virtues, Intimacies, Resolve      |
| **Advancement** | Character progression  | Milestones, XP tracking           |
| **Rulings**     | GM decisions           | House rules, edge cases           |

---

## 💾 Data Management

**Import/Export**

- Export single characters or full roster (JSON)
- Automatic migration for older formats
- Easy backup and sharing

**Dexie Storage**

- Auto-save after each change
- Persistent across sessions
- Handles schema migrations on update

---

## 🗃️ Storage

Character data is persisted using [Dexie](https://dexie.org/), a wrapper around
the browser's IndexedDB API. This approach supports large rosters, offline
access, and versioned migrations beyond localStorage limits.

---

## 📖 Documentation

- [Contributing Guide](CONTRIBUTING.md): How to contribute
- [Changelog](CHANGELOG.md): Project history
- [Game Rules](https://www.drivethrurpg.com/product/162759/Exalted-Essence): Official rulebook

---

## 🛠️ Technical Stack

- **Frontend**: React 19.2 + TypeScript 5.x
- **Framework**: Next.js 16 (App Router)
- **Build**: Turbopack (default bundler)
- **UI**: shadcn/ui, Radix UI primitives
- **Forms**: React Hook Form v7 + @hookform/resolvers v5 (Zod)
- **Drag & Drop**: @dnd-kit v10
- **Styling**: Tailwind CSS 4 with CSS variables
- **Icons**: Lucide React
- **State**: Zustand v5 with Immer middleware
- **Storage**: Dexie v4 (IndexedDB wrapper)
- **Deployment**: Static export (GitHub Pages, Vercel, etc.)

---

## 🤝 Contributing

We welcome contributions! See [Contributing Guide](CONTRIBUTING.md).

**Development Setup:**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for full history.

**v0.0.6 (Current):**

- Persist imported characters to Dexie sequentially
- Export characters from Dexie storage
- Guard Dexie usage for server environments

---

## 🐛 Known Issues

- Storage limited by browser IndexedDB quotas
- Basic markdown support only
- Combat steps are static (not dynamic)
- Some edge cases handled via text fields

---

## 📄 License

MIT License – see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- **Onyx Path Publishing** – Exalted: Essence system
- **React Team** – Framework
- **Tailwind CSS** – Styling
- **Exalted Community** – Feedback and suggestions

---

## ⭐ Support

If you find this tool useful, please:

- ⭐ Star the repository
- 🐛 Report bugs via Issues
- 💡 Suggest features via Discussions
- 🤝 Contribute improvements

---

**🎲 Made with ❤️ for the Exalted community**

> _"In the Time of Tumult, heroes arise..."_
