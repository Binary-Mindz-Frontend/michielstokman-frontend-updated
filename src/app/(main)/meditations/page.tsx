'use client';

import MeditationsGrid from './_components/MeditationsGrid/MeditationsGrid';
import MeditationsHero from './_components/MeditationsHero/MeditationsHero';

export default function MeditationsPage() {
  return (
    <div className="relative z-10 mx-auto max-w-350 space-y-10 px-4 lg:space-y-20">
      <MeditationsHero />
      <MeditationsGrid />
    </div>
  );
}
