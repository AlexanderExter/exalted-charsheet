# Functional Requirements

## Overview
Exalted: Essence Character Manager is a digital character sheet application designed for players of the Exalted: Essence tabletop RPG system. The application provides comprehensive character management with focus on combat efficiency and game session support.

## Target Users
- **Primary**: Exalted: Essence players managing their characters during game sessions
- **Secondary**: Game Masters needing quick character references
- **Tertiary**: New players learning the Exalted: Essence system

## Core Functional Requirements

### FR-1: Character Management
**Priority**: Critical
**Description**: Users must be able to create, manage, and switch between multiple characters.

**Acceptance Criteria**:
- ✅ Create new characters with unique names
- ✅ Switch between existing characters via selection screen
- ✅ Delete characters with confirmation prompt
- ✅ Character data persists between sessions
- ✅ Character list displays character names and basic info

**Business Rules**:
- Character names must be unique within a user's roster
- Minimum 1 character required to use application
- Maximum ~50 characters (localStorage limitation)

### FR-2: Character Attributes & Abilities
**Priority**: Critical
**Description**: Users must be able to track all character statistics per Exalted: Essence rules.

**Acceptance Criteria**:
- ✅ Three Attributes: Fortitude, Finesse, Force (1-5 base, 0-4 added, unlimited bonus)
- ✅ Fourteen Abilities: athletics, awareness, closeCombat, craft, embassy, integrity, navigate, physique, presence, performance, rangedCombat, sagacity, stealth, war (0-5 base, 0-4 added, unlimited bonus)
- ✅ Base + Added cannot exceed 5 for any stat
- ✅ Real-time calculation display
- ✅ Global attribute selector for quick dice pool reference

**Business Rules**:
- Attributes minimum base value: 1
- Abilities minimum base value: 0
- Added values represent experience/training increases
- Bonus values represent temporary modifiers

### FR-3: Essence System
**Priority**: Critical
**Description**: Track character's mystical power and expenditure.

**Acceptance Criteria**:
- ✅ Essence Rating (1-10)
- ✅ Current Motes tracking
- ✅ Committed Motes tracking  
- ✅ Spent Motes tracking
- ✅ Anima Level (0-10)
- ✅ Available for quick reference on Combat tab

**Business Rules**:
- Mote pools calculated from Essence Rating
- Commitments reduce available motes
- Anima increases with mote expenditure
- Values reset per scene/session as appropriate

### FR-4: Combat System
**Priority**: Critical
**Description**: Support combat encounters with quick access to relevant mechanics.

**Acceptance Criteria**:
- ✅ Health tracking with damage types (Bashing, Lethal, Aggravated)
- ✅ Health penalty calculation
- ✅ Static Values: Defense, Evasion, Parry, Soak, Hardness, Resolve
- ✅ Ox Body Technique integration
- ✅ Join Battle calculator
- ✅ Weapon attack/damage pool display
- ✅ Power accumulation tracking
- ✅ Dice pool calculator with modifiers

**Business Rules**:
- Health levels: 2 zero-penalty, 2 -1, 2 -2, 1 Incapacitated
- Ox Body adds health levels based on Exalt type
- Static values auto-calculate from attributes/abilities
- Power accumulates during combat encounters

### FR-5: Equipment Management
**Priority**: High
**Description**: Track armor, weapons, and their mechanical effects.

**Acceptance Criteria**:
- ✅ Armor: Name, Soak, Hardness, Mobility penalty, Tags
- ✅ Weapons: Name, Accuracy, Damage, Range bands (Close/Short/Mid/Long), Tags
- ✅ Equipment integrates with static value calculations
- ✅ Tag reference system extracts unique tags
- ✅ Add/Edit/Delete equipment entries

**Business Rules**:
- Equipment bonuses automatically apply to relevant calculations
- Tags provide additional mechanical context
- Range bands support tactical positioning

