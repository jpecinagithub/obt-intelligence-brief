'use client';

import { useLang, useView } from '../providers';
import { EvidenceBadge, SectionHeading, TrustLights } from '../ui';
import { filterByEvidence } from '@/lib/filters';

export default function Summary() {
  const { t } = useLang();
  const { verifiedOnly } = useView();
  const s = t.summary;
  const cards = filterByEvidence(s.cards, verifiedOnly);
  return (
    <section id="resumen" aria-labelledby="resumen-h" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14 sm:px-6">
      <SectionHeading id="resumen-h" title={s.title} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <article key={c.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-marine-900">
            <h3 className="text-base font-bold text-marine-950 dark:text-white">{c.title}</h3>
            <p className="detail-text mt-2 text-sm text-slate-600 dark:text-slate-300">{c.body}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <EvidenceBadge level={c.evidence} />
              <span className="text-xs text-slate-500 dark:text-slate-400">{c.source}</span>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-emerald-600/30 bg-emerald-50/60 p-5 dark:bg-emerald-950/20">
          <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-200">{t.ui.knownTitle}</h3>
          <ul className="detail-text mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-700 dark:text-slate-200">
            {s.known.map((k) => <li key={k}>{k}</li>)}
          </ul>
        </div>
        <div className="rounded-xl border border-red-600/30 bg-red-50/60 p-5 dark:bg-red-950/20">
          <h3 className="text-base font-bold text-red-900 dark:text-red-200">{t.ui.unknownTitle}</h3>
          <ul className="detail-text mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-700 dark:text-slate-200">
            {s.unknown.map((k) => <li key={k}>{k}</li>)}
          </ul>
        </div>
      </div>

      <h3 className="mb-4 mt-10 text-lg font-bold text-marine-950 dark:text-white">{t.ui.trustTitle}</h3>
      <TrustLights items={s.trust} />

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="text-lg font-bold text-marine-950 dark:text-white">{s.thesisTitle}</h3>
          <p className="mt-2 text-slate-600 dark:text-slate-300">{s.thesis}</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-marine-950 dark:text-white">{s.risksTitle}</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-600 dark:text-slate-300">
            {s.risks.map((r) => <li key={r}>{r}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
