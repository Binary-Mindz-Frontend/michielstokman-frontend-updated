'use client';

import LiberationsGrid from './_components/LiberationsGrid/LiberationsGrid';
import LiberationsHero from './_components/LiberationsHero/LiberationsHero';

export default function LiberationsPage() {
  return (
    <div className="relative z-10 mx-auto max-w-400 space-y-10 px-4 lg:space-y-25">
      <LiberationsHero />
      <LiberationsGrid />
    </div>
  );
}
