// 'use client';

// import Image from 'next/image';
// import creditBg from '@/assets/profile/credit-bg.png';
// import creditIcon from '@/assets/profile/credit-icon.png';
// import reflectionBrush from '@/assets/profile/reflection-brush-bg.png';
// import resonanceBrush from '@/assets/profile/resonence-brush-bg.png';
// import usernameBrush from '@/assets/profile/username-brush-bg.png';

// interface ProfileHeroProps {
//   trueName?: string;
//   lifePhase?: string;
//   dailyCredits?: number;
//   reflectionsCount?: number;
//   avgResonance?: number;
// }

// export default function ProfileHero({
//   trueName = 'Michiel Stockman',
//   lifePhase = 'Discovering',
//   dailyCredits = 3,
//   reflectionsCount = 7,
//   avgResonance = 8.3,
// }: ProfileHeroProps) {
//   return (
//     <div className="relative mb-8 flex w-full flex-col items-center justify-center rounded-2xl bg-[#F7F3EC] px-4 py-12 shadow-sm md:py-16">
//       {/* Top Brush - Profile Name */}
//       <div className="relative flex min-h-[105px] w-full max-w-[420px] items-center justify-center text-center">
//         <Image
//           src={usernameBrush}
//           alt="Username Brush Background"
//           fill
//           className="object-contain"
//           priority
//         />

//         {/* Credit Badge */}
//         <div className="absolute -top-2 right-2 z-20 flex h-7 w-16 items-center justify-center sm:-top-3 sm:-right-2">
//           <Image src={creditBg} alt="Credit Badge BG" fill className="object-contain" />
//           <div className="relative z-10 flex items-center gap-1 text-[11px] font-bold text-white">
//             <Image
//               src={creditIcon}
//               alt="Coin Icon"
//               width={14}
//               height={14}
//               className="h-3.5 w-3.5 object-contain"
//             />
//             <span>{dailyCredits}/3</span>
//           </div>
//         </div>

//         <div className="relative z-10 flex flex-col items-center justify-center pb-1 text-white">
//           <h2 className="font-playpen text-2xl font-bold text-white md:text-3xl">{trueName}</h2>
//           <p className="font-playpen text-xs font-medium uppercase tracking-widest text-purple-100">
//             {lifePhase}
//           </p>
//         </div>
//       </div>

//       {/* Bottom Brushes Container */}
//       <div className="mt-8 flex w-full flex-col items-center justify-center gap-6 md:flex-row md:gap-12">
//         {/* Left Brush - Reflections */}
//         <div className="relative flex min-h-[95px] w-[270px] items-center justify-center">
//           <Image src={reflectionBrush} alt="Reflection Brush" fill className="object-contain" />
//           <div className="relative z-10 pb-1 text-center text-white">
//             <p className="font-playpen text-3xl font-bold">{reflectionsCount}</p>
//             <p className="font-playpen text-xs font-semibold uppercase tracking-wider">
//               REFLECTIONS
//             </p>
//           </div>
//         </div>

//         {/* Right Brush - Resonance */}
//         <div className="relative flex min-h-[95px] w-[270px] items-center justify-center">
//           <Image src={resonanceBrush} alt="Resonance Brush" fill className="object-contain" />
//           <div className="relative z-10 pb-1 text-center text-white">
//             <p className="font-playpen text-3xl font-bold">{avgResonance}</p>
//             <p className="font-playpen text-xs font-semibold uppercase tracking-wider">
//               AVG. RESONANCE
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import Image from 'next/image';
import creditBg from '@/assets/profile/credit-bg.png';
import creditIcon from '@/assets/profile/credit-icon.png';
import reflectionBrush from '@/assets/profile/reflection-brush-bg.png';
import resonanceBrush from '@/assets/profile/resonence-brush-bg.png';
import usernameBrush from '@/assets/profile/username-brush-bg.png';

interface ProfileHeroProps {
  trueName?: string;
  lifePhase?: string;
  dailyCredits?: number;
  reflectionsCount?: number;
  avgResonance?: number;
}

export default function ProfileHero({
  trueName = 'Michiel Stockman',
  lifePhase = 'Discovering',
  dailyCredits = 3,
  reflectionsCount = 7,
  avgResonance = 8.3,
}: ProfileHeroProps) {
  return (
    <div className="relative mx-auto mb-8 flex w-full max-w-[1000px] flex-col items-center justify-center rounded-2xl bg-[#F7F3EC] px-4 py-12 shadow-sm md:py-20">
      <div className="relative flex min-h-[140px] w-full max-w-[550px] items-center justify-center text-center">
        <Image
          src={usernameBrush}
          alt="Username Brush Background"
          fill
          className="object-contain"
          priority
        />

        {/* Credit Badge - Repositioned to overlay the top right tail of the brush */}
        <div className="absolute top-3 right-8 z-20 flex h-7 w-[72px] items-center justify-center sm:top-4 sm:right-12 md:top-5 md:right-16">
          <Image src={creditBg} alt="Credit Badge BG" fill className="object-contain" />
          <div className="relative z-10 flex items-center gap-1 pl-1 text-[11px] font-bold text-white">
            <Image
              src={creditIcon}
              alt="Coin Icon"
              width={14}
              height={14}
              className="h-3.5 w-3.5 object-contain"
            />
            <span>{dailyCredits}/3</span>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center pb-2 text-white">
          <h2 className="font-playpen text-3xl font-bold text-white md:text-4xl">{trueName}</h2>
          <p className="font-playpen mt-1 text-[13px] font-medium tracking-widest text-purple-100 uppercase">
            {lifePhase}
          </p>
        </div>
      </div>

      {/* Bottom Brushes Container */}
      <div className="mt-10 flex w-full flex-col items-center justify-center gap-6 md:flex-row md:gap-12 lg:gap-16">
        {/* Left Brush - Reflections */}
        {/* Scaled up width and min-height */}
        <div className="relative flex min-h-[110px] w-[320px] max-w-full items-center justify-center">
          <Image src={reflectionBrush} alt="Reflection Brush" fill className="object-contain" />
          <div className="relative z-10 pb-1 text-center text-white">
            <p className="font-playpen text-4xl font-bold">{reflectionsCount}</p>
            <p className="font-playpen mt-1 text-[13px] font-semibold tracking-wider uppercase">
              REFLECTIONS
            </p>
          </div>
        </div>

        {/* Right Brush - Resonance */}
        {/* Scaled up width and min-height */}
        <div className="relative flex min-h-[110px] w-[320px] max-w-full items-center justify-center">
          <Image src={resonanceBrush} alt="Resonance Brush" fill className="object-contain" />
          <div className="relative z-10 pb-1 text-center text-white">
            <p className="font-playpen text-4xl font-bold">{avgResonance}</p>
            <p className="font-playpen mt-1 text-[13px] font-semibold tracking-wider uppercase">
              AVG. RESONANCE
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
