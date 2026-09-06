'use server';

import { TLoginUser } from '@/types/userRole.types';
import { cookies } from 'next/headers';
import { FieldValues } from 'react-hook-form';
import { baseApi } from '../root/baseApi';
import { sessionCookieOptions } from './cookieOptions';

export const forgetPassword = async (data: FieldValues) => {
  const result = await baseApi('/auth/forgot-password', {
    method: 'POST',
    data: data,
  });
  return result;
};
export const resetPassword = async (data: FieldValues) => {
  const result = await baseApi(`/auth/reset-password`, {
    method: 'POST',
    data: data,
  });
  return result;
};

export const updateTemporaryPassword = async (data: FieldValues) => {
  const result = await baseApi('/auth/update-password', {
    method: 'POST',
    data: data,
  });
  return result;
};

export const getCurrentUser = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const userCookie = cookieStore.get('user')?.value;

  if (accessToken && userCookie) {
    try {
      const user = JSON.parse(userCookie);
      return { ...user, accessToken };
    } catch (err) {
      console.error('Error parsing user cookie:', err);
      return null;
    }
  }

  return null;
};

export const logoutUser = async () => {
  const cookiesStore = await cookies();
  cookiesStore.delete('accessToken');
  cookiesStore.delete('refreshToken');
  cookiesStore.delete('user');
};

export const setAccessToken = async (accessToken: string) => {
  const cookieStore = await cookies();
  cookieStore.set('accessToken', accessToken, sessionCookieOptions());
};
export const setUserProfile = async (user: TLoginUser, token: string) => {
  const cookieStore = await cookies();
  cookieStore.set('accessToken', token, sessionCookieOptions());
  cookieStore.set('user', JSON.stringify(user), sessionCookieOptions());
};
export const updateUserProfile = async (user: TLoginUser) => {
  const cookieStore = await cookies();
  cookieStore.set('user', JSON.stringify(user), sessionCookieOptions());
};
