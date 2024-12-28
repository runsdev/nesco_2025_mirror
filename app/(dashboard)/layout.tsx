import { ThemeProvider } from 'next-themes';
import { Geist } from 'next/font/google';
import '../../styles/globals.css';

const geistSans = Geist({
  display: 'swap',
  subsets: ['latin'],
});

export default function DashboardRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
