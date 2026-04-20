'use client';

import MainFooter from '@/components/main/MainFooter/MainFooter';
import MainNavigationBar from '@/components/main/MainNavigationBar/MainNavigationBar';
import { usePathname } from 'next/navigation';
import React from 'react';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const allowedPaths = ['/', '/create', '/profile'];
  const shouldShowLayout = allowedPaths.includes(pathname);

  return (
    <section className="min-h-screen bg-[#FAF7F5]">
      {shouldShowLayout && <MainNavigationBar />}
      {children}
      <MainFooter />
    </section>
  );
};

export default MainLayout;
