'use client';

import { useMemo, useRef, useState } from 'react';
import { useLang, useView } from './providers';
import { Toggle } from './ui';
import { countriesEs } from '@/data/es';
import { countriesEn } from '@/data/en';
import { sources } from '@/data/sources';
import { globalSearch, type SearchHit } from '@/lib/filters';

const kindIcon: Record<SearchHit['kind'], string> = {
  country: '🌍',
  person: '👤',
  service: '⚙️',
  source: '📄',
};

function SearchBar() {
  const { t, lang } = useLang();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const hits = useMemo(() => {
    const countries = (lang === 'es' ? countriesEs : countriesEn).map((c) => ({ id: c.id, name: c.name }));
    return globalSearch(q, {
      countries,
      leaders: t.leadership.leaders.map((l) => ({ name: l.name, role: l.role })),
      services: t.operating.serviceGroups.map((g) => ({ name: g.name, items: g.items })),
      sources,
    });
  }, [q, t, lang]);

  return (
    <div ref={boxRef} className="relative w-full max-w-xs">
      <input
        type="search"
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={t.nav.searchPlaceholder}
        aria-label={t.nav.searchPlaceholder}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm dark:border-white/15 dark:bg-white/5 dark:text-white"
      />
      {open && hits.length > 0 && (
        <ul className="absolute z-40 mt-1 max-h-80 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-marine-900" role="listbox">
          {hits.map((h, i) => (
            <li key={`${h.kind}-${h.label}-${i}`}>
              <a
                href={`#${h.anchor}`}
                onClick={() => { setOpen(false); setQ(''); }}
                className="flex items-start gap-2 px-3 py-2 text-sm hover:bg-mist-100 dark:hover:bg-white/5"
                role="option"
                aria-selected="false"
              >
                <span aria-hidden>{kindIcon[h.kind]}</span>
                <span>
                  <span className="block font-semibold text-marine-950 dark:text-white">{h.label}</span>
                  <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{h.detail}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Header() {
  const { t, lang, setLang } = useLang();
  const { verifiedOnly, setVerifiedOnly, presentation, setPresentation, dark, setDark } = useView();
  const [menu, setMenu] = useState(false);

  return (
    <div className="print-hidden sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-marine-950/90">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-2.5 sm:px-6">
        <a href="#resumen" className="flex items-center gap-2 font-extrabold text-marine-950 dark:text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-marine-900 text-sm font-black text-white dark:bg-abyss-600" aria-hidden>OBT</span>
          <span className="hidden sm:inline">Intelligence Brief</span>
        </a>
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden md:block"><SearchBar /></div>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as 'es' | 'en')}
            aria-label={t.nav.language}
            className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm font-bold dark:border-white/15 dark:bg-white/5 dark:text-white"
          >
            <option value="es">ES</option>
            <option value="en">EN</option>
          </select>
          <button
            onClick={() => setDark(!dark)}
            aria-label={t.nav.theme}
            aria-pressed={dark}
            className="rounded-lg px-2.5 py-1.5 text-lg ring-1 ring-slate-300 dark:ring-white/15"
          >
            {dark ? '☀️' : '🌙'}
          </button>
          <button
            onClick={() => setMenu(!menu)}
            aria-expanded={menu}
            className="rounded-lg px-2.5 py-1.5 text-sm font-bold ring-1 ring-slate-300 dark:ring-white/15 md:hidden"
          >
            ☰
          </button>
        </div>
        <div className="hidden w-full items-center gap-4 border-t border-slate-100 pt-2 md:flex dark:border-white/5">
          <nav aria-label="sections" className="flex flex-wrap gap-x-4 gap-y-1">
            {t.nav.sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="text-sm font-medium text-slate-600 hover:text-marine-950 dark:text-slate-300 dark:hover:text-white">
                {s.label}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <Toggle label={t.nav.verifiedOnly} checked={verifiedOnly} onChange={setVerifiedOnly} />
            <Toggle label={t.nav.presentation} checked={presentation} onChange={setPresentation} />
          </div>
        </div>
      </div>
      {menu && (
        <div className="border-t border-slate-100 px-4 py-3 md:hidden dark:border-white/5">
          <div className="mb-3"><SearchBar /></div>
          <nav aria-label="sections" className="grid gap-1">
            {t.nav.sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} onClick={() => setMenu(false)} className="rounded px-2 py-1.5 text-sm font-medium text-slate-700 hover:bg-mist-100 dark:text-slate-200 dark:hover:bg-white/5">
                {s.label}
              </a>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3 dark:border-white/5">
            <Toggle label={t.nav.verifiedOnly} checked={verifiedOnly} onChange={setVerifiedOnly} />
            <Toggle label={t.nav.presentation} checked={presentation} onChange={setPresentation} />
          </div>
        </div>
      )}
    </div>
  );
}
