import { apiClient } from '@/redux/apiClient/apiClient';

export const adminLiberationApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    // Create Liberation (Only Admin)
    createLiberation: builder.mutation({
      query: (data) => ({
        url: '/admin/liberation/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Liberations'],
    }),

    // Get All Liberations (Only Admin)
    getAllLiberations: builder.query({
      query: ({ limit = 50, offset = 0 }) => ({
        url: `/admin/liberation?limit=${limit}&offset=${offset}`,
        method: 'GET',
      }),
      providesTags: ['Liberations'],
    }),

    // Deactivate Liberation (Only Admin)
    deactivateLiberation: builder.mutation({
      query: (id) => ({
        url: `/admin/liberation/${id}/deactivate`,
        method: 'POST',
      }),
      invalidatesTags: ['Liberations'],
    }),

    // Update Liberation (Only Admin)
    updateLiberation: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/liberation/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Liberations'],
    }),
  }),
});

export const {
  useCreateLiberationMutation,
  useGetAllLiberationsQuery,
  useDeactivateLiberationMutation,
  useUpdateLiberationMutation,
} = adminLiberationApi;
