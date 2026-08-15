/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import btnBg from '@/assets/shared/btnBg.png';
import submitSuccessBg from '@/assets/shared/submit-success.png';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { apiClient } from '@/redux/apiClient/apiClient';
import { logout as authLogout, useCurrentUser } from '@/redux/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logoutUser } from '@/services/auth/auth.service';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose?: () => void;
  redirectUrl?: string;
}

export default function LoginRequiredModal({
  isOpen,
  onClose,
  redirectUrl = '/login',
}: LoginRequiredModalProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(useCurrentUser) as any;
  const isGuest = user?.is_guest;

  const handleLogin = async () => {
    if (onClose) onClose();
    dispatch(authLogout());
    dispatch(apiClient.util.resetApiState());
    await logoutUser();
    window.location.href = redirectUrl;
  };

  const handleGoHome = () => {
    if (onClose) onClose();
    router.push('/');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose || (() => router.push('/'))}>
      <DialogContent className="max-w-135 border-none bg-transparent p-0 shadow-none focus:outline-none [&>button]:hidden">
        {/* Main Torn Paper Container */}
        <div className="relative flex min-h-60 w-full flex-col items-center justify-center p-6 text-center">
          {/* Torn Paper Graphic Background */}
          <div className="absolute inset-0 h-full w-full">
            <Image
              src={submitSuccessBg}
              alt="Torn Paper Background"
              fill
              className="object-fill drop-shadow-md"
              priority
            />
          </div>

          {/* Content inside Torn Paper */}
          <div className="relative z-10 flex max-w-xs flex-col items-center justify-center px-2 sm:max-w-sm sm:px-4">
            {/* Title */}
            <h2 className="font-edo text-lg font-black tracking-wide text-[#503225] uppercase sm:text-xl">
              {isGuest ? 'Unlock Full Access' : 'Enter Your Safe Space'}
            </h2>

            {/* Description */}
            <p className="mt-2 font-sans text-xs leading-relaxed font-bold text-[#503225] sm:text-sm">
              {isGuest
                ? 'Your journey has just begun. Log in or create an account to read unlimited stories, embark on deep liberation journeys, and share your own experiences.'
                : 'To share something real, vulnerable, or meaningful, we first ask you to enter your safe space.'}
            </p>

            {/* Actions */}
            <div className="mt-4 flex flex-col items-center gap-2 sm:mt-5">
              {/* LOG IN NOW Brush Button */}
              <button
                type="button"
                onClick={handleLogin}
                className="relative flex h-11 w-48 cursor-pointer items-center justify-center transition-transform hover:scale-105 sm:h-12 sm:w-56"
              >
                <div className="absolute inset-0 h-full w-full">
                  <Image src={btnBg} alt="Button background" fill className="object-fill" />
                </div>
                <span className="relative z-10 font-sans text-xs font-black tracking-widest text-[#503225] uppercase sm:text-sm">
                  LOG IN NOW —&gt;
                </span>
              </button>

              {/* GO BACK HOME Text Link */}
              <button
                type="button"
                onClick={handleGoHome}
                className="cursor-pointer font-sans text-xs font-semibold tracking-wider text-[#777] underline underline-offset-2 transition-colors hover:text-[#503225]"
              >
                Go Back Home
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
