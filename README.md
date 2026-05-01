# Retirement Calculator

A small React + Vite website for basic retirement planning using the **4% rule**.

## Features

- Enter your current savings, target annual retirement spending, and annual savings rate.
- Slide expected annual returns from conservative (4%) → median (7%) → aggressive (10%).
- See your **target nest egg** (25× annual spending) and **years to retirement**.
- Visualize the projected portfolio balance vs. total contributions over time.

## Repository layout

This is an npm-workspaces monorepo with two packages:

```
packages/
  calc/   ← @retirement/calc — pure retirement math (no UI deps)
  web/    ← @retirement/web  — the React + Vite website
```

The web app consumes the calc library as `@retirement/calc`, so the math
could later be reused by a CLI, server, or mobile app without changes.

## Getting started

```bash
npm install
npm run dev      # start the Vite dev server (web)
npm run build    # build calc lib, then web app
npm test         # run tests across all packages
```

Per-package commands also work, e.g. `npm test -w @retirement/calc`.

## Open in VS Code

The repo includes a `.vscode/` folder with tasks, launch configs, recommended extensions, and editor settings, so you can get going quickly:

```bash
code .              # open the project in VS Code
```

Once open, you have a few easy ways to launch the site:

- **Run task** (`Cmd/Ctrl+Shift+B`): runs `npm: dev` and starts the Vite dev server.
- **Run and Debug** (`F5`): pick *Launch Chrome against dev server* (or Edge) to start the dev server and open a browser with the debugger attached.
- **Debug Vitest tests**: from the Run and Debug panel, pick *Debug Vitest tests*.

On first open VS Code will offer to install the recommended extensions listed in `.vscode/extensions.json`.

## How the math works

- **Target**: `annualSpending / 0.04` (the 4% safe-withdrawal rule).
- **Projection**: each year, balance grows by the expected return and the annual savings amount is added at year-end. We report the first year the balance crosses the target.

## Notes

This is a starting point — more features (inflation, taxes, Monte Carlo, Social Security, etc.) will be added later.
