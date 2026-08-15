'use client';

import iconHeartPink from '@/assets/submit/icon-heart-pink.png';
import iconSunYellow from '@/assets/submit/icon-sun-yellow.png';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function CreateFormCategoryTabs({ selected }: { selected: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleCategoryChange = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('type', cat);
    router.push(`${pathname}?${params.toString()}`);
  };

  const isConfession = selected === 'Confessions';

  return (
    <div className="mb-6 space-y-3">
      <label className="font-playpen block text-sm font-semibold text-[#1A1A1A]">
        What Are You Sharing?
      </label>
      <div className="flex flex-wrap gap-4">
        {/* CONFESSION TAB */}
        <button
          type="button"
          onClick={() => handleCategoryChange('Confessions')}
          className={`flex cursor-pointer items-center justify-center gap-2.5 rounded-md border-2 bg-transparent px-6 py-3 font-sans text-sm font-semibold tracking-wider text-[#EB2874] uppercase transition-all ${
            isConfession ? 'border-[#EB2874]/80' : 'border-[#EBE4D5] hover:border-[#EB2874]/50'
          }`}
        >
          <div className="relative h-5 w-5 shrink-0">
            <Image src={iconHeartPink} alt="Confession" fill className="object-contain" />
          </div>
          <span>CONFESSION</span>
        </button>

        {/* MEDITATION TAB */}
        <button
          type="button"
          onClick={() => handleCategoryChange('Meditation')}
          className={`flex cursor-pointer items-center justify-center gap-2.5 rounded-md border-2 bg-transparent px-6 py-3 font-sans text-sm font-semibold tracking-wider text-[#FEC332] uppercase transition-all ${
            !isConfession ? 'border-[#FEC332]' : 'border-[#EBE4D5] hover:border-[#FEC332]/50'
          }`}
        >
          <div className="relative h-6 w-6 shrink-0">
            <Image src={iconSunYellow} alt="Meditation" fill className="object-contain" />
          </div>
          <span>MEDITATION</span>
        </button>
      </div>
    </div>
  );
}
