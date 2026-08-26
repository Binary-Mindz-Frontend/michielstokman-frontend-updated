import { apiClient } from '@/redux/apiClient/apiClient';
import type {
  MemberStoryDetail,
  MemberStoryListResponse,
  MemberStoriesQueryArgs,
  RenarrateRequest,
  SharePackage,
  StoryImageResponse,
} from '@/types/memberStory.types';

const buildStoriesQuery = (args: MemberStoriesQueryArgs = {}) => {
  const params = new URLSearchParams();
  if (args.story_type && args.story_type !== 'all') {
    params.set('story_type', args.story_type);
  }
  if (args.submission_status && args.submission_status !== 'all') {
    params.set('submission_status', args.submission_status);
  }
  if (args.generation_status && args.generation_status !== 'all') {
    params.set('generation_status', args.generation_status);
  }
  if (args.page) params.set('page', String(args.page));
  if (args.limit) params.set('limit', String(args.limit));

  const query = params.toString();
  return `/me/stories${query ? `?${query}` : ''}`;
};

const invalidateStory = (storyId: string) => [
  { type: 'MemberStories' as const, id: storyId },
  { type: 'MemberStories' as const, id: `${storyId}-share` },
  { type: 'MemberStories' as const, id: 'LIST' },
];

const memberStoryApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getMyStories: builder.query<{ data: MemberStoryListResponse }, MemberStoriesQueryArgs | void>({
      query: (args) => ({
        url: buildStoriesQuery(args ?? {}),
        method: 'GET',
      }),
      providesTags: (result) =>
        result?.data?.stories
          ? [
              ...result.data.stories.map(({ id }) => ({ type: 'MemberStories' as const, id })),
              { type: 'MemberStories', id: 'LIST' },
            ]
          : [{ type: 'MemberStories', id: 'LIST' }],
    }),

    getMyStory: builder.query<{ data: MemberStoryDetail }, string>({
      query: (storyId) => ({
        url: `/me/stories/${storyId}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'MemberStories', id }],
    }),

    getSharePackage: builder.query<{ data: SharePackage }, string>({
      query: (storyId) => ({
        url: `/me/stories/${storyId}/share`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'MemberStories', id: `${id}-share` }],
    }),

    regenerateSocialIntros: builder.mutation<{ data: MemberStoryDetail }, string>({
      query: (storyId) => ({
        url: `/me/stories/${storyId}/social-intros?force=true`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => invalidateStory(id),
    }),

    updateMyStory: builder.mutation<
      { data: MemberStoryDetail | { story_id: string; message: string } },
      { storyId: string; body: Record<string, unknown> }
    >({
      query: ({ storyId, body }) => ({
        url: `/me/stories/${storyId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { storyId }) => invalidateStory(storyId),
    }),

    deleteMyStory: builder.mutation<{ success: boolean; message: string }, string>({
      query: (storyId) => ({
        url: `/me/stories/${storyId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => invalidateStory(id),
    }),

    withdrawMyStory: builder.mutation<
      { data: { story_id: string; submission_status: string; message: string } },
      string
    >({
      query: (storyId) => ({
        url: `/me/stories/${storyId}/withdraw`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => invalidateStory(id),
    }),

    resubmitMyStory: builder.mutation<
      { data: { story_id: string; submission_status: string; message: string } },
      string
    >({
      query: (storyId) => ({
        url: `/me/stories/${storyId}/resubmit`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => invalidateStory(id),
    }),

    renarrateMyStory: builder.mutation<
      { data: { story_id: string; job_id: string; generation_status: string; message: string } },
      { storyId: string; body: RenarrateRequest }
    >({
      query: ({ storyId, body }) => ({
        url: `/me/stories/${storyId}/narrate`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { storyId }) => invalidateStory(storyId),
    }),

    uploadStoryImage: builder.mutation<
      { data: StoryImageResponse },
      { storyId: string; file: File }
    >({
      query: ({ storyId, file }) => {
        const formData = new FormData();
        formData.append('image', file);
        return {
          url: `/me/stories/${storyId}/image`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (result, error, { storyId }) => invalidateStory(storyId),
    }),

    generateStoryImage: builder.mutation<{ data: StoryImageResponse }, string>({
      query: (storyId) => ({
        url: `/me/stories/${storyId}/image/generate`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, storyId) => invalidateStory(storyId),
    }),
  }),
});

export const {
  useGetMyStoriesQuery,
  useGetMyStoryQuery,
  useLazyGetMyStoryQuery,
  useGetSharePackageQuery,
  useLazyGetSharePackageQuery,
  useRegenerateSocialIntrosMutation,
  useUpdateMyStoryMutation,
  useDeleteMyStoryMutation,
  useWithdrawMyStoryMutation,
  useResubmitMyStoryMutation,
  useRenarrateMyStoryMutation,
  useUploadStoryImageMutation,
  useGenerateStoryImageMutation,
} = memberStoryApi;
