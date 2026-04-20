'use client';

import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function StoryDetailPage() {
  const data = {
    id: '1',
    category: 'STORY',
    title: 'The Morning I Stopped Running',
    author: 'Elena',
    listens: '53,057',
    rating: '4.3',
    resonance: '9.1',
    reflectionsCount: '347',
    tags: ['Fear & Freedom', 'Self-Discovery'],
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200',
    duration: '12:00',
    currentTime: '0:21',
    content: `I used to run every morning. Not for health, not for clarity — but because stopping meant hearing myself think. And thinking meant feeling. And feeling meant remembering everything I'd spent years trying to outpace. \n That Tuesday was different. The alarm sounded at 5:30, and my body simply refused. Not with exhaustion, but with a quiet firmness I'd never felt before. My legs said no. My chest said stay. \n So I stayed. I lay in the half-dark, listening to rain against the window, and for the first time in years, I let the silence hold me instead of chasing it away. \n What came wasn't the flood I'd feared. It was a single memory — my grandmother's hands folding laundry, the way she hummed without knowing she was humming. The simplest image. And yet it cracked something open. \n I cried. Not the dramatic, movie kind. The quiet kind that feels like thawing. Like something inside you has been frozen so long you forgot it was even there. \n I didn't run that day. Or the next. I walked instead. Slowly. Feeling my feet on the ground, feeling the weight of my own body as something to carry gently, not escape from. \n Liberation, I learned, isn't a destination you sprint toward. It's what happens when you finally stop running`,
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <Image
          src={data?.image}
          alt={data?.title}
          fill
          className="object-cover"
          style={{ objectPosition: '50% 50%' }}
          priority
        />

        {/* Exact Overlay from your specs */}
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
            className="inline-flex items-center text-sm font-medium text-[#C2704C] hover:underline"
          >
            ← Back
          </Link>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative z-20 mx-auto -mt-40 w-full max-w-400 px-4">
        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex items-center justify-between gap-x-4 gap-y-2">
            <div className="flex items-center gap-3">
              <span className="text-dark-primary text-sm font-medium tracking-wider uppercase">
                {data?.category}
              </span>
              <div className="bg-dark-primary/30 h-0.5 w-12" />
            </div>

            <div className="bg-primary rounded px-3 py-1.5 text-xs font-semibold tracking-wider text-white">
              Rating {data?.rating}
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="w-full space-y-4">
              <h1 className="text-dark-primary font-serif text-2xl font-semibold sm:text-3xl md:text-4xl lg:text-5xl">
                {data?.title}
              </h1>
              <div className="text-secondary flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <p>
                  {data?.author} • Listened to {data?.listens} times • Explicit
                </p>

                <p>
                  Resonance:{' '}
                  <span className="text-dark-primary font-semibold">{data?.resonance}</span> from{' '}
                  {data?.reflectionsCount} reflections
                </p>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-3">
            {data?.tags.map((tag) => (
              <span
                key={tag}
                className="border-primary/40 text-primary rounded-sm border bg-transparent px-4 py-2 text-xs transition-all hover:bg-transparent"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Player Section */}
          <div className="space-y-4 pt-6 md:space-y-6 md:pt-12">
            <div className="space-y-4">
              <div className="bg-primary/30 relative h-1.5 w-full rounded-full">
                <div className="bg-primary absolute h-full w-[15%]" />
              </div>
              <div className="flex justify-between text-[11px] font-medium text-[#7C6F64]">
                <span>{data?.currentTime}</span>
                <span>{data?.duration}</span>
              </div>
            </div>

            <div className="flex justify-center">
              <button className="bg-primary flex h-16 w-16 cursor-pointer items-center justify-center rounded-full text-white shadow-sm transition-transform hover:scale-110">
                <Play fill="currentColor" size={28} className="ml-1" />
              </button>
            </div>
          </div>

          {/* Text Content */}
          <div className="mx-auto w-full pt-6 md:pt-10">
            <div className="text-dark-primary/90 space-y-4 text-lg font-light">
              {data?.content.split('\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-6 pt-6 md:pt-10">
            <Link href={`/details/${data?.id}/reflect`}>
              <Button className="btn-styles">Reflect on this</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
