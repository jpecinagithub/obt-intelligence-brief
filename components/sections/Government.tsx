'use client';

import { useLang, useView } from '../providers';
import { EvidenceBadge, SectionHeading } from '../ui';
import { filterByEvidence } from '@/lib/filters';

export default function Government() {
  const { t } = useLang();
  const { verifiedOnly } = useView();
  const g = t.leadership;
  return (
    <section id="gobierno" aria-labelledby="gobierno-h" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14 sm:px-6">
      <SectionHeading id="gobierno-h" title={g.title} intro={g.intro} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {g.leaders.map((l) => (
          <article key={l.name} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-marine-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-marine-900 text-lg font-extrabold text-white dark:bg-abyss-600" aria-hidden>
              {l.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
            </div>
            <h3 className="mt-3 font-bold text-marine-950 dark:text-white">{l.name}</h3>
            <p className="text-sm text-abyss-600 dark:text-abyss-400">{l.role}</p>
            <p className="detail-text mt-2 text-xs text-slate-500 dark:text-slate-400">{l.evidenceNote}</p>
            {l.caution && <p className="detail-text mt-1 text-xs text-amber-700 dark:text-amber-300">{l.caution}</p>}
          </article>
        ))}
        <article className="flex flex-col justify-center rounded-xl border border-dashed border-slate-300 bg-mist-100 p-5 dark:border-white/15 dark:bg-white/5">
          <h3 className="font-bold text-marine-950 dark:text-white">{g.boardNoteTitle}</h3>
          <p className="detail-text mt-2 text-sm text-slate-600 dark:text-slate-300">{g.boardNote}</p>
        </article>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-marine-900">
          <h3 className="font-bold text-marine-950 dark:text-white">{g.orgTitle}</h3>
          <ol className="mt-3 space-y-2">
            {g.orgLevels.map((lv, i) => (
              <li key={lv} className="flex items-center gap-3 text-sm">
                <span className="tnum flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-marine-900 text-xs font-bold text-white dark:bg-abyss-600">{i + 1}</span>
                <span className="text-slate-700 dark:text-slate-200">{lv}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-marine-900">
          <h3 className="font-bold text-marine-950 dark:text-white">{g.successionTitle}</h3>
          <ul className="detail-text mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
            {filterByEvidence(g.succession.map((s) => ({ text: s, evidence: 'reported' as const })), verifiedOnly).map((s) => (
              <li key={s.text}>{s.text}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
