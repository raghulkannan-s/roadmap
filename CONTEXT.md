# Project Context & Coding Conventions

> This file defines the coding standards, patterns, and conventions for the AI Roadmap & Todo Generator project. All code contributions — human or AI — must follow these rules.

---

## 1. General Principles

- **Readability first.** Code should read like well-written prose. If you need a comment to explain *what* the code does, the code is too complex — refactor it.
- **Single Responsibility.** Every file, function, and component does ONE thing well.
- **DRY but not over-abstracted.** Extract common logic only when it's used 3+ times. Premature abstraction is worse than duplication.
- **Fail fast, fail loud.** Validate inputs early. Throw meaningful errors. Never silently swallow failures.
- **No magic values.** Use named constants for any non-obvious number or string.

---

## 2. File & Folder Naming

| Type | Convention | Example |
|------|-----------|---------|
| Components | `kebab-case.tsx` | `prompt-input.tsx` |
| Hooks | `use-kebab-case.ts` | `use-local-storage.ts` |
| Utilities | `kebab-case.ts` | `storage.ts` |
| Types | `types.ts` (co-located or in `lib/`) | `lib/types.ts` |
| Constants | `constants.ts` | `lib/constants.ts` |
| Pages | `page.tsx` (Next.js App Router) | `app/page.tsx` |
| API Routes | `route.ts` (Next.js App Router) | `app/api/generate/route.ts` |

---

## 3. TypeScript

- **Strict mode ON.** No `any` unless absolutely unavoidable (and then add a `// TODO: fix type` comment).
- **Interfaces over types** for object shapes. Use `type` for unions, intersections, and utility types.
- **Export types explicitly.** Use `export interface` / `export type` — no default exports for types.
- **Name interfaces with PascalCase**, no `I` prefix.

```typescript
// ✅ Good
export interface Roadmap {
  id: string;
  title: string;
  phases: Phase[];
}

// ❌ Bad
export type IRoadmap = { ... }
export default interface Roadmap { ... }
```

---

## 4. React Components

### Structure

Every component file follows this order:

```typescript
// 1. Imports (external → internal → types → styles)
// 2. Constants (if component-specific)
// 3. TypeScript interface for props
// 4. Component function (named export)
// 5. Sub-components (if small and tightly coupled)
```

### Rules

- **Named exports only.** No `export default` for components.

```typescript
// ✅ Good
export function PromptInput({ onSubmit }: PromptInputProps) { ... }

// ❌ Bad
export default function PromptInput() { ... }
```

- **Exception:** Next.js `page.tsx` and `layout.tsx` files MUST use `export default` (framework requirement).

- **Props interface** named `{ComponentName}Props`, defined directly above the component.

```typescript
interface PromptInputProps {
  onSubmit: (prompt: string, mode: GenerationMode) => void;
  isLoading: boolean;
}

export function PromptInput({ onSubmit, isLoading }: PromptInputProps) { ... }
```

- **Destructure props** in the function signature.
- **Keep components under 80 lines.** If it's longer, extract sub-components or hooks.
- **No inline styles.** Use Tailwind classes exclusively.
- **Use semantic HTML.** `<button>` not `<div onClick>`. `<section>` not `<div>`.

---

## 5. Hooks

- Prefix with `use`.
- One hook per file.
- Return an object (not an array) when returning 3+ values.

```typescript
// ✅ Good
export function useGeneration() {
  return { data, isLoading, error, generate };
}

// ❌ Bad — too many positional values
export function useGeneration() {
  return [data, isLoading, error, generate];
}
```

---

## 6. State Management

- **Local state (`useState`)** for component-specific UI state.
- **React Context** for shared state that crosses 2+ component boundaries (e.g., generated result, theme).
- **No external state libraries** (no Redux, Zustand, etc.) — the app is simple enough without them.
- **Context structure:**

```typescript
// context/generation-context.tsx

interface GenerationContextValue {
  result: Roadmap | TodoList | null;
  setResult: (result: Roadmap | TodoList | null) => void;
  mode: GenerationMode;
  setMode: (mode: GenerationMode) => void;
}
```

---

## 7. API Routes

