import Providers from '@/providers/Providers';
import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'michielstokman',
  description: 'Personal website of Michiel Stokman!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="max-w-screen overflow-x-hidden antialiased"
        style={{ fontFamily: '"Times New Roman", Times, serif' }}
      >
        <Providers>
          {children}
          {/* Toaster */}
          <Toaster position="top-center" richColors theme="light" />
        </Providers>
      </body>
    </html>
  );
}
