import { getValidToken } from '@/services/root/handleToken';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseApi = process.env.NEXT_PUBLIC_BASE_API;

// Warn if baseApi is not set in production
if (!process.env.NEXT_PUBLIC_BASE_API) {
  console.warn('WARNING: NEXT_PUBLIC_BASE_API is not set, using fallback URL');
}

// const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: baseApi,

  // credentials: "include",
  prepareHeaders: async (headers) => {
    const token = await getValidToken();
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
  tagTypes: ['PROFILE'],
});
