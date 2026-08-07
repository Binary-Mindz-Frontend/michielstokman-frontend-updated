'use client';

import brushTextBg from '@/assets/account/brush-text-bg.png';
import submitHero from '@/assets/submit/submit-hero.png';
import Image from 'next/image';

export default function CreateFormHeader({ category }: { category: string }) {
  const isConfession = category === 'Confessions';

  return (
    <div className="mx-auto mb-10 flex w-full flex-col items-center justify-between gap-2 md:flex-row md:items-center md:gap-6">
      {/* Left Column: Title & Subtitle */}
      <div className="flex w-full flex-col items-start md:w-1/2">
        {/* Title */}
        <div className="font-edo flex flex-col items-start leading-none font-medium uppercase">
          <span className="-rotate-2 transform text-5xl tracking-wide text-[#486221] sm:text-6xl lg:text-7xl">
            SHARE
          </span>
          <span className="mt-1 -rotate-2 transform text-5xl tracking-wide text-[#E81A66] sm:text-6xl lg:text-7xl">
            YOUR
          </span>
          <span className="-rotate-2 transform text-5xl tracking-wide text-[#F3A134] sm:text-6xl lg:text-7xl">
            LIBERATION
          </span>
        </div>

        {/* Brush stroke subtitle */}
        <div className="relative mt-6 flex min-h-16 w-full max-w-85 -rotate-1 transform items-center justify-center px-6 sm:min-h-20 sm:max-w-100">
          <div className="absolute inset-0 h-full w-full">
            <Image src={brushTextBg} alt="Brush background" fill className="object-fill" />
          </div>
          <p className="relative z-10 px-6 py-2 text-center font-sans text-xs font-semibold tracking-wide text-white sm:text-sm">
            {isConfession ? (
              <>
                Your Story Could Be Exactly <br />{' '}
                <span className="text-[#F3A134]">What Someone</span> Needs Today.
              </>
            ) : (
              <>
                Guide Others Through Your <span className="text-[#F3A134]">Unique Meditation</span>{' '}
                Practice.
              </>
            )}
          </p>
        </div>
      </div>

      {/* Right Column: Hero Collage Photo */}
      <div className="relative flex w-full justify-center md:w-1/2">
        <div className="relative h-70 w-full max-w-85 sm:h-85 sm:max-w-100">
          <Image
            src={submitHero}
            alt="Share your liberation"
            fill
            className="object-contain object-center"
            priority
          />
        </div>
      </div>
    </div>
  );
}
