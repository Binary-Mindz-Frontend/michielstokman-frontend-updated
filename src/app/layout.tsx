import Providers from '@/providers/Providers';
import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import './globals.css';
// import './tw-animate.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://transformtoliberation.com'),
  title: 'Transform to Liberation',
  description: 'Personal website of Michiel Stokman!',
  openGraph: {
    title: 'Transform to Liberation',
    description: 'Personal website of Michiel Stokman!',
    url: '/',
    siteName: 'Transform to Liberation',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Transform to Liberation',
        type: 'image/jpeg',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Transform to Liberation',
    description: 'Personal website of Michiel Stokman!',
    images: ['/og-image.jpg'], // Next.js uses metadataBase to convert this to an absolute URL
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="TTL" />
      </head>
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
