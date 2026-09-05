export type AssetStatus =
  | 'missing'
  | 'pending'
  | 'in_progress'
  | 'ready_for_review'
  | 'approved'
  | 'rejected';

export type PublicationStatus =
  | 'missing'
  | 'pending'
  | 'in_progress'
  | 'ready_for_review'
  | 'ready_to_publish'
  | 'published'
  | 'rejected';

export type PublicationListItem = {
  id: string;
  title: string;
  author: string | null;
  story_type: string;
  submitted_at: string;
  updated_at: string;
  cover_image_url: string | null;
  content_status: AssetStatus;
  cover_status: AssetStatus;
  voice_status: AssetStatus;
  publication_status: PublicationStatus;
  high_intensity: boolean;
};

export type PublicationWorkspace = {
  id: string;
  title: string | null;
  story_type: string;
  first_name: string | null;
  location: string | null;
  gender: string | null;
  sexual_orientation: string | null;
  occupation: string | null;
  age: number | null;
  high_intensity: boolean;
  story_input: string | null;
  story_text: string | null;
  hero_hook: string | null;
  hero_tagline: string | null;
  editorial_brief: string | null;
  tags: string[] | null;
  growth_areas: string[] | null;
  life_phase: string | null;
  submission_mode: string | null;
  cover_image_url: string | null;
  content_status: AssetStatus;
  cover_status: AssetStatus;
  voice_status: AssetStatus;
  publication_status: PublicationStatus;
  can_publish: boolean;
  publish_blockers: string[];
  submitted_at: string;
  updated_at: string;
  published_at: string | null;
  voice: {
    voice_name: string | null;
    audio_path: string | null;
    duration_seconds: number | null;
    generated_at: string | null;
    voice_not_required: boolean;
  };
  contact: {
    email: string | null;
    true_name: string | null;
  };
};

export const ASSET_STATUS_LABEL: Record<AssetStatus, string> = {
  missing: 'Missing',
  pending: 'Pending',
  in_progress: 'In progress',
  ready_for_review: 'Ready for review',
  approved: 'Approved',
  rejected: 'Rejected',
};

export const PUBLICATION_STATUS_LABEL: Record<PublicationStatus, string> = {
  ...ASSET_STATUS_LABEL,
  ready_to_publish: 'Ready to publish',
  published: 'Published',
};

export const STATUS_COLOR: Record<string, string> = {
  missing: '#9A8878',
  pending: '#C9A227',
  in_progress: '#3B82F6',
  ready_for_review: '#BF7758',
  ready_to_publish: '#149443',
  approved: '#149443',
  published: '#0F6B3A',
  rejected: '#DC2626',
};
