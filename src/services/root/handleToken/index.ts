'use server';

import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';

import { sessionCookieOptions } from '@/services/auth/cookieOptions';

export const getNewToken = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const baseApi = process.env.NEXT_PUBLIC_BASE_API;

  if (!accessToken || !baseApi) return null;

  try {
    const res = await fetch(`${baseApi}/auth/refresh`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Refresh Token Error:', error);
    return null;
  }
};

export const isTokenExpired = async (token: string): Promise<boolean> => {
  if (!token) return true;
  try {
    const decoded: { exp: number } = jwtDecode(token);
    return decoded.exp * 1000 - 60000 < Date.now();
  } catch {
    return true;
  }
};

export const getValidToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  let token = cookieStore.get('accessToken')?.value;

  if (!token || (await isTokenExpired(token))) {
    const res = await getNewToken();
    const nextToken = res?.data?.access_token as string | undefined;
    if (nextToken) {
      token = nextToken;
      cookieStore.set('accessToken', token, sessionCookieOptions());
      return token;
    }
    return null;
  }

  return token;
};
