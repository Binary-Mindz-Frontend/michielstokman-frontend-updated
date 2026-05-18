import { apiClient } from '@/redux/apiClient/apiClient';

const adminVoiceReviewApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    // Get Voice Review List (Added query params support)
    getVoiceReviewList: builder.query({
      query: (params) => ({
        url: '/admin/voice-review',
        method: 'GET',
        params: {
          search: params?.search || undefined,
          limit: params?.limit || 20,
          offset: params?.offset || 0,
        },
      }),
      providesTags: ['Voice_Review'],
    }),

    // Regenerate Voice
    regenerateVoice: builder.mutation({
      query: (storyId) => ({
        url: `/admin/voice-review/${storyId}/regenerate`,
        method: 'POST',
      }),
      invalidatesTags: ['Voice_Review'],
    }),
  }),
});

export const { useGetVoiceReviewListQuery, useRegenerateVoiceMutation } = adminVoiceReviewApi;
