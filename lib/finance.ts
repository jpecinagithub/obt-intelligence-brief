import type { FinancialYear } from '../data/types';

/** Solvencia = patrimonio / activos * 100 */
export function solvency(y: Pick<FinancialYear, 'equity' | 'assets'>): number {
  if (y.assets === 0) return 0;
  return (y.equity / y.assets) * 100;
}

/** Variación interanual en %; null si no hay base */
export function yoy(current: number, previous: number | undefined): number | null {
  if (previous === undefined || previous === 0) return null;
  return ((current - previous) / Math.abs(previous)) * 100;
}

/** Waterfall del resultado neto: [{year, value, cumulative}] */
export function netIncomeWaterfall(years: FinancialYear[]): { year: number; value: number; cumulative: number }[] {
  let acc = 0;
  return years.map((y) => {
    acc += y.netIncome;
    return { year: y.year, value: y.netIncome, cumulative: acc };
  });
}

/** Reconciliación del balance: patrimonio + deuda + provisiones === activos (tolerancia 1 kDKK) */
export function balanceReconciles(y: FinancialYear, tolerance = 1): boolean {
  return Math.abs(y.equity + y.debtExProvisions + y.provisions - y.assets) <= tolerance;
}

/** Conversión kDKK -> kEUR con tipo manual */
export function dkkToEur(kdkk: number, rate: number): number {
  return kdkk / rate;
}

/** Formato compacto: 36524 -> "36.524" (es) */
export function formatK(value: number, locale: 'es' | 'en'): string {
  return new Intl.NumberFormat(locale === 'es' ? 'es-ES' : 'en-GB').format(value);
}

export function formatPct(value: number, locale: 'es' | 'en', digits = 1): string {
  return new Intl.NumberFormat(locale === 'es' ? 'es-ES' : 'en-GB', {
    style: 'percent',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value / 100);
}
