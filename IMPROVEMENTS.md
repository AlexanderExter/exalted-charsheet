# Modernization Improvements for Exalted Character Manager

This document outlines recommended improvements now that we're on the latest dependency versions.

---

## 📚 Documentation Updates (High Priority)

### README.md - Outdated Version Badges

**Current:**
```markdown
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.4.3-black.svg)](https://nextjs.org/)
```

**Should be:**
```markdown
[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://react.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-16.0.0-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
```

### Technical Stack Section

**Current mentions:**
- "Framework: Next.js 15 (App Router)"
- "Build: Turbopack (dev), Next.js (prod)"

**Should update to:**
- "Framework: Next.js 16 (App Router)"
- "Build: Turbopack (default bundler)"
- Add: "Forms: React Hook Form v7 with @hookform/resolvers v5"
- Add: "Drag & Drop: @dnd-kit v10"

### Prerequisites Update

**Current:** "Node.js 18+"

**Should be:** "Node.js 20.9+" (Next.js 16 requirement)

---

## ⚛️ React 19 Modern Patterns

### 1. Use React 19's `use()` Hook for Promises

**Current Pattern:**
```tsx
const [data, setData] = useState(null);
useEffect(() => {
  fetchData().then(setData);
}, []);
```

**Modern React 19 Pattern:**
```tsx
import { use } from 'react';

function Component() {
  const data = use(fetchData());  // Suspends until resolved
}
```

**Where to apply:**
- `hooks/useCharacterStore.ts` - loadCharacters method
- `lib/db.ts` - All Dexie operations

### 2. Error Boundaries with React 19

**Current:** Class-based ErrorBoundary (components/ErrorBoundary.tsx)

**React 19 allows:** More declarative error handling with `use()` + Suspense

**Recommendation:** Keep current implementation (still best practice), but consider adding Suspense boundaries for async operations.

### 3. Actions & Form Actions

**Opportunity:** React 19's `useActionState` for form submissions

**Current:** React Hook Form with manual submission

**Potential Enhancement:**
```tsx
import { useActionState } from 'react';

function CharacterForm() {
  const [state, formAction] = useActionState(async (prevState, formData) => {
    // Server action or client action
    return await updateCharacter(formData);
  });

  return <form action={formAction}>...</form>;
}
```

**Recommendation:** Keep React Hook Form for complex forms, but consider `useActionState` for simple forms.

---

## 📝 Form Patterns with @hookform/resolvers v5

### 1. Leverage Type Inference Everywhere

**Already done:** `components/forms/DicePoolEditor.tsx`

**To apply to:**
- Any future forms using `useForm()`
- Remove explicit type parameters, let Zod schemas infer types

### 2. Form Composition Pattern

**Current:** Nested FormField components

**Enhancement:** Extract reusable field components

```tsx
// components/forms/fields/AttributeField.tsx
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';

export const AttributeField = ({ name, label }: { name: string; label: string }) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} type="number" min={0} max={5} />
          </FormControl>
        </FormItem>
      )}
    />
  );
};
```

---

## 🎯 Performance Optimizations

### 1. Reduce Unnecessary Memoization

**Current:** 81 instances of React.memo/useMemo/useCallback

**Issue:** Over-optimization can hurt performance

**Recommendation:** Profile and remove unnecessary memoization in:
- Components that rarely re-render
- Simple calculations (cheaper than memoization overhead)
- Components with no props

**Example - Remove unnecessary memo:**
```tsx
// BEFORE (unnecessary)
export const SimpleButton = React.memo(({ onClick }: Props) => (
  <button onClick={onClick}>Click</button>
));

// AFTER
export const SimpleButton = ({ onClick }: Props) => (
  <button onClick={onClick}>Click</button>
);
```

### 2. Use React Compiler (Experimental)

**React 19 feature:** Automatic memoization via compiler

**Future consideration:** Once React Compiler is stable, remove manual memoization

---

## 🏗️ Component Architecture

### 1. Server Components Where Possible

**Current:** Everything is "use client"

**Opportunity:** Some components could be Server Components in Next.js 16

**Candidates:**
- `app/layout.tsx` - Could make SiteHeader/SiteFooter server components
- Static content components
- Non-interactive UI elements

**Example:**
```tsx
// app/components/StaticHeader.tsx (Server Component)
export default function StaticHeader() {
  return <header>Static content</header>;
}

// app/layout.tsx
import StaticHeader from './components/StaticHeader';
import ClientContent from './components/ClientContent';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <StaticHeader /> {/* Server Component */}
        <ClientContent>{children}</ClientContent> {/* Client Component */}
      </body>
    </html>
  );
}
```

### 2. Co-location Pattern

**Current:** Separate directories for different concerns

**Enhancement:** Co-locate related files

```
components/
  character-tabs/
    CoreStatsTab/
      CoreStatsTab.tsx
      CoreStatsTab.test.tsx
      useCoreSt ats.ts
      CoreStatsPanel.tsx
```

---

## 🔄 State Management Improvements

### 1. Zustand with Selectors

**Current:** Basic store usage

**Enhancement:** Use selectors to prevent unnecessary re-renders

```tsx
// BEFORE
const { characters, currentCharacter } = useCharacterStore();

// AFTER - Only subscribe to what you need
const characters = useCharacterStore(state => state.characters);
const currentCharacter = useCharacterStore(state => state.currentCharacter);
```

### 2. Computed Selectors

**Enhancement:** Move calculated values to store selectors

