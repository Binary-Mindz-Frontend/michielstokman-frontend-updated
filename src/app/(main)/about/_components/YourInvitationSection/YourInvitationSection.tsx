'use client';

import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import { FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Assets from src/assets/about
import blackUnderline from '@/assets/about/black-underline.png';
import founderLinkPaperBg from '@/assets/about/founder-link-paper-bg.png';
import invitationQuoteBg from '@/assets/about/invitation-quote-text-bg.png';
import loveIcon from '@/assets/about/love-icon.png';

const YourInvitationSection = () => {
  return (
    <motion.div variants={FADE_IN_UP_ITEM} className="flex w-full flex-col space-y-16">
      {/* --- TOP ROW: SECTION 5 & ACTION CALLOUT --- */}
      <div className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start lg:gap-14">
        {/* LEFT COLUMN: Section 05 Text & Quote Card */}
        <div className="flex w-full flex-col items-start text-left lg:w-1/2">
          {/* Section Heading */}
          <h2 className="font-edo text-2xl font-normal text-[#D96B27] uppercase sm:text-3xl md:text-3xl lg:text-4xl">
            05. YOUR INVITATION
          </h2>

          {/* Text Paragraphs */}
          <div className="mt-6 space-y-4 font-sans text-sm leading-relaxed font-normal text-[#333333] sm:text-base md:text-[17px]">
            <p>
              You have lived for others long enough. You have adapted until you became a stranger to
              yourself.
            </p>
            <p>
              Now, the depth is calling. It is asking you to reduce the distance between what you
              feel and what you allow yourself to express. It is asking you to stop surviving the
              waves and start owning the ocean.
            </p>
          </div>

          {/* Quote Paper Container */}
          <div className="relative mt-8 flex min-h-28 w-full max-w-120 items-center justify-start px-6 py-6 sm:mt-10 sm:min-h-32 sm:px-8">
            {/* Background Paper Image */}
            <div className="absolute inset-0 h-full w-full">
              <Image
                src={invitationQuoteBg}
                alt="Invitation Quote Background"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Content inside Quote Paper */}
            <div className="relative z-10 flex items-center gap-4">
              <div className="relative h-8 w-8 shrink-0 sm:h-10 sm:w-10">
                <Image src={loveIcon} alt="Love icon" fill className="object-contain" />
              </div>
              <div className="font-playpen text-xs leading-snug font-normal text-[#1A1A1A] sm:text-sm md:text-base">
                <p>I am Michiel Stokman. This is</p>
                <p>Transform to Liberation.</p>
                <p>I am here. Are you ready to shine?</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Callout Stack & Dynamic Action Button */}
        <div className="flex w-full flex-col items-center text-center lg:w-1/2 lg:items-start lg:pl-6 lg:text-left">
          <p className="font-sans text-sm font-normal text-[#4A4A4A] sm:text-base md:text-lg">
            You have adapted long enough.
          </p>

          {/* Callout Headline Stack */}
          <div className="font-edo mt-3 flex flex-col items-center leading-none font-normal uppercase not-italic lg:items-start">
            <span className="text-3xl tracking-wider text-[#1A1A1A] sm:text-4xl md:text-5xl lg:text-6xl">
              ARE YOU READY
            </span>
            <span className="mt-2 text-3xl tracking-wider text-[#1A1A1A] sm:mt-3 sm:text-4xl md:text-5xl lg:text-6xl">
              TO COME HOME
            </span>
            <div className="mt-2 flex items-center justify-center gap-3 sm:mt-3 lg:justify-start">
              <span className="text-3xl tracking-wider text-[#1A1A1A] sm:text-4xl md:text-5xl lg:text-6xl">
                TO
              </span>
              <div className="relative inline-block">
                <span className="text-3xl tracking-wider text-[#EB2874] sm:text-4xl md:text-5xl lg:text-6xl">
                  YOURSELF?
                </span>
                {/* Pink Underline Vector Image in #EB2874 (Under YOURSELF? only) */}
                <div className="relative mt-1 h-3.5 w-full">
                  <Image
                    src={blackUnderline}
                    alt="Pink underline accent"
                    fill
                    className="object-contain"
                    style={{
                      filter:
                        'invert(24%) sepia(85%) saturate(3687%) hue-rotate(324deg) brightness(96%) contrast(93%)',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Action Button */}
          <div className="mt-8 w-full max-w-md sm:mt-10">
            <DynamicActionButton
              text="BEGIN LIBERATION"
              href="/sign-up"
              bgColor="#5124A0"
              textColor="white"
              fullWidth={true}
              className="rounded-none"
            />
          </div>
        </div>
      </div>

      {/* --- BOTTOM ROW: FOUNDER LINK PAPER & FOOTER BRANDING --- */}
      <div className="relative flex w-full flex-col items-center justify-between gap-8 pt-8 md:flex-row md:items-end">
        {/* Pink Paper Note Link to Founder's Word (Left Side) */}
        <Link
          href="/about/founders-word"
          className="relative flex min-h-32 w-full max-w-80 cursor-pointer items-center justify-center p-6 sm:min-h-36 sm:max-w-90"
        >
          <div className="absolute inset-0 h-full w-full">
            <Image
              src={founderLinkPaperBg}
              alt="Read personal word paper background"
              fill
              className="object-contain"
              priority
            />
          </div>
          <p className="font-playpen relative z-10 text-center text-sm leading-snug font-semibold text-[#1A1A1A] sm:text-base">
            Read a personal word
            <br />
            from the founder
          </p>
        </Link>

        {/* Copyright Footer Branding - Horizontally Centered & Bottom-Edge Aligned */}
        <div className="flex flex-col items-center justify-center pb-1 text-center md:absolute md:bottom-1 md:left-1/2 md:-translate-x-1/2">
          <p className="font-sans text-xs font-semibold tracking-widest text-[#1A1A1A] uppercase sm:text-sm">
            TRANSFORM TO LIBERATION &copy; 2026
          </p>
          {/* Copyright Underline Black Vector Image */}
          <div className="relative mt-2 h-4 w-48 sm:w-56">
            <Image
              src={blackUnderline}
              alt="Copyright black underline brush"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default YourInvitationSection;
