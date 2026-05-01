import { describe, it, expect } from 'vitest';
import { targetNestEgg, projectBalances, formatCurrency } from './calc';

describe('targetNestEgg (4% rule)', () => {
  it('returns 25x annual spending', () => {
    expect(targetNestEgg(40000)).toBe(1000000);
    expect(targetNestEgg(50000)).toBe(1250000);
  });

  it('returns 0 for non-positive spending', () => {
    expect(targetNestEgg(0)).toBe(0);
    expect(targetNestEgg(-5000)).toBe(0);
  });

  it('respects a custom withdrawal rate', () => {
    expect(targetNestEgg(40000, 0.05)).toBe(800000);
  });
});

describe('projectBalances', () => {
  it('reports 0 years when already at target', () => {
    const { yearsToTarget } = projectBalances({
      currentSavings: 1_500_000,
      annualSavings: 0,
      annualReturn: 0.07,
      target: 1_250_000,
    });
    expect(yearsToTarget).toBe(0);
  });

  it('grows the balance by the expected return + contributions', () => {
    const { series } = projectBalances({
      currentSavings: 1000,
      annualSavings: 100,
      annualReturn: 0.10,
      target: 10_000_000,
      maxYears: 2,
    });
    // Year 1: 1000 * 1.10 + 100 = 1200
    // Year 2: 1200 * 1.10 + 100 = 1420
    expect(series[1].balance).toBe(1200);
    expect(series[2].balance).toBe(1420);
  });

  it('finds the year the target is first reached', () => {
    const { yearsToTarget } = projectBalances({
      currentSavings: 50_000,
      annualSavings: 20_000,
      annualReturn: 0.07,
      target: 1_250_000,
    });
    expect(yearsToTarget).toBeGreaterThan(0);
    expect(yearsToTarget).toBeLessThan(60);
  });

  it('returns null years when target is unreachable', () => {
    const { yearsToTarget } = projectBalances({
      currentSavings: 0,
      annualSavings: 0,
      annualReturn: 0.07,
      target: 1_000_000,
    });
    expect(yearsToTarget).toBeNull();
  });
});

describe('formatCurrency', () => {
  it('formats whole-dollar USD', () => {
    expect(formatCurrency(1234)).toBe('$1,234');
    expect(formatCurrency(1_250_000)).toBe('$1,250,000');
  });
});
