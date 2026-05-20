import { apiClient } from '@/redux/apiClient/apiClient';

export const aiStoryApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Generate story
    generateStory: builder.mutation({
      query: (storyData) => ({
        url: '/ai/story/generate',
        method: 'POST',
        body: storyData,
      }),
      invalidatesTags: ['PROFILE'],
    }),
  }),
});

export const { useGenerateStoryMutation } = aiStoryApi;
