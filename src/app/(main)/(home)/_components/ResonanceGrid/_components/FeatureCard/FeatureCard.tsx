'use client';

import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import Image, { StaticImageData } from 'next/image';
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
    <div className="relative flex min-h-87.5 flex-col justify-between overflow-hidden rounded-md bg-[#F8F3ED] p-5 shadow-xs sm:min-h-92.5 sm:p-6 lg:min-h-95 lg:p-7">
      {/* Left Content Area */}
      <div className="relative z-10 max-w-[50%] sm:max-w-[48%]">
        {/* Card Top: Number */}
        <span className="font-sans text-sm font-semibold text-[#301C05] sm:text-base">
          {item.number}
        </span>

        {/* Title */}
        <h3
          className={`font-edo mt-0.5 text-2xl leading-tight font-black tracking-wide uppercase sm:text-[1.9rem] lg:text-[2.2rem] ${item.titleColor}`}
        >
          {item.title}
        </h3>

        {/* Description */}
        <p className="mt-3 font-sans text-xs leading-relaxed font-semibold text-black sm:mt-4 sm:text-sm">
          {item.description}
        </p>

        {/* Icon Bottom Right of Left Column (Next to image) */}
        <div className="mt-4 flex w-full justify-end sm:mt-6">
          <div className="relative h-8 w-8 shrink-0 sm:h-9 sm:w-9">
            <Image src={item.icon} alt={item.iconAlt} fill className="object-contain" />
          </div>
        </div>
      </div>

      {/* Right Photo Layer - Absolute Positioned to Fill Right Side */}
      <div className="absolute top-8 right-2 bottom-18 z-0 w-[48%] sm:top-10 sm:bottom-20 sm:w-[50%]">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-contain object-bottom-right"
          priority
        />
      </div>

      {/* Reusable Dynamic Action Button */}
      <div className="relative z-10 mt-5 sm:mt-6">
        <DynamicActionButton
          text={item.btnText}
          href={item.link}
          bgColor={item.bgColor}
          textColor={item.textColor}
        />
      </div>
    </div>
  );
};

export default FeatureCard;
