'use client';

import Link from 'next/link';
import { useLang } from '@/components/providers';
import Header from '@/components/Header';

export default function MethodologyPage() {
  const { t } = useLang();
  const m = t.methodology;
  return (
    <div className="print-hidden">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <p className="mb-4 text-sm">
          <Link href="/" className="font-bold text-abyss-600 underline underline-offset-2 dark:text-abyss-400">← {t.meta.title}</Link>
        </p>
        <h1 className="text-3xl font-extrabold text-marine-950 dark:text-white">{m.title}</h1>
        <p className="mt-2 text-sm text-slate-500">{t.meta.cutoff}</p>

        <Block title={m.scopeTitle} items={m.scope} />
        <Block title={m.limitsTitle} items={m.limits} />
        <Block title={m.rulesTitle} items={m.rules} />
        <Block title={m.missingTitle} items={m.missing} />
      </main>
    </div>
  );
}

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold text-marine-950 dark:text-white">{title}</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600 dark:text-slate-300">
        {items.map((it, i) => <li key={i}>{it}</li>)}
      </ul>
    </section>
  );
}
