import Providers from '@/providers/Providers';
import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import './globals.css';

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
    images: ['/og-image.jpg'],
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
      <body className="max-w-screen overflow-x-hidden antialiased">
        <Providers>
          {children}
          {/* Brand Toaster without close button */}
          <Toaster position="top-center" expand={false} visibleToasts={3} closeButton={false} />
        </Providers>
      </body>
    </html>
  );
}
