import { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { targetNestEgg, projectBalances, formatCurrency } from '@retirement/calc';

const RETURN_PRESETS = {
  conservative: 0.04,
  median: 0.07,
  aggressive: 0.10,
};

function returnLabel(rate: number): string {
  if (rate <= 0.05) return 'Conservative';
  if (rate <= 0.085) return 'Median';
  return 'Aggressive';
}

export default function App() {
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [annualSpending, setAnnualSpending] = useState(50000);
  const [annualSavings, setAnnualSavings] = useState(20000);
  const [returnRate, setReturnRate] = useState(RETURN_PRESETS.median);

  const target = useMemo(() => targetNestEgg(annualSpending), [annualSpending]);

  const { series, yearsToTarget } = useMemo(
    () =>
      projectBalances({
        currentSavings,
        annualSavings,
        annualReturn: returnRate,
        target,
      }),
    [currentSavings, annualSavings, returnRate, target]
  );

  return (
    <div className="app">
      <h1>Retirement Calculator</h1>
      <p className="subtitle">
        Estimate when you can retire using the 4% rule.
      </p>

      <div className="grid">
        <section className="card" aria-label="Inputs">
          <div className="field">
            <label htmlFor="current">Current savings</label>
            <input
              id="current"
              type="number"
              min="0"
              step="1000"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(Number(e.target.value) || 0)}
            />
          </div>

          <div className="field">
            <label htmlFor="spending">Target annual retirement spending</label>
            <input
              id="spending"
              type="number"
              min="0"
              step="1000"
              value={annualSpending}
              onChange={(e) => setAnnualSpending(Number(e.target.value) || 0)}
            />
            <div className="hint">
              4% rule target: <strong>{formatCurrency(target)}</strong>
            </div>
          </div>

          <div className="field">
            <label htmlFor="savings">Annual savings (per year)</label>
            <input
              id="savings"
              type="number"
              min="0"
              step="500"
              value={annualSavings}
              onChange={(e) => setAnnualSavings(Number(e.target.value) || 0)}
            />
          </div>

          <div className="field">
            <label htmlFor="return">
              Expected annual return: {(returnRate * 100).toFixed(1)}% —{' '}
              {returnLabel(returnRate)}
            </label>
            <input
              id="return"
              type="range"
              min="2"
              max="12"
              step="0.1"
              value={(returnRate * 100).toFixed(1)}
              onChange={(e) => setReturnRate(Number(e.target.value) / 100)}
            />
            <div className="return-presets">
              <span>Conservative (4%)</span>
              <span>Median (7%)</span>
              <span>Aggressive (10%)</span>
            </div>
          </div>
        </section>

        <section className="card" aria-label="Summary">
          <h2 style={{ marginTop: 0 }}>Outlook</h2>
          <div className="summary">
            <div className="metric">
              <div className="label">Target nest egg</div>
              <div className="value">{formatCurrency(target)}</div>
            </div>
            <div className="metric">
              <div className="label">Years to retirement</div>
              <div className="value" data-testid="years-to-target">
                {yearsToTarget === null ? '—' : `${yearsToTarget} yr`}
              </div>
            </div>
            <div className="metric">
              <div className="label">Projected balance at target</div>
              <div className="value">
                {yearsToTarget === null
                  ? '—'
                  : formatCurrency(
                      series.find((p) => p.year === yearsToTarget)?.balance ?? 0
                    )}
              </div>
            </div>
            <div className="metric">
              <div className="label">Assumed return</div>
              <div className="value">{(returnRate * 100).toFixed(1)}%</div>
            </div>
          </div>

          {yearsToTarget === null && (
            <div className="notice">
              At this savings rate and return, you won't reach your target
              within 80 years. Try increasing savings or your expected return.
            </div>
          )}
        </section>
      </div>

      <section className="card chart-card" aria-label="Projection chart">
        <h2 style={{ marginTop: 0 }}>Projected balance over time</h2>
        <div style={{ width: '100%', height: 360 }}>
          <ResponsiveContainer>
            <LineChart data={series} margin={{ top: 10, right: 60, bottom: 40, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="year"
                label={{ value: 'Years', position: 'insideBottom', offset: -25 }}
              />
              <YAxis
                tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                width={70}
              />
              <Tooltip
                formatter={(v: number) => formatCurrency(v)}
                labelFormatter={(l: number) => `Year ${l}`}
              />
              <Legend verticalAlign="bottom" wrapperStyle={{ bottom: 0 }} />
              <ReferenceLine
                y={target}
                stroke="#dc2626"
                strokeDasharray="4 4"
                label={{ value: 'Target', position: 'insideTopRight', fill: '#dc2626' }}
              />
              <Line
                type="monotone"
                dataKey="balance"
                name="Portfolio balance"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="contributions"
                name="Total contributed"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
