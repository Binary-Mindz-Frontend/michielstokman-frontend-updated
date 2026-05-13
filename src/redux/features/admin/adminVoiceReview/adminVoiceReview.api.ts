import { apiClient } from '@/redux/apiClient/apiClient';

const adminVoiceReviewApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    // Get Voice Review List
    getVoiceReviewList: builder.query({
      query: () => ({
        url: '/v1/admin/voice-review',
        method: 'GET',
      }),
      providesTags: ['VoiceReview'],
    }),

    // Regenerate Voice
    regenerateVoice: builder.mutation({
      query: (storyId) => ({
        url: `/v1/admin/voice-review/${storyId}/regenerate`,
        method: 'POST',
      }),
      // Invalidating 'VoiceReview' ensures the list updates to show the new state
      invalidatesTags: ['VoiceReview'],
    }),
  }),
});

export const { useGetVoiceReviewListQuery, useRegenerateVoiceMutation } = adminVoiceReviewApi;
