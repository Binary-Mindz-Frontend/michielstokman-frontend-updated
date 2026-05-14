import { apiClient } from '@/redux/apiClient/apiClient';

const discoveryFeedApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getDiscoveryFeed: builder.query({
      query: (storyTypes: string[]) => {
        const params = new URLSearchParams();
        storyTypes.forEach((type) => params.append('story_type', type.toLowerCase()));

        return {
          url: `/dashboard/feed?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['DISCOVERY_FEED'],
    }),

    getStoryDetails: builder.query({
      query: (storyId) => ({
        url: `/stories/${storyId}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'DISCOVERY_FEED', id }],
    }),

    submitStoryFeedback: builder.mutation({
      query: ({ storyId, body }) => ({
        url: `/stories/${storyId}/feedback`,
        method: 'POST',
        body: body,
      }),

      invalidatesTags: (result, error, { storyId }) => [{ type: 'DISCOVERY_FEED', id: storyId }],
    }),
  }),
});

export const { useGetDiscoveryFeedQuery, useGetStoryDetailsQuery, useSubmitStoryFeedbackMutation } =
  discoveryFeedApi;
