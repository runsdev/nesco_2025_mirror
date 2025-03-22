import { Kode_Mono, Montserrat } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import LocomotiveProvider from '@/providers/LocomotiveProvider';
import GSAPProvider from '@/providers/GSAPProvider';
import { Navbar, Footer } from '@/components/UI/index';
import Script from 'next/script';
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
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-M9T2Z18PXY" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-M9T2Z18PXY');
          `}
        </Script>
        <link rel="canonical" href="https://nesco.id/" />
      </head>
      <body className={`${kodeMono.className} ${montserrat.className}`}>
        <LocomotiveProvider>
          <GSAPProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <Analytics />
          </GSAPProvider>
        </LocomotiveProvider>
      </body>
    </html>
  );
}
