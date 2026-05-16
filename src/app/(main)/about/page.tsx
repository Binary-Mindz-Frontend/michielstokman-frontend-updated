'use client';

import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import Link from 'next/link';

function WhyTransformToLiberationPage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={FADE_IN_UP_CONTAINER}
      className="min-h-screen w-full px-4 py-10"
    >
      <div className="mx-auto max-w-3xl space-y-8 text-left">
        {/* Main Title */}
        <motion.h1
          variants={FADE_IN_UP_ITEM}
          className="text-primary font-serif text-3xl font-medium tracking-wide italic md:text-4xl"
        >
          Why Transform to Liberation?
        </motion.h1>

        {/* --- Section 1: The Sovereign Truth --- */}
        <motion.div variants={FADE_IN_UP_ITEM} className="space-y-4">
          <h2 className="text-primary font-serif text-xl font-medium md:text-2xl">
            The Sovereign Truth: Why Transform to Liberation?
          </h2>
          <div className="text-secondary space-y-4 font-sans leading-relaxed">
            <p>
              The world we have built is a world of the surface. We live at the narrow edge, where
              the waves of reaction constantly crash against the rocks. We define ourselves by
              opposition: right or wrong, success or failure, us versus them.
            </p>
            <p>
              For many of us—especially those who have achieved much and given more—there comes a
              moment of silent realization: This friction is not all there is.
            </p>
          </div>
        </motion.div>

        {/* --- Interactive Play Button --- */}
        <motion.div variants={FADE_IN_UP_ITEM}>
          <button
            onClick={() => console.log('Play Video')}
            className="bg-primary flex cursor-pointer items-center gap-2 rounded-full px-8 py-3.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-[#A65D3D] hover:shadow-lg active:scale-95"
          >
            <Play size={14} fill="white" strokeWidth={0} />
            <span>Why I started Transform to Liberation</span>
          </button>
        </motion.div>

        {/* --- Section 2: The Cost of Adaptation --- */}
        <motion.div variants={FADE_IN_UP_ITEM} className="space-y-4">
          <h2 className="text-primary font-serif text-xl font-medium md:text-2xl">
            The Cost of Adaptation
          </h2>
          <div className="text-secondary space-y-4 font-sans leading-relaxed">
            <p>
              No one sets out to lose themselves. We simply learn to survive. We learn which parts
              of our soul are welcomed and which create friction. We adapt to keep our families, our
              companies, and our circles safe. We become the keepers of the peace, the managers of
              the status quo.
            </p>
            <p>
              But over time, these adjustments look like character. We lose track of the one
              question that can no longer be silenced: &quot;What is actually true for me?&quot;
            </p>
          </div>
        </motion.div>

        {/* --- Section 3: The Return to Vitality --- */}
        <motion.div variants={FADE_IN_UP_ITEM} className="space-y-4">
          <h2 className="text-primary font-serif text-xl font-medium md:text-2xl">
            The Return to Vitality
          </h2>
          <div className="text-secondary space-y-4 font-sans leading-relaxed">
            <p>
              Transform to Liberation is not a program for self-improvement. It is a return to what
              is real. It is the recognition that maturity is not about control, but about the
              courage to be fully present.
            </p>
            <p>
              We are breaking the greatest taboo of our time: the artificial separation of our
              intellect from our life force. We have lived too long in a &quot;Childish
              Duality&quot; that ignores our deepest essence.
            </p>
            <p>
              To be truly liberated is to embrace your sensuality and sexuality not as a
              performance, but as the sacred fire of your existence. It is the energy that allows a
              human being to truly shine. It is the integration of the feminine power within the
              masculine frame—a state where we no longer just manage life, but actually live it.
            </p>
          </div>
        </motion.div>

        {/* --- Section 4: The Space to Be Seen --- */}
        <motion.div variants={FADE_IN_UP_ITEM} className="space-y-4">
          <h2 className="text-primary font-serif text-xl font-medium md:text-2xl">
            The Space to Be Seen
          </h2>
          <div className="text-secondary space-y-4 font-sans leading-relaxed">
            <p>
              This is not a commercial product. It is a space for honest expression. Through
              &quot;Confessions&quot; and shared &quot;Transformations,&quot; we dissolve the
              distance between us. We move from the isolation of perfection to the abundance of
              greatness.
            </p>
            <p>
              I started this because the path appeared beneath my feet. I realized that our current
              leaders are not ready to guide us; they are trapped in the same surface- level
              reactions. We cannot wait for wise elders. We must become them.
            </p>
          </div>
        </motion.div>

        {/* --- Section 5: Your Invitation --- */}
        <motion.div variants={FADE_IN_UP_ITEM} className="space-y-4">
          <h2 className="text-primary font-serif text-xl font-medium md:text-2xl">
            Your Invitation
          </h2>
          <div className="text-secondary space-y-4 font-sans leading-relaxed">
            <p>
              You have lived for others long enough. You have adapted until you became a stranger to
              yourself.
            </p>
            <p>
              Now, the depth is calling. It is asking you to reduce the distance between what you
              feel and what you allow yourself to express. It is asking you to stop surviving the
              waves and start owning the ocean.
            </p>
            <p className="text-dark-primary pt-2 font-bold">
              I am Michiel Stokman. This is Transform to Liberation. I am here. Are you ready to
              shine?
            </p>
          </div>
        </motion.div>

        {/* --- Footer Link --- */}
        <div className="pt-2 text-center">
          <Link
            href="/about/founders-word"
            className="text-primary font-serif text-sm font-medium tracking-wide italic transition-all hover:underline hover:opacity-90 md:text-base"
          >
            Read a personal word from the founder &rarr; &quot;The Truth That Stayed&quot;
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default WhyTransformToLiberationPage;
