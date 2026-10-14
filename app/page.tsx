'use client';

import Header from '@/components/Header';
import Hero from '@/components/sections/Hero';
import Summary from '@/components/sections/Summary';
import History from '@/components/sections/History';
import Operating from '@/components/sections/Operating';
import Africa from '@/components/sections/Africa';
import Government from '@/components/sections/Government';
import Workforce from '@/components/sections/Workforce';
import Finance from '@/components/sections/Finance';
import Press from '@/components/sections/Press';
import SierraLeone, { SierraLeonePrint } from '@/components/sections/SierraLeone';
import Sources from '@/components/sections/Sources';
import { useLang } from '@/components/providers';

function Footer() {
  const { t } = useLang();
  return (
    <footer className="print-hidden border-t border-slate-200 bg-marine-950 py-10 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-sm font-bold text-white">{t.footer.author} · jpecina@gmail.com</p>
        <p className="detail-text mt-2 max-w-3xl text-xs text-slate-400">{t.footer.disclaimer}</p>
        <p className="mt-2 text-xs text-slate-500">{t.footer.cutoff} · {t.meta.entityWarning}</p>
      </div>
    </footer>
  );
}

export default function Page() {
  return (
    <>
      <div className="print-hidden">
        <Header />
        <main>
          <Hero />
          <Summary />
          <History />
          <Operating />
          <Africa />
          <Government />
          <Workforce />
          <Finance />
          <Press />
          <SierraLeone />
          <Sources />
        </main>
        <Footer />
      </div>
      <SierraLeonePrint />
    </>
  );
}
