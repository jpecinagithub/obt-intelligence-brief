'use client';

import { useState } from 'react';
import { useLang, useView } from '../providers';
import { EvidenceBadge, SectionHeading } from '../ui';
import { filterByEvidence, filterTimeline } from '@/lib/filters';
import type { TimelineEvent } from '@/data/types';

const catColor: Record<TimelineEvent['category'], string> = {
  expansion: 'bg-cyan-600',
  leadership: 'bg-marine-800 dark:bg-abyss-400',
  alliance: 'bg-emerald-600',
  brand: 'bg-violet-600',
};

export default function History() {
  const { t } = useLang();
  const { verifiedOnly } = useView();
  const [cat, setCat] = useState<'all' | TimelineEvent['category']>('all');
  const events = filterByEvidence(filterTimeline(t.history.events, cat), verifiedOnly);

  return (
    <section id="historia" aria-labelledby="historia-h" className="border-y border-slate-200 bg-mist-100 dark:border-white/10 dark:bg-marine-950/60">
      <div className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14 sm:px-6">
        <SectionHeading id="historia-h" title={t.history.title} intro={t.history.intro} />
        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="filter">
          {(Object.keys(t.history.filters) as ('all' | TimelineEvent['category'])[]).map((k) => (
            <button
              key={k}
              onClick={() => setCat(k)}
              aria-pressed={cat === k}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold ring-1 transition ${
                cat === k
                  ? 'bg-marine-900 text-white ring-marine-900 dark:bg-abyss-500 dark:ring-abyss-500'
                  : 'bg-white text-slate-700 ring-slate-300 hover:ring-slate-400 dark:bg-white/5 dark:text-slate-200 dark:ring-white/15'
              }`}
            >
              {t.history.filters[k]}
            </button>
          ))}
        </div>
        {events.length === 0 && <p className="text-sm text-slate-500">{t.ui.noResults}</p>}
        <ol className="relative ml-3 space-y-6 border-l-2 border-slate-300 pl-6 dark:border-white/15">
          {events.map((e, i) => (
            <li key={`${e.year}-${i}`} className="relative">
              <span className={`absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full ring-4 ring-mist-100 dark:ring-marine-950/60 ${catColor[e.category]}`} aria-hidden />
              <div className="flex flex-wrap items-center gap-2">
                <span className="tnum text-lg font-extrabold text-marine-950 dark:text-white">{e.year}</span>
                <span className="rounded-full bg-marine-900/5 px-2 py-0.5 text-[11px] font-semibold text-marine-900 ring-1 ring-marine-900/15 dark:bg-white/5 dark:text-mist-200 dark:ring-white/15">
                  {t.history.filters[e.category]}
                </span>
                <EvidenceBadge level={e.evidence} />
              </div>
              <h3 className="mt-1 font-bold text-slate-900 dark:text-slate-100">{e.title}</h3>
              {e.detail && <p className="detail-text mt-1 max-w-3xl text-sm text-slate-600 dark:text-slate-300">{e.detail}</p>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
