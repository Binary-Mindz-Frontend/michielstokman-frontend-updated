'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import arrowBlack from '@/assets/shared/arrow-black.png';

export interface DynamicActionButtonProps {
  text: string;
  href?: string;
  // eslint-disable-next-line no-unused-vars
  onClick?: (e?: React.MouseEvent) => void;
  type?: 'button' | 'submit' | 'reset';
  bgColor?: string;
  textColor?: 'white' | 'black' | string;
  showArrow?: boolean;
  className?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  /** Render the button look without a link or button — for cards that are already links. */
  asVisual?: boolean;
}

const DynamicActionButton: React.FC<DynamicActionButtonProps> = ({
  text,
  href,
  onClick,
  type = 'button',
  bgColor = '#D22D4C',
  textColor = 'white',
  showArrow = true,
  className = '',
  fullWidth = true,
  disabled = false,
  asVisual = false,
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

  const roundedClass = className.includes('rounded-') ? '' : 'rounded-none';

  const content = (
    <div
      style={bgStyle}
      className={`flex cursor-pointer items-center justify-center gap-3 border-2 border-transparent ${roundedClass} px-6 py-2.5 text-center font-sans text-sm font-semibold text-nowrap uppercase transition-all duration-300 hover:opacity-90 ${bgClass} ${textColorClass} ${
        fullWidth ? 'w-full' : 'w-auto'
      } ${disabled ? 'pointer-events-none opacity-50' : ''} ${className}`}
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

  if (asVisual) {
    return content;
  }

  if (href) {
    return (
      <Link href={href} className="block w-full cursor-pointer">
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className="w-full cursor-pointer">
      {content}
    </button>
  );
};

export default DynamicActionButton;
