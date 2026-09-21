'use client';

import Image from 'next/image';
import { BsFacebook, BsInstagram, BsLink45Deg, BsWhatsapp } from 'react-icons/bs';
import { toast } from 'sonner';
import type { ReactNode } from 'react';

import blackDrawnArrow from '@/assets/reflect/red-drawn-heart.png';
import yellowBrushUnderline from '@/assets/reflect/yellow-brush-underline.png';
import { cn } from '@/lib/utils';

const SHARE_OPTIONS = [
  { label: 'WhatsApp', icon: BsWhatsapp, color: 'text-[#25D366]', platform: 'whatsapp' },
  { label: 'Instagram', icon: BsInstagram, color: 'text-[#E1306C]', platform: 'instagram' },
  { label: 'Facebook', icon: BsFacebook, color: 'text-[#1877F2]', platform: 'facebook' },
  { label: 'Copy link', icon: BsLink45Deg, color: 'text-[#5A6A85]', platform: 'copy' },
] as const;

interface StoryShareActionsProps {
  /** Absolute or site-relative details URL to share (no /reflect or /share). */
  shareUrl?: string;
  size?: 'compact' | 'large';
  className?: string;
  /** Rendered beside large share buttons (e.g. Skip). Must match Facebook button size. */
  trailingAction?: ReactNode;
  showHeading?: boolean;
}

function resolveShareUrl(explicit?: string) {
  if (typeof window === 'undefined') return explicit || '';
  if (explicit) {
    if (explicit.startsWith('http')) return explicit;
    return `${window.location.origin}${explicit.startsWith('/') ? '' : '/'}${explicit}`;
  }
  return window.location.href.replace(/\/(reflect|share)\/?$/, '');
}

export default function StoryShareActions({
  shareUrl,
  size = 'compact',
  className,
  trailingAction,
  showHeading = true,
}: StoryShareActionsProps) {
  const handleShare = (platform: string) => {
    const currentUrl = resolveShareUrl(shareUrl);
    const shareText = 'Check out this inspiring story!';

    switch (platform) {
      case 'whatsapp':
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${shareText} ${currentUrl}`)}`,
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
        void navigator.clipboard.writeText(currentUrl);
        toast.info("Instagram doesn't support direct link sharing. Link copied to clipboard!");
        break;
      case 'copy':
        void navigator.clipboard.writeText(currentUrl);
        toast.success('Link copied to clipboard!');
        break;
      default:
        break;
    }
  };

  const large = size === 'large';

  return (
    <div className={cn('w-full space-y-6 text-center', className)}>
      {showHeading ? (
        <div className="relative inline-flex flex-col items-center justify-center px-4">
          <h3 className="font-sans text-lg font-semibold tracking-wide text-[#1A1A1A] sm:text-xl">
            Share This With Someone Who Needs It
          </h3>
          <div className="relative mt-2 h-3.5 w-full max-w-95 sm:max-w-105">
            <Image src={yellowBrushUnderline} alt="" fill className="object-contain" />
          </div>
          <div className="absolute -right-8 -bottom-7 h-8 w-8 sm:-right-12 sm:h-14 sm:w-14">
            <Image src={blackDrawnArrow} alt="" fill className="object-contain" />
          </div>
        </div>
      ) : null}

      <div
        className={cn(
          'flex flex-wrap items-stretch justify-center gap-3 pt-2',
          large ? 'sm:gap-4' : 'gap-6 sm:gap-10',
        )}
      >
        {SHARE_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.label}
              type="button"
              onClick={() => handleShare(opt.platform)}
              className={cn(
                'cursor-pointer font-sans font-semibold text-[#1A1A1A] transition-transform hover:scale-[1.02] active:scale-100',
                large
                  ? 'border-primary/25 inline-flex min-h-14 min-w-[140px] flex-1 items-center justify-center gap-2 rounded-md border bg-white px-5 py-3.5 text-sm shadow-sm sm:min-w-[160px] sm:flex-none sm:text-base'
                  : 'flex items-center gap-2 text-sm',
              )}
            >
              <Icon className={cn(large ? 'text-2xl' : 'text-xl', opt.color)} />
              <span>{opt.label}</span>
            </button>
          );
        })}
        {trailingAction}
      </div>
    </div>
  );
}
