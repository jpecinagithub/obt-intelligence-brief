'use client';

import { useLang, useView } from '../providers';
import { EvidenceBadge, SectionHeading } from '../ui';
import { filterByEvidence } from '@/lib/filters';

export default function Workforce() {
  const { t } = useLang();
  const { verifiedOnly } = useView();
  const w = t.workforce;
  const milestones = filterByEvidence(w.milestones, verifiedOnly);
  const max = 1000;

  return (
    <section id="plantilla" aria-labelledby="plantilla-h" className="border-y border-slate-200 bg-mist-100 dark:border-white/10 dark:bg-marine-950/60">
      <div className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14 sm:px-6">
        <SectionHeading id="plantilla-h" title={w.title} intro={w.intro} />
        <div className="space-y-4">
          {milestones.map((m) => {
            const numeric = parseInt(m.value.replace(/[^0-9]/g, ''), 10);
            const width = Math.min(100, (numeric / max) * 100);
            return (
              <div key={m.year + m.label} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-marine-900">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-bold text-marine-950 dark:text-white">
                    <span className="tnum">{m.year}</span> · {m.label}
                  </p>
                  <p className="tnum text-xl font-extrabold text-abyss-600 dark:text-abyss-400">{m.value}</p>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10" role="img" aria-label={`${m.value} ${m.label}`}>
                  <div className="h-full rounded-full bg-gradient-to-r from-abyss-600 to-abyss-400" style={{ width: `${Math.max(width, 2)}%` }} />
                </div>
                <div className="detail-text mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <EvidenceBadge level={m.evidence} />
                  <span>{m.source}</span>
                  <span>· {m.quality}</span>
                </div>
                {m.note && <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">{m.note}</p>}
              </div>
            );
          })}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-marine-900">
            <h3 className="font-bold text-marine-950 dark:text-white">{w.orgTitle}</h3>
            <p className="detail-text mt-2 text-sm text-slate-600 dark:text-slate-300">{w.orgBody}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-marine-900">
            <h3 className="font-bold text-marine-950 dark:text-white">{w.kpiTitle}</h3>
            <ul className="detail-text mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
              {w.kpis.map((k) => <li key={k}>{k}</li>)}
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-marine-900">
            <h3 className="font-bold text-marine-950 dark:text-white">{w.localTitle}</h3>
            <p className="detail-text mt-2 text-sm text-slate-600 dark:text-slate-300">{w.localBody}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
