import type { Metadata } from 'next';
import { Bodoni_Moda, Public_Sans, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';
import { PageShell } from '@/components/layout/PageShell';

const bodoniModa = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-display',
  display: 'swap',
});

const publicSans = Public_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Glowrie — Perpetual Alchemy',
  description:
    'Glowrie — clinically formulated, transparently delivered skincare. Browse the collection.',
};

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bodoniModa.variable} ${publicSans.variable} ${jetBrainsMono.variable}`}>
      <body className="font-body">
        <PageShell>{children}</PageShell>
      </body>
    </html>
  );
}
