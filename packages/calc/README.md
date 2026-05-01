# @retirement/calc

Pure retirement-math library — no React, no DOM, no I/O. Safe to consume from
any TypeScript/JavaScript context (web, Node CLI, server, etc.).

## API

```ts
import { targetNestEgg, projectBalances, formatCurrency } from '@retirement/calc';
```

- `targetNestEgg(annualSpending, withdrawalRate?)` — 4% rule target
- `projectBalances({ currentSavings, annualSavings, annualReturn, target, maxYears? })`
- `formatCurrency(n)` — locale-formatted USD string

## Scripts

- `npm test` — run unit tests
- `npm run build` — emit `dist/` with `.js` + `.d.ts` (for publishing)
- `npm run typecheck`
