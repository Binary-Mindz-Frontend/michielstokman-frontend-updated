import { apiClient } from '@/redux/apiClient/apiClient';

const userProfileApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get currently logged in user's profile
    getProfile: builder.query({
      query: () => ({
        url: '/me/profile',
        method: 'GET',
      }),
      providesTags: ['PROFILE'],
    }),

    // 2. Update or Create profile information
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: '/me/profile',
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: ['PROFILE'],
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = userProfileApi;
