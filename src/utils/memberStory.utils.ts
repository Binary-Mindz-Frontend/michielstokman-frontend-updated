import type { MemberStoryListItem } from '@/types/memberStory.types';

export type SubmissionTab = 'all' | 'submitted' | 'withdrawn' | 'draft';

export function getGenerationStatusLabel(status: MemberStoryListItem['generation_status']): string {
  switch (status) {
    case 'processing':
      return 'Creating…';
    case 'failed':
      return 'Failed';
    case 'completed':
      return 'Ready';
    default:
      return status;
  }
}

export function getModerationStatusLabel(status: MemberStoryListItem['moderation_status']): string {
  switch (status) {
    case 'pending':
      return 'In review';
    case 'approved':
      return 'Approved';
    case 'rejected':
      return 'Not approved';
    case 'flagged':
      return 'Flagged';
    default:
      return status;
  }
}

export function getSubmissionStatusLabel(status: MemberStoryListItem['submission_status']): string {
  switch (status) {
    case 'submitted':
      return 'Live';
    case 'withdrawn':
      return 'Withdrawn';
    case 'draft':
      return 'Draft';
    default:
      return status;
  }
}

export type StoryActionState = Pick<
  MemberStoryListItem,
  'generation_status' | 'submission_status' | 'moderation_status'
>;

export function canEditStory(story: StoryActionState): boolean {
  return story.generation_status !== 'processing';
}

export function canWithdrawStory(story: StoryActionState): boolean {
  return story.generation_status === 'completed' && story.submission_status === 'submitted';
}

export function canResubmitStory(story: Pick<MemberStoryListItem, 'submission_status'>): boolean {
  return story.submission_status === 'withdrawn';
}

export function canShareStory(story: Pick<MemberStoryListItem, 'generation_status'>): boolean {
  return story.generation_status === 'completed';
}

export function canChangeVoice(story: Pick<MemberStoryListItem, 'generation_status'>): boolean {
  return story.generation_status === 'completed';
}

export function canChangeArtwork(story: Pick<MemberStoryListItem, 'generation_status'>): boolean {
  return story.generation_status === 'completed';
}

export function formatAudioDuration(seconds: number | null | undefined): string | null {
  if (!seconds || seconds <= 0) return null;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function hasProcessingStories(stories: MemberStoryListItem[]): boolean {
  return stories.some((s) => s.generation_status === 'processing');
}
