'use client';

import { apiClient } from '@/redux/apiClient/apiClient';
import { useSignOutMutation } from '@/redux/features/auth/auth.api';
import { logout, useCurrentUser } from '@/redux/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logoutUser } from '@/services/auth/auth.service';
import { usePathname, useRouter } from 'next/navigation';

export const protectedRoutes = ['/dashboard', '/profile'];
export const useLogout = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const user = useAppSelector(useCurrentUser);
  const [signOut] = useSignOutMutation();

  const handleLogout = async () => {
    if (user && !user.is_guest) {
      try {
        await signOut().unwrap();
      } catch {
        // Still clear the local session if revoke fails (expired token, network).
      }
    }

    dispatch(logout());

    dispatch(apiClient.util.resetApiState());

    await logoutUser();
    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
      router.push('/');
    }
  };

  return handleLogout;
};
