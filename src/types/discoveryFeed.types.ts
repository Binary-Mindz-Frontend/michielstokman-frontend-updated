export type TDiscoveryCardType = 'story' | 'liberation_journey';

export type IStoryItemType = {
  card_type: 'story' | 'liberation_journey';
  id: string;
  title: string;
  description: string;
  excerpt?: string | null;
  story_type: 'confession' | 'meditation';
  cover_image_url: string | null;
  audio_path: string;
  rating: number | null;
  listened_count: number;
  author_name?: string | null;
  location?: string | null;
  gender?: string | null;
  sexual_orientation?: string | null;
  occupation?: string | null;
  age?: number | null;
  audio_duration_seconds?: number | null;
  is_explicit: boolean;
  tags?: string[];
  growth_areas?: string[];
};

export type ILiberationJourneyItemType = {
  card_type: 'story' | 'liberation_journey';
  id: string;
  journey_code: string;
  title: string;
  description: string;
  cover_image_url: string | null;
  price_display: number;
  price_cents: number;
  total_days: number | null;
  rating: number | null;
  what_to_expect: string[];
  setup_instructions: string[];
  is_enrolled: boolean;
  has_access: boolean;
  current_day: number | null;
  journey_status: string | null;
  journey_id: string | null;
};

export type TDiscoveryItemType = IStoryItemType & ILiberationJourneyItemType;

export type IDiscoveryFeedDataType = {
  hero_stats: {
    total_users: number;
    total_countries: number;
    total_stories_generated: number;
  };
  items: TDiscoveryItemType[];
};

export type IDiscoveryFeedType = {
  status: number;
  success: boolean;
  message: string;
  data: IDiscoveryFeedDataType;
};
