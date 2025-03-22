// import HeaderAuth from '@/components/header-auth';
// import { ThemeSwitcher } from '@/components/theme-switcher';
// import { Geist } from 'next/font/google';
// import { ThemeProvider } from 'next-themes';

import { Kode_Mono } from 'next/font/google';
import { Montserrat } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';

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
import Script from 'next/script';
import '@/styles/globals.css';
import '@/styles/animasi.css';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'NESCO UGM',
  description: 'National Electrical Power System Competition 2025',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <meta property="twitter:image" content="https://nesco.id/opengraph/main.png" />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content="National Electrical Power System Competition 2025" />
      <meta
        property="twitter:description"
        content="NESCO adalah kompetisi nasional yang mengambil tema terkait power system dan tenaga kelistrikan."
      />
      <meta property="og:image" content="https://nesco.id/opengraph/main.png" />
      <meta property="og:site_name" content="NESCO UGM" />
      <meta property="og:title" content="National Electrical Power System Competition 2025" />
      <meta
        property="og:description"
        content="NESCO adalah kompetisi nasional yang mengambil tema terkait power system dan tenaga kelistrikan."
      />
      <meta property="og:url" content="https://nesco.id/" />
      <meta property="og:type" content="website" />
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
            {children}
            <Analytics />
          </GSAPProvider>
        </LocomotiveProvider>
      </body>
    </html>
  );
}
