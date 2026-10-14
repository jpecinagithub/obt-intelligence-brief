'use client';

import { useLang } from '../providers';
import { SectionHeading } from '../ui';

export default function Operating() {
  const { t } = useLang();
  const o = t.operating;
  return (
    <section id="modelo-operativo" aria-labelledby="modelo-h" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14 sm:px-6">
      <SectionHeading id="modelo-h" title={o.title} intro={o.intro} />

      <h3 className="mb-4 text-lg font-bold text-marine-950 dark:text-white">{o.chainTitle}</h3>
      <div className="overflow-x-auto pb-2" role="list" aria-label={o.chainTitle}>
        <svg viewBox="0 0 1120 120" className="min-w-[880px]" role="img" aria-label={o.chain.join(' → ')}>
          {o.chain.map((step, i) => {
            const x = 10 + i * 160;
            return (
              <g key={step} role="listitem">
                {i > 0 && (
                  <line x1={x - 12} y1={60} x2={x - 52} y2={60} stroke="#06a3c2" strokeWidth={3} className="chain-line" aria-hidden />
                )}
                <rect x={x} y={28} width={140} height={64} rx={12} className="fill-white stroke-slate-300 dark:fill-marine-900 dark:stroke-white/15" strokeWidth={1.5} />
                <text x={x + 70} y={55} textAnchor="middle" className="fill-marine-950 text-[13px] font-bold dark:fill-white">
                  {step.length > 22 ? step.slice(0, 20) + '…' : step}
                </text>
                <text x={x + 70} y={74} textAnchor="middle" className="fill-slate-500 text-[11px] dark:fill-slate-400">
                  {String(i + 1).padStart(2, '0')}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <h3 className="mb-4 mt-10 text-lg font-bold text-marine-950 dark:text-white">{o.servicesTitle}</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {o.serviceGroups.map((g) => (
          <div key={g.name} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-marine-900">
            <h4 className="font-bold text-abyss-600 dark:text-abyss-400">{g.name}</h4>
            <ul className="mt-2 grid gap-1 sm:grid-cols-2">
              {g.items.map((it) => (
                <li key={it} className="text-sm text-slate-600 dark:text-slate-300">• {it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h3 className="mb-4 mt-10 text-lg font-bold text-marine-950 dark:text-white">{o.sectorsTitle}</h3>
      <div className="flex flex-wrap gap-2">
        {o.sectors.map((s) => (
          <span key={s} className="rounded-full bg-marine-900/5 px-3 py-1.5 text-sm font-medium text-marine-900 ring-1 ring-marine-900/10 dark:bg-white/5 dark:text-mist-200 dark:ring-white/10">
            {s}
          </span>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-marine-900">
          <h3 className="font-bold text-marine-950 dark:text-white">{o.diffTitle}</h3>
          <ul className="detail-text mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
            {o.differentiators.map((d) => <li key={d}>{d}</li>)}
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-marine-900">
          <h3 className="font-bold text-marine-950 dark:text-white">{o.depTitle}</h3>
          <ul className="detail-text mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
            {o.dependencies.map((d) => <li key={d}>{d}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
