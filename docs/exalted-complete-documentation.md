# Exalted: Essence Character Manager - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [User Guide](#user-guide)
4. [Technical Architecture](#technical-architecture)
5. [Tab Structure](#tab-structure)
6. [Import/Export System](#importexport-system)
7. [Recent Updates](#recent-updates)
8. [Development Guidelines](#development-guidelines)

---

## Overview

A comprehensive digital character sheet manager for the Exalted: Essence tabletop RPG system. Built as a React-based single-page application with local data persistence, designed for individual use during gameplay sessions.

### Design Philosophy
- **Guidance Over Automation**: Present options rather than enforcing strict rules
- **Combat Optimization**: Quick access to frequently-used mechanics
- **Progressive Disclosure**: Information organized by frequency of use
- **Flexibility**: Supports house rules and edge cases

---

## Features

### Core Functionality
- **Multi-Character Management**: Create, switch between, and manage multiple characters
- **Complete Character Tracking**: All Exalted: Essence mechanics supported
- **Persistent Storage**: Automatic saving to browser localStorage
- **Import/Export**: Full character data portability via JSON files
- **Combat Support**: Integrated dice pools, weapon stats, and power tracking
- **Social System**: Virtues and intimacies with resolve calculation

### Key Mechanics Implemented
- Attributes & Abilities with 5-dot system
- Essence tracking with mote management
- Health levels with Ox Body integration
- Static values (Defense, Soak, Hardness, etc.)
- Advancement tracking with milestone budget
- Equipment management (armor & weapons)
- Charms and spells with step tracking
- Social influence system

---

## User Guide

### Getting Started
1. **Create a Character**: Enter name and click "Create"
2. **Import Existing**: Use "Import Character(s)" to load JSON files
3. **Switch Characters**: Use character selection screen or header button

### Character Sheet Navigation

#### Core Stats Tab (Default)
- **Essence Management**: Track rating, motes, commitments, and anima
- **Attributes**: Fortitude, Finesse, Force (1-5 base + added + bonus)
- **Abilities**: All 14 abilities with global attribute selector for quick pools

#### Combat Tab
- **Essence Tracking**: Repeated for combat convenience
- **Combat Rolls**: Join Battle calculator and weapon attack/damage pools
- **Power Tracker**: Simple counter for tracking gained power
- **Static Values**: Defense, Evasion, Parry, Resolve, Soak, Hardness
- **Health Track**: Damage tracking with penalty calculation
- **Dice Pool Calculator**: Full pool assembly with modifiers

#### Equipment Tab
- **Armor**: Track soak, hardness, mobility, and tags
- **Weapons**: Full stats including range (close/short/mid/long)
- **Tag References**: Automatic extraction of unique tags

#### Powers Tab
- **Charms**: Name, step, cost, description, page reference
- **Spells**: Same structure as charms with different styling

#### Socials Tab
- **Resolve Display**: Base value before modifiers
- **Virtues**: Select 1 Major and 1 Minor virtue
- **Intimacies**: Separated into Ties and Principles sections
- **Social Rules Reference**: Quick reminder of influence steps

#### Advancement Tab
- **Milestone Budget**: Track accrued/spent/remaining milestones
- **Advancement Log**: Detailed tracking with payment status

#### Rulings Tab
- **Character-Specific Rulings**: Track GM decisions and edge cases
- **Timestamped Entries**: Know when rulings were made

#### WIP Tab
- **Experimental Features**: Combat step guidance system
- **Future Development**: Testing ground for new features

### Combat Workflow
1. Stay on Combat tab during encounters
2. Track essence spending at top
3. Reference weapon pools for attacks
4. Monitor power accumulation
5. Use dice pool calculator for complex rolls

### Social Encounters
1. Check base Resolve value
2. Select relevant virtues/intimacies
3. Calculate final Resolve (±2 for Minor, ±3 for Major)
4. Add new intimacies as story develops

---

## Technical Architecture

### Technology Stack
- **Framework**: React with functional components and hooks
- **Styling**: Tailwind CSS utility classes
- **Icons**: Lucide React icon library
- **Data Persistence**: Browser localStorage
- **Environment**: Single HTML artifact, no external dependencies

### Core Data Structure
```javascript
{
  id: Number (timestamp),
  name: String,
  
  // Core Stats
  attributes: {
    fortitude: { base: Number(1-5), added: Number(0-4), bonus: Number },
    finesse: { base: Number(1-5), added: Number(0-4), bonus: Number },
    force: { base: Number(1-5), added: Number(0-4), bonus: Number }
  },
  
  abilities: {
    // 14 abilities with same structure as attributes
  },
  
  essence: {
    rating: Number(1-10),
    motes: Number,
    commitments: Number,
    spent: Number,
    anima: Number(0-10)
  },
  
  staticValues: {
    // Modifiers for defense, evasion, parry, resolve, soak, hardness
  },
  
  health: {
    baseline: { zero: 2, minusOne: 2, minusTwo: 2, incap: 1 },
    oxBodyLevels: Number(0-5),
    exaltType: String,
    bashingDamage: Number,
    lethalDamage: Number,
    aggravatedDamage: Number,
    dramaticInjuries: Array
  },
  
  combat: {
    power: Number,
    joinBattleBonus: Number
  },
  
  social: {
    virtues: { major: String, minor: String },
    intimacies: Array
  },
  
  // Arrays for equipment, powers, advancement, rulings
}
```

### Key Business Logic

#### Attribute & Ability Constraints
- Base + Added cannot exceed 5 for any stat
- Minimum base 1 for attributes, 0 for abilities
- UI enforces limits dynamically

#### Static Value Calculations
- **Defense**: Max(Evasion, Parry) + modifier
- **Evasion**: ⌈(Athletics + Highest Attribute) / 2⌉ + modifier
- **Parry**: ⌈(Close Combat + Highest Attribute) / 2⌉ + modifier
- **Resolve**: 2 + Integrity bonuses + modifier
- **Soak**: 1 + Physique bonus + Armor + modifier
- **Hardness**: Essence + 2 + Armor + modifier

#### Health System
- **Base Levels**: 2/2/2/1 (0/-1/-2/Incap)
- **Ox Body**: Varies by exalt type (Lunar: +2/+1 per purchase)
- **Penalty Calculation**: Based on total damage vs health levels

---

## Tab Structure

### Tab Organization
1. **Core Stats** - Most frequently accessed information
2. **Combat** - All combat-related mechanics
3. **Equipment** - Gear management
4. **Powers** - Magical abilities reference
5. **Socials** - Social combat and relationships
6. **Advancement** - Character progression
7. **Rulings** - GM decisions tracking
8. **WIP** - Experimental features

### Design Rationale
- Frequency-based ordering
- Related information grouped
- Combat gets essence module duplicate for convenience
- Reference material in later tabs
- Progressive disclosure of complexity

---

## Import/Export System

### Export Features
- **Single Character**: JSON file with character name
- **All Characters**: Combined JSON file
- **Direct Download**: No blob URLs, immediate file save

### Import Features
- **Flexible Input**: Accepts single or multiple character files
- **Validation**: Ensures data integrity
- **Auto-Migration**: Updates old formats to current schema
- **Conflict Prevention**: Generates new IDs on import

### File Format
```json
{
  "id": 1234567890,
  "name": "Character Name",
  "attributes": { ... },
  "abilities": { ... },
  // Complete character data
}
```

### Use Cases
- **Backup**: Regular exports protect against data loss
- **Sharing**: Exchange characters between players/devices
- **Templates**: Create and reuse character archetypes
- **Campaign Management**: GMs can manage NPC rosters

---

## Recent Updates

### Latest Enhancements (Current Version)

#### UI Improvements
- **Global Attribute Selector**: Single control affects all ability calculations
- **Split Intimacies**: Ties and Principles in separate sections
- **Virtues Rework**: 1 Major + 1 Minor instead of any 2
- **Combat Essence**: Full essence module added to combat tab
- **About Page**: Markdown-based information system

#### Bug Fixes
- Export functionality now triggers proper downloads
- Weapon range displays correctly
- Data migration handles legacy virtue format
- Improved error handling throughout

#### Data Structure Updates
- Virtues changed from array to object format
- Automatic migration for existing characters
- Better null safety and validation

---

## Development Guidelines

### Code Standards
- Use functional React patterns with hooks
- Implement defensive programming (null checks, fallbacks)
- Follow Exalted game terminology
- Maintain clear separation between UI and business logic
- Comment game rule implementations

### State Management
- Character data in main component state
- Automatic localStorage persistence
- Migration strategy for schema changes
- Careful handling of nested updates

### UI/UX Principles
- Mobile-responsive design
- Accessibility with semantic HTML
- Visual feedback for user actions
- Consistent color coding
- Progressive enhancement

### Performance Considerations
- Lightweight calculations on every render
- Debounce rapid input changes
- Efficient localStorage operations
- Minimal re-renders with proper deps

### Testing Checklist
- [ ] Character creation and deletion
- [ ] Data persistence across sessions
- [ ] Import/export functionality
- [ ] Calculation accuracy
- [ ] Edge cases (max values, empty states)
- [ ] Mobile responsiveness

### Future Development

#### Planned Features
- Additional exalt types with unique mechanics
- Extended markdown support for About content
- Advanced dice rolling with probability
- Character comparison tools
- Campaign package exports

#### Extension Points
- New exalt types in `createNewCharacter()`
- Static value formulas in calculation functions
- Anima rulings in threshold arrays
- Equipment categories in table structures

### Known Limitations
1. **Storage**: localStorage has size limits
2. **Automation**: Many edge cases handled via text
3. **Markdown**: Basic support only (headers, paragraphs)
4. **Combat Steps**: Currently static, not dynamic

---

## Quick Reference

### Keyboard Shortcuts
- None currently implemented

### Common Actions
- **Quick Dice Pool**: Core Stats → Select Attribute → Read totals
- **Combat Check**: Combat Tab → Weapon Rolls → Attack pool
- **Resolve Check**: Socials Tab → Base + virtue/intimacy mods
- **Health Status**: Combat Tab → Health Track → Current penalty

### Tips & Tricks
1. Export after each session
2. Use tag system for house rules
3. Track rulings for consistency
4. Template characters for quick NPCs
5. Global attribute selector for comparisons

### Troubleshooting
- **Import fails**: Verify JSON validity
- **Missing data**: Check migration in console
- **Export issues**: Try different browser
- **Performance**: Clear old localStorage data

---

## Credits
- **System**: Exalted: Essence by Onyx Path Publishing
- **Development**: Created for the Exalted community
- **Framework**: React, Tailwind CSS, Lucide Icons
- **Testing**: Community feedback and iteration

---

*This documentation represents the current state of the Exalted: Essence Character Manager. For updates and contributions, please refer to the project repository.*