// Core retirement math (the 4% rule).

// Target nest egg using the 4% safe withdrawal rate:
// targetSpending / 0.04  ==  targetSpending * 25
export function targetNestEgg(annualSpending, withdrawalRate = 0.04) {
  if (annualSpending <= 0) return 0;
  return annualSpending / withdrawalRate;
}

// Project balances year-by-year, contributing `annualSavings` at the end of
// each year and growing by `annualReturn` (e.g. 0.07 for 7%).
// Returns an array of { year, balance, contributions, target }.
// `maxYears` caps the projection so we don't loop forever for unreachable goals.
export function projectBalances({
  currentSavings,
  annualSavings,
  annualReturn,
  target,
  maxYears = 80,
}) {
  const series = [
    { year: 0, balance: currentSavings, contributions: currentSavings, target },
  ];

  let balance = currentSavings;
  let contributions = currentSavings;
  let yearsToTarget = currentSavings >= target ? 0 : null;

  for (let year = 1; year <= maxYears; year++) {
    balance = balance * (1 + annualReturn) + annualSavings;
    contributions += annualSavings;
    series.push({
      year,
      balance: Math.round(balance),
      contributions: Math.round(contributions),
      target,
    });
    if (yearsToTarget === null && balance >= target) {
      yearsToTarget = year;
    }
    // Continue a few years past target so the chart shows the crossover.
    if (yearsToTarget !== null && year >= yearsToTarget + 5) break;
    if (yearsToTarget === null && year === maxYears) break;
  }

  return { series, yearsToTarget };
}

export function formatCurrency(n) {
  if (!isFinite(n)) return '—';
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
}
