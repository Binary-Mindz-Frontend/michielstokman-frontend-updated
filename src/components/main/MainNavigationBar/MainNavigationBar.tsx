'use client';

import { useAuthState } from '@/redux/features/auth/authSlice';
import { useAppSelector } from '@/redux/hooks';
import { Menu, X } from 'lucide-react';
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
  const [isOpen, setIsOpen] = useState(false);

  const { user } = useAppSelector(useAuthState);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navItems: INavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Create', href: '/create' },
    { label: 'About', href: '/about' },
    { label: 'Safety Rules', href: '/safety-freedom-rules' },
  ];

  let redirectPath;
  if (user) {
    if (user.is_admin) {
      redirectPath = '/dashboard/overview';
    } else {
      redirectPath = '/profile';
    }
  } else {
    redirectPath = '/login';
  }

  return (
    <header className="z-50 w-full bg-[#FDFCFB]">
      <div
        className={`hidden py-2.5 text-center transition-all duration-500 md:block ${
          isSticky ? 'h-0 overflow-hidden py-0 opacity-80' : 'opacity-100'
        }`}
      >
        <h1 className="text-primary text-2xl font-semibold">Transform to Liberation</h1>
      </div>

      {/* Navbar */}
      <nav
        className={`border-primary/20 z-50 w-full border-t border-b backdrop-blur-md transition-all duration-300 ${
          isSticky ? 'fixed top-0 right-0 bg-[#FDFCFB] py-3' : 'relative py-3'
        }`}
      >
        <div className="flex w-full items-center justify-between px-4 md:hidden">
          <Link
            href="/"
            className="text-primary text-xl font-semibold"
            onClick={() => setIsOpen(false)}
          >
            Transform to Liberation
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-dark-primary hover:text-primary cursor-pointer p-1 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <ul
          className={`border-primary/10 fixed top-0 right-0 z-40 flex h-screen w-[80%] flex-col items-center justify-start gap-8 border-l bg-[#FDFCFB] px-6 py-20 text-lg shadow-2xl transition-all duration-300 ease-in-out sm:w-[60%] md:pointer-events-auto md:static md:flex md:h-auto md:w-auto md:flex-row md:items-center md:justify-center md:gap-12 md:bg-transparent md:p-0 md:opacity-100 ${isOpen ? 'pointer-events-auto translate-x-0 opacity-100' : 'pointer-events-none translate-x-full opacity-0 md:translate-x-0'} `}
        >
          <li className="absolute top-4 left-4 md:hidden">
            <button
              onClick={() => setIsOpen(false)}
              className="text-dark-primary cursor-pointer p-1"
            >
              <X size={22} />
            </button>
          </li>

          {/* Always visible items */}
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <li key={item.href} className="group relative" onClick={() => setIsOpen(false)}>
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

          <li className="group relative" onClick={() => setIsOpen(false)}>
            <Link
              href={redirectPath}
              className={`whitespace-nowrap transition-colors duration-300 ${
                pathname === redirectPath ? 'text-primary' : 'hover:text-primary text-dark-primary'
              }`}
            >
              {user ? (user.is_admin ? 'Dashboard' : 'Profile') : 'Login/Signup'}
            </Link>

            <div
              className={`bg-primary absolute bottom-0 left-1/2 h-[1.5px] -translate-x-1/2 transition-all duration-300 ${
                pathname === redirectPath ? 'w-full' : 'w-0 group-hover:w-full'
              }`}
            />
          </li>
        </ul>
      </nav>

      {/* Spacer when sticky */}
      {isSticky && <div className="h-15" />}
    </header>
  );
}

export default MainNavigationBar;
