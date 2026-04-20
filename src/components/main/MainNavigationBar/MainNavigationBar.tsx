'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface INavItem {
  label: string;
  href: string;
}

const navItems: INavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Create', href: '/create' },
  { label: 'Profile', href: '/profile' },
  { label: 'Login/Signup', href: '/login' },
];

function MainNavigationBar() {
  const pathname = usePathname();
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="w-full bg-[#FDFCFB]">
      <div
        className={`py-2.5 text-center transition-all duration-500 ${isSticky ? 'h-0 overflow-hidden py-0 opacity-80' : 'opacity-100'}`}
      >
        <h1 className="text-primary text-2xl font-semibold">Transform to Liberation</h1>
      </div>

      <nav
        className={`border-primary/20 z-50 w-full border-t border-b backdrop-blur-md transition-all duration-300 ${
          isSticky ? 'fixed top-0 left-0 bg-[#FDFCFB] py-3' : 'relative py-3'
        }`}
      >
        <ul className="flex items-center justify-center gap-12 text-lg">
          {navItems.map((item) => {
            const isActive = pathname === item?.href;
            return (
              <li key={item?.href} className="group relative">
                <Link
                  href={item?.href}
                  className={`whitespace-nowrap transition-colors duration-300 ${
                    isActive ? 'text-primary' : 'hover:text-primary text-dark-primary'
                  }`}
                >
                  {item?.label}
                </Link>
                {/* Active Underline */}
                <div
                  className={`bg-primary absolute bottom-0 left-1/2 h-[1.5px] -translate-x-1/2 transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </li>
            );
          })}
        </ul>
      </nav>

      {isSticky && <div className="h-15" />}
    </header>
  );
}

export default MainNavigationBar;
