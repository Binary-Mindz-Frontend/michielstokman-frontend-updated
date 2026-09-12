import { apiClient } from '@/redux/apiClient/apiClient';

const authManagementApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    //Create User
    registerUser: builder.mutation({
      query: (data) => {
        const result = {
          url: '/signup',
          method: 'POST',
          body: data,
        };
        return result;
      },
      invalidatesTags: ['PROFILE', 'Discovery_Feed', 'Liberations'],
    }),
    //login user
    loginUser: builder.mutation({
      query: (data) => {
        const result = {
          url: '/login',
          method: 'POST',
          body: data,
        };
        return result;
      },
      invalidatesTags: ['PROFILE', 'Discovery_Feed', 'Liberations'],
    }),
    socialLogin: builder.mutation({
      query: (data) => {
        const result = {
          url: '/social-login',
          method: 'POST',
          body: data,
        };
        return result;
      },
      invalidatesTags: ['PROFILE', 'Discovery_Feed', 'Liberations'],
    }),
    guestLogin: builder.mutation({
      query: () => {
        return {
          url: '/guest-login',
          method: 'POST',
        };
      },
      invalidatesTags: ['PROFILE', 'Discovery_Feed', 'Liberations'],
    }),
    updateUserProfile: builder.mutation({
      query: (data) => {
        const result = {
          url: '/me/profile',
          method: 'PUT',
          body: data,
        };
        return result;
      },
      invalidatesTags: ['PROFILE'],
    }),
    getUserProfile: builder.query({
      query: () => {
        const result = {
          url: '/auth/profile',
          method: 'GET',
        };
        return result;
      },
      providesTags: ['PROFILE'],
    }),
    signOut: builder.mutation<unknown, void>({
      query: () => ({
        url: '/signout',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useUpdateUserProfileMutation,
  useGetUserProfileQuery,
  useSocialLoginMutation,
  useGuestLoginMutation,
  useSignOutMutation,
} = authManagementApi;
