'use client';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import { FileText, Shield, Wind } from 'lucide-react';

function SafetyFreedomRulesPage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={FADE_IN_UP_CONTAINER}
      className="min-h-screen w-full px-4 py-10"
    >
      <div className="mx-auto max-w-3xl space-y-8 text-left">
        {/* Main Header */}
        <motion.div variants={FADE_IN_UP_ITEM} className="space-y-4">
          <motion.h1
            variants={FADE_IN_UP_ITEM}
            className="text-primary font-serif text-3xl font-medium tracking-wide md:text-4xl"
          >
            Safety, Freedom, Rules
          </motion.h1>
          <p className="text-secondary font-medium tracking-tight">
            The ground we stand on together. Read it once. Carry it with you.
          </p>
        </motion.div>

        {/* --- Safety Section --- */}
        <motion.div variants={FADE_IN_UP_ITEM} className="space-y-4">
          <div className="text-primary flex items-center gap-3">
            <Shield size={20} strokeWidth={1.5} />
            <h2 className="font-serif text-xl font-medium md:text-2xl">Safety</h2>
          </div>
          <div className="text-secondary space-y-4 font-sans leading-relaxed">
            <p>
              Safety is technical — encrypted accounts, protected submissions, careful handling of
              your data. But mostly, safety is human.
            </p>
            <p>
              You can only express what is true when you feel safe. So if you need to, use a
              nickname. Hide behind a name that lets your real voice come forward. There is no shame
              in that — it is wisdom.
            </p>
            <p>
              Safety also means we do not scream at each other. We do not yell. We do not weaponize
              our pain against another person. Inside that container, you are free to name your
              deepest desires, your longings, the things you have never said out loud.
            </p>
          </div>
        </motion.div>

        {/* --- Freedom Section --- */}
        <motion.div variants={FADE_IN_UP_ITEM} className="space-y-4">
          <div className="text-primary flex items-center gap-3">
            <Wind size={20} strokeWidth={1.5} />
            <h2 className="font-serif text-xl font-medium md:text-2xl">Freedom</h2>
          </div>
          <div className="text-secondary space-y-4 font-sans leading-relaxed">
            <p>
              At Transform to Liberation, we act from freedom. We explore freedom. We practice it.
            </p>
            <p>
              And freedom only exists alongside responsibility. One without the other collapses into
              either tyranny or chaos. Together, they become a way of living.
            </p>
            <p>
              Act in the spirit of Transform to Liberation. Help each other. Hold each other
              accountable, and embrace each other in the same breath. We are here to liberate — not
              to perform liberation while binding the person beside us.
            </p>
          </div>
        </motion.div>

        {/* --- Rules Section --- */}
        <motion.div variants={FADE_IN_UP_ITEM} className="space-y-4">
          <div className="text-primary flex items-center gap-3">
            <FileText size={20} strokeWidth={1.5} />
            <h2 className="font-serif text-xl font-medium md:text-2xl">Rules</h2>
          </div>
          <div className="text-secondary space-y-4 font-sans leading-relaxed">
            <p>
              Our editorial team curates language that divides. The kind of language that puts one
              human above another, or strips someone of their dignity. That is what we filter — not
              the truth, not the body, not desire.
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
        <motion.div variants={FADE_IN_UP_ITEM} className="pt-6">
          <p className="text-primary/90 font-serif text-base leading-relaxed font-medium tracking-wide md:text-lg">
            Safe enough to be honest. Free enough to be whole. Kind enough to keep each other here.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default SafetyFreedomRulesPage;
