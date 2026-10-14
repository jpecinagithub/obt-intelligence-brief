import { describe, expect, it } from 'vitest';
import { balanceReconciles, dkkToEur, formatK, formatPct, netIncomeWaterfall, solvency, yoy } from '../lib/finance';
import { es, countriesEs } from '../data/es';
import { en, countriesEn } from '../data/en';
import type { FinancialYear } from '../data/types';

const years = es.finance.years;

describe('solvency', () => {
  it('computes equity/assets*100', () => {
    expect(solvency({ equity: 4618, assets: 36524 })).toBeCloseTo(12.64, 1);
  });
  it('matches the published series', () => {
    for (const y of years) {
      expect(solvency(y)).toBeCloseTo(y.solvency, 0);
    }
  });
  it('returns 0 for zero assets', () => {
    expect(solvency({ equity: 100, assets: 0 })).toBe(0);
  });
});

describe('yoy', () => {
  it('computes the 2024 gross-profit break (-82%)', () => {
    const v = yoy(1697, 9508);
    expect(v).toBeCloseTo(-82.15, 1);
  });
  it('returns null without a base', () => {
    expect(yoy(100, undefined)).toBeNull();
    expect(yoy(100, 0)).toBeNull();
  });
});

describe('netIncomeWaterfall', () => {
  it('accumulates to -1724 kDKK', () => {
    const wf = netIncomeWaterfall(years);
    expect(wf).toHaveLength(5);
    expect(wf[4].cumulative).toBe(-1724);
    expect(wf[0]).toEqual({ year: 2021, value: 1351, cumulative: 1351 });
  });
});

describe('balanceReconciles', () => {
  it('reconciles every published year (equity + debt + provisions = assets)', () => {
    for (const y of years) {
      expect(balanceReconciles(y)).toBe(true);
    }
  });
  it('detects a broken balance', () => {
    const broken: FinancialYear = { ...years[0], assets: years[0].assets + 100 };
    expect(balanceReconciles(broken)).toBe(false);
  });
});

describe('dkkToEur', () => {
  it('converts with a manual rate', () => {
    expect(dkkToEur(7460, 7.46)).toBeCloseTo(1000, 6);
  });
});

describe('formatting', () => {
  it('formats thousands per locale', () => {
    expect(formatK(36524, 'es')).toBe('36.524');
    expect(formatK(36524, 'en')).toBe('36,524');
  });
  it('formats percents per locale', () => {
    expect(formatPct(12.6, 'es')).toContain('12,6');
    expect(formatPct(12.6, 'en')).toContain('12.6');
  });
});

describe('dataset integrity', () => {
  it('keeps both locales structurally aligned', () => {
    expect(en.finance.years).toHaveLength(es.finance.years.length);
    expect(en.sierraLeone.tabs.map((t: { id: string }) => t.id)).toEqual(
      es.sierraLeone.tabs.map((t: { id: string }) => t.id),
    );
    expect(en.nav.sections.map((s: { id: string }) => s.id)).toEqual(es.nav.sections.map((s: { id: string }) => s.id));
  });
  it('lists 34 countries per locale', () => {
    expect(countriesEs).toHaveLength(34);
    expect(countriesEn).toHaveLength(34);
    expect(new Set(countriesEs.map((c) => c.id)).size).toBe(34);
  });
});
