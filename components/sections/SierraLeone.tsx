'use client';

import { useState } from 'react';
import { useLang } from '../providers';
import { MetricCard, SectionHeading } from '../ui';

export function PrintButton() {
  const { t } = useLang();
  return (
    <button
      onClick={() => window.print()}
      className="rounded-lg bg-marine-900 px-5 py-2.5 text-sm font-bold text-white shadow hover:bg-marine-800 dark:bg-abyss-600 dark:hover:bg-abyss-500"
    >
      🖨 {t.ui.printReport}
    </button>
  );
}

export default function SierraLeone() {
  const { t, lang } = useLang();
  const sl = t.sierraLeone;
  const [tab, setTab] = useState(sl.tabs[0].id);
  const active = tab;
  const riskHeaders = lang === 'es' ? ['Riesgo', 'Impacto', 'Mitigación / control a verificar'] : ['Risk', 'Impact', 'Mitigation / control to verify'];

  return (
    <section id="sierra-leona" aria-labelledby="sl-h" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14 sm:px-6">
      <SectionHeading id="sl-h" title={sl.title} intro={sl.intro} />
      <div className="print-hidden mb-8">
        <PrintButton />
      </div>

      <div className="print-hidden mb-8 rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-marine-900">
        <h3 className="mb-3 font-bold text-marine-950 dark:text-white">{sl.profileTitle}</h3>
        <dl className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {sl.profile.map((p) => (
            <div key={p.k} className="flex gap-2 text-sm">
              <dt className="shrink-0 font-semibold text-slate-500 dark:text-slate-400">{p.k}:</dt>
              <dd className="text-slate-800 dark:text-slate-100">{p.v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="print-hidden mb-6 flex flex-wrap gap-2" role="tablist" aria-label={sl.title}>
        {sl.tabs.map((tb) => (
          <button
            key={tb.id}
            role="tab"
            aria-selected={active === tb.id}
            onClick={() => setTab(tb.id)}
            className={`rounded-lg px-4 py-2 text-sm font-bold ring-1 transition ${
              active === tb.id
                ? 'bg-marine-900 text-white ring-marine-900 dark:bg-abyss-500 dark:ring-abyss-500'
                : 'bg-white text-slate-600 ring-slate-300 hover:ring-slate-400 dark:bg-white/5 dark:text-slate-200 dark:ring-white/15'
            }`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      <div className="print-hidden rounded-xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-marine-900" role="tabpanel">
        {active === 'capacidades' && <BulletList items={sl.capabilities} />}
        {active === 'corredores' && (
          <div><h3 className="mb-3 font-bold">{sl.corridorsTitle}</h3><BulletList items={sl.corridors} /></div>
        )}
        {active === 'casos' && (
          <div><h3 className="mb-3 font-bold">{sl.casesTitle}</h3><BulletList items={sl.cases} /></div>
        )}
        {active === 'mercado' && (
          <div>
            <h3 className="mb-4 font-bold">{sl.marketTitle}</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sl.marketCards.map((c) => <MetricCard key={c.label} value={c.value} label={c.label} source={c.source} evidence={c.evidence} />)}
            </div>
            <p className="detail-text mt-4 text-sm text-slate-600 dark:text-slate-300">{sl.marketNote}</p>
          </div>
        )}
        {active === 'regulacion' && (
          <div><h3 className="mb-3 font-bold">{sl.regulationTitle}</h3><BulletList items={sl.regulation} /></div>
        )}
        {active === 'riesgos' && (
          <div>
            <h3 className="mb-3 font-bold">{sl.risksTitle}</h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr className="bg-mist-100 text-left dark:bg-white/5">
                    {riskHeaders.map((h) => <th key={h} className="p-3 font-bold">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {sl.risks.map((r, i) => (
                    <tr key={i} className="border-t border-slate-100 dark:border-white/5">
                      <td className="p-3 font-semibold">{r.risk}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">{r.impact}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">{r.mitigation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {active === 'swot' && (
          <div>
            <h3 className="mb-4 font-bold">{sl.swotTitle}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {(['s', 'w', 'o', 't'] as const).map((k) => (
                <div key={k} className="rounded-lg border border-slate-200 p-4 dark:border-white/10">
                  <h4 className="font-bold text-abyss-600 dark:text-abyss-400">{sl.swotLabels[k]}</h4>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
                    {sl.swot[k].map((it, i) => <li key={i}>{it}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
        {active === 'preguntas' && (
          <div>
            <h3 className="mb-3 font-bold">{sl.questionsTitle}</h3>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-200">
              {sl.questions.map((q, i) => <li key={i}>{q}</li>)}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-200">
      {items.map((it, i) => <li key={i}>{it}</li>)}
    </ul>
  );
}

/** Versión imprimible del informe (solo visible en print) */
export function SierraLeonePrint() {
  const { t } = useLang();
  const sl = t.sierraLeone;
  return (
    <div className="print-only mx-auto max-w-3xl px-2 py-4 text-black">
      <h1 className="text-2xl font-extrabold">{t.meta.title} — {sl.title}</h1>
      <p className="mt-1 text-sm">{t.meta.cutoff}</p>
      <p className="mt-2 rounded bg-amber-100 p-2 text-xs font-bold">{t.meta.entityWarning}</p>
      <h2 className="mb-2 mt-6 text-lg font-bold">{sl.profileTitle}</h2>
      <dl className="space-y-1 text-sm">
        {sl.profile.map((p) => (
          <div key={p.k} className="flex gap-2"><dt className="font-semibold">{p.k}:</dt><dd>{p.v}</dd></div>
        ))}
      </dl>
      <h2 className="mb-2 mt-6 text-lg font-bold">{sl.tabs[0].label}</h2>
      <ul className="list-disc space-y-1 pl-5 text-sm">{sl.capabilities.map((c, i) => <li key={i}>{c}</li>)}</ul>
      <h2 className="mb-2 mt-6 text-lg font-bold">{sl.marketTitle}</h2>
      <ul className="list-disc space-y-1 pl-5 text-sm">
        {sl.marketCards.map((c) => <li key={c.label}><strong>{c.value}</strong> — {c.label} ({c.source})</li>)}
      </ul>
      <p className="mt-2 text-sm">{sl.marketNote}</p>
      <h2 className="mb-2 mt-6 text-lg font-bold">{sl.regulationTitle}</h2>
      <ul className="list-disc space-y-1 pl-5 text-sm">{sl.regulation.map((r, i) => <li key={i}>{r}</li>)}</ul>
      <h2 className="mb-2 mt-6 text-lg font-bold">{sl.risksTitle}</h2>
      <ul className="list-disc space-y-1 pl-5 text-sm">
        {sl.risks.map((r, i) => <li key={i}><strong>{r.risk}.</strong> {r.impact}. → {r.mitigation}</li>)}
      </ul>
      <h2 className="mb-2 mt-6 text-lg font-bold">{sl.swotTitle}</h2>
      {(['s', 'w', 'o', 't'] as const).map((k) => (
        <div key={k} className="mt-2">
          <h3 className="font-bold">{sl.swotLabels[k]}</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm">{sl.swot[k].map((it, i) => <li key={i}>{it}</li>)}</ul>
        </div>
      ))}
      <h2 className="mb-2 mt-6 text-lg font-bold">{sl.questionsTitle}</h2>
      <ol className="list-decimal space-y-1 pl-5 text-sm">{sl.questions.map((q, i) => <li key={i}>{q}</li>)}</ol>
      <p className="mt-8 border-t pt-2 text-xs">{t.footer.disclaimer}</p>
      <p className="mt-1 text-xs font-bold">{t.footer.author} · jpecina@gmail.com</p>
    </div>
  );
}
