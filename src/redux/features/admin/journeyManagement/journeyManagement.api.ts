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
      query: ({ limit = 10, page = 1, search = '' }) => ({
        url: '/admin/liberation',
        method: 'GET',
        params: {
          limit,
          page,
          search: search || undefined,
        },
      }),
      providesTags: ['Liberations'],
    }),
    // Get Single Liberation (Only Admin)
    getSingleLiberation: builder.query({
      query: (id) => ({
        url: `/admin/liberation/${id}`,
        method: 'GET',
      }),
      providesTags: ['Liberations'],
    }),

    // Upload Day Image
    uploadDayImage: builder.mutation({
      query: (formData) => ({
        url: '/admin/liberation/upload-image',
        method: 'POST',
        body: formData,
      }),
    }),

    // Deactivate Liberation (Only Admin)
    deactivateLiberation: builder.mutation({
      query: ({ id, isActive }) => ({
        url: `/admin/liberation/${id}/set-active`,
        method: 'POST',
        body: { is_active: isActive },
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
  useUploadDayImageMutation,
  useDeactivateLiberationMutation,
  useUpdateLiberationMutation,
  useGetSingleLiberationQuery,
} = adminLiberationApi;
