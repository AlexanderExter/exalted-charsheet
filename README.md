# Exalted: Essence Character Manager

[![Version](https://img.shields.io/badge/version-0.0.6-orange.svg)](https://github.com/AlexanderExter/exalted-charsheet/releases)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.4.3-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

> **🎲 A comprehensive digital character sheet manager for the Exalted: Essence tabletop RPG system**

---

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Tab Overview](#tab-overview)
- [Data Management](#data-management)
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
- **Persistent Storage**: Auto-save to browser localStorage
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

- Node.js 18+
- npm or yarn

---

## 📋 Tab Overview

| Tab             | Description            | Key Features                      |
| --------------- | ---------------------- | --------------------------------- |
| **Core Stats**  | Primary character info | Attributes, Abilities, Essence    |
| **Combat**      | Battle mechanics       | Health, Dice pools, Static values |
| **Equipment**   | Gear management        | Weapons, Armor, Tag references    |
| **Powers**      | Magical abilities      | Charms, Spells, Descriptions      |
| **Socials**     | Social mechanics       | Virtues, Intimacies, Resolve      |
| **Advancement** | Character progression  | Milestones, XP tracking           |
| **Rulings**     | GM decisions           | House rules, edge cases           |

---

## 💾 Data Management

**Import/Export**

- Export single characters or full roster (JSON)
- Automatic migration for older formats
- Easy backup and sharing

**Local Storage**

- Auto-save after each change
- Persistent across sessions
- Handles migrations on update

---

## 📖 Documentation

- [Contributing Guide](CONTRIBUTING.md): How to contribute
- [Changelog](CHANGELOG.md): Project history
- [Game Rules](https://www.drivethrurpg.com/product/162759/Exalted-Essence): Official rulebook

---

## 🛠️ Technical Stack

- **Frontend**: React 19 + TypeScript
- **Framework**: Next.js 15 (App Router)
- **UI**: shadcn/ui, Radix UI
- **Build**: Turbopack (dev), Next.js (prod)
- **Styling**: Tailwind CSS 4, CSS variables
- **Icons**: Lucide React
- **Storage**: Browser localStorage (custom hooks)
- **Deployment**: Static export

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

- Storage limited by browser localStorage
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
- **Exalted Community** – Feedback & testing

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
