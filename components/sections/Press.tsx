'use client';

import { useState } from 'react';
import { useLang, useView } from '../providers';
import { EvidenceBadge, EvidenceDrawer, KindBadge, SectionHeading, SentimentBadge, SourceLink, useDrawer } from '../ui';
import { filterByEvidence, filterPress } from '@/lib/filters';
import type { PressItem, PressKind, Sentiment } from '@/data/types';

export default function Press() {
  const { t } = useLang();
  const { verifiedOnly } = useView();
  const p = t.press;
  const [kind, setKind] = useState<'all' | PressKind>('all');
  const [sentiment, setSentiment] = useState<'all' | Sentiment>('all');
  const drawer = useDrawer();
  const items = filterByEvidence(filterPress(p.items, kind, sentiment), verifiedOnly);
  const active: PressItem | null = p.items.find((i) => `${i.date}-${i.title}` === drawer.openId) ?? null;

  const pill = (active: boolean) =>
    `rounded-full px-3.5 py-1.5 text-sm font-semibold ring-1 transition ${
      active ? 'bg-marine-900 text-white ring-marine-900 dark:bg-abyss-500 dark:ring-abyss-500' : 'bg-white text-slate-600 ring-slate-300 hover:ring-slate-400 dark:bg-white/5 dark:text-slate-200 dark:ring-white/15'
    }`;

  return (
    <section id="prensa" aria-labelledby="prensa-h" className="border-y border-slate-200 bg-mist-100 dark:border-white/10 dark:bg-marine-950/60">
      <div className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14 sm:px-6">
        <SectionHeading id="prensa-h" title={p.title} intro={p.intro} />
        <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="kind">
          {(Object.keys(p.kindFilter) as ('all' | PressKind)[]).map((k) => (
            <button key={k} onClick={() => setKind(k)} aria-pressed={kind === k} className={pill(kind === k)}>{p.kindFilter[k]}</button>
          ))}
        </div>
        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="sentiment">
          {(Object.keys(p.sentimentFilter) as ('all' | Sentiment)[]).map((s) => (
            <button key={s} onClick={() => setSentiment(s)} aria-pressed={sentiment === s} className={pill(sentiment === s)}>{p.sentimentFilter[s]}</button>
          ))}
        </div>
        {items.length === 0 && <p className="text-sm text-slate-500">{t.ui.noResults}</p>}
        <ol className="relative ml-3 space-y-5 border-l-2 border-slate-300 pl-6 dark:border-white/15">
          {items.map((it) => {
            const id = `${it.date}-${it.title}`;
            return (
              <li key={id} className="relative">
                <span className={`absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full ring-4 ring-mist-100 dark:ring-marine-950/60 ${it.sentiment === 'positive' ? 'bg-emerald-500' : it.sentiment === 'risk' ? 'bg-red-500' : 'bg-slate-400'}`} aria-hidden />
                <div className="flex flex-wrap items-center gap-2">
                  <span className="tnum text-sm font-bold text-slate-500 dark:text-slate-400">{it.date}</span>
                  <KindBadge kind={it.kind} />
                  <SentimentBadge sentiment={it.sentiment} />
                  <EvidenceBadge level={it.evidence} />
                </div>
                <button onClick={() => drawer.open(id)} className="mt-1 text-left font-bold text-marine-950 underline decoration-abyss-500/30 underline-offset-2 hover:decoration-abyss-500 dark:text-white">
                  {it.title}
                </button>
                <p className="detail-text mt-1 max-w-3xl text-sm text-slate-600 dark:text-slate-300">{it.summary}</p>
              </li>
            );
          })}
        </ol>
      </div>
      <EvidenceDrawer open={!!active} onClose={drawer.close} title={active?.title ?? ''}>
        {active && (
          <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex flex-wrap gap-2">
              <KindBadge kind={active.kind} />
              <SentimentBadge sentiment={active.sentiment} />
              <EvidenceBadge level={active.evidence} />
            </div>
            <p>{active.summary}</p>
            <p className="font-semibold text-marine-950 dark:text-white">{t.ui.sources}:</p>
            <ul className="list-disc pl-5">
              {active.sourceIds.map((sid) => (
                <li key={sid}><SourceLink id={sid} /></li>
              ))}
            </ul>
          </div>
        )}
      </EvidenceDrawer>
    </section>
  );
}
