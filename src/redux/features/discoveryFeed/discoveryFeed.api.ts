import { apiClient } from '@/redux/apiClient/apiClient';
import type { CatalogSort } from '@/utils/storyMoods.utils';

export type DiscoveryFeedQueryArg =
  | string[]
  | {
      storyTypes?: string[];
      sort?: CatalogSort;
      hideExplicit?: boolean;
      growthArea?: string | null;
      tag?: string | null;
      limit?: number;
    };

function buildFeedQuery(arg: DiscoveryFeedQueryArg) {
  const params = new URLSearchParams();
  const options = Array.isArray(arg) ? { storyTypes: arg } : arg;

  (options.storyTypes || []).forEach((type) => params.append('story_type', type.toLowerCase()));
  if (options.sort && options.sort !== 'newest') params.set('sort', options.sort);
  if (options.hideExplicit) params.set('hide_explicit', 'true');
  if (options.growthArea) params.set('growth_area', options.growthArea);
  if (options.tag) params.set('tag', options.tag);
  if (options.limit) params.set('limit', String(options.limit));

  const query = params.toString();
  return {
    url: query ? `/dashboard/feed?${query}` : '/dashboard/feed',
    method: 'GET' as const,
  };
}

const discoveryFeedApi = apiClient.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getDiscoveryFeed: builder.query({
      query: (arg: DiscoveryFeedQueryArg) => buildFeedQuery(arg),
      providesTags: ['Discovery_Feed'],
    }),

    getStoryDetails: builder.query({
      query: (storyId) => ({
        url: `/stories/${storyId}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Discovery_Feed', id }],
    }),

    getLiberationDetails: builder.query({
      query: (journey_code) => ({
        url: `/liberation/catalog/${journey_code}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Discovery_Feed', id }],
    }),

    submitStoryFeedback: builder.mutation({
      query: ({ storyId, body }) => ({
        url: `/stories/${storyId}/feedback`,
        method: 'POST',
        body: body,
      }),

      invalidatesTags: (result, error, { storyId }) => [{ type: 'Discovery_Feed', id: storyId }],
    }),
  }),
});

export const {
  useGetDiscoveryFeedQuery,
  useGetStoryDetailsQuery,
  useGetLiberationDetailsQuery,
  useSubmitStoryFeedbackMutation,
} = discoveryFeedApi;
