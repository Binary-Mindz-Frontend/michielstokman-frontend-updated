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
    }),
    //login user
    loginUser: builder.mutation({
      query: (data) => {
        const result = {
          url: '/auth/login',
          method: 'POST',
          body: data,
        };
        return result;
      },
    }),
    updateUser: builder.mutation({
      query: (data) => {
        const result = {
          url: '/auth/profile',
          method: 'PATCH',
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
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useUpdateUserMutation,
  useGetUserProfileQuery,
} = authManagementApi;
