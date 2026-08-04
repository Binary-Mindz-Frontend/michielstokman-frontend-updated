'use client';

import { useAuthState } from '@/redux/features/auth/authSlice';
import { useAppSelector } from '@/redux/hooks';
import { Menu, X, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import logoSvg from '@/assets/navbar/logo.svg';
import activeBrush from '@/assets/navbar/navbar-active-brush.svg';

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
      setIsSticky(window.scrollY > 50);
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
    { label: 'ABOUT', href: '/about' },
    { label: 'CONFESSIONS', href: '/confessions' },
    { label: 'MEDITATIONS', href: '/meditations' },
    { label: 'LIBERATIONS', href: '/liberations' },
    { label: 'SAFETY', href: '/safety-freedom-rules' },
    { label: 'SUBMIT', href: '/create' },
  ];

  let redirectPath: string;
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
    <>
      <header
        className={`z-50 w-full transition-all duration-300 ${
          isSticky
            ? 'fixed top-0 left-0 bg-[#FDFCFB]/95 shadow-sm backdrop-blur-md'
            : 'relative bg-[#FDFCFB]'
        }`}
      >
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 md:px-12">
          {/* ================= LOGO ================= */}
          <Link
            href="/"
            className="relative z-50 flex items-center"
            onClick={() => setIsOpen(false)}
          >
            <div className="relative h-10 w-16 md:h-12 md:w-20">
              <Image src={logoSvg} alt="TTL Logo" fill className="object-contain" priority />
            </div>
          </Link>

          {/* ================= MOBILE CONTROLS (USER ICON + MENU TOGGLE) ================= */}
          <div className="z-50 flex items-center gap-3 md:hidden">
            {/* Show user profile icon on left side of the three line menu button ONLY when logged in */}
            {user && (
              <Link
                href={redirectPath}
                onClick={() => setIsOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F4F6] text-black shadow-sm transition-colors hover:bg-[#E5E7EB]"
                aria-label="User Profile"
              >
                <User size={18} strokeWidth={2} />
              </Link>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer p-1 text-black transition-colors hover:text-gray-600"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* ================= NAVIGATION LINKS ================= */}
          <ul
            className={`fixed top-0 right-0 z-40 flex h-screen w-full flex-col items-center justify-center gap-8 bg-[#FDFCFB] px-6 text-lg transition-all duration-300 ease-in-out md:static md:h-auto md:w-auto md:flex-row md:gap-3.5 md:bg-transparent md:px-0 md:text-xs md:opacity-100 lg:gap-7 lg:text-sm xl:gap-10 xl:text-base ${
              isOpen
                ? 'pointer-events-auto translate-x-0 opacity-100'
                : 'pointer-events-none translate-x-full opacity-0 md:pointer-events-auto md:translate-x-0'
            }`}
          >
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

              return (
                <li key={item.href} className="relative" onClick={() => setIsOpen(false)}>
                  <Link
                    href={item.href}
                    className={`font-playpen font-semibold tracking-wider whitespace-nowrap transition-colors duration-300 ${
                      isActive ? 'text-black' : 'text-black hover:text-gray-600'
                    }`}
                  >
                    {item.label}
                  </Link>

                  {/* Active Brush SVG */}
                  <div
                    className={`absolute -bottom-3 left-1/2 h-3 w-full -translate-x-1/2 transition-opacity duration-300 ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <Image
                      src={activeBrush}
                      alt="active indicator"
                      fill
                      className="object-contain"
                    />
                  </div>
                </li>
              );
            })}

            {/* Mobile-only Auth Link - Shown inside drawer ONLY when NOT logged in */}
            {!user && (
              <li className="mt-8 md:hidden" onClick={() => setIsOpen(false)}>
                <Link
                  href={redirectPath}
                  className="font-playpen font-semibold tracking-wider text-black transition-colors hover:text-gray-600"
                >
                  SIGN IN
                </Link>
              </li>
            )}
          </ul>

          {/* ================= DESKTOP AUTH (SIGN IN / USER ICON) ================= */}
          <div className="hidden min-w-25 items-center justify-end md:flex">
            <Link
              href={redirectPath}
              className="group relative flex items-center justify-center transition-transform hover:scale-105"
            >
              {user ? (
                // User Profile Icon (Logged In)
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F3F4F6] text-black shadow-sm transition-colors group-hover:bg-[#E5E7EB]">
                  <User size={22} strokeWidth={2} />
                </div>
              ) : (
                // Sign In Text (Logged Out)
                <span className="font-playpen text-[15px] font-semibold tracking-wider text-black transition-colors group-hover:text-gray-600">
                  SIGN IN
                </span>
              )}
            </Link>
          </div>
        </nav>
      </header>
      {isSticky && <div className="h-19" />}
    </>
  );
}

export default MainNavigationBar;
