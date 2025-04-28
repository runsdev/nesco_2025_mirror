import HeaderAuth from '@/components/header-auth';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Geist, Kode_Mono, Montserrat } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import Link from 'next/link';
import '../../styles/globals.css';
import { cn } from '@/lib/utils';
import { Analytics } from '@vercel/analytics/next';
import { GoogleAnalytics } from '@next/third-parties/google';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Sign In to NESCO',
  description: 'Enroll yourself to this prestigious electrical power system event',
};

const geistSans = Geist({
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  return (
    <>
      {/* // <html lang={locale} className={geistSans.className} suppressHydrationWarning> */}
      <div
        className={cn(
          'bg-background text-foreground',
          `${kodeMono.className} ${montserrat.className}`,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <div className="flex min-h-screen flex-col items-center">
              <div className="flex w-full flex-1 flex-col items-center">
                {/* <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                  <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                    <div className="flex gap-5 items-center font-semibold">
                      <Link href={'/'}>NESCO 2025</Link>
                    </div>
                    <HeaderAuth />
                  </div>
                </nav> */}
                <div className="min-w-full">
                  {children} <Analytics />
                </div>

                {/* <footer className="mx-auto flex w-full items-center justify-between gap-8 border-t py-6 text-center text-xs">
                  <p className="ml-8">Powered by NESCO 2025</p>
                  <div className="mr-8 flex gap-4">
                    <ThemeSwitcher />
                    <LocaleSwitcher />
                  </div>
                </footer> */}
              </div>
            </div>
          </NextIntlClientProvider>
        </ThemeProvider>
      </div>
      <GoogleAnalytics gaId="G-M9T2Z18PXY" />
      {/* </div> */}
    </>
  );
}
