# Exalted: Essence Character Manager

[![Version](https://img.shields.io/badge/version-0.1.0--alpha-orange.svg)](https://github.com/yourusername/exalted-character-manager/releases)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue.svg)](https://www.typescriptlang.org/)

> **🎲 A comprehensive digital character sheet manager for the Exalted: Essence tabletop RPG system**

![Screenshot](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Character+Manager+Screenshot)

## ✨ Features

### 🎯 Core Functionality
- **Multi-Character Management**: Create, switch between, and manage multiple characters
- **Complete Character Tracking**: All Exalted: Essence mechanics supported
- **Persistent Storage**: Automatic saving to browser localStorage
- **Import/Export**: Full character data portability via JSON files
- **Combat Support**: Integrated dice pools, weapon stats, and power tracking
- **Social System**: Virtues and intimacies with resolve calculation

### 🎮 Game Mechanics Implemented
- ⚡ **Attributes & Abilities**: Full 5-dot system with calculated totals
- 🔮 **Essence Management**: Mote tracking, commitments, anima levels
- ❤️ **Health System**: Damage tracking with Ox Body integration
- 🛡️ **Static Values**: Auto-calculated Defense, Soak, Hardness, Resolve
- 📈 **Advancement**: Milestone tracking with detailed progression log
- ⚔️ **Equipment**: Comprehensive armor and weapon management
- ✨ **Powers**: Charms and spells with step tracking
- 👥 **Social Mechanics**: Virtue system and intimacy management

### 📱 User Experience
- 8 organized tabs for different character aspects
- Mobile-responsive design
- Real-time calculations
- Intuitive interface following game terminology
- Data validation and error prevention

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/exalted-character-manager.git
cd exalted-character-manager

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Alternative: Standalone Demo
For a quick demo without setup, open `standalone.html` directly in your browser.

## 🏗️ Development

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## 📋 Tab Overview

| Tab | Description | Key Features |
|-----|-------------|--------------|
| **Core Stats** | Primary character information | Attributes, Abilities, Essence |
| **Combat** | Battle mechanics | Health, Dice pools, Static values |
| **Equipment** | Gear management | Weapons, Armor, Tag references |
| **Powers** | Magical abilities | Charms, Spells with descriptions |
| **Socials** | Social mechanics | Virtues, Intimacies, Resolve |
| **Advancement** | Character progression | Milestones, XP tracking |
| **Rulings** | GM decisions | House rules, edge cases |
| **WIP** | Experimental features | Combat step guidance |

## 💾 Data Management

### Import/Export
- Export single characters or entire roster
- JSON format for portability
- Automatic data migration for older formats
- Backup and sharing capabilities

### Local Storage
- Automatic saving after each change
- Persistent across browser sessions
- Migration handling for updates

## 🎯 Testing

### Manual Testing Checklist
- [ ] Character creation and deletion
- [ ] Data persistence across sessions
- [ ] Import/export functionality
- [ ] Calculation accuracy
- [ ] Mobile responsiveness
- [ ] All tab functionality

### Key Features to Test
1. **Character Management**: Create, switch, delete characters
2. **Core Mechanics**: Verify all calculations (Defense, Soak, etc.)
3. **Equipment System**: Add weapons/armor, check stat integration
4. **Data Persistence**: Refresh page, verify data remains
5. **Import/Export**: Export character, delete, re-import

## 📖 Documentation

- **[Complete Documentation](docs/exalted-complete-documentation.md)**: Comprehensive feature guide
- **[Game Rules](https://www.drivethrurpg.com/product/162759/Exalted-Essence)**: Official Exalted: Essence rulebook
- **[Contributing Guide](CONTRIBUTING.md)**: How to contribute to the project

## 🛠️ Technical Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Storage**: Browser localStorage
- **Deployment**: Static hosting ready

## 🎮 Game System

This application is designed for **Exalted: Essence** by Onyx Path Publishing. It implements the complete character creation and management system including:

- All Exalt types (focused on Lunar mechanics)
- Combat system with static values
- Social influence mechanics
- Advancement through milestones
- Equipment and artifact management

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 Changelog

### v0.1.0-alpha (Current)
- ✅ Initial release
- ✅ Complete character sheet functionality
- ✅ All 8 tab system implemented
- ✅ Import/export system
- ✅ Local storage persistence
- ✅ Mobile-responsive design
- ✅ Comprehensive documentation

## 🐛 Known Issues

- Storage limited by browser localStorage constraints
- Basic markdown support only
- Combat steps are static (not dynamic)
- Some edge cases handled via text fields

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Onyx Path Publishing** for the Exalted: Essence system
- **React Team** for the excellent framework
- **Tailwind CSS** for the utility-first styling
- **Exalted Community** for feedback and testing

## ⭐ Support

If you find this tool useful, please:
- ⭐ Star the repository
- 🐛 Report bugs via Issues
- 💡 Suggest features via Discussions
- 🤝 Contribute improvements

---

**🎲 Made with ❤️ for the Exalted community**

> *"In the Time of Tumult, heroes arise..."*