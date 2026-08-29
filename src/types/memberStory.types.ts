export type GenerationStatus = 'processing' | 'completed' | 'failed';
export type ModerationStatus = 'pending' | 'approved' | 'rejected' | 'flagged';
export type SubmissionStatus = 'submitted' | 'withdrawn' | 'draft';
export type StoryType = 'confession' | 'meditation' | 'transformation';

export type SocialIntros = {
  instagram: string;
  facebook: string;
  spotify: string;
};

export type MemberStoryListItem = {
  id: string;
  story_number: number | null;
  story_reference: string | null;
  title: string | null;
  excerpt: string | null;
  story_type: StoryType;
  cover_image_url: string | null;
  audio_path: string | null;
  voice_name: string | null;
  audio_duration_seconds: number | null;
  generation_status: GenerationStatus;
  moderation_status: ModerationStatus;
  submission_status: SubmissionStatus;
  has_social_intros: boolean;
  moderation_notes?: string | null;
  created_at: string;
};

export type MemberStoryDetail = MemberStoryListItem & {
  member_title: string | null;
  ai_generated_title: string | null;
  use_ai_title: boolean;
  story_text: string | null;
  story_input: string | null;
  first_name: string | null;
  location: string | null;
  gender: string | null;
  occupation: string | null;
  age: number | null;
  growth_areas: string[] | null;
  life_phase: string | null;
  tags: string[] | null;
  high_intensity: boolean;
  uses_custom_voice: boolean;
  image_source: string | null;
  alignment: Array<{ word: string; start: number; end: number }> | null;
  social_intros: SocialIntros | null;
  regeneration_count: number;
  moderation_notes: string | null;
  withdrawn_at: string | null;
};

export type MemberStoryListResponse = {
  stories: MemberStoryListItem[];
  counts: Record<string, number>;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type SharePackage = {
  story_id: string;
  story_number: number | null;
  story_reference: string | null;
  title: string | null;
  story_type: StoryType;
  author_name: string | null;
  cover_image_url: string | null;
  audio_url: string | null;
  audio_duration_seconds: number | null;
  share_url: string | null;
  intros: SocialIntros;
  generated_at: string | null;
};

export type MemberStoriesQueryArgs = {
  story_type?: StoryType | 'all';
  submission_status?: SubmissionStatus | 'all';
  generation_status?: GenerationStatus | 'all';
  page?: number;
  limit?: number;
};

export type StoryImageResponse = {
  story_id: string;
  cover_image_url: string | null;
  image_source: string | null;
  message: string;
};

export type RenarrateRequest = {
  voice_name?: string;
  use_custom_voice?: boolean;
};
