---
name: localelore-sandbox
description: >-
  Provides step-by-step instructions to quickly initialize, sandbox, build, and test the LocaleLore GenAI Travel platform inside a separate project subdirectory, sandboxed from the parent codebase.
---

# LocaleLore Sandbox Dev Skill

## Overview
This skill provides a fast, repeatable protocol for initializing and sandboxing **LocaleLore**—the PromptWars winning GenAI Travel Platform—into a separate project subdirectory without modifying or corrupting the parent codebase. It outlines the exact file schemas, prompts, API routes, and configuration adjustments (ESLint and strict TypeScript null checks) required to compile successfully and run the test suite.

## Dependencies
- `@google/generative-ai`
- `zod`
- `next`
- `tailwindcss`
- `vitest`

## Quick Start
To spin up a new sandboxed travel platform in the `localelore` subdirectory:
1. Copy baseline Next.js, Tailwind, and TypeScript configs from the root (excluding build/git assets).
2. Create the travel schemas (`lib/types.ts`, `lib/validation/input.ts`, `lib/validation/output.ts`, `lib/gemini/schema.ts`).
3. Set up the API route (`app/api/generate-travel/route.ts`) and styling (`app/globals.css`).
4. Generate the UI components (`components/form/DestinationPreferencesForm.tsx`, `components/results/PlanDashboard.tsx`, etc.).
5. Run the local tests and verification.

---

## Workflow

### 1. Project Directory Initialization
Create a subdirectory `localelore/` and copy configuration files:
```bash
mkdir -p localelore
rsync -av --exclude="node_modules" --exclude=".next" --exclude=".git" --exclude="localelore" ./ localelore/
```
In `localelore/package.json`, update the package `name` to `"localelore"` and update the `description`.

### 2. Sandbox Configuration Fixes
To prevent nested compiler and linter collisions:
- **ESLint**: In `localelore/.eslintrc.json`, add `"root": true` to stop ESLint from checking parent configurations.
- **Vitest**: In `localelore/vitest.config.ts`, resolve `setupFiles` absolutely using:
  `setupFiles: [fileURLToPath(new URL("./tests/setup.ts", import.meta.url))]`
- **TypeScript**: Ensure the tsconfig handles `@/*` pointing to `./*` relative to the subfolder.

### 3. Establish Travel Schemas
Write the Zod schemas and types:
- `lib/types.ts`: Define `TravelContext`, `Attraction`, `WalkingRoute`, `TimelineSlot`, `LanguagePhrase`, and API contracts.
- `lib/validation/input.ts`: Input validation schema (`travelContextSchema`) specifying limits.
- `lib/validation/output.ts`: Output validation schema (`rawTravelPlanSchema`) specifying array minimum bounds (e.g. `timeline` min 3).
- `lib/gemini/schema.ts`: Define the Google GenAI SDK JSON `Schema` properties matching the Zod structures.

### 4. Build AI Integration
- `lib/gemini/prompt.ts`: Set up the master travel storytelling system prompt, guide avatars (Anya, Marcus, Kavi), and the self-repair template.
- `lib/gemini/client.ts`: Handle structured content calls, timeouts (20s), code fence stripping, Zod parsing, and error classification.

### 5. Setup Budget Math
- `lib/budget/computeFeasibility.ts`: Implement `computeTravelFeasibility` which sums:
  `attractionsCost + foodCost + artisanCost`
  Compare the sum against budget limits, and mark it `"revised_to_fit"` if the recomputed cost is less than what the AI proposed.

### 6. Create UI Components
- `components/form/DestinationPreferencesForm.tsx`: Guide selection cards, inputs, and strict client validation with loading button disabled status.
- `components/results/PlanDashboard.tsx`: Coordinate results tabs (Overview, Timeline, Sights, Route, Customs).
- `components/results/Timeline.tsx`: Sequential timeline with checkboxes tracking completion progress.
- `components/results/WalkingRouteMap.tsx`: Plot route dots and construct/animate the SVG path dynamically in React.

### 7. Run Verification & Compile
Verify the project builds and all tests pass:
```bash
cd localelore
npm install
npm test
npm run build
```

---

## Common Mistakes

1. **Strict Null Checks in Timeline Grouping**
   - *Pitfall*: Grouping timeline slots with `acc[slot.dayNumber].push(slot)` triggers a compilation error.
   - *Fix*: Use the non-null assertion `acc[slot.dayNumber]!.push(slot)`.

2. **Vitest Relative Path Resolution**
   - *Pitfall*: Specifying relative string paths in `setupFiles` resolves to the parent root workspace and crashes.
   - *Fix*: Resolve setup file paths absolutely using `import.meta.url` and `fileURLToPath`.

3. **ESLint Inheritance Conflicts**
   - *Pitfall*: Production builds fail with `@next/next` conflicts between nested lint configurations.
   - *Fix*: Declare `"root": true` in `localelore/.eslintrc.json` to isolate the project scope.
