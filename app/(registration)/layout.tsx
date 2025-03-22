// import HeaderAuth from '@/components/header-auth';
// import { ThemeSwitcher } from '@/components/theme-switcher';
// import { Geist } from 'next/font/google';
// import { ThemeProvider } from 'next-themes';

import { Kode_Mono } from 'next/font/google';
import { Montserrat } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import Script from 'next/script';

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

import LocomotiveProvider from '@/providers/LocomotiveProvider';
import GSAPProvider from '@/providers/GSAPProvider';
import { Navbar, Footer } from '@/components/UI/index';
import '@/styles/globals.css';
import '@/styles/animasi.css';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'NESCO Registration',
  description: 'National Electrical Power System Competition 2025',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-M9T2Z18PXY" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-M9T2Z18PXY');
      `,
          }}
        />
      </head>
      <body className={`${kodeMono.className} ${montserrat.className}`}>
        <LocomotiveProvider>
          <GSAPProvider>
            <Navbar />
            {children}
            <Analytics />
            <Footer />
          </GSAPProvider>
        </LocomotiveProvider>
      </body>
    </html>
  );
}
