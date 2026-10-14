'use client';

import { useEffect, useMemo, useState } from 'react';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import type { CountryEntry, CountryStatus } from '@/data/types';
import { useLang, useView } from './providers';

interface Feature {
  type: 'Feature';
  id: string;
  properties: { name: string; point?: boolean };
  geometry: { type: string; coordinates: number[] | number[][] | number[][][] | number[][][][] };
}

const statusFill: Record<CountryStatus, string> = {
  owned: '#0e7490',
  partner: '#7dd3fc',
  announced: '#f59e0b',
};

const W = 780;
const H = 560;

export default function AfricaMap({ countries }: { countries: readonly CountryEntry[] }) {
  const { t, lang } = useLang();
  const { selectedCountry, setSelectedCountry } = useView();
  const [features, setFeatures] = useState<Feature[]>([]);

  useEffect(() => {
    fetch('/data/africa-110m.json')
      .then((r) => r.json())
      .then((fc) => setFeatures(fc.features))
      .catch(() => {});
  }, []);

  const statusById = useMemo(() => {
    const m = new Map<string, CountryStatus>();
    for (const c of countries) m.set(c.id, c.status);
    return m;
  }, [countries]);

  const projection = useMemo(() => {
    const fc = { type: 'FeatureCollection', features } as never;
    return features.length ? geoNaturalEarth1().fitSize([W, H], fc) : geoNaturalEarth1().translate([W / 2, H / 2]).scale(150);
  }, [features]);
  const path = useMemo(() => geoPath(projection), [projection]);

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full rounded-xl border border-slate-200 bg-mist-100 dark:border-white/10 dark:bg-marine-950"
        role="img"
        aria-label={t.africa.title}
      >
        {features.map((f) => {
          const status = statusById.get(f.id);
          const isSel = selectedCountry === f.id;
          if (f.properties.point) {
            const coords = f.geometry.coordinates as number[];
            const p = projection(coords as [number, number]);
            if (!p) return null;
            return (
              <g key={f.id}>
                <title>{f.properties.name}</title>
                <circle
                  cx={p[0]}
                  cy={p[1]}
                  r={isSel ? 9 : 6}
                  fill={status ? statusFill[status] : 'transparent'}
                  stroke={isSel ? '#0a1c38' : '#fff'}
                  strokeWidth={isSel ? 2.5 : 1.5}
                  className="cursor-pointer"
                  onClick={() => setSelectedCountry(status ? (isSel ? null : f.id) : null)}
                />
              </g>
            );
          }
          const d = path(f as never);
          if (!d) return null;
          const fill = status ? statusFill[status] : '#cbd5e1';
          return (
            <path
              key={f.id}
              d={d}
              fill={fill}
              fillOpacity={status ? (isSel ? 1 : 0.85) : 0.5}
              stroke={isSel ? '#0a1c38' : '#ffffff'}
              strokeWidth={isSel ? 2.2 : 0.6}
              className={status ? 'cursor-pointer transition-opacity hover:fill-opacity-100' : undefined}
              onClick={() => status && setSelectedCountry(isSel ? null : f.id)}
            >
              <title>{f.properties.name}</title>
            </path>
          );
        })}
      </svg>
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600 dark:text-slate-300">
        {(Object.keys(statusFill) as CountryStatus[]).map((s) => (
          <span key={s} className="inline-flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm" style={{ background: statusFill[s] }} aria-hidden />
            {t.ui.countryStatus[s]}
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-slate-300 dark:bg-slate-600" aria-hidden />
          {lang === 'es' ? 'Resto de África (contexto)' : 'Rest of Africa (context)'}
        </span>
      </div>
      <p className="detail-text mt-2 text-xs text-slate-500 dark:text-slate-400">{t.africa.legendNote}</p>
    </div>
  );
}
