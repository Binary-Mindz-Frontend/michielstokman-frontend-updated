import { apiClient } from '@/redux/apiClient/apiClient';

/** Matches GET /v1/voices → data.voices[] */
export type StoryVoiceOption = {
  name: string;
  label: string;
  gender: string;
  language: string;
  description: string;
  is_custom: boolean;
  preview_url: string | null;
  preview_text?: string;
};

/** Matches GET /v1/voices → data */
export type StoryVoicesCatalog = {
  voices: StoryVoiceOption[];
  custom_voice: StoryVoiceOption | null;
  default_voice: string;
};

const mapVoice = (voice: Record<string, unknown>): StoryVoiceOption | null => {
  const name = String(voice.name ?? '').trim();
  if (!name) return null;

  const previewRaw = voice.preview_url;
  const preview_url =
    typeof previewRaw === 'string' && previewRaw.trim() ? previewRaw.trim() : null;
  const previewTextRaw = voice.preview_text;
  const preview_text =
    typeof previewTextRaw === 'string' && previewTextRaw.trim() ? previewTextRaw.trim() : undefined;

  return {
    name,
    label: String(voice.label ?? name),
    gender: String(voice.gender ?? ''),
    language: String(voice.language ?? ''),
    description: String(voice.description ?? ''),
    is_custom: Boolean(voice.is_custom),
    preview_url,
    preview_text,
  };
};

const getCatalogPayload = (response: unknown) => {
  const body = response as {
    data?: {
      voices?: unknown[];
      custom_voice?: Record<string, unknown> | null;
      default_voice?: string;
    };
    voices?: unknown[];
    custom_voice?: Record<string, unknown> | null;
    default_voice?: string;
  };

  if (body?.data && Array.isArray(body.data.voices)) {
    return body.data;
  }

  if (Array.isArray(body?.voices)) {
    return body;
  }

  return null;
};

const normalizeVoices = (response: unknown): StoryVoicesCatalog => {
  const catalog = getCatalogPayload(response);
  const voices = (catalog?.voices ?? [])
    .map((item) => mapVoice(item as Record<string, unknown>))
    .filter((voice): voice is StoryVoiceOption => voice !== null);

  const customRaw = catalog?.custom_voice;
  const custom_voice = customRaw && typeof customRaw === 'object' ? mapVoice(customRaw) : null;

  if (custom_voice && !voices.some((voice) => voice.name === custom_voice.name)) {
    voices.push({ ...custom_voice, is_custom: true });
  }

  return {
    voices,
    custom_voice,
    default_voice: String(catalog?.default_voice ?? voices[0]?.name ?? ''),
  };
};

export const aiStoryApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getVoices: builder.query<StoryVoicesCatalog, void>({
      query: () => ({
        url: '/voices',
        method: 'GET',
      }),
      transformResponse: normalizeVoices,
      providesTags: ['Voices'],
    }),

    generateStory: builder.mutation({
      query: (storyData) => ({
        url: '/ai/story/generate',
        method: 'POST',
        body: storyData,
      }),
      invalidatesTags: ['PROFILE', 'Voices', 'MemberStories'],
    }),
  }),
});

export const { useGenerateStoryMutation, useGetVoicesQuery } = aiStoryApi;
