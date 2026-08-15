/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useSocialLoginMutation } from '@/redux/features/auth/auth.api';
import { setAuth } from '@/redux/features/auth/authSlice';
import { auth, googleProvider } from '@/redux/features/auth/firebase.config';
import { useAppDispatch } from '@/redux/hooks';
import { setUserProfile } from '@/services/auth/auth.service';
import { TLoginUser } from '@/types/userRole.types';
import { catchAsyncMutation } from '@/utils/apiReqRes.utils';
import { signInWithPopup } from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'sonner';

export default function GoogleSignInButton({ className }: { className?: string } = {}) {
  const [socialLogin, { isLoading }] = useSocialLoginMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleGoogleSignIn = async () => {
    const firebaseAuthPromise = async () => {
      googleProvider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      return socialLogin({ provider: 'google', token }).unwrap();
    };

    await catchAsyncMutation(
      firebaseAuthPromise(),
      // onSuccess
      async (res: any) => {
        const user: TLoginUser = {
          id: res?.data?.user?.id,
          user_id: res?.data?.user_id,
          email: res?.data?.user?.email,
          is_admin: res?.data?.user?.is_admin || false,
        };

        const defaultRedirect = res?.data?.user?.is_admin ? '/dashboard/overview' : '/profile';
        const redirectUrl = searchParams.get('redirect');
        const redirectPath = redirectUrl ? decodeURIComponent(redirectUrl) : defaultRedirect;

        dispatch(setAuth({ user }));
        await setUserProfile(user, res?.data?.access_token);

        toast.success(res?.message || 'User Logged in Successfully');

        setTimeout(() => {
          if (!res?.data?.user?.is_profile_setup) {
            const stepperPath = redirectUrl
              ? `/register/stepper?redirect=${encodeURIComponent(redirectUrl)}`
              : '/register/stepper';
            router.push(stepperPath);
          } else {
            router.push(redirectPath);
          }
        }, 1000);
      },
    );
  };

  return (
    <Button
      type="button"
      disabled={isLoading}
      onClick={handleGoogleSignIn}
      className={cn(
        'border-primary/20 flex items-center justify-center gap-3 border bg-transparent font-medium text-white shadow-none hover:bg-transparent',
        isLoading && 'cursor-not-allowed opacity-70',
        className,
      )}
    >
      <div className="flex h-[22px] w-[22px] items-center justify-center">
        <FcGoogle className="h-full w-full" />
      </div>
      <span className="text-sm font-medium tracking-wide text-white">
        {isLoading ? 'Signing in...' : 'Sign In With Google'}
      </span>
    </Button>
  );
}
