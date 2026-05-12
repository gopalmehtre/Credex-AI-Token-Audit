// src/app/layout.tsx
import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans, JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['700', '800', '900'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://spendsight.io';

export const metadata: Metadata = {
  title: 'SpendSight — Free AI Spend Audit for Startups',
  description:
    'Find out if your startup is overspending on AI tools. Get an instant audit of Cursor, Claude, ChatGPT, GitHub Copilot and more — with specific savings recommendations.',
  metadataBase: new URL(APP_URL),
  openGraph: {
    title: 'SpendSight — Free AI Spend Audit',
    description:
      'Find out if your startup is overspending on AI tools. Instant, free audit.',
    url: APP_URL,
    siteName: 'SpendSight',
    type: 'website',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SpendSight — Free AI Spend Audit',
    description: 'Find out if your startup is overspending on AI tools.',
    images: ['/og-default.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${playfair.variable} ${dmSans.variable} ${jetbrains.variable}`}>
      <body className="bg-ink-950 text-ink-100 font-body antialiased" suppressHydrationWarning>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#14141f',
              border: '1px solid #363649',
              color: '#e8e8ed',
            },
          }}
        />
      </body>
    </html>
  );
}
