'use client';

import ConfessionsGrid from './_components/ConfessionsGrid/ConfessionsGrid';
import ConfessionsHero from './_components/ConfessionsHero/ConfessionsHero';

export default function ConfessionsPage() {
  return (
    <div className="relative z-10 mx-auto max-w-350 space-y-10 px-4 lg:space-y-20">
      <ConfessionsHero />
      <ConfessionsGrid />
    </div>
  );
}
