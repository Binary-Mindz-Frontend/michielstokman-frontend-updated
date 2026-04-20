'use client';

import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { cardData } from '../../(home)/_components/ResonanceGrid/_components/data/cardData.data';

export default function JourneyDetailPage() {
  const { id } = useParams();

  // Data find logic
  const journey = cardData.find((item) => item.id.toString() === id);

  if (!journey)
    return <div className="p-20 text-center font-serif text-[#4A3F35]">Journey not found</div>;

  const expectations = [
    'Daily 15-minute guided practices',
    'Morning check-ins to tune into your energy',
    'Gentle movement & breathwork exercises',
    'Evening reflections to deepen awareness',
    'A blooming flower tracking your inner growth',
    'A medal of transformation upon completion',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Matching Story Page */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <Image
          src={journey?.image}
          alt={journey?.title}
          fill
          className="object-cover"
          style={{ objectPosition: '50% 50%' }}
          priority
        />

        {/* Exact Overlay - Exact same as Story Page */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background: 'linear-gradient(180deg, rgba(250, 247, 245, 0) -39.16%, #FAF7F5 93.71%)',
          }}
        />

        {/* Back Button */}
        <div className="relative z-20 container mx-auto pt-12">
          <Link
            href="/"
            className="text-primary inline-flex items-center text-sm font-medium hover:underline"
          >
            ← Back
          </Link>
        </div>
      </div>

      {/* Content Section - Same Width & Negative Margin as Story Page */}
      <div className="relative z-20 mx-auto -mt-40 w-full max-w-400 px-4">
        <div className="space-y-6">
          {/* Header Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-dark-primary text-sm font-medium tracking-wider uppercase">
                Liberations
              </span>
              <div className="bg-dark-primary/30 h-0.5 w-12" />
            </div>

            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div className="w-full space-y-4">
                <h1 className="text-dark-primary font-serif text-2xl font-semibold sm:text-3xl md:text-4xl lg:text-5xl">
                  {journey?.title || 'Feel More Vital – 7 Days to More Life Energy'}
                </h1>

                <div className="flex items-center gap-3">
                  <span className="border-primary/40 text-primary rounded-sm border bg-transparent px-4 py-1.5 text-xs transition-all hover:bg-transparent">
                    30 Days
                  </span>
                  <div className="border-primary/40 text-primary rounded-sm border bg-transparent px-4 py-1.5 text-xs transition-all hover:bg-transparent">
                    Rating 4.3
                  </div>
                </div>
              </div>

              <div className="text-dark-primary font-serif text-4xl font-bold md:text-4xl">€47</div>
            </div>
          </div>

          {/* Description Text - Matching Story Page Typography */}
          <div className="max-w-4xl">
            <p className="text-dark-primary/90 space-y-4 text-lg font-light">
              This Liberation gently guides you through 7 days of simple body-mind practices. Each
              day builds on the last — waking up your breath, softening tension, and opening space
              for genuine vitality to return.
            </p>
          </div>

          {/* What to Expect Section */}
          <div className="space-y-6 pt-6">
            <h2 className="text-dark-primary font-serif text-2xl font-semibold">What to Expect</h2>
            <ul className="grid grid-cols-1 gap-y-4 md:max-w-xl">
              {expectations.map((item, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="bg-primary/10 mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
                    <Check className="text-primary h-3 w-3" strokeWidth={3} />
                  </div>
                  <span className="text-secondary text-[15px] font-light">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Checkout Action - Styling from your Story Button */}
          <div className="flex flex-col items-center gap-4 pt-6 md:pt-10">
            <Link href={`/journeys/${journey?.id}/liberation`}>
              <Button className="btn-styles w-fit">Start This Liberation — €47</Button>
            </Link>
            <p className="text-secondary text-xs">
              One-time payment · Lifetime access · 30-day guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
