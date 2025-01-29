import '../styles/globals.css';
import '../styles/animasi.css';
import { Kode_Mono } from 'next/font/google';
import { Montserrat } from 'next/font/google';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

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

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'NESCO 2025',
  description: 'National Electrical Power System Competition 2025',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${kodeMono.className} ${montserrat.className}`}>{children}</body>
    </html>
  );
}
