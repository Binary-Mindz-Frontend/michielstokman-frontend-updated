'use client';

import Image from 'next/image';
import { BsFacebook, BsInstagram, BsLink45Deg, BsWhatsapp } from 'react-icons/bs';
import { toast } from 'sonner';

import blackDrawnArrow from '@/assets/reflect/red-drawn-heart.png';
import yellowBrushUnderline from '@/assets/reflect/yellow-brush-underline.png';

const SHARE_OPTIONS = [
  { label: 'WhatsApp', icon: BsWhatsapp, color: 'text-[#25D366]', platform: 'whatsapp' },
  { label: 'Instagram', icon: BsInstagram, color: 'text-[#E1306C]', platform: 'instagram' },
  { label: 'Facebook', icon: BsFacebook, color: 'text-[#1877F2]', platform: 'facebook' },
  { label: 'Copy link', icon: BsLink45Deg, color: 'text-[#5A6A85]', platform: 'copy' },
];

export default function ShareSection() {
  const handleShare = (platform: string) => {
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
    <div className="w-full space-y-6 pt-4 pb-8 text-center">
      {/* Title with Yellow Brush Underline & Black Drawn Arrow PNG Image Assets */}
      <div className="relative inline-flex flex-col items-center justify-center px-4">
        <h3 className="font-sans text-lg font-semibold tracking-wide text-[#1A1A1A] sm:text-xl">
          Share This With Someone Who Needs It
        </h3>

        {/* Yellow Brush Underline Image */}
        <div className="relative mt-2 h-3.5 w-full max-w-95 sm:max-w-105">
          <Image
            src={yellowBrushUnderline}
            alt="Yellow Brush Underline"
            fill
            className="object-contain"
          />
        </div>

        {/* Black Drawn Arrow Image Asset on Bottom Right */}
        <div className="absolute -right-8 -bottom-7 h-8 w-8 sm:-right-12 sm:h-14 sm:w-14">
          <Image src={blackDrawnArrow} alt="Drawn Arrow" fill className="object-contain" />
        </div>
      </div>

      {/* Social Platform Share Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-6 pt-4 sm:gap-10">
        {SHARE_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.label}
              type="button"
              onClick={() => handleShare(opt.platform)}
              className="flex cursor-pointer items-center gap-2 font-sans text-sm font-semibold text-[#1A1A1A] transition-transform hover:scale-105 active:scale-100"
            >
              <Icon className={`text-xl ${opt.color}`} />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
