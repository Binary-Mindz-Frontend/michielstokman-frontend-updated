'use client';

import { useAuthState } from '@/redux/features/auth/authSlice';
import { useGetProfileQuery } from '@/redux/features/userProfile/userProfile.api';
import { useAppSelector } from '@/redux/hooks';
import { useLogout } from '@/hooks/useLogout';
import { Menu, X, User, LayoutGrid, LogOut } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import logoSvg from '@/assets/navbar/logo.svg';
import activeBrush from '@/assets/navbar/navbar-active-brush.svg';

interface INavItem {
  label: string;
  href: string;
}

function MainNavigationBar() {
  const pathname = usePathname();
  const logout = useLogout();
  const [isSticky, setIsSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { user } = useAppSelector(useAuthState);
  const { data: profileResponse } = useGetProfileQuery(undefined, { skip: !user });
  const profileData = profileResponse?.data;

  const userName = profileData?.true_name || (user?.email ? user.email.split('@')[0] : 'User');
  const userEmail = user?.email || profileData?.email || '';

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
      redirectPath = '/user-dashboard';
    }
  } else {
    redirectPath = '/login';
  }

  const dashboardHref = user?.is_admin ? '/dashboard/overview' : '/user-dashboard';

  return (
    <>
      <header
        className={`z-50 w-full transition-all duration-300 ${
          isSticky
            ? 'fixed top-0 left-0 bg-[#FDFCFB]/95 shadow-sm backdrop-blur-md'
            : 'relative bg-[#FDFCFB]'
        }`}
      >
        <nav className="mx-auto flex w-full max-w-350 items-center justify-between px-4 py-4">
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
            {/* Show user profile icon button on mobile header when logged in */}
            {user && (
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F4F6] text-black shadow-sm transition-colors hover:bg-[#E5E7EB]"
                aria-label="User Menu"
              >
                <User size={18} strokeWidth={2} />
              </button>
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
            className={`fixed top-0 right-0 z-40 flex h-screen w-full flex-col items-center justify-center gap-6 bg-[#FDFCFB] px-6 text-lg transition-all duration-300 ease-in-out md:static md:h-auto md:w-auto md:flex-row md:gap-3.5 md:bg-transparent md:px-0 md:text-xs md:opacity-100 lg:gap-7 lg:text-sm xl:gap-10 xl:text-base ${
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

            {/* Mobile-only Logged In Profile & Dashboard Links inside Mobile Drawer */}
            {user ? (
              <li className="mt-4 flex w-full max-w-xs flex-col items-center border-t border-gray-200 pt-6 md:hidden">
                {/* User Info Header */}
                <div className="mb-4 flex flex-col items-center text-center">
                  <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-[#D98755] text-white shadow-sm">
                    <User size={20} strokeWidth={2} />
                  </div>
                  <h4 className="font-playpen text-base font-bold text-gray-900">{userName}</h4>
                  <p className="text-xs text-gray-500">{userEmail}</p>
                </div>

                {/* Profile & Dashboard Navigation Options */}
                <div className="flex w-full flex-col gap-2.5">
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="font-playpen flex w-full items-center justify-center gap-2 rounded-xl border border-[#EBE4D5] bg-[#FAF7F2] px-4 py-2.5 text-xs font-semibold text-gray-800 transition-colors hover:bg-[#F3EFE6]"
                  >
                    <User size={16} className="text-[#D98755]" />
                    <span>PROFILE</span>
                  </Link>

                  <Link
                    href={dashboardHref}
                    onClick={() => setIsOpen(false)}
                    className="font-playpen flex w-full items-center justify-center gap-2 rounded-xl border border-[#EBE4D5] bg-[#FAF7F2] px-4 py-2.5 text-xs font-semibold text-gray-800 transition-colors hover:bg-[#F3EFE6]"
                  >
                    <LayoutGrid size={16} className="text-[#D98755]" />
                    <span>DASHBOARD</span>
                  </Link>

                  <button
                    onClick={() => {
                      setIsOpen(false);
                      logout();
                    }}
                    className="font-playpen flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
                  >
                    <LogOut size={16} />
                    <span>LOG OUT</span>
                  </button>
                </div>
              </li>
            ) : (
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

          {/* ================= DESKTOP AUTH (ORIGINAL CIRCULAR USER ICON + CLICK DROPDOWN) ================= */}
          <div className="hidden min-w-25 items-center justify-end md:flex">
            {user ? (
              <div className="relative" ref={userMenuRef}>
                {/* Original Circular User Profile Icon */}
                <button
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-[#F3F4F6] text-black shadow-sm transition-colors hover:bg-[#E5E7EB] focus:outline-none"
                  aria-label="User Profile Menu"
                >
                  <User size={22} strokeWidth={2} />
                </button>

                {/* Dropdown Menu shown on click */}
                {isUserMenuOpen && (
                  <div className="animate-in fade-in zoom-in-95 absolute right-0 z-50 mt-2 w-64 rounded-xl border border-gray-100 bg-white p-3 shadow-xl duration-150">
                    {/* User Name & Email Header */}
                    <div className="mb-2 flex items-center gap-3 border-b border-gray-100 px-3 py-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D98755] font-bold text-white">
                        <User size={18} strokeWidth={2} />
                      </div>
                      <div className="flex flex-col overflow-hidden text-left">
                        <p className="font-playpen truncate text-sm font-bold text-gray-900">
                          {userName}
                        </p>
                        {userEmail && <p className="truncate text-xs text-gray-500">{userEmail}</p>}
                      </div>
                    </div>

                    {/* Navigation Options */}
                    <div className="space-y-1">
                      <Link
                        href="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-[#FAF7F2] hover:text-[#D98755]"
                      >
                        <User size={16} className="text-[#D98755]" />
                        <span>Profile</span>
                      </Link>

                      <Link
                        href={dashboardHref}
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-[#FAF7F2] hover:text-[#D98755]"
                      >
                        <LayoutGrid size={16} className="text-[#D98755]" />
                        <span>Dashboard</span>
                      </Link>

                      <div className="my-1 border-t border-gray-100" />

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                      >
                        <LogOut size={16} />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Sign In Text (Logged Out)
              <div className="relative">
                <Link
                  href={redirectPath}
                  className={`font-playpen font-semibold tracking-wider whitespace-nowrap transition-colors duration-300 md:text-xs lg:text-sm xl:text-base ${
                    pathname === '/login' ? 'text-black' : 'text-black hover:text-gray-600'
                  }`}
                >
                  SIGN IN
                </Link>

                {/* Active Brush SVG */}
                <div
                  className={`absolute -bottom-3 left-1/2 h-3 w-full -translate-x-1/2 transition-opacity duration-300 ${
                    pathname === '/login' ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Image src={activeBrush} alt="active indicator" fill className="object-contain" />
                </div>
              </div>
            )}
          </div>
        </nav>
      </header>
      {isSticky && <div className="h-19" />}
    </>
  );
}

export default MainNavigationBar;
