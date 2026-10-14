'use client';

import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Area,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from 'recharts';
import { useLang, useView } from '../providers';
import { EvidenceBadge, EvidenceDrawer, SectionHeading, useDrawer } from '../ui';
import { balanceReconciles, dkkToEur, formatK, formatPct, netIncomeWaterfall, yoy } from '@/lib/finance';
import type { FinancialYear } from '@/data/types';

const FX_DEFAULT = 7.46;

const metricKeys = ['grossProfit', 'ebit', 'netIncome', 'equity', 'assets', 'totalLiabilities', 'cash', 'employees'] as const;

export default function Finance() {
  const { t, lang } = useLang();
  const { selectedYear, setSelectedYear } = useView();
  const f = t.finance;
  const drawer = useDrawer();
  const [eur, setEur] = useState(false);
  const [rate, setRate] = useState(FX_DEFAULT);

  const conv = (v: number) => (eur ? dkkToEur(v, rate) : v);
  const unit = eur ? 'kEUR' : 'kDKK';

  const chartData = useMemo(
    () =>
      f.years.map((y) => ({
        year: String(y.year),
        grossProfit: Math.round(conv(y.grossProfit)),
        ebit: Math.round(conv(y.ebit)),
        netIncome: Math.round(conv(y.netIncome)),
        equity: Math.round(conv(y.equity)),
        assets: Math.round(conv(y.assets)),
        totalLiabilities: Math.round(conv(y.totalLiabilities)),
        raw: y,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [f.years, eur, rate],
  );

  const waterfall = useMemo(() => netIncomeWaterfall(f.years), [f.years]);

  const sel = f.years.find((y) => y.year === selectedYear) ?? null;
  const prev = sel ? f.years.find((y) => y.year === sel.year - 1) ?? null : null;

  const tooltipStyle = {
    backgroundColor: 'var(--color-marine-900)',
    color: '#fff',
    borderRadius: 8,
    fontSize: 12,
  };

  return (
    <section id="finanzas" aria-labelledby="finanzas-h" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14 sm:px-6">
      <SectionHeading id="finanzas-h" title={f.title} />
      <div className="mb-6 rounded-xl bg-red-600/10 p-4 text-sm font-bold text-red-900 ring-1 ring-red-600/30 dark:text-red-200" role="note">
        {f.banner}
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label={t.ui.year}>
          <YearPill active={selectedYear === null} onClick={() => setSelectedYear(null)} label={t.ui.all} />
          {f.years.map((y) => (
            <YearPill key={y.year} active={selectedYear === y.year} onClick={() => setSelectedYear(selectedYear === y.year ? null : y.year)} label={String(y.year)} />
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 text-sm">
          <button
            onClick={() => setEur(false)}
            aria-pressed={!eur}
            className={`rounded-lg px-3 py-1.5 font-bold ring-1 ${!eur ? 'bg-marine-900 text-white ring-marine-900 dark:bg-abyss-500' : 'text-slate-600 ring-slate-300 dark:text-slate-300'}`}
          >
            {t.ui.currencyDKK}
          </button>
          <button
            onClick={() => setEur(true)}
            aria-pressed={eur}
            className={`rounded-lg px-3 py-1.5 font-bold ring-1 ${eur ? 'bg-marine-900 text-white ring-marine-900 dark:bg-abyss-500' : 'text-slate-600 ring-slate-300 dark:text-slate-300'}`}
          >
            {t.ui.currencyEUR}
          </button>
          {eur && (
            <label className="flex items-center gap-1 text-xs text-slate-500">
              1 EUR =
              <input
                type="number"
                step="0.01"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value) || FX_DEFAULT)}
                className="tnum w-16 rounded border border-slate-300 px-1 py-0.5 dark:border-white/20 dark:bg-white/5"
                aria-label="DKK/EUR"
              />
              DKK · {t.ui.eurNote}
            </label>
          )}
        </div>
      </div>

      {sel && prev && (
        <div className="mb-6 flex flex-wrap gap-2" aria-live="polite">
          {metricKeys.map((k) => {
            const v = yoy(sel[k] as number, prev[k] as number);
            if (v === null) return null;
            const up = v >= 0;
            return (
              <span key={k} className="tnum rounded-full bg-white px-3 py-1 text-xs font-bold ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/15">
                {f.labels[k]} {sel.year}: <span className={up ? 'text-emerald-600' : 'text-red-600'}>{up ? '▲' : '▼'} {formatPct(Math.abs(v), lang)}</span> {t.ui.yoy}
              </span>
            );
          })}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
        <table className="w-full min-w-[720px] border-collapse bg-white text-sm dark:bg-marine-900">
          <caption className="sr-only">{f.title} — {unit}</caption>
          <thead>
            <tr className="bg-mist-100 dark:bg-white/5">
              <th className="p-3 text-left font-bold text-marine-950 dark:text-white">{t.ui.year} · {unit}</th>
              {f.years.map((y) => (
                <th key={y.year} className={`tnum p-3 text-right font-bold ${selectedYear === y.year ? 'bg-abyss-500/15 text-marine-950 dark:text-white' : 'text-marine-950 dark:text-white'}`}>
                  {y.year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-slate-100 dark:border-white/5">
              <td className="p-3 font-medium">{f.labels.netSales}</td>
              {f.years.map((y) => <td key={y.year} className="tnum p-3 text-right text-slate-400">{f.ndLabel}</td>)}
            </tr>
            {metricKeys.map((k) => (
              <tr key={k} className="border-t border-slate-100 dark:border-white/5">
                <td className="p-3 font-medium text-slate-700 dark:text-slate-200">{f.labels[k]}</td>
                {f.years.map((y) => {
                  const v = y[k] as number;
                  const neg = v < 0;
                  return (
                    <td key={y.year} className={`tnum p-3 text-right ${selectedYear === y.year ? 'bg-abyss-500/15' : ''} ${neg ? 'font-bold text-red-600 dark:text-red-400' : ''}`}>
                      {formatK(Math.round(conv(v)), lang)}
                      {k === 'employees' && y.employeeConflict && <span title={f.conflictNote} aria-label={f.conflictNote}> *</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr className="border-t border-slate-100 dark:border-white/5">
              <td className="p-3 font-medium text-slate-700 dark:text-slate-200">{f.labels.solvency}</td>
              {f.years.map((y) => (
                <td key={y.year} className={`tnum p-3 text-right ${selectedYear === y.year ? 'bg-abyss-500/15' : ''}`}>{formatPct(y.solvency, lang)}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        * {f.conflictNote} · {t.ui.kdkk}{eur ? ` · ${t.ui.eurNote}` : ''}
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <figure className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-marine-900">
          <figcaption className="mb-2 text-sm font-bold text-marine-950 dark:text-white">
            {f.labels.grossProfit} / {f.labels.ebit} / {f.labels.netIncome} · {unit}
          </figcaption>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.5} />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <ReferenceLine y={0} stroke="#64748b" />
                <Bar dataKey="grossProfit" name={f.labels.grossProfit} fill="#0e7490" />
                <Bar dataKey="ebit" name={f.labels.ebit} fill="#16407c" />
                <Bar dataKey="netIncome" name={f.labels.netIncome} fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </figure>

        <figure className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-marine-900">
          <figcaption className="mb-2 text-sm font-bold text-marine-950 dark:text-white">
            {f.labels.assets} / {f.labels.totalLiabilities} / {f.labels.equity} · {unit}
          </figcaption>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.5} />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="assets" name={f.labels.assets} fill="#0e7490" stroke="#0e7490" fillOpacity={0.25} />
                <Line type="monotone" dataKey="totalLiabilities" name={f.labels.totalLiabilities} stroke="#f59e0b" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="equity" name={f.labels.equity} stroke="#16407c" strokeWidth={2.5} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </figure>
      </div>

      <figure className="mt-8 rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-marine-900">
        <figcaption className="mb-2 text-sm font-bold text-marine-950 dark:text-white">{f.waterfallTitle} · {unit}</figcaption>
        <Waterfall data={waterfall} eur={eur} rate={rate} lang={lang} />
        <p className="detail-text mt-2 text-xs text-slate-500">{f.waterfallNote}</p>
      </figure>

      <h3 className="mb-3 mt-10 text-lg font-bold text-marine-950 dark:text-white">{f.insightsTitle}</h3>
      <ul className="list-disc space-y-2 pl-5 text-slate-600 dark:text-slate-300">
        {f.insights.map((ins, i) => <li key={i}>{ins}</li>)}
      </ul>

      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={() => drawer.open('metodologia')} className="rounded-lg bg-marine-900 px-4 py-2 text-sm font-bold text-white dark:bg-abyss-600">
          {t.ui.viewMethodology}
        </button>
        <button onClick={() => drawer.open('reconciliacion')} className="rounded-lg px-4 py-2 text-sm font-bold text-marine-900 ring-1 ring-marine-900/30 dark:text-white dark:ring-white/30">
          {f.reconciliationTitle}
        </button>
      </div>

      <EvidenceDrawer open={drawer.openId === 'metodologia'} onClose={drawer.close} title={f.methodologyTitle}>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
          {f.methodologyBody.map((m, i) => <li key={i}>{m}</li>)}
        </ul>
        <p className="mt-4 text-sm">
          <EvidenceBadge level="verified" /> <span className="text-xs text-slate-500">{t.meta.cutoff}</span>
        </p>
      </EvidenceDrawer>
      <EvidenceDrawer open={drawer.openId === 'reconciliacion'} onClose={drawer.close} title={f.reconciliationTitle}>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
          {f.reconciliationBody.map((m, i) => <li key={i}>{m}</li>)}
        </ul>
      </EvidenceDrawer>
    </section>
  );
}

function YearPill({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`tnum rounded-full px-3.5 py-1.5 text-sm font-bold ring-1 transition ${
        active ? 'bg-marine-900 text-white ring-marine-900 dark:bg-abyss-500 dark:ring-abyss-500' : 'bg-white text-slate-600 ring-slate-300 hover:ring-slate-400 dark:bg-white/5 dark:text-slate-200 dark:ring-white/15'
      }`}
    >
      {label}
    </button>
  );
}

function Waterfall({ data, eur, rate, lang }: { data: { year: number; value: number; cumulative: number }[]; eur: boolean; rate: number; lang: 'es' | 'en' }) {
  const W = 640;
  const H = 260;
  const pad = 40;
  const conv = (v: number) => (eur ? dkkToEur(v, rate) : v);
  const vals = data.flatMap((d) => [conv(d.cumulative), conv(d.cumulative - d.value)]);
  const min = Math.min(0, ...vals);
  const max = Math.max(0, ...vals);
  const y = (v: number) => pad + (1 - (v - min) / (max - min || 1)) * (H - pad * 2);
  const bw = (W - pad * 2) / data.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="waterfall">
      <line x1={pad} x2={W - pad} y1={y(0)} y2={y(0)} stroke="#64748b" strokeWidth={1.5} />
      {data.map((d, i) => {
        const v0 = conv(d.cumulative - d.value);
        const v1 = conv(d.cumulative);
        const top = y(Math.max(v0, v1));
        const h = Math.abs(y(v1) - y(v0));
        const x = pad + i * bw + 8;
        const positive = d.value >= 0;
        return (
          <g key={d.year}>
            <rect x={x} y={top} width={bw - 16} height={Math.max(h, 2)} rx={4} fill={positive ? '#0e7490' : '#dc2626'} opacity={0.9}>
              <title>{d.year}: {formatK(Math.round(conv(d.value)), lang)}</title>
            </rect>
            {i > 0 && (
              <line x1={pad + i * bw} x2={pad + i * bw + 8} y1={y(v0)} y2={y(v0)} stroke="#94a3b8" strokeDasharray="4 3" />
            )}
            <text x={x + (bw - 16) / 2} y={H - 12} textAnchor="middle" fontSize={12} className="fill-slate-600">{d.year}</text>
            <text x={x + (bw - 16) / 2} y={top - 6} textAnchor="middle" fontSize={11} fontWeight={700} className={positive ? 'fill-emerald-700' : 'fill-red-600'}>
              {d.value >= 0 ? '+' : ''}{formatK(Math.round(conv(d.value)), lang)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export { balanceReconciles };