```tsx
// Add to useCharacterStore.ts
export const useCharacterStore = create<CharacterState>()(
  // ...middleware
  (set, get) => ({
    // ...existing state

    // Computed values
    get totalMotes() {
      const char = get().currentCharacter;
      return char ? calculateTotalMotes(char) : 0;
    },
  })
);

// Usage
const totalMotes = useCharacterStore(state => state.totalMotes);
```

---

## 🎨 Styling & UI Improvements

### 1. CSS Variables for Dynamic Theming

**Current:** Static Tailwind classes

**Enhancement:** Use CSS variables for character-specific colors

```tsx
// components/CharacterTheme.tsx
export const CharacterTheme = ({ character }: { character: Character }) => {
  const exaltType = character.exaltType;
  const colors = getExaltColors(exaltType);

  return (
    <div
      style={{
        '--exalt-primary': colors.primary,
        '--exalt-secondary': colors.secondary,
      } as React.CSSProperties}
    >
      {/* Content uses var(--exalt-primary) */}
    </div>
  );
};
```

### 2. Tailwind 4 Features

**Current:** Using basic Tailwind 4

**Opportunities:**
- Use container queries: `@container`
- Use new color functions
- Leverage performance improvements

---

## 🔐 Type Safety Enhancements

### 1. Discriminated Unions for Exalt Types

**Current:** string type for exaltType

**Enhancement:**
```tsx
// lib/character-types.ts
type SolarCharacter = {
  exaltType: 'solar';
  caste: 'dawn' | 'zenith' | 'twilight' | 'night' | 'eclipse';
  anima: SolarAnima;
};

type LunarCharacter = {
  exaltType: 'lunar';
  caste: 'full-moon' | 'changing-moon' | 'no-moon';
  anima: LunarAnima;
};

type Character = SolarCharacter | LunarCharacter | DragonBloodedCharacter;

// Now TypeScript knows which caste options based on exaltType
function renderCaste(char: Character) {
  if (char.exaltType === 'solar') {
    // char.caste is typed as Solar castes only
  }
}
```

### 2. Const Assertions for Static Data

**Current:**
```tsx
const attributes = [
  { key: "fortitude", label: "Fortitude" },
  // ...
];
```

**Enhancement:**
```tsx
const attributes = [
  { key: "fortitude", label: "Fortitude" },
  // ...
] as const;

type AttributeKey = typeof attributes[number]['key']; // "fortitude" | "finesse" | "force"
```

---

## 📦 Bundle Optimization

### 1. Dynamic Imports for Heavy Components

**Opportunity:** Markdown renderer only needed in modals

```tsx
// components/SiteFooter.tsx
import { lazy, Suspense } from 'react';

const ReactMarkdown = lazy(() => import('react-markdown'));

export default function SiteFooter() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </Suspense>
  );
}
```

### 2. Route-based Code Splitting

**Already done:** Next.js handles this automatically with App Router

---

## 🧪 Testing Infrastructure

### 1. Add Vitest for Unit Tests

**Currently:** No test infrastructure

**Recommendation:**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

**Example test:**
```tsx
// hooks/__tests__/useCharacterStore.test.ts
import { renderHook, act } from '@testing-library/react';
import { useCharacterStore } from '../useCharacterStore';

describe('useCharacterStore', () => {
  it('should add a character', () => {
    const { result } = renderHook(() => useCharacterStore());

    act(() => {
      result.current.addCharacter('Test Character');
    });

    expect(result.current.characters).toHaveLength(1);
    expect(result.current.characters[0].name).toBe('Test Character');
  });
});
```

### 2. Playwright for E2E Tests

**Recommendation:**
```bash
npm install -D @playwright/test
```

---

## 📱 Progressive Web App (PWA)

### 1. Add PWA Support

**Current:** Static web app

**Enhancement:** Make it installable

```ts
// next.config.ts
import withPWA from 'next-pwa';

const config = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})({
  output: 'export',
  // ...rest of config
});
```

---

## 🚀 Next.js 16 Specific Features

### 1. Partial Prerendering (Experimental)

**Feature:** Mix static and dynamic content

**Opportunity:** Static character sheet layout, dynamic character data

```tsx
// app/character/[id]/page.tsx
export const experimental_ppr = true;

export default function CharacterPage() {
  return (
    <>
      <StaticSheetLayout /> {/* Prerendered */}
      <Suspense fallback={<Skeleton />}>
        <DynamicCharacterData /> {/* Streamed */}
      </Suspense>
    </>
  );
}
```

### 2. Server Actions for Data Mutations

**Current:** Client-side Dexie operations

**Consideration:** If moving to server-backed storage, use Server Actions

---

## 🎯 Immediate High-Impact Changes (Priority Order)

1. **Update Documentation** (30 minutes)
   - Fix version badges
   - Update technical stack
   - Update Node.js requirement

2. **Add Zustand Selectors** (1 hour)
   - Prevent unnecessary re-renders
   - Immediate performance win

3. **Dynamic Import React-Markdown** (15 minutes)
   - Reduce initial bundle size
   - Only loads when modals open

4. **Remove Unnecessary Memoization** (2 hours)
   - Profile performance
   - Remove over-optimization
   - Cleaner code

5. **Add Basic Tests** (4 hours)
   - Vitest setup
   - Test critical paths
   - Foundation for future testing

---

## 🎓 Learning Resources

- [React 19 Release Notes](https://react.dev/blog/2024/04/25/react-19)
- [Next.js 16 Docs](https://nextjs.org/docs)
- [Zustand Best Practices](https://docs.pmnd.rs/zustand/guides/performance)
- [React Hook Form v7](https://react-hook-form.com/get-started)

---

**Last Updated:** 2025-10-23
**Dependencies Version:** Next.js 16.0.0, React 19.2.0, TypeScript 5.x