### FR-6: Powers System  
**Priority**: High
**Description**: Track magical abilities (Charms and Spells).

**Acceptance Criteria**:
- ✅ Charms: Name, Step, Cost, Description, Page Reference
- ✅ Spells: Same structure as Charms with visual distinction
- ✅ Step tracking for combo organization
- ✅ Free-form description fields
- ✅ Page references for rule lookup

**Business Rules**:
- Powers organized by type (Charm vs Spell)
- Step system allows combo planning
- Descriptions support house rules and clarifications

### FR-7: Social System
**Priority**: Medium
**Description**: Support social encounters and influence mechanics.

**Acceptance Criteria**:
- ✅ Resolve calculation and display
- ✅ Major and Minor Virtue selection
- ✅ Intimacies tracking (Ties and Principles)
- ✅ Social influence rules reference
- ✅ Virtue/Intimacy impact on Resolve calculation

**Business Rules**:
- One Major Virtue, One Minor Virtue per character
- Intimacies provide ±2 (Minor) or ±3 (Major) to Resolve
- Base Resolve = 2 + Integrity bonuses

### FR-8: Advancement System
**Priority**: Medium
**Description**: Track character progression through milestones.

**Acceptance Criteria**:
- ✅ Milestone budget tracking (Accrued/Spent/Remaining)
- ✅ Advancement log with timestamps
- ✅ Payment status tracking
- ✅ Detailed advancement history

**Business Rules**:
- Milestones are primary advancement currency
- Advancement costs vary by trait type and current rating
- Log maintains audit trail of character growth

### FR-9: Data Persistence
**Priority**: Critical
**Description**: Character data must persist between sessions.

**Acceptance Criteria**:
- ✅ Automatic save after each change
- ✅ Data persists browser sessions
- ✅ No data loss on page refresh
- ✅ Multiple characters maintained simultaneously

**Business Rules**:
- Uses browser localStorage
- Data saved immediately on change
- No manual save required

### FR-10: Import/Export System
**Priority**: High
**Description**: Allow data portability and backup.

**Acceptance Criteria**:
- ✅ Export individual characters as JSON
- ✅ Export entire character roster as JSON
- ✅ Import character files with validation
- ✅ Import multiple characters at once
- ✅ Backup and sharing capabilities

**Business Rules**:
- JSON format for interoperability
- Import validates data structure
- Duplicate names handled gracefully
- File format version tracking

## Non-Functional Requirements

### NFR-1: Performance
- Application loads in < 3 seconds on broadband
- UI interactions respond in < 200ms
- Calculations update in real-time
- No noticeable lag with multiple characters

### NFR-2: Usability
- Intuitive navigation following game terminology
- Mobile-responsive design for tablets
- Clear visual hierarchy and organization
- Accessible color contrast and font sizes

### NFR-3: Reliability
- Data integrity maintained across sessions
- Graceful handling of invalid inputs
- No data corruption on browser crashes
- Automatic recovery from localStorage issues

### NFR-4: Compatibility
- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- No external dependencies required
- Functions offline after initial load
- Responsive design supports tablets and desktops

### NFR-5: Security
- No personal data transmitted externally
- Client-side only processing
- Input validation prevents XSS
- Safe JSON import/export handling

## Out of Scope

### Explicitly Excluded Features
- **Multi-user support**: Single-user application only
- **Server-side storage**: Local storage only
- **Real-time collaboration**: No sharing capabilities
- **Automated rule enforcement**: Guidance over automation
- **Character generators**: Manual character creation only
- **Campaign management**: Individual character focus only
- **Cross-game compatibility**: Exalted: Essence specific
- **Mobile app**: Web application only
- **Offline-first**: Requires initial online load

### Future Considerations
- PWA capabilities for better mobile experience
- Optional cloud sync for character sharing
- GM tools and campaign integration
- Character sheet printing/PDF export
- Advanced calculation automation
- Plugin system for house rules