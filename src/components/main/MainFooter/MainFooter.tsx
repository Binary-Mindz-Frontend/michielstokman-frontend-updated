'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuthState } from '@/redux/features/auth/authSlice';
import { useAppSelector } from '@/redux/hooks';

// Assets
import greenWaves from '@/assets/home/green-waves.png';
import pinkHeartDrawn from '@/assets/home/pink-heart-drawn.png';
import pinkUnderline from '@/assets/home/pink-underline.png';

function MainFooter() {
  const { user } = useAppSelector(useAuthState);
  let redirectPath = '/login';
  if (user) {
    redirectPath = user.is_admin ? '/dashboard/overview' : '/profile';
  }

  return (
    <footer className="mt-14 w-full border-t border-[#EFEADF] bg-[#FAF7F2] pt-10 pb-8 sm:mt-20 sm:pt-12 sm:pb-10">
      <div className="mx-auto w-full max-w-350 px-4">
        {/* Main Footer Row */}
        <div className="flex flex-col items-center justify-between gap-8 border-b border-[#EBE4D5] pb-8 sm:pb-10 md:flex-row md:items-start md:gap-4 lg:gap-8 xl:gap-12">
          {/* Brand Column */}
          <div className="flex max-w-sm flex-col items-center text-center md:items-start md:text-left">
            <div className="flex items-center gap-2">
              <div className="relative">
                <h3 className="font-edo text-xl font-bold tracking-wide text-[#1A1A1A] uppercase sm:text-2xl">
                  <span className="text-[#486221]">Transform</span> To{' '}
                  <span className="text-[#E81A66]">Liberation</span>
                </h3>
                <div className="relative mt-1 h-1.5 w-full">
                  <Image src={pinkUnderline} alt="underline" fill className="object-cover" />
                </div>
              </div>
              <div className="relative h-6 w-6 shrink-0 -translate-y-1 sm:h-7 sm:w-7">
                <Image src={pinkHeartDrawn} alt="Heart" fill className="object-contain" />
              </div>
            </div>

            <p className="font-playpen mt-3 text-xs leading-relaxed font-semibold text-[#555] sm:mt-3.5 sm:text-sm">
              A space to be real, to feel deep, to transform without asking permission.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="flex w-full max-w-xs flex-col items-center sm:max-w-none md:w-auto md:items-start">
            <h4 className="font-edo mb-3 text-xs font-bold tracking-widest text-[#486221] uppercase sm:mb-3.5">
              Explore
            </h4>
            <ul className="font-playpen flex flex-wrap justify-center gap-x-5 gap-y-2 text-center text-xs font-bold text-[#1A1A1A] sm:gap-6 md:flex-col md:gap-2 md:text-left lg:flex-row lg:gap-5">
              <li>
                <Link href="/" className="transition-colors hover:text-[#E81A66]">
                  HOME
                </Link>
              </li>
              <li>
                <Link href="/confessions" className="transition-colors hover:text-[#E81A66]">
                  CONFESSIONS
                </Link>
              </li>
              <li>
                <Link href="/meditations" className="transition-colors hover:text-[#F3A134]">
                  MEDITATIONS
                </Link>
              </li>
              <li>
                <Link href="/liberations" className="transition-colors hover:text-[#54318C]">
                  LIBERATIONS
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition-colors hover:text-[#E81A66]">
                  ABOUT
                </Link>
              </li>
              <li>
                <Link
                  href="/safety-freedom-rules"
                  className="transition-colors hover:text-[#E81A66]"
                >
                  SAFETY RULES
                </Link>
              </li>
            </ul>
          </div>

          {/* Account CTA Column */}
          <div className="flex w-full shrink-0 flex-col items-center text-center md:w-auto md:items-end md:text-right">
            <div className="relative mb-1.5 h-4 w-12 sm:mb-2 sm:h-4.5 sm:w-14">
              <Image src={greenWaves} alt="decoration" fill className="object-contain" />
            </div>
            <p className="font-playpen mb-3 text-xs font-bold text-[#4A3628]">
              Ready to begin your journey?
            </p>
            <Link
              href={redirectPath}
              className="font-edo rounded-sm bg-[#D22D4C] px-5 py-2.5 text-xs font-bold tracking-widest whitespace-nowrap text-white uppercase transition-all hover:bg-[#b5243f] sm:px-6"
            >
              {user ? (user.is_admin ? 'Dashboard' : 'My Profile') : 'Join For Free →'}
            </Link>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="font-playpen mt-6 flex flex-col items-center justify-between gap-2.5 text-center text-[11px] font-semibold text-[#777] sm:flex-row sm:text-left sm:text-xs">
          <p>© {new Date().getFullYear()} TRANSFORM TO LIBERATION. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-1.5">
            <span>Made with</span>
            <div className="relative h-3.5 w-3.5 shrink-0">
              <Image src={pinkHeartDrawn} alt="Heart" fill className="object-contain" />
            </div>
            <span>for authentic souls.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default MainFooter;
