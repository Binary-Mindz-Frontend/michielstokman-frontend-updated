import { apiClient } from '@/redux/apiClient/apiClient';

const discoveryFeedApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    // Get Discovery Feed
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

    // Get Story Details
    getStoryDetails: builder.query({
      query: (storyId) => ({
        url: `/stories/${storyId}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'DISCOVERY_FEED', id }],
    }),

    // Get Liberation Details
    getLiberationDetails: builder.query({
      query: (journey_code) => ({
        url: `/liberation/catalog/${journey_code}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'DISCOVERY_FEED', id }],
    }),

    // Submit Story Feedback
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

export const {
  useGetDiscoveryFeedQuery,
  useGetStoryDetailsQuery,
  useGetLiberationDetailsQuery,
  useSubmitStoryFeedbackMutation,
} = discoveryFeedApi;
