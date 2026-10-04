import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/lib/store';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'EYG Auto Care Shop — Change Oil, PMS, Detailing',
  description:
    'EYG Auto Care Shop. Change oil, PMS, car wash, detailing, brakes, undercoating. Presyong shop, walang tago.',
  openGraph: {
    title: 'EYG Auto Care Shop',
    description: 'PMS in 45 minutes. Record kept. Change oil, brakes, detailing.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <StoreProvider>
          <SiteHeader />
          <main className="min-h-[70vh]">{children}</main>
          <SiteFooter />
        </StoreProvider>
      </body>
    </html>
  );
}
