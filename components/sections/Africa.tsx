'use client';

import { useLang, useView } from '../providers';
import { DataGapCard, EvidenceBadge, SectionHeading, SourceLink, StatusBadge } from '../ui';
import AfricaMap from '../AfricaMap';
import { countriesEs } from '@/data/es';
import { countriesEn } from '@/data/en';
import { filterByEvidence, filterCountries } from '@/lib/filters';
import type { CountryEntry, CountryStatus } from '@/data/types';

export default function Africa() {
  const { t, lang } = useLang();
  const { verifiedOnly, selectedCountry, setSelectedCountry } = useView();
  const all = (lang === 'es' ? countriesEs : countriesEn) as unknown as CountryEntry[];
  const countries = filterByEvidence(filterCountries(all, 'all'), verifiedOnly);
  const selected = countries.find((c) => c.id === selectedCountry) ?? null;
  const counts = (['owned', 'partner', 'announced'] as CountryStatus[]).map((s) => ({
    status: s,
    n: all.filter((c) => c.status === s).length,
  }));

  return (
    <section id="africa" aria-labelledby="africa-h" className="border-y border-slate-200 bg-mist-100 dark:border-white/10 dark:bg-marine-950/60">
      <div className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14 sm:px-6">
        <SectionHeading id="africa-h" title={t.africa.title} intro={t.africa.intro} />
        <div className="mb-6 flex flex-wrap gap-2">
          {counts.map((c) => (
            <span key={c.status} className="tnum rounded-full bg-white px-3 py-1 text-sm font-bold text-marine-950 ring-1 ring-slate-200 dark:bg-white/5 dark:text-white dark:ring-white/15">
              {c.n} · {t.ui.countryStatus[c.status]}
            </span>
          ))}
          <span className="tnum rounded-full bg-marine-900 px-3 py-1 text-sm font-bold text-white dark:bg-abyss-500">
            {all.length} · {t.africa.countLabel}
          </span>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AfricaMap countries={all} />
          </div>
          <aside aria-live="polite" className="rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-marine-900">
            {selected ? (
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-extrabold text-marine-950 dark:text-white">{selected.name}</h3>
                  <button onClick={() => setSelectedCountry(null)} className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300" aria-label={t.ui.close}>✕</button>
                </div>
                <div className="mt-3 space-y-2 text-sm">
                  <p><span className="font-semibold">{t.africa.panelLabels.status}:</span> <StatusBadge status={selected.status} /></p>
                  {selected.year && <p><span className="font-semibold">{t.africa.panelLabels.year}:</span> <span className="tnum">{selected.year}</span></p>}
                  {selected.city && <p><span className="font-semibold">{t.africa.panelLabels.city}:</span> {selected.city}</p>}
                  {selected.detail && <p className="detail-text text-slate-600 dark:text-slate-300">{selected.detail}</p>}
                  <p><span className="font-semibold">{t.africa.panelLabels.evidence}:</span> <EvidenceBadge level={selected.evidence} /></p>
                  <p>
                    <span className="font-semibold">{t.africa.panelLabels.sources}:</span>{' '}
                    {selected.sourceIds.map((id, i) => (
                      <span key={id}>{i > 0 && ', '}<SourceLink id={id} short /></span>
                    ))}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">{lang === 'es' ? 'Selecciona un país del mapa para ver su ficha.' : 'Select a country on the map to view its file.'}</p>
            )}
            <div className="mt-6">
              <DataGapCard title={t.africa.gapTitle} body={t.africa.gapBody} />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
