'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const SHARE_OPTIONS = [
  { label: 'WhatsApp', icon: '💬', platform: 'whatsapp' },
  { label: 'Instagram', icon: '📷', platform: 'instagram' },
  { label: 'Facebook', icon: '📘', platform: 'facebook' },
  { label: 'Copy link', icon: '🔗', platform: 'copy' },
];

export default function ShareSection() {
  const handleShare = (platform: string) => {
    // Strip /reflect so shared links always point to the story detail page
    const currentUrl = window.location.href.replace('/reflect', '');
    const shareText = 'Check out this inspiring story!';

    switch (platform) {
      case 'whatsapp':
        window.open(
          `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`,
          '_blank',
        );
        break;

      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
          '_blank',
        );
        break;

      case 'instagram':
        navigator.clipboard.writeText(currentUrl);
        toast.info("Instagram doesn't support direct link sharing. Link copied to clipboard!");
        break;

      case 'copy':
        navigator.clipboard.writeText(currentUrl);
        toast.success('Link copied to clipboard!');
        break;

      default:
        break;
    }
  };

  return (
    <div className="border-t border-[#E5E0DA] pt-4">
      <p className="text-primary text-center">Share this with someone who needs it</p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {SHARE_OPTIONS.map((opt) => (
          <Button
            key={opt.label}
            type="button"
            onClick={() => handleShare(opt.platform)}
            className={cn(
              'rounded-sm border bg-transparent px-4 py-2 text-sm transition-all hover:bg-transparent',
              'border-primary/20 text-secondary',
            )}
          >
            <span>{opt.icon}</span>
            {opt.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
