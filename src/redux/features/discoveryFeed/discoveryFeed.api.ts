import { apiClient } from '@/redux/apiClient/apiClient';

const discoveryFeedApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get discovery feed
    getDiscoveryFeed: builder.query({
      query: () => ({
        url: '/dashboard/feed',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetDiscoveryFeedQuery } = discoveryFeedApi;
