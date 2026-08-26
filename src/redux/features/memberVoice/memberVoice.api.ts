import { apiClient } from '@/redux/apiClient/apiClient';
import type { CustomVoiceResponse, UploadCustomVoiceArgs } from '@/types/memberVoice.types';

const memberVoiceApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getCustomVoice: builder.query<{ data: CustomVoiceResponse }, void>({
      query: () => ({
        url: '/me/voice',
        method: 'GET',
      }),
      providesTags: ['CustomVoice'],
    }),

    uploadCustomVoice: builder.mutation<{ data: CustomVoiceResponse }, UploadCustomVoiceArgs>({
      query: ({ recordings, displayName }) => {
        const formData = new FormData();
        recordings.forEach((file) => {
          formData.append('recordings', file);
        });

        const params = displayName?.trim()
          ? `?display_name=${encodeURIComponent(displayName.trim())}`
          : '';

        return {
          url: `/me/voice${params}`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['CustomVoice', 'Voices'],
    }),

    deleteCustomVoice: builder.mutation<{ data: CustomVoiceResponse }, void>({
      query: () => ({
        url: '/me/voice',
        method: 'DELETE',
      }),
      invalidatesTags: ['CustomVoice', 'Voices'],
    }),
  }),
});

export const {
  useGetCustomVoiceQuery,
  useUploadCustomVoiceMutation,
  useDeleteCustomVoiceMutation,
} = memberVoiceApi;
