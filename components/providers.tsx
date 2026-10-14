'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Dictionary } from '@/data/types';
import { es } from '@/data/es';
import { en } from '@/data/en';

export type Lang = 'es' | 'en';

function readParam(key: string): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get(key);
}

function writeParam(key: string, value: string | null) {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  if (value === null || value === '') url.searchParams.delete(key);
  else url.searchParams.set(key, value);
  window.history.replaceState(null, '', url.toString());
}

function useQueryState(key: string, initial: string): [string, (v: string) => void] {
  const [value, setValue] = useState(initial);
  useEffect(() => {
    const p = readParam(key);
    if (p !== null) setValue(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const set = useCallback(
    (v: string) => {
      setValue(v);
      writeParam(key, v === initial ? null : v);
    },
    [key, initial],
  );
  return [value, set];
}

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dictionary;
}

const LangContext = createContext<LangCtx>({ lang: 'es', setLang: () => {}, t: es });

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [raw, setRaw] = useQueryState('lang', 'es');
  const lang: Lang = raw === 'en' ? 'en' : 'es';

  useEffect(() => {
    try {
      const saved = localStorage.getItem('obt-lang');
      if (!readParam('lang') && (saved === 'es' || saved === 'en')) setRaw(saved);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLang = useCallback(
    (l: Lang) => {
      setRaw(l);
      try {
        localStorage.setItem('obt-lang', l);
      } catch {}
      document.documentElement.lang = l;
    },
    [setRaw],
  );

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t: lang === 'es' ? es : en }), [lang, setLang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

interface ViewCtx {
  verifiedOnly: boolean;
  setVerifiedOnly: (v: boolean) => void;
  presentation: boolean;
  setPresentation: (v: boolean) => void;
  selectedCountry: string | null;
  setSelectedCountry: (id: string | null) => void;
  selectedYear: number | null;
  setSelectedYear: (y: number | null) => void;
  dark: boolean;
  setDark: (v: boolean) => void;
}

const ViewContext = createContext<ViewCtx>({
  verifiedOnly: false,
  setVerifiedOnly: () => {},
  presentation: false,
  setPresentation: () => {},
  selectedCountry: null,
  setSelectedCountry: () => {},
  selectedYear: null,
  setSelectedYear: () => {},
  dark: false,
  setDark: () => {},
});

export function ViewProvider({ children }: { children: React.ReactNode }) {
  const [verifiedRaw, setVerifiedRaw] = useQueryState('verified', '0');
  const [presentRaw, setPresentRaw] = useQueryState('present', '0');
  const [countryRaw, setCountryRaw] = useQueryState('country', '');
  const [yearRaw, setYearRaw] = useQueryState('fyear', '');
  const [dark, setDarkState] = useState(false);

  useEffect(() => {
    try {
      setDarkState(localStorage.getItem('obt-theme') === 'dark');
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.classList.toggle('presentation', presentRaw === '1');
    try {
      localStorage.setItem('obt-theme', dark ? 'dark' : 'light');
    } catch {}
  }, [dark, presentRaw]);

  const setDark = useCallback((v: boolean) => setDarkState(v), []);

  const value = useMemo<ViewCtx>(
    () => ({
      verifiedOnly: verifiedRaw === '1',
      setVerifiedOnly: (v) => setVerifiedRaw(v ? '1' : '0'),
      presentation: presentRaw === '1',
      setPresentation: (v) => setPresentRaw(v ? '1' : '0'),
      selectedCountry: countryRaw || null,
      setSelectedCountry: (id) => setCountryRaw(id ?? ''),
      selectedYear: yearRaw ? Number(yearRaw) : null,
      setSelectedYear: (y) => setYearRaw(y === null ? '' : String(y)),
      dark,
      setDark,
    }),
    [verifiedRaw, presentRaw, countryRaw, yearRaw, dark, setVerifiedRaw, setPresentRaw, setCountryRaw, setYearRaw, setDark],
  );
  return <ViewContext.Provider value={value}>{children}</ViewContext.Provider>;
}

export const useView = () => useContext(ViewContext);
