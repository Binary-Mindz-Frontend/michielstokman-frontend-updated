'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

import arrowLeftWhite from '@/assets/shared/arrow-left-white.png';

export interface DynamicBackButtonProps {
  text?: string;
  href?: string;
  // eslint-disable-next-line no-unused-vars
  onClick?: (e?: React.MouseEvent) => void;
  bgColor?: string;
  textColor?: 'white' | 'black' | string;
  showArrow?: boolean;
  className?: string;
  fullWidth?: boolean;
}

const DynamicBackButton: React.FC<DynamicBackButtonProps> = ({
  text = 'Back',
  href,
  onClick,
  bgColor = '#D22D4C',
  textColor = 'white',
  showArrow = true,
  className = '',
  fullWidth = false,
}) => {
  const router = useRouter();

  // Determine if bgColor is hex string (starts with '#') or Tailwind class
  const isHexBg = bgColor.startsWith('#');
  const bgClass = isHexBg ? '' : bgColor;
  const bgStyle = isHexBg ? { backgroundColor: bgColor } : {};

  // Determine text color class and arrow filter (white or black)
  const isDarkText =
    textColor === 'black' ||
    textColor.includes('black') ||
    textColor.includes('#3A2200') ||
    textColor.includes('#301C05');
  const textColorClass =
    textColor === 'white' ? 'text-white' : textColor === 'black' ? 'text-[#3A2200]' : textColor;
  const isWhiteArrow = !isDarkText;

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e);
    } else if (!href) {
      router.back();
    }
  };

  const content = (
    <div
      style={bgStyle}
      className={`flex cursor-pointer items-center justify-center gap-2 px-4 py-2.5 text-center font-sans text-xs font-medium text-nowrap uppercase transition-all duration-300 hover:opacity-90 ${bgClass} ${textColorClass} ${
        fullWidth ? 'w-full' : 'w-auto'
      } ${className}`}
    >
      {showArrow && (
        <Image
          src={arrowLeftWhite}
          alt="back arrow"
          width={22}
          height={10}
          className="inline-block shrink-0 object-contain"
          style={{
            filter: isWhiteArrow ? 'none' : 'invert(1)',
          }}
        />
      )}

      <span>{text}</span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block cursor-pointer">
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={handleClick} className="inline-block cursor-pointer">
      {content}
    </button>
  );
};

export default DynamicBackButton;
