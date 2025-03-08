import { ThemeProvider } from 'next-themes';
import { Geist } from 'next/font/google';
import { Kode_Mono } from 'next/font/google';
import { Montserrat } from 'next/font/google';
import '../../styles/globals.css';

import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

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

export default async function DashboardRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
