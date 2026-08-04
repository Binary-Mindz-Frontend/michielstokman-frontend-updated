'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import arrowBlack from '@/assets/shared/arrow-black.png';

export interface DynamicActionButtonProps {
  text: string;
  href?: string;
  onClick?: () => void;
  bgColor?: string;
  textColor?: 'white' | 'black' | string;
  showArrow?: boolean;
  className?: string;
  fullWidth?: boolean;
}

const DynamicActionButton: React.FC<DynamicActionButtonProps> = ({
  text,
  href,
  onClick,
  bgColor = '#D22D4C',
  textColor = 'white',
  showArrow = true,
  className = '',
  fullWidth = true,
}) => {
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

  const content = (
    <div
      style={bgStyle}
      className={`flex items-center justify-center gap-3 rounded-sm px-6 py-3.5 text-center font-sans text-sm font-semibold tracking-widest uppercase transition-all duration-300 hover:opacity-90 ${bgClass} ${textColorClass} ${
        fullWidth ? 'w-full' : 'w-auto'
      } ${className}`}
    >
      <span>{text}</span>

      {showArrow && (
        <Image
          src={arrowBlack}
          alt="arrow"
          width={28}
          height={12}
          className="inline-block shrink-0 object-contain"
          style={{
            filter: isWhiteArrow ? 'invert(1) brightness(2)' : 'none',
          }}
        />
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block w-full">
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className="w-full">
      {content}
    </button>
  );
};

export default DynamicActionButton;
