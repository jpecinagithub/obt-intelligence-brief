import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';
import { LangProvider, ViewProvider } from '@/components/providers';
import SwRegister from '@/components/SwRegister';

export const metadata: Metadata = {
  title: 'OBT Intelligence Brief',
  description: 'Dossier corporativo ejecutivo de OBT Group con foco en Sierra Leona. / Executive corporate dossier on OBT Group with a focus on Sierra Leone.',
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a1c38',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-white text-slate-900 antialiased dark:bg-marine-950 dark:text-slate-100">
        <LangProvider>
          <ViewProvider>{children}</ViewProvider>
        </LangProvider>
        <SwRegister />
        <Analytics />
      </body>
    </html>
  );
}
