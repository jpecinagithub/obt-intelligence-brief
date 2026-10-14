'use client';

import { useLang } from '../providers';
import { EvidenceBadge } from '../ui';
import { countriesEs } from '@/data/es';

export default function Hero() {
  const { t } = useLang();
  const marketCount = countriesEs.length;
  return (
    <header className="relative overflow-hidden bg-marine-950 text-white">
      <div className="bg-grid absolute inset-0" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-marine-950/60 via-transparent to-marine-950" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-16 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-abyss-400">{t.hero.kicker}</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">{t.hero.title}</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-300">{t.hero.subtitle}</p>
        <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {t.hero.facts.map((f, i) => (
            <div key={f.label} className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur">
              <dt className="order-2 mt-1 text-xs text-slate-300">{i === 2 ? `${marketCount} ${t.africa.countLabel}` : f.label}</dt>
              <dd className="tnum order-1 text-2xl font-extrabold text-white">{i === 2 ? String(marketCount) : f.value}</dd>
              <div className="mt-2">
                <EvidenceBadge level={f.evidence} />
              </div>
              <p className="mt-1 text-[11px] text-slate-400">{f.source}</p>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs text-slate-400">{t.meta.cutoff}</p>
      </div>
    </header>
  );
}
