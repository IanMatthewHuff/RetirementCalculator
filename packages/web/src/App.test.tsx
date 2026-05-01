import { describe, it, expect, beforeAll, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';

vi.mock('recharts', async () => {
  const actual = await vi.importActual<typeof import('recharts')>('recharts');
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: ReactNode }) => (
      <div style={{ width: 600, height: 360 }}>{children}</div>
    ),
  };
});

beforeAll(() => {
  global.ResizeObserver = class {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
});

import App from './App';

describe('App', () => {
  it('renders the headline and inputs', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /retirement calculator/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/current savings/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/target annual retirement spending/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/annual savings/i)).toBeInTheDocument();
  });

  it('shows the 4% target updating with spending input', async () => {
    const user = userEvent.setup();
    render(<App />);
    const spending = screen.getByLabelText(/target annual retirement spending/i);
    await user.clear(spending);
    await user.type(spending, '40000');
    expect(screen.getAllByText(/\$1,000,000/).length).toBeGreaterThan(0);
  });

  it('computes a non-empty years-to-target with default values', () => {
    render(<App />);
    const years = screen.getByTestId('years-to-target');
    expect(years.textContent).toMatch(/\d+\s*yr/);
  });
});
