/* eslint-disable no-unused-vars */
import img from '@/assets/shared/table_placeholder_image.jpg';
import { useGetStoryDetailsQuery } from '@/redux/features/admin/adminModeration/adminModeration.api';
import { Compass, Heart, MessageSquareText, User, Volume2 } from 'lucide-react';
import Image from 'next/image';

interface ReviewDetailsProps {
  id: string;
  onEdit?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onRemove?: (id: string) => void;
  onClose?: () => void;
}

export const ReviewDetails = ({
  id,
  onEdit,
  onApprove,
  onReject,
  onRemove,
  onClose,
}: ReviewDetailsProps) => {
  const { data, isLoading } = useGetStoryDetailsQuery(id);
  const story = data?.data;

  console.log(story, 'story');

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-4xl animate-pulse flex-col gap-6 p-6">
        <div className="h-48 w-full rounded-xl bg-neutral-200" />
        <div className="space-y-3">
          <div className="h-4 w-12 rounded bg-neutral-200" />
          <div className="h-6 w-3/4 rounded bg-neutral-200" />
        </div>
        <div className="space-y-3">
          <div className="h-4 w-12 rounded bg-neutral-200" />
          <div className="h-5 w-24 rounded bg-neutral-200" />
        </div>
        <div className="mt-2 space-y-3">
          <div className="h-4 w-full rounded bg-neutral-200" />
          <div className="h-4 w-5/6 rounded bg-neutral-200" />
          <div className="h-4 w-4/5 rounded bg-neutral-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col justify-between gap-6 overflow-hidden">
      {/* Main Details Card */}
      <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto rounded-xl bg-white p-4">
        {/* Optional Cover Image */}
        {story?.cover_image_url && (
          <div className="relative h-40 w-full overflow-hidden rounded-xl border border-[#E6DFDA]">
            <Image src={story.cover_image_url || img} alt="Cover" fill className="object-cover" />
          </div>
        )}

        {/* Dynamic Title */}
        <div>
          <span className="text-primary mb-1 block text-[12px] font-bold tracking-wider uppercase">
            Title
          </span>
          <h3 className="text-lg leading-snug font-bold text-[#5C3A21]">
            {story?.title || 'Untitled Story'}
          </h3>
        </div>

        {/* Dynamic Type / Category */}
        <div>
          <span className="mb-1 block text-[12px] font-bold tracking-wider text-[#A08170] uppercase">
            Type
          </span>
          <p className="text-sm font-semibold text-[#5C3A21] capitalize">
            {story?.story_type || 'Uncategorized'}
          </p>
        </div>

        {/* Subtle Metadata Layout */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-b border-[#F0EAE5] py-3 text-xs text-[#8A6E5F]">
          <span className="flex items-center gap-1">
            <User size={14} className="text-[#A08170]" />
            <strong>Author:</strong> {story?.author || 'Anonymous'}
          </span>
          <span className="flex items-center gap-1">
            <strong>Story ID:</strong> {id}
          </span>
          {story?.first_name && (
            <span className="flex items-center gap-1">
              <strong>First Name:</strong> {story.first_name}
            </span>
          )}
        </div>

        {/* Audio Player Section */}
        {story?.audio_path && (
          <div className="rounded-xl border border-[#F0EAE5] bg-[#FAF8F5] p-4">
            <span className="mb-2 flex items-center gap-1.5 text-[12px] font-bold tracking-wider text-[#A08170] uppercase">
              <Volume2 size={14} /> Audio Narration
            </span>
            <audio controls src={story.audio_path} className="mt-1 h-10 w-full accent-[#BF7758]">
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {/* Dynamic Story Body Content */}
        <div>
          <span className="mb-2 block text-[12px] font-bold tracking-wider text-[#A08170] uppercase">
            Content
          </span>
          <div className="max-h-87.5 overflow-y-auto pr-2 font-serif text-[15px] leading-relaxed whitespace-pre-line text-[#4A3B32] selection:bg-[#E6DFDA]">
            {story?.story_text || (
              <p className="font-sans text-sm text-neutral-400 italic">
                Place wait, Content is processing...
              </p>
            )}
          </div>
        </div>

        {/* Meta Insights: Life Phase & Growth Areas */}
        <div className="grid grid-cols-1 gap-4 border-t border-[#F0EAE5] pt-4 sm:grid-cols-2">
          {story?.life_phase && (
            <div>
              <span className="mb-2 flex items-center gap-1 text-[12px] font-bold tracking-wider text-[#A08170] uppercase">
                <Compass size={14} /> Life Phase
              </span>
              <span className="inline-block rounded-md border border-[#E6DFDA] bg-[#FDFBF7] px-3 py-1.5 text-sm font-medium text-[#5C3A21]">
                {story.life_phase}
              </span>
            </div>
          )}

          {story?.growth_areas && story.growth_areas.length > 0 && (
            <div>
              <span className="mb-2 flex items-center gap-1 text-[12px] font-bold tracking-wider text-[#A08170] uppercase">
                <Heart size={14} /> Growth Areas
              </span>
              <div className="flex flex-wrap gap-2">
                {story.growth_areas.map((area: string, index: number) => (
                  <span
                    key={index}
                    className="inline-block rounded-md border border-[#E1D7CE] bg-[#F5EFEA] px-2.5 py-1 text-xs font-semibold text-[#4A2E2B]"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Original User Input Prompt */}
        {story?.story_input && (
          <div className="border-t border-[#F0EAE5] pt-4">
            <span className="mb-2 flex items-center gap-1 text-[12px] font-bold tracking-wider text-[#A08170] uppercase">
              <MessageSquareText size={14} /> Original User Input
            </span>
            <div className="rounded-lg border border-[#EDE7E1] bg-[#FAF8F6] p-3 text-sm whitespace-pre-line text-[#614E43] italic">
              {story.story_input}
            </div>
          </div>
        )}
      </div>

      {/* Action Controller Footer */}
      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[#E6DFDA] pt-4">
        {onEdit && (
          <button
            onClick={() => onEdit(id)}
            className="cursor-pointer rounded-md bg-[#BF7758] px-5 py-2 text-sm font-medium text-white transition-all hover:bg-[#B37154] active:scale-[0.98]"
          >
            Edit
          </button>
        )}
        {onApprove && (
          <button
            onClick={() => onApprove(id)}
            className="bg-success cursor-pointer rounded-md px-5 py-2 text-sm font-medium text-white transition-all hover:bg-[#0A6332] active:scale-[0.98]"
          >
            Approve
          </button>
        )}
        {onReject && (
          <button
            onClick={() => onReject(id)}
            className="cursor-pointer rounded-md bg-[#C82323] px-5 py-2 text-sm font-medium text-white transition-all hover:bg-[#850000] active:scale-[0.98]"
          >
            Reject
          </button>
        )}
        {onRemove && (
          <button
            onClick={() => onRemove(id)}
            className="cursor-pointer rounded-md border border-[#E5CDCD] bg-[#FFF5F5] px-5 py-2 text-sm font-medium text-[#A80000] transition-all hover:bg-[#FFE5E5] active:scale-[0.98]"
          >
            Remove
          </button>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="cursor-pointer rounded-md border border-[#D1C7BD] bg-white px-5 py-2 text-sm font-medium text-[#5C4D43] transition-all hover:bg-[#F5F0EB] active:scale-[0.98]"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};
