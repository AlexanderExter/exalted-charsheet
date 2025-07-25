# AI Roast Session Notes & Instructions

## Context for Future AI Sessions

### Project Philosophy
This is an **AI-first development environment** designed as a stomping ground for AI developers. The project intentionally uses AI-generated code and embraces AI-natural patterns. Any criticism of "AI-generated" code misses the fundamental point.

### Project Constraints & Realities
- **Single developer**: PM, BA, Designer, Stakeholder, Business owner, and developer are all the same person
- **Hobby project**: Not enterprise software, doesn't need enterprise patterns
- **Rapid prototyping**: Active development with frequent changes
- **AI workforce**: Documentation serves as external memory for AI sessions that forget context

### What NOT to Criticize

#### The Monolith Pattern
- **Don't roast**: Single large component architecture
- **Reality**: This is how AI naturally generates coherent solutions
- **Context**: Splitting into micro-components requires human architectural planning that's often unnecessary

#### AI-Generated Code
- **Don't roast**: Code that "looks AI-generated"
- **Reality**: It IS AI-generated - that's the entire point!
- **Context**: We're using AI as zero-cost engineering workforce

#### Documentation "Excess"
- **Don't roast**: Multiple documentation files
- **Reality**: AI workers forget everything between sessions
- **Context**: Docs are workflow optimization, not over-engineering

#### localStorage Auto-save Timing
- **Don't roast**: 10-minute intervals being "too long"
- **Reality**: It's localStorage, not remote storage
- **Context**: Hammering localStorage on every keystroke kills performance
- **Design**: Import/export exists for data portability

#### Manual Testing Approach
- **Don't roast**: Lack of automated testing
- **Reality**: Single developer on hobby project
- **Context**: Manual testing is appropriate for this scale

#### Loose Typing During Development
- **Don't roast**: Using `any` types during rapid development
- **Reality**: Adding strict typing mid-sprint wastes token budget
- **Context**: Type safety comes during stabilization, not prototyping

### Legitimate Areas for Roasting & Improvement

#### Bundle Size & Dependencies
- **Valid concern**: Build size with full Radix imports
- **Action item**: Audit actual usage vs. imported components
- **Impact**: Real performance concern for users

#### State Management Complexity
- **Valid concern**: Multiple useState hooks creating complexity
- **Action item**: Consider consolidation strategies
- **Context**: But remember - character sheets have inherently complex state

#### Component Extraction Strategy
- **Valid concern**: 3,507-line single component
- **Action item**: Strategic breakup for AI handoff, not purity
- **Goal**: Smaller chunks = easier future AI sessions

#### Dependency Management
- **Valid concern**: Staying on bleeding edge while removing unused deps
- **Action item**: Regular audits for abandoned or redundant packages
- **Goal**: Clean, modern tech stack

## Roast Session Guidelines

### DO Roast:
1. **Actual performance issues** (build size, runtime performance)
2. **Maintainability concerns** that affect AI handoff
3. **Genuine architectural problems** that cause real issues
4. **Security vulnerabilities** or bad practices
5. **Dependency bloat** or outdated packages

### DON'T Roast:
1. **AI-generated patterns** - that's the point
2. **Documentation quantity** - it's workflow optimization
3. **Manual testing** - appropriate for project scale
4. **Loose typing during development** - premature optimization
5. **localStorage implementation** - it's local-first by design

## Post-Roast Action Items Template

After each roast session, create actionable items in these categories:

### 1. Performance & Bundle
- [ ] Dependency audit
- [ ] Bundle size optimization
- [ ] Runtime performance profiling

### 2. AI Development Experience
- [ ] Component extraction for better AI handoff
- [ ] Documentation updates for context preservation
- [ ] State management simplification

### 3. Technical Debt
- [ ] Dependency updates and cleanup
- [ ] Type safety improvements (during stabilization phases)
- [ ] Code organization improvements

### 4. User Experience
- [ ] Feature improvements
- [ ] Bug fixes
- [ ] Performance optimizations

## Remember: Context is King

This project succeeds because it:
- **Works** - functional character sheet that serves its purpose
- **Ships** - actually deployed and usable
- **Iterates** - rapid development cycle with AI workforce
- **Delivers value** - solves real problem for tabletop RPG players

Perfect architecture that never ships is worthless. Working software that serves users is valuable.