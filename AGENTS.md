# Agent Instructions

This file gives coding agents (GitHub Copilot, Claude, Cursor, etc.) the
project-specific rules they must follow when making changes.

## Architecture rule: keep calculations out of the UI

This repo is an **npm-workspaces monorepo** with the boundary enforced
*structurally* by package layout:

```
packages/
  calc/   ← @retirement/calc — pure TS library, NO React, NO DOM, NO I/O
  web/    ← @retirement/web  — React + Vite UI, depends on @retirement/calc
```

### Hard rules

1. **`packages/calc/` must not import React, ReactDOM, the DOM, `fetch`,
   `window`, or `document`.** It must remain consumable from any TS/JS
   environment (web, Node CLI, server, mobile). Its `package.json` does
   not list React as a dependency — keep it that way.

2. **`packages/web/` must not contain numeric business logic.** No domain
   arithmetic, no hard-coded financial constants (e.g. `0.04`, `25`),
   no recomputing values that `@retirement/calc` already returns. The UI
   reads input, calls `@retirement/calc`, renders the result.

3. **All retirement math, projections, formulas, and domain types live
   in `@retirement/calc`** with unit tests next to them
   (`packages/calc/src/*.test.ts`).

### Concretely, when adding a feature

- New math, rule, or formula → add or extend a function in
  `packages/calc/src/index.ts`, export it from the package, and add a
  test in `packages/calc/src/index.test.ts`.
- New input field, chart, or layout → edit files in `packages/web/src/`
  and call the calc function via `import { … } from '@retirement/calc'`.
  Do not inline the math.
- If you find yourself typing `*`, `/`, `**`, or a magic financial
  constant inside a `.tsx` file, **stop** and move it to `@retirement/calc` first.

## Testing rules

1. **New features must ship with basic tests.**
   - New or extended functions in `@retirement/calc` → add unit tests in
     `packages/calc/src/index.test.ts` covering the happy path and at
     least one edge case (zero/negative inputs, unreachable targets,
     boundary values, etc.).
   - New UI behavior in `@retirement/web` (new input fields, derived
     summary tiles, conditional rendering, user interactions that
     change displayed values) → add a test in
     `packages/web/src/App.test.tsx` using `@testing-library/react` +
     `userEvent` that exercises the interaction and asserts the
     visible outcome.
   - Tests live next to the code (`*.test.ts` / `*.test.tsx`) and must
     pass via `npm test` from the repo root.

2. **Bug fixes should add a regression test when appropriate.** If a
   bug is fixed and can be easily verified with a test, make sure to
   add a test along with the bug fix.

### Quick self-check before finishing a change

- [ ] `packages/calc/package.json` still has no React/DOM dependencies.
- [ ] No `import` from `react` (or any DOM/browser API) appears under
      `packages/calc/`.
- [ ] No domain arithmetic or magic financial constants appear under
      `packages/web/src/` in `.tsx` files.
- [ ] Any new calc function has a corresponding test in
      `packages/calc/src/index.test.ts`.
- [ ] Any new UI behavior has a corresponding test in
      `packages/web/src/App.test.tsx`.
- [ ] If this change fixes a bug, a regression test is included when
      it can be easily verified with one.
- [ ] `npm test` and `npm run build` (run from the repo root) both pass.

## Commands

Run from the repo root:

- Install: `npm install`
- Dev server: `npm run dev` (runs `@retirement/web`)
- Tests (all packages): `npm test`
- Build (calc lib, then web app): `npm run build`
- Typecheck (all packages): `npm run typecheck`

Per-package: `npm <script> -w @retirement/calc` or `-w @retirement/web`.
