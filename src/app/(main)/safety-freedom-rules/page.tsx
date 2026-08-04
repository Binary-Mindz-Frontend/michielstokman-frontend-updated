'use client';

import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import { FileText, Shield, Wind } from 'lucide-react';
import Image from 'next/image';

// Assets from src/assets/safety
import greenLoveImg from '@/assets/safety/green-love-image.png';
import pinkLoveImg from '@/assets/safety/pink-love-image.png';
import safetyBrushBg from '@/assets/safety/safety-brush-bg.png';
import safetyHeroImg from '@/assets/safety/safety-hero-image.png';
import starImg from '@/assets/safety/star-image.png';

function SafetyFreedomRulesPage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={FADE_IN_UP_CONTAINER}
      className="min-h-screen w-full px-4 py-8 md:py-14"
    >
      <div className="mx-auto max-w-6xl space-y-16">
        {/* ================= HERO SECTION ================= */}
        <motion.div
          variants={FADE_IN_UP_ITEM}
          className="relative flex w-full flex-col items-center justify-between gap-0 md:flex-row md:gap-12"
        >
          {/* --- LEFT TEXT COLUMN --- */}
          <div className="flex w-full flex-col items-start text-left md:w-1/2">
            {/* Title Header with Floating Heart */}
            <div className="relative flex w-full flex-col items-start">
              {/* Floating Pink Heart (Top Right of Title) */}
              <div className="absolute top-2 right-4 h-7 w-7 sm:right-12 sm:h-8 sm:w-8 md:top-0 md:right-6 lg:right-12">
                <Image src={pinkLoveImg} alt="pink heart" fill className="object-contain" />
              </div>

              {/* Title Text */}
              <div className="font-edo flex flex-col items-start leading-none font-black uppercase">
                <span className="-rotate-2 transform text-[2.75rem] tracking-wider text-[#486221] sm:text-5xl md:text-[3.5rem] lg:text-[4.5rem]">
                  SAFETY.
                </span>
                <span className="mt-2 -rotate-2 transform text-[2.75rem] tracking-wider text-[#E81A66] sm:mt-3 sm:text-5xl md:text-[3.5rem] lg:text-[4.5rem]">
                  FREEDOM.
                </span>
                <span className="mt-2 -rotate-2 transform text-[2.75rem] tracking-wider text-[#F3A134] sm:mt-3 sm:text-5xl md:text-[3.5rem] lg:text-[4.5rem]">
                  RULES.
                </span>
              </div>
            </div>

            {/* Brush Text Container */}
            <div className="relative mt-8 flex min-h-[100px] w-full max-w-[420px] -rotate-1 transform items-center justify-center px-4 py-6 sm:mt-10 sm:px-6">
              {/* Brush Image Background */}
              <div className="absolute inset-0 h-full w-full">
                <Image
                  src={safetyBrushBg}
                  alt="Brush background"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Text inside Brush */}
              <div className="relative z-10 px-4 text-center font-sans text-[11px] leading-relaxed font-medium text-white sm:text-xs md:text-sm">
                <p>
                  The Ground We <span className="font-bold text-[#E81A66]">Stand On</span> Together.
                </p>
                <p className="mt-0.5">Read It Once. Carry It With You.</p>
              </div>

              {/* Floating Pink Hearts around Brush Box (Desktop) */}
              <div className="absolute -bottom-5 left-4 hidden h-5 w-5 sm:h-6 sm:w-6 md:block">
                <Image src={pinkLoveImg} alt="pink heart" fill className="object-contain" />
              </div>
              <div className="absolute -bottom-6 left-1/2 hidden h-5 w-5 -translate-x-1/2 sm:h-6 sm:w-6 md:block">
                <Image src={pinkLoveImg} alt="pink heart" fill className="object-contain" />
              </div>
              <div className="absolute right-6 -bottom-5 hidden h-5 w-5 sm:h-6 sm:w-6 md:block">
                <Image src={pinkLoveImg} alt="pink heart" fill className="object-contain" />
              </div>
            </div>
          </div>

          {/* --- RIGHT IMAGE COLUMN --- */}
          <div className="relative flex w-full justify-center md:w-1/2 md:pr-6">
            {/* Hero Image Container */}
            <div className="relative aspect-[4/5] w-full max-w-[360px] sm:max-w-[420px]">
              <Image
                src={safetyHeroImg}
                alt="Safety Hero Reflecting Woman"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Right Side Floating Icons (Star, Pink Heart, Green Heart - Desktop) */}
            <div className="absolute top-1/2 -right-1 z-10 hidden -translate-y-1/2 flex-col items-center gap-6 sm:right-0 md:flex">
              {/* Star Icon */}
              <div className="relative h-6 w-6 sm:h-7 sm:w-7">
                <Image src={starImg} alt="star icon" fill className="object-contain" />
              </div>

              {/* Pink Heart Icon */}
              <div className="relative h-6 w-6 sm:h-7 sm:w-7">
                <Image src={pinkLoveImg} alt="pink heart icon" fill className="object-contain" />
              </div>

              {/* Green Heart Icon */}
              <div className="relative h-6 w-6 sm:h-7 sm:w-7">
                <Image src={greenLoveImg} alt="green heart icon" fill className="object-contain" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ================= CONTENT SECTIONS ================= */}
        <div className="mx-auto max-w-3xl space-y-10 text-left">
          {/* --- Safety Section --- */}
          <motion.div variants={FADE_IN_UP_ITEM} className="space-y-4">
            <div className="text-primary flex items-center gap-3">
              <Shield size={22} strokeWidth={1.5} />
              <h2 className="font-serif text-xl font-medium md:text-2xl">Safety</h2>
            </div>
            <div className="text-secondary space-y-4 font-sans leading-relaxed">
              <p>
                Safety is technical — encrypted accounts, protected submissions, careful handling of
                your data. But mostly, safety is human.
              </p>
              <p>
                You can only express what is true when you feel safe. So if you need to, use a
                nickname. Hide behind a name that lets your real voice come forward. There is no
                shame in that — it is wisdom.
              </p>
              <p>
                Safety also means we do not scream at each other. We do not yell. We do not
                weaponize our pain against another person. Inside that container, you are free to
                name your deepest desires, your longings, the things you have never said out loud.
              </p>
            </div>
          </motion.div>

          {/* --- Freedom Section --- */}
          <motion.div variants={FADE_IN_UP_ITEM} className="space-y-4">
            <div className="text-primary flex items-center gap-3">
              <Wind size={22} strokeWidth={1.5} />
              <h2 className="font-serif text-xl font-medium md:text-2xl">Freedom</h2>
            </div>
            <div className="text-secondary space-y-4 font-sans leading-relaxed">
              <p>
                At Transform to Liberation, we act from freedom. We explore freedom. We practice it.
              </p>
              <p>
                And freedom only exists alongside responsibility. One without the other collapses
                into either tyranny or chaos. Together, they become a way of living.
              </p>
              <p>
                Act in the spirit of Transform to Liberation. Help each other. Hold each other
                accountable, and embrace each other in the same breath. We are here to liberate —
                not to perform liberation while binding the person beside us.
              </p>
            </div>
          </motion.div>

          {/* --- Rules Section --- */}
          <motion.div variants={FADE_IN_UP_ITEM} className="space-y-4">
            <div className="text-primary flex items-center gap-3">
              <FileText size={22} strokeWidth={1.5} />
              <h2 className="font-serif text-xl font-medium md:text-2xl">Rules</h2>
            </div>
            <div className="text-secondary space-y-4 font-sans leading-relaxed">
              <p>
                Our editorial team curates language that divides. The kind of language that puts one
                human above another, or strips someone of their dignity. That is what we filter —
                not the truth, not the body, not desire.
              </p>
              <p>
                You can break the rules of polite society. You can name any body part you like. You
                can speak about pleasure, grief, rage, hunger, tenderness — without apology.
              </p>
              <p>
                What you cannot do is talk people down. Not yourself. Not anyone else. We all are
                worthy. That is the one line, and it holds everything else in place.
              </p>
            </div>
          </motion.div>

          {/* --- Footer Note --- */}
          <motion.div variants={FADE_IN_UP_ITEM} className="border-t border-gray-200/60 pt-4">
            <p className="text-primary/90 text-center font-serif text-base leading-relaxed font-medium tracking-wide md:text-left md:text-lg">
              Safe enough to be honest. Free enough to be whole. Kind enough to keep each other
              here.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default SafetyFreedomRulesPage;
