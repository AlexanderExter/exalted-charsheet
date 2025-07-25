# Monolith Breakup Strategy for AI Development

## Executive Summary

The 3,507-line `ExaltedCharacterManager.tsx` represents a successful AI-generated solution that now needs strategic decomposition for improved AI handoff and maintainability. This strategy prioritizes **AI development workflow optimization** over traditional architectural purity.

## Current Monolith Analysis

### Structure Overview
- **Lines**: 3,507 total
- **Hooks**: ~54 React hooks (useState, useCallback, useMemo, useEffect)
- **Logical Sections**: 8 major tabs + character management + utilities
- **Data Model**: Complex character state with nested objects

### AI-Generated Characteristics
- **Coherent Logic Flow**: Single-pass generation creates natural flow
- **Consistent Patterns**: Uniform approach to state management
- **Complete Feature Set**: All requirements fulfilled in one component
- **Self-Contained**: Minimal external dependencies

## AI Development Workflow Constraints

### AI Session Limitations
- **Context Window**: Large files exceed token limits for modification
- **Cognitive Load**: 3,500 lines impossible to reason about entirely
- **Modification Risk**: Changes in one area can break unrelated features
- **Handoff Difficulty**: New AI sessions can't grasp full scope quickly

### AI Strengths to Preserve
- **Pattern Recognition**: AI excels at consistent implementations
- **Feature Completion**: Single-session feature development
- **Integration**: Natural understanding of related components

## Strategic Breakup Approach

### Phase 1: Extract Pure Utilities (Low Risk)
**Target**: Functions with no React dependencies

```typescript
// Extract to: lib/exalted-utils.ts
- getAnimaLevel()
- getActiveAnimaRulings()
- calculation helpers
- validation functions
```

**Benefits**:
- ✅ Zero breaking change risk
- ✅ Easier to test and reason about
- ✅ Reusable across components

### Phase 2: Extract Custom Hooks (Medium Risk)
**Target**: Stateful logic that can be abstracted

```typescript
// Extract to: hooks/useCharacterManager.ts
- useAutoSave (already extracted)
- useCharacterState
- useCharacterValidation

// Extract to: hooks/useCharacterCalculations.ts
- Static value calculations
- Dice pool calculations
- Health calculations
```

**Benefits**:
- ✅ Reusable state logic
- ✅ Easier to modify individual features
- ✅ Cleaner main component

### Phase 3: Extract Tab Components (High Value)
**Target**: Each major tab as its own component

```typescript
// components/character-tabs/
├── CoreStatsTab.tsx        // Attributes, abilities, essence
├── CombatTab.tsx          // Health, dice pools, static values
├── EquipmentTab.tsx       // Weapons, armor
├── PowersTab.tsx          // Charms, spells
├── SocialTab.tsx          // Virtues, intimacies
├── AdvancementTab.tsx     // Milestones, progression
├── RulingsTab.tsx         // House rules
└── WIPTab.tsx             // Experimental features
```

**Benefits**:
- ✅ **AI Session Scope**: Each tab fits in single AI session
- ✅ **Feature Isolation**: Changes don't affect other tabs
- ✅ **Parallel Development**: Multiple features can be developed simultaneously
- ✅ **Testing Scope**: Individual tab testing becomes feasible

### Phase 4: Extract Character Management (Stabilization)
**Target**: Character CRUD operations

```typescript
// components/character-management/
├── CharacterSelector.tsx   // Character switching UI
├── CharacterCreator.tsx    // New character form
├── CharacterActions.tsx    // Import/export/delete
└── CharacterProvider.tsx   // Context for character state
```

## AI-Optimized Architecture

### Component Size Guidelines
- **Maximum**: 500 lines per component
- **Target**: 200-300 lines for optimal AI handling
- **Complexity**: Single responsibility per component

### State Management Strategy
```typescript
// Character Context Provider
interface CharacterContextType {
  characters: Character[]
  currentCharacter: Character | null
  updateCharacter: (updates: Partial<Character>) => void
  // ... other methods
}

// Tab Components receive:
interface TabProps {
  character: Character
  updateCharacter: (updates: Partial<Character>) => void
}
```

### File Organization
```
components/
├── ExaltedCharacterManager.tsx      // Main orchestrator (< 200 lines)
├── character-tabs/                  // Feature-specific tabs
├── character-management/            // CRUD operations
└── ui/                             // Shared UI components

hooks/
├── useCharacterManager.ts          // Main character state
├── useCharacterCalculations.ts     // Derived values
└── useLocalStorage.ts              // Already extracted

lib/
├── exalted-utils.ts               // Pure utility functions
├── character-schema.ts            // Type definitions
└── character-defaults.ts          // Default values
```

## Migration Strategy

### Step 1: Preparation
1. **Create types file** for Character interface
2. **Extract utility functions** to lib/
3. **Test current functionality** to establish baseline

### Step 2: Hook Extraction
1. **Extract useCharacterCalculations** hook
2. **Create useCharacterManager** hook for state
3. **Update main component** to use new hooks
4. **Verify functionality** after each extraction

### Step 3: Tab Component Extraction
1. **Start with simplest tab** (Rulings or WIP)
2. **Extract one tab at a time**
3. **Test each tab independently**
4. **Maintain feature parity** throughout

### Step 4: Management Component Extraction
1. **Extract character selector**
2. **Extract import/export logic**
3. **Create character provider context**
4. **Finalize main orchestrator**

## AI Session Planning

### Per-Session Scope
- **Single tab extraction** per AI session
- **Related hook extraction** in same session
- **Complete testing** before session end
- **Documentation update** with each change

### Session Handoff Protocol
1. **Read technical debt document** for context
2. **Identify current extraction target**
3. **Complete extraction with testing**
4. **Update progress tracking**
5. **Document any issues discovered**

## Success Metrics

### AI Development Efficiency
- **Session Success Rate**: >90% of extractions work on first try
- **Modification Scope**: Individual features modifiable in single session
- **Context Understanding**: New AI sessions can understand component purpose quickly

### Code Quality
- **Component Size**: All components <500 lines
- **Test Coverage**: Individual components testable
- **Type Safety**: Strong typing throughout extracted components

### Functionality Preservation
- **Feature Parity**: All current features work identically
- **Performance**: No performance degradation
- **Data Integrity**: Character data fully preserved

## Risk Mitigation

### High-Risk Areas
- **State synchronization** between extracted components
- **Complex calculations** spanning multiple tabs
- **Import/export** functionality during transition

### Mitigation Strategies
- **Incremental extraction** with full testing
- **Feature flags** for gradual rollout
- **Comprehensive backup** of working state
- **Rollback plan** for each phase

## Expected Outcomes

### For AI Development
- **Faster iterations**: Components fit in single AI session
- **Reduced errors**: Smaller scope reduces complexity
- **Better handoffs**: Clear component boundaries
- **Parallel development**: Multiple features simultaneously

### For Human Users
- **Same functionality**: Zero user-facing changes
- **Better performance**: Potentially smaller bundle sizes
- **Future features**: Easier to add new capabilities

## Conclusion

This breakup strategy prioritizes **practical AI development workflow** over theoretical architectural purity. The goal is creating an environment where:

1. **AI sessions can succeed** with 200-500 line components
2. **Feature development** happens in isolated, manageable scopes
3. **Context handoff** between AI sessions is seamless
4. **Human oversight** can focus on coordination rather than implementation

The monolith worked for initial development. Now it's time to optimize for ongoing AI-driven evolution.