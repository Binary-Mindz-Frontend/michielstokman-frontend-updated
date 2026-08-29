'use client';

import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import React from 'react';

export interface FeatureItem {
  number: string;
  title: string;
  titleColor: string;
  description: string;
  image: StaticImageData;
  link: string;
  btnText: string;
  bgColor: string;
  textColor: 'white' | 'black';
  icon: StaticImageData;
  iconAlt: string;
}

interface FeatureCardProps {
  item: FeatureItem;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ item }) => {
  return (
    <Link
      href={item.link}
      className="relative flex min-h-80 flex-col justify-between overflow-hidden rounded-md bg-[#F8F3ED] p-5 shadow-xs transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D22D4C] sm:min-h-85 lg:min-h-90 xl:min-h-92.5"
    >
      <div className="relative z-10 max-w-[53%]">
        <span className="font-sans text-xs font-semibold text-[#301C05] sm:text-sm">
          {item?.number}
        </span>

        <h3
          className={`font-edo mt-0.5 text-xl leading-tight font-medium tracking-wide uppercase sm:text-[1.6rem] lg:text-[1.85rem] xl:text-[2rem] ${item?.titleColor}`}
        >
          {item?.title}
        </h3>

        <p className="mt-2.5 font-sans text-xs leading-relaxed font-medium text-black sm:mt-3 lg:text-sm">
          {item?.description}
        </p>

        <div className="mt-6 flex w-full justify-end sm:mt-12">
          <div className="relative h-7 w-7 shrink-0 sm:h-8 sm:w-8">
            <Image src={item?.icon} alt={item?.iconAlt} fill className="object-contain" />
          </div>
        </div>
      </div>

      <div className="absolute top-8 right-2 bottom-16 z-0 w-[47%] sm:top-8 sm:bottom-18 lg:top-8 lg:bottom-18">
        <Image
          src={item?.image}
          alt={item?.title}
          fill
          className="object-contain object-bottom-right"
          priority
        />
      </div>

      <div className="relative z-10 mt-4">
        <DynamicActionButton
          text={item?.btnText}
          bgColor={item?.bgColor}
          textColor={item?.textColor}
          asVisual
        />
      </div>
    </Link>
  );
};

export default FeatureCard;
