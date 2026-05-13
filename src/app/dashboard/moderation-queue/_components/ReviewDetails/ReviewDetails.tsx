import { useGetStoryDetailsQuery } from '@/redux/features/admin/adminModeration/adminModeration.api';
import { User, BookOpen, Hash } from 'lucide-react';
import Image from 'next/image';
import img from '@/assets/table_placeholder_image.jpg';

export const ReviewDetails = ({ id }: { id: string }) => {
  const { data, isLoading } = useGetStoryDetailsQuery(id);
  const story = data?.data;

  if (isLoading) return <div className="h-64 animate-pulse rounded-lg bg-gray-100" />;

  return (
    <div className="flex flex-col gap-6 overflow-hidden">
      {/* Cover Image & Title */}
      <div className="border-primary/10 relative h-48 w-full overflow-hidden rounded-xl border">
        <Image src={story?.cover_image_url || img} alt="Cover" fill className="object-cover" />
        <div className="absolute inset-0 flex items-end bg-linear-to-t from-black/70 to-transparent p-4">
          <h3 className="line-clamp-2 text-xl font-bold text-white">{story?.title}</h3>
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border-primary/5 flex items-center gap-3 rounded-lg border bg-[#FAF7F5] p-3">
          <User size={18} className="text-secondary" />
          <div>
            <p className="text-mute text-[10px] tracking-wider uppercase">Author</p>
            <p className="text-dark-primary text-sm font-semibold">{story?.author}</p>
          </div>
        </div>
        <div className="border-primary/5 flex items-center gap-3 rounded-lg border bg-[#FAF7F5] p-3">
          <Hash size={18} className="text-secondary" />
          <div>
            <p className="text-mute text-[10px] tracking-wider uppercase">Type</p>
            <p className="text-dark-primary text-sm font-semibold capitalize">
              {story?.story_type}
            </p>
          </div>
        </div>
      </div>

      {/* Story Content */}
      <div className="space-y-2">
        <div className="text-dark-primary border-primary/10 flex items-center gap-2 border-b pb-2 font-medium">
          <BookOpen size={18} />
          <span>Story Content</span>
        </div>
        <div className="text-dark-primary/80 border-primary/5 max-h-60 overflow-y-auto rounded-lg border bg-white p-4 pr-2 text-sm leading-relaxed">
          {story?.story_text || 'No content provided.'}
        </div>
      </div>
    </div>
  );
};
