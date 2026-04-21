'use client';

import { useAuthState } from '@/redux/features/auth/authSlice';
import { useAppSelector } from '@/redux/hooks';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface INavItem {
  label: string;
  href: string;
}

function MainNavigationBar() {
  const pathname = usePathname();
  const [isSticky, setIsSticky] = useState(false);

  const { user, isAuthChecked } = useAppSelector(useAuthState);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 🔹 Static nav items (always visible)
  const navItems: INavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Create', href: '/create' },
  ];

  return (
    <header className="w-full bg-[#FDFCFB]">
      {/* Top Title */}
      <div
        className={`py-2.5 text-center transition-all duration-500 ${
          isSticky ? 'h-0 overflow-hidden py-0 opacity-80' : 'opacity-100'
        }`}
      >
        <h1 className="text-primary text-2xl font-semibold">Transform to Liberation</h1>
      </div>

      {/* Navbar */}
      <nav
        className={`border-primary/20 z-50 w-full border-t border-b backdrop-blur-md transition-all duration-300 ${
          isSticky ? 'fixed top-0 left-0 bg-[#FDFCFB] py-3' : 'relative py-3'
        }`}
      >
        <ul className="flex items-center justify-center gap-12 text-lg">
          {/* 🔹 Always visible items */}
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <li key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className={`whitespace-nowrap transition-colors duration-300 ${
                    isActive ? 'text-primary' : 'hover:text-primary text-dark-primary'
                  }`}
                >
                  {item.label}
                </Link>

                <div
                  className={`bg-primary absolute bottom-0 left-1/2 h-[1.5px] -translate-x-1/2 transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </li>
            );
          })}

          {/* 🔥 Auth-based item (controlled render) */}
          <li className="group relative">
            {!isAuthChecked ? (
              // ⏳ ছোট placeholder (no layout shift)
              <span className="opacity-40">...</span>
            ) : (
              <>
                <Link
                  href={user ? '/profile' : '/login'}
                  className={`whitespace-nowrap transition-colors duration-300 ${
                    pathname === (user ? '/profile' : '/login')
                      ? 'text-primary'
                      : 'hover:text-primary text-dark-primary'
                  }`}
                >
                  {user ? 'Profile' : 'Login/Signup'}
                </Link>

                <div
                  className={`bg-primary absolute bottom-0 left-1/2 h-[1.5px] -translate-x-1/2 transition-all duration-300 ${
                    pathname === (user ? '/profile' : '/login')
                      ? 'w-full'
                      : 'w-0 group-hover:w-full'
                  }`}
                />
              </>
            )}
          </li>
        </ul>
      </nav>

      {/* Spacer when sticky */}
      {isSticky && <div className="h-15" />}
    </header>
  );
}

export default MainNavigationBar;
