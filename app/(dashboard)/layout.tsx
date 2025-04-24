import { ThemeProvider } from 'next-themes';
import { Geist } from 'next/font/google';
import { Kode_Mono } from 'next/font/google';
import { Montserrat } from 'next/font/google';
import '../../styles/globals.css';

import { GoogleAnalytics } from '@next/third-parties/google';

import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Analytics } from '@vercel/analytics/next';

const geist = Geist({
  display: 'swap',
  subsets: ['latin'],
});

const kodeMono = Kode_Mono({
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
});

const montserrat = Montserrat({
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
});

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Dashboard',
  description: 'National Electrical Power System Competition 2025',
};

export default async function DashboardRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-[100svh] bg-gradient-to-b from-[#61CCC2] to-[#FFE08D] md:min-h-screen">
        <NextIntlClientProvider messages={messages}>
          {children} <Analytics />
        </NextIntlClientProvider>
      </body>
      <GoogleAnalytics gaId="G-M9T2Z18PXY" />
    </html>
  );
}
