import HeaderAuth from '@/components/header-auth';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Geist } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import Link from 'next/link';
import LocomotiveProvider from '@/providers/LocomotiveProvider';
import { Navbar, Footer } from '@/components/UI/index';
import '../../styles/globals.css';
import '../../styles/animasi.css';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'NESCO 2025',
  description: 'National Electrical Power System Competition 2025',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <LocomotiveProvider>
          <Navbar />
          {children}
          <Footer />
        </LocomotiveProvider>
      </body>
    </html>
  );
}
