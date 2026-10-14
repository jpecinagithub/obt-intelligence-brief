'use client';

import { useState } from 'react';
import type { EvidenceLevel, Sentiment, CountryStatus, PressKind } from '@/data/types';
import { useLang } from './providers';
import { sources } from '@/data/sources';

const evidenceStyles: Record<EvidenceLevel, string> = {
  verified: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200 ring-emerald-600/30',
  reported: 'bg-sky-100 text-sky-900 dark:bg-sky-900/40 dark:text-sky-200 ring-sky-600/30',
  secondary: 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200 ring-amber-600/30',
  inferred: 'bg-violet-100 text-violet-900 dark:bg-violet-900/40 dark:text-violet-200 ring-violet-600/30',
  undisclosed: 'bg-slate-200 text-slate-700 dark:bg-slate-700/50 dark:text-slate-300 ring-slate-500/30',
};

export function EvidenceBadge({ level }: { level: EvidenceLevel }) {
  const { t } = useLang();
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${evidenceStyles[level]}`}>
      {t.ui.evidence[level]}
    </span>
  );
}

const sentimentStyles: Record<Sentiment, string> = {
  positive: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200 ring-emerald-600/30',
  neutral: 'bg-slate-200 text-slate-700 dark:bg-slate-700/50 dark:text-slate-300 ring-slate-500/30',
  risk: 'bg-red-100 text-red-900 dark:bg-red-900/40 dark:text-red-200 ring-red-600/30',
};

export function SentimentBadge({ sentiment }: { sentiment: Sentiment }) {
  const { t } = useLang();
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${sentimentStyles[sentiment]}`}>
      {t.ui.sentiment[sentiment]}
    </span>
  );
}

const statusStyles: Record<CountryStatus, string> = {
  owned: 'bg-cyan-100 text-cyan-900 dark:bg-cyan-900/40 dark:text-cyan-200 ring-cyan-600/30',
  partner: 'bg-slate-200 text-slate-700 dark:bg-slate-700/50 dark:text-slate-300 ring-slate-500/30',
  announced: 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200 ring-amber-600/30',
};

export function StatusBadge({ status }: { status: CountryStatus }) {
  const { t } = useLang();
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${statusStyles[status]}`}>
      {t.ui.countryStatus[status]}
    </span>
  );
}

export function KindBadge({ kind }: { kind: PressKind }) {
  const { t } = useLang();
  return (
    <span className="inline-flex items-center rounded-full bg-marine-900/5 px-2 py-0.5 text-[11px] font-medium text-marine-900 ring-1 ring-marine-900/15 dark:bg-white/5 dark:text-mist-200 dark:ring-white/15">
      {t.press.kindFilter[kind]}
    </span>
  );
}

export function SectionHeading({ id, kicker, title, intro }: { id: string; kicker?: string; title: string; intro?: string }) {
  return (
    <div className="mb-8">
      {kicker && (
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-abyss-600 dark:text-abyss-400">{kicker}</p>
      )}
      <h2 id={id} className="scroll-mt-24 text-3xl font-extrabold tracking-tight text-marine-950 dark:text-white">
        {title}
      </h2>
      {intro && <p className="detail-text mt-3 max-w-3xl text-slate-600 dark:text-slate-300">{intro}</p>}
    </div>
  );
}

export function MetricCard({ value, label, source, evidence }: { value: string; label: string; source: string; evidence: EvidenceLevel }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-marine-900">
      <p className="tnum text-3xl font-extrabold text-marine-950 dark:text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{label}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <EvidenceBadge level={evidence} />
        <span className="text-xs text-slate-500 dark:text-slate-400">{source}</span>
      </div>
    </div>
  );
}

export function DataGapCard({ title, body }: { title: string; body: string }) {
  const { t } = useLang();
  return (
    <div className="rounded-xl border border-dashed border-amber-500/60 bg-amber-50 p-5 dark:bg-amber-950/20">
      <p className="flex items-center gap-2 text-sm font-bold text-amber-900 dark:text-amber-200">
        <span aria-hidden>◌</span> {t.ui.dataGap}: {title}
      </p>
      <p className="detail-text mt-2 text-sm text-amber-800 dark:text-amber-300/90">{body}</p>
    </div>
  );
}

export function SourceLink({ id, short }: { id: string; short?: boolean }) {
  const s = sources.find((x) => x.id === id);
  if (!s) return null;
  return (
    <a
      href={s.url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-abyss-600 underline decoration-abyss-500/40 underline-offset-2 hover:decoration-abyss-500 dark:text-abyss-400"
      title={s.url}
    >
      {short ? s.publisher : s.title} ↗
    </a>
  );
}

export function EvidenceDrawer({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const { t } = useLang();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={title}>
      <button aria-label={t.ui.close} className="absolute inset-0 bg-black/50" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl dark:bg-marine-900">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className="text-lg font-bold text-marine-950 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
          >
            {t.ui.close} ✕
          </button>
        </div>
        {children}
      </aside>
    </div>
  );
}

export function TrustLights({ items }: { items: { level: string; label: string; desc: string }[] }) {
  const colors: Record<string, string> = { high: 'bg-emerald-500', medium: 'bg-amber-500', low: 'bg-red-500' };
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {items.map((it) => (
        <div key={it.level} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-marine-900">
          <span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${colors[it.level]}`} aria-hidden />
          <div>
            <p className="text-sm font-bold text-marine-950 dark:text-white">{it.label}</p>
            <p className="detail-text mt-1 text-xs text-slate-600 dark:text-slate-300">{it.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={(e) => {
          e.preventDefault();
          onChange(!checked);
        }}
        className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-abyss-600' : 'bg-slate-300 dark:bg-slate-600'}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`}
        />
      </button>
      {label}
    </label>
  );
}

export function useDrawer() {
  const [openId, setOpenId] = useState<string | null>(null);
  return { openId, open: (id: string) => setOpenId(id), close: () => setOpenId(null) };
}
