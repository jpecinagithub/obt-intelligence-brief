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

function NavLink({ id, label }: { id: string; label: string }) {
  return (
    <a
      href={`#${id}`}
      className="group relative whitespace-nowrap px-1 py-2.5 text-[13px] font-semibold tracking-wide text-slate-500 transition-colors duration-300 hover:text-marine-950 dark:text-slate-400 dark:hover:text-white"
    >
      {label}
      <span
        aria-hidden
        className="absolute inset-x-1 -bottom-px h-[2.5px] origin-center scale-x-0 rounded-full bg-gradient-to-r from-abyss-400 via-abyss-600 to-marine-800 transition-transform duration-300 ease-out group-hover:scale-x-100 dark:from-abyss-400 dark:to-abyss-600"
      />
      <span
        aria-hidden
        className="absolute inset-x-1 -bottom-px h-[2.5px] rounded-full bg-abyss-400/0 blur-[3px] transition-all duration-300 group-hover:bg-abyss-400/50"
      />
    </a>
  );
}

/** Toggles reubicados: píldora flotante discreta, fuera del menú */
function FloatingViewOptions() {
  const { t } = useLang();
  const { verifiedOnly, setVerifiedOnly, presentation, setPresentation } = useView();
  return (
    <div className="print-hidden fixed bottom-5 right-5 z-40 flex max-w-[calc(100vw-2.5rem)] items-center gap-4 rounded-full border border-slate-200/80 bg-white/85 py-2 pl-4 pr-5 shadow-xl shadow-marine-950/10 backdrop-blur-md dark:border-white/10 dark:bg-marine-900/85 dark:shadow-black/40">
      <Toggle label={t.nav.verifiedOnly} checked={verifiedOnly} onChange={setVerifiedOnly} />
      <span className="h-5 w-px bg-slate-200 dark:bg-white/10" aria-hidden />
      <Toggle label={t.nav.presentation} checked={presentation} onChange={setPresentation} />
    </div>
  );
}

export default function Header() {
  const { t, lang, setLang } = useLang();
  const { dark, setDark } = useView();
  const [menu, setMenu] = useState(false);

  return (
    <>
      <div className="print-hidden sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-white/10 dark:bg-marine-950/90">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center gap-3 py-2.5">
            <a href="#resumen" className="group flex items-center gap-2.5" aria-label={t.meta.title}>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-marine-900 via-marine-800 to-abyss-600 text-[13px] font-black tracking-tight text-white shadow-md shadow-marine-900/20 transition-transform duration-300 group-hover:scale-105 dark:from-abyss-600 dark:to-marine-800" aria-hidden>
                OBT
              </span>
              <span className="hidden text-[15px] font-extrabold tracking-tight text-marine-950 sm:inline dark:text-white">
                Intelligence Brief
              </span>
            </a>
            <div className="ml-auto flex items-center gap-2.5">
              <div className="hidden md:block"><SearchBar /></div>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as 'es' | 'en')}
                aria-label={t.nav.language}
                className="cursor-pointer rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[13px] font-bold text-slate-600 transition-colors hover:border-abyss-500 hover:text-marine-950 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:border-abyss-400 dark:hover:text-white"
              >
                <option value="es">ES</option>
                <option value="en">EN</option>
              </select>
              <button
                onClick={() => setDark(!dark)}
                aria-label={t.nav.theme}
                aria-pressed={dark}
                className="rounded-lg px-2.5 py-1.5 text-base ring-1 ring-slate-200 transition-all duration-300 hover:ring-abyss-500 dark:ring-white/15 dark:hover:ring-abyss-400"
              >
                <span className="inline-block transition-transform duration-300 hover:rotate-12">{dark ? '☀️' : '🌙'}</span>
              </button>
              <button
                onClick={() => setMenu(!menu)}
                aria-expanded={menu}
                aria-label="menu"
                className="rounded-lg px-2.5 py-1.5 text-sm font-bold ring-1 ring-slate-200 transition-colors hover:ring-abyss-500 md:hidden dark:ring-white/15"
              >
                ☰
              </button>
            </div>
          </div>
          <nav aria-label="sections" className="hidden border-t border-slate-100 md:block dark:border-white/5">
            <div className="flex items-stretch justify-between gap-1">
              {t.nav.sections.map((s) => (
                <NavLink key={s.id} id={s.id} label={s.label} />
              ))}
            </div>
          </nav>
        </div>
        {menu && (
          <div className="border-t border-slate-100 px-4 py-3 md:hidden dark:border-white/5">
            <div className="mb-3"><SearchBar /></div>
            <nav aria-label="sections" className="grid gap-0.5">
              {t.nav.sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={() => setMenu(false)}
                  className="group relative rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-mist-100 hover:text-marine-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
                >
                  <span className="absolute left-0 top-1/2 h-0 w-[3px] -translate-y-1/2 rounded-full bg-gradient-to-b from-abyss-400 to-marine-800 opacity-0 transition-all duration-300 group-hover:h-2/3 group-hover:opacity-100" aria-hidden />
                  <span className="pl-1">{s.label}</span>
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
      <FloatingViewOptions />
    </>
  );
}
