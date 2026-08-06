'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import arrowBlack from '@/assets/shared/arrow-black.png';

export interface DynamicBackButtonProps {
  text?: string;
  href?: string;
  onClick?: () => void;
  bgColor?: string;
  textColor?: 'white' | 'black' | string;
  className?: string;
}

const DynamicBackButton: React.FC<DynamicBackButtonProps> = ({
  text = 'Back',
  href,
  onClick,
  bgColor = '#52277F',
  textColor = 'white',
  className = '',
}) => {
  const isHexBg = bgColor.startsWith('#');
  const bgClass = isHexBg ? '' : bgColor;
  const bgStyle = isHexBg ? { backgroundColor: bgColor } : {};

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
      className={`font-playpen inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-xs px-4 py-2 text-sm leading-normal font-medium text-nowrap transition-all duration-300 hover:opacity-90 ${bgClass} ${textColorClass} ${className}`}
    >
      <Image
        src={arrowBlack}
        alt="back arrow"
        width={24}
        height={10}
        className="inline-block shrink-0 rotate-180 object-contain"
        style={{
          filter: isWhiteArrow ? 'invert(1) brightness(2)' : 'none',
        }}
      />
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
    <button type="button" onClick={onClick} className="inline-block cursor-pointer">
      {content}
    </button>
  );
};

export default DynamicBackButton;
