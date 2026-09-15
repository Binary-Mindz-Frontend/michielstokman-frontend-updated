'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

import arrowBlack from '@/assets/shared/arrow-black.png';

export interface DynamicSkipButtonProps {
  text?: string;
  href?: string;
  // eslint-disable-next-line no-unused-vars
  onClick?: (e?: React.MouseEvent) => void;
  borderColor?: string;
  textColor?: string;
  bgColor?: string;
  className?: string;
  fullWidth?: boolean;
  showArrow?: boolean;
}

const DynamicSkipButton: React.FC<DynamicSkipButtonProps> = ({
  text = 'Skip',
  href,
  onClick,
  borderColor = '#D22D4C',
  textColor = '#D22D4C',
  bgColor = 'white',
  className = '',
  fullWidth = true,
  showArrow = false,
}) => {
  const router = useRouter();

  const isHexBorder = borderColor.startsWith('#');
  const borderStyle = isHexBorder ? { borderColor } : {};

  const isHexText = textColor.startsWith('#');
  const textStyle = isHexText ? { color: textColor } : {};

  const roundedClass = className.includes('rounded-') ? '' : 'rounded-none';

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e);
    } else if (!href) {
      router.back();
    }
  };

  const content = (
    <div
      style={{ ...borderStyle, ...textStyle, backgroundColor: bgColor }}
      className={`flex cursor-pointer items-center justify-center gap-3 border-2 ${roundedClass} px-6 py-2.5 text-center font-sans text-sm font-semibold text-nowrap uppercase transition-all duration-300 hover:bg-[#FFF5F7] active:scale-95 ${
        fullWidth ? 'w-full' : 'w-auto'
      } ${className}`}
    >
      <span>{text}</span>
      {showArrow ? (
        <Image
          src={arrowBlack}
          alt=""
          width={28}
          height={12}
          className="inline-block shrink-0 object-contain"
          style={{
            filter:
              textColor === 'white' || textColor.includes('white')
                ? 'invert(1) brightness(2)'
                : 'none',
          }}
        />
      ) : null}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block w-full cursor-pointer">
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={handleClick} className="w-full cursor-pointer">
      {content}
    </button>
  );
};

export default DynamicSkipButton;
