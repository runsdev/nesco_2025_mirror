import { Kode_Mono, Montserrat } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import LocomotiveProvider from '@/providers/LocomotiveProvider';
import GSAPProvider from '@/providers/GSAPProvider';
import { GoogleAnalytics } from '@next/third-parties/google';
import '@/styles/globals.css';
import '@/styles/animasi.css';

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
  title: 'NESCO UGM - National Electrical Power System Competition 2025',
  description:
    'NESCO adalah kompetisi nasional yang mengambil tema terkait power system dan tenaga kelistrikan.',
  openGraph: {
    title: 'National Electrical Power System Competition 2025',
    description:
      'NESCO adalah kompetisi nasional yang mengambil tema terkait power system dan tenaga kelistrikan.',
    url: 'https://nesco.id/',
    siteName: 'NESCO UGM',
    images: [
      {
        url: 'https://nesco.id/opengraph/main.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'National Electrical Power System Competition 2025',
    description:
      'NESCO adalah kompetisi nasional yang mengambil tema terkait power system dan tenaga kelistrikan.',
    images: ['https://nesco.id/opengraph/main.png'],
  },
  robots: 'index, follow',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://nesco.id/" />
      </head>
      <body className={`${kodeMono.className} ${montserrat.className}`}>
        <LocomotiveProvider>
          <GSAPProvider>
            <main>{children}</main>
            <Analytics />
          </GSAPProvider>
        </LocomotiveProvider>
      </body>
      <GoogleAnalytics gaId="G-M9T2Z18PXY" />
    </html>
  );
}
