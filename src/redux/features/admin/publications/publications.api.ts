import { apiClient } from '@/redux/apiClient/apiClient';
import type { PublicationWorkspace } from '@/types/publication.types';

type ListParams = {
  search?: string;
  story_type?: string;
  status?: string;
  missing?: string;
  sort?: string;
  limit?: number;
  page?: number;
};

const publicationsApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getPublications: builder.query({
      query: ({
        search,
        story_type,
        status,
        missing,
        sort = 'submitted_at',
        limit = 10,
        page = 1,
      }: ListParams = {}) => ({
        url: '/admin/publications',
        params: {
          search,
          story_type,
          status: status && status !== 'all' ? status : undefined,
          missing,
          sort,
          limit,
          page,
        },
      }),
      providesTags: ['Publications'],
    }),

    getPublication: builder.query({
      query: (storyId: string) => ({
        url: `/admin/publications/${storyId}`,
      }),
      providesTags: (_result, _error, storyId) => [{ type: 'Story', id: storyId }, 'Publications'],
    }),

    approvePublicationAsset: builder.mutation({
      query: ({ storyId, asset }: { storyId: string; asset: 'content' | 'cover' | 'voice' }) => ({
        url: `/admin/publications/${storyId}/assets/${asset}/approve`,
        method: 'POST',
      }),
      invalidatesTags: (_r, _e, { storyId }) => [
        { type: 'Story', id: storyId },
        'Publications',
        'MemberStories',
      ],
    }),

    rejectPublicationAsset: builder.mutation({
      query: ({ storyId, asset }: { storyId: string; asset: 'content' | 'cover' | 'voice' }) => ({
        url: `/admin/publications/${storyId}/assets/${asset}/reject`,
        method: 'POST',
      }),
      invalidatesTags: (_r, _e, { storyId }) => [
        { type: 'Story', id: storyId },
        'Publications',
        'MemberStories',
      ],
    }),

    skipPublicationVoice: builder.mutation({
      query: (storyId: string) => ({
        url: `/admin/publications/${storyId}/voice/skip`,
        method: 'POST',
      }),
      invalidatesTags: (_r, _e, storyId) => [{ type: 'Story', id: storyId }, 'Publications'],
    }),

    publishPublication: builder.mutation({
      query: (storyId: string) => ({
        url: `/admin/publications/${storyId}/publish`,
        method: 'POST',
      }),
      invalidatesTags: (_r, _e, storyId) => [
        { type: 'Story', id: storyId },
        'Publications',
        'Discovery_Feed',
        'MemberStories',
      ],
    }),

    regeneratePublicationCover: builder.mutation({
      query: (storyId: string) => ({
        url: `/admin/publications/${storyId}/cover/regenerate`,
        method: 'POST',
      }),
      invalidatesTags: (_r, _e, storyId) => [{ type: 'Story', id: storyId }, 'Publications'],
    }),

    replacePublicationCover: builder.mutation({
      query: ({ storyId, file }: { storyId: string; file: File }) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: `/admin/publications/${storyId}/cover`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (_r, _e, { storyId }) => [{ type: 'Story', id: storyId }, 'Publications'],
    }),

    regeneratePublicationVoice: builder.mutation({
      query: (storyId: string) => ({
        url: `/admin/publications/${storyId}/voice/regenerate`,
        method: 'POST',
      }),
      invalidatesTags: (_r, _e, storyId) => [
        { type: 'Story', id: storyId },
        'Publications',
        'Voice_Review',
      ],
    }),

    replacePublicationVoice: builder.mutation({
      query: ({ storyId, file }: { storyId: string; file: File }) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: `/admin/publications/${storyId}/voice`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (_r, _e, { storyId }) => [{ type: 'Story', id: storyId }, 'Publications'],
    }),
  }),
});

export const {
  useGetPublicationsQuery,
  useGetPublicationQuery,
  useApprovePublicationAssetMutation,
  useRejectPublicationAssetMutation,
  useSkipPublicationVoiceMutation,
  usePublishPublicationMutation,
  useRegeneratePublicationCoverMutation,
  useReplacePublicationCoverMutation,
  useRegeneratePublicationVoiceMutation,
  useReplacePublicationVoiceMutation,
} = publicationsApi;

export type { PublicationWorkspace };