- **One route per file.** Each file exports named HTTP method handlers.
- **Validate request body** at the top of the handler using type guards.
- **Return consistent response shapes.**

```typescript
// ✅ Success
return NextResponse.json({ success: true, data: result });

// ✅ Error
return NextResponse.json({ success: false, error: "Invalid prompt" }, { status: 400 });
```

- **Never expose API keys.** All AI calls happen server-side in API routes.

---

## 8. Error Handling

- **API routes:** Always wrap in try/catch. Return structured error responses.
- **Client-side:** Show user-friendly toast messages. Log technical details to console.
- **Never use empty catch blocks.**

```typescript
// ✅ Good
try {
  const data = await generateWithAI(prompt);
  return NextResponse.json({ success: true, data });
} catch (error) {
  console.error("[API] Generation failed:", error);
  return NextResponse.json(
    { success: false, error: "Failed to generate. Please try again." },
    { status: 500 }
  );
}
```

---

## 9. Tailwind & Styling

- **Use the `cn()` utility** (from `lib/utils.ts`) for conditional classes.
- **Group Tailwind classes** logically: layout → sizing → spacing → typography → colors → effects.
- **Extract repeated class patterns** into component-level constants.

```typescript
// ✅ Good
const cardStyles = "flex flex-col gap-4 p-6 rounded-xl bg-white shadow-sm border";

// ✅ Conditional
<div className={cn("px-4 py-2 rounded-lg", isActive && "bg-blue-500 text-white")} />
```

- **No `@apply` in CSS.** Keep all styles in JSX via Tailwind classes.
- **Responsive:** Mobile-first. Use `sm:`, `md:`, `lg:` breakpoints.

---

## 10. localStorage

- **All localStorage access goes through `lib/storage.ts`.** No direct `localStorage.getItem()` calls in components.
- **Always wrap in try/catch** (localStorage can throw in private browsing).
- **Use SSR-safe checks** (`typeof window !== "undefined"`).
- **JSON parse/stringify** with validation — never trust stored data blindly.

---

## 11. Naming Conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| Variables / functions | `camelCase` | `isLoading`, `handleSubmit` |
| Components | `PascalCase` | `PromptInput`, `RoadmapView` |
| Interfaces / Types | `PascalCase` | `Roadmap`, `GenerationMode` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_PROMPT_LENGTH`, `STORAGE_KEYS` |
| Event handlers | `handle{Event}` | `handleClick`, `handleSubmit` |
| Booleans | `is/has/should` prefix | `isLoading`, `hasError`, `shouldAnimate` |
| Files | `kebab-case` | `prompt-input.tsx`, `use-generation.ts` |

---

## 12. Imports Order

Enforce this order with blank lines separating each group:

```typescript
// 1. React / Next.js
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 2. External libraries
import { v4 as uuidv4 } from "uuid";

// 3. Internal components
import { PromptInput } from "@/components/prompt-input";
import { Button } from "@/components/ui/button";

// 4. Hooks, utils, constants
import { useGeneration } from "@/hooks/use-generation";
import { cn } from "@/lib/utils";
import { STORAGE_KEYS } from "@/lib/constants";

// 5. Types (import type)
import type { Roadmap, GenerationMode } from "@/lib/types";
```

---

## 13. Comments

- **Don't comment *what*. Comment *why*.**
- **JSDoc** for exported functions and complex utilities.
- **TODO format:** `// TODO: description` — no names or dates.
- **No commented-out code.** Delete it. Git has history.

```typescript
// ✅ Good — explains WHY
// Gemini sometimes wraps JSON in markdown code fences, so we strip them
const cleanJson = raw.replace(/```json?\n?/g, "").replace(/```/g, "");

// ❌ Bad — explains WHAT (obvious from the code)
// Set loading to true
setLoading(true);
```

---

## 14. Git Commits

- **Conventional commits:** `feat:`, `fix:`, `refactor:`, `style:`, `docs:`, `chore:`
- **Present tense, imperative mood:** "add prompt input" not "added prompt input"
- **One logical change per commit.**

```
feat: add prompt input with mode toggle
fix: handle empty AI response gracefully
refactor: extract storage helpers into lib/storage.ts
style: improve roadmap card spacing on mobile
docs: add setup instructions to README
```

