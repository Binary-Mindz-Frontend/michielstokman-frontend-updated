import { getValidToken } from '@/services/root/handleToken';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { jwtDecode } from 'jwt-decode';

const baseApi = process.env.NEXT_PUBLIC_BASE_API;

// Warn if baseApi is not set in production
if (!process.env.NEXT_PUBLIC_BASE_API) {
  console.warn('WARNING: NEXT_PUBLIC_BASE_API is not set, using fallback URL');
}

// Helper to get cookie on the client side
const getClientCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

// Helper to check token expiration on the client
const isTokenExpiredClient = (token: string): boolean => {
  if (!token) return true;
  try {
    const decoded: { exp: number } = jwtDecode(token);
    // Expired if current time is within 60 seconds of expiration
    return decoded.exp * 1000 - 60000 < Date.now();
  } catch {
    return true;
  }
};

const getClientValidToken = async (): Promise<string | null> => {
  // 1. Try to get valid token from client-side cookies first
  const clientToken = getClientCookie('accessToken');
  if (clientToken && !isTokenExpiredClient(clientToken)) {
    return clientToken;
  }

  // 2. If missing or expired, call the Server Action to refresh/retrieve it
  try {
    const token = await getValidToken();
    return token;
  } catch (error) {
    console.error('Error fetching valid token from server:', error);
    return null;
  }
};

// const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: baseApi,

  // credentials: "include",
  prepareHeaders: async (headers) => {
    const token = await getClientValidToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
//   args,
//   api,
//   extraOptions,
// ) => {
//   await mutex.waitForUnlock();
//   let result = await baseQuery(args, api, extraOptions);

//   if (result.error && result.error.status === 401) {
//     if (!mutex.isLocked()) {
//       const release = await mutex.acquire();
//       try {
//         console.log('Attempting to refresh token...');
//         const newToken = await getValidToken();

//         if (newToken) {
//           result = await baseQuery(args, api, extraOptions);
//         } else {
//           api.dispatch(setSessionExpired(true));
//           api.dispatch(logout());
//           await logoutUser();
//         }
//       } finally {
//         release();
//       }
//     } else {
//       await mutex.waitForUnlock();
//       result = await baseQuery(args, api, extraOptions);
//     }
//   }

//   if (result.error) {
//     result.error = formatGlobalErrorResponse(result.error) as any;
//   }

//   return result;
// };

export const apiClient = createApi({
  reducerPath: 'apiClient',
  baseQuery: baseQuery,
  endpoints: () => ({}),
  tagTypes: [
    'PROFILE',
    'AdminStats',
    'ModerationQueue',
    'Story',
    'Discovery_Feed',
    'Liberations',
    'Orders_History',
    'Photos_Management',
    'Voice_Review',
  ],
});
