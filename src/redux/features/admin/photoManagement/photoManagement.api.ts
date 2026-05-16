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
      invalidatesTags: ['Photos_Management'],
    }),

    // Delete Cover Image
    deletePhoto: builder.mutation({
      query: (id) => ({
        url: `/admin/photos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Photos_Management'],
    }),
  }),
});

export const {
  useGetAllPhotosQuery,
  useUploadPhotoMutation,
  useUpdatePhotoMutation,
  useDeletePhotoMutation,
} = adminPhotoApi;
