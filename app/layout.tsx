import Providers from '@/context/providers';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Faticalendar',
  description: 'Visualize your life in months'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-vintage-cream text-vintage-green`}>
        <Analytics />
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
