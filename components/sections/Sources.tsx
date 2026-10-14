'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLang } from '../providers';
import { SectionHeading, SourceLink } from '../ui';
import { sources } from '@/data/sources';
import { searchSources } from '@/lib/filters';
import type { Source } from '@/data/types';

const confColor: Record<Source['confidence'], string> = {
  high: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200',
  medium: 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200',
  low: 'bg-slate-200 text-slate-700 dark:bg-slate-700/50 dark:text-slate-300',
};

export default function Sources() {
  const { t } = useLang();
  const sp = t.sourcesPage;
  const [q, setQ] = useState('');
  const results = searchSources(sources, q);

  return (
    <section id="fuentes" aria-labelledby="fuentes-h" className="border-t border-slate-200 bg-mist-100 dark:border-white/10 dark:bg-marine-950/60">
      <div className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14 sm:px-6">
        <SectionHeading id="fuentes-h" title={sp.title} intro={sp.intro} />

        <h3 className="mb-3 text-lg font-bold text-marine-950 dark:text-white">{sp.triangulationTitle}</h3>
        <ul className="detail-text mb-10 list-disc space-y-1.5 pl-5 text-slate-600 dark:text-slate-300">
          {sp.triangulation.map((r, i) => <li key={i}>{r}</li>)}
        </ul>

        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={sp.searchPlaceholder}
          aria-label={sp.searchPlaceholder}
          className="mb-6 w-full max-w-xl rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm dark:border-white/15 dark:bg-white/5 dark:text-white"
        />

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
          <table className="w-full min-w-[760px] border-collapse bg-white text-sm dark:bg-marine-900">
            <thead>
              <tr className="bg-mist-100 text-left dark:bg-white/5">
                {[sp.tableHeaders.title, sp.tableHeaders.publisher, sp.tableHeaders.date, sp.tableHeaders.kind, sp.tableHeaders.country, sp.tableHeaders.confidence].map((h) => (
                  <th key={h} className="p-3 font-bold text-marine-950 dark:text-white">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((s) => (
                <tr key={s.id} className="border-t border-slate-100 dark:border-white/5">
                  <td className="p-3"><SourceLink id={s.id} /></td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{s.publisher}</td>
                  <td className="tnum p-3 text-slate-600 dark:text-slate-300">{s.date ?? '—'}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{s.kind}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{s.country ?? '—'}</td>
                  <td className="p-3"><span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${confColor[s.confidence]}`}>{s.confidence}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {results.length === 0 && <p className="mt-4 text-sm text-slate-500">{t.ui.noResults}</p>}

        <p className="mt-8 text-sm">
          <Link href="/methodology" className="font-bold text-abyss-600 underline underline-offset-2 dark:text-abyss-400">
            {t.nav.methodology} →
          </Link>
        </p>
      </div>
    </section>
  );
}
