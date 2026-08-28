import { apiClient } from '@/redux/apiClient/apiClient';

export const adminPhotoApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    // Get All Cover Images
    getAllPhotos: builder.query({
      query: () => ({
        url: '/admin/photos',
        method: 'GET',
      }),
      providesTags: ['Photos_Management'],
    }),

    // Upload Cover Image
    uploadPhoto: builder.mutation({
      query: (formData) => ({
        url: '/admin/photos',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Photos_Management'],
    }),

    //  Update Cover Image
    updatePhoto: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/admin/photos/${id}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: ['Photos_Management', 'Discovery_Feed', 'Story'],
    }),

    regenerateStoryCovers: builder.mutation({
      query: (body: { limit?: number; only_missing_or_default?: boolean } = {}) => ({
        url: '/admin/stories/regenerate-covers',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Photos_Management', 'Discovery_Feed', 'Story', 'MemberStories'],
    }),
  }),
});

export const {
  useGetAllPhotosQuery,
  useUploadPhotoMutation,
  useUpdatePhotoMutation,
  useRegenerateStoryCoversMutation,
} = adminPhotoApi;
