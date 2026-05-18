'use client';

import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import Link from 'next/link';

function FoundersWordPage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={FADE_IN_UP_CONTAINER}
      className="min-h-screen w-full px-4 py-10"
    >
      <div className="mx-auto max-w-3xl space-y-8 text-left">
        {/* Top Mini Header & Main Title */}
        <motion.div variants={FADE_IN_UP_ITEM} className="space-y-3 text-center md:text-left">
          <p className="font-sans text-xs font-semibold tracking-widest text-[#978279] uppercase">
            A Word from the Founder
          </p>
          <h1 className="text-primary font-serif text-3xl font-medium tracking-wide italic md:text-4xl">
            The Truth That Stayed
          </h1>
          <p className="font-serif text-sm text-[#978279] italic">By Michiel Stokman</p>
        </motion.div>

        {/* --- Intro Paragraphs --- */}
        <motion.div
          variants={FADE_IN_UP_ITEM}
          className="text-secondary space-y-4 font-sans leading-relaxed"
        >
          <p>
            My name is Michiel Stokman. I was born in the Netherlands in 1973, and when I am asked
            why I started Transform to Liberation, I notice that every answer I try to give feels
            incomplete. It is as if the question belongs to a different layer of reality than the
            one where our usual explanations live.
          </p>
          <p>
            It didn&apos;t arrive as a business plan. It wasn&apos;t a calculated move. It came to
            me as a persistent clarity—growing quietly in the background, becoming more certain each
            day, until I could no longer set it aside without feeling that I was ignoring my own
            soul.
          </p>
        </motion.div>

        {/* --- Section 1: The Stalemate of Success --- */}
        <motion.div variants={FADE_IN_UP_ITEM} className="space-y-4">
          <h2 className="text-primary font-serif text-xl font-medium md:text-2xl">
            The Stalemate of Success
          </h2>
          <div className="text-secondary space-y-4 font-sans leading-relaxed">
            <p>
              For a long time, I followed the louder voice. I did what a man of my generation and
              background is expected to do. I built, I adapted, and I succeeded. But somewhere
              beneath the noise of achievement, there was a quiet, persistent awareness that I was
              not doing the right things.
            </p>
            <p>
              I could see it in flashes. I could feel it in the moments between the meetings and the
              milestones. And yet, for years, I remained. Not because I didn&apos;t know the truth,
              but because the state I was in did not yet allow me to move. I understand now that
              insight alone is not enough; you can recognize the lie and still stay inside it
              because you are not yet free enough to leave.
            </p>
            <p>I had to learn the difference between wanting and knowing.</p>
            <p>
              Most of our decisions are driven by the &quot;Childish Brain&quot;—a layer of fear
              disguised as energy, or ambition disguised as a need for validation. This time, that
              layer was absent. I finally found the distinction between the voice that
              pushes—urgent, persuasive, and reactive—and the voice that knows. The second voice
              doesn&apos;t argue. It simply stays. And for the first time, I chose to stay with it.
            </p>
          </div>
        </motion.div>

        {/* --- Section 2: The Great Taboo --- */}
        <motion.div variants={FADE_IN_UP_ITEM} className="space-y-4">
          <h2 className="text-primary font-serif text-xl font-medium md:text-2xl">
            The Great Taboo: The Reclamation of the Whole Self
          </h2>
          <div className="text-secondary space-y-4 font-sans leading-relaxed">
            <p>
              We live in a world of duality. A world of &apos;us versus them,&apos; of rigid
              categories and managed emotions. It is an adolescent way of existing that keeps us
              trapped at the surface, exhausted by the friction of the waves.
            </p>
            <p>
              To move toward liberation is to choose maturity. And true maturity requires us to stop
              hiding the parts of ourselves that we were taught to leave behind.
            </p>
            <p>
              In my work, I see a profound gap in our culture—a taboo around our deepest vitality.
              We have separated our professional excellence from our sensual and sexual essence. We
              have treated our life force as something to be managed or performed, rather than the
              very origin of our being.
            </p>
            <p>
              To be truly liberated—whether you are a woman reclaiming her power or a man stepping
              into his integrity—is to embrace this energy. Sexuality is not a separate activity; it
              is the sacred fuel that allows a human being to truly shine. It is the integration of
              the feminine depth and the masculine strength. Without it, we are merely functioning.
              With it, we are alive.
            </p>
          </div>
        </motion.div>

        {/* --- Section 3: A Path That Reveals Itself --- */}
        <motion.div variants={FADE_IN_UP_ITEM} className="space-y-4">
          <h2 className="text-primary font-serif text-xl font-medium md:text-2xl">
            A Path That Reveals Itself
          </h2>
          <div className="text-secondary space-y-4 font-sans leading-relaxed">
            <p>
              When I work on Transform to Liberation, I rarely see far ahead. There is no master
              plan, only a sequence where the next step becomes visible once the previous one is
              taken. It reminds me of Rumi&apos;s wisdom: &quot;The path appears as you walk
              it.&quot; This is not poetry; it is my practical reality. It is a quiet unfolding that
              asks for trust instead of control.
            </p>
            <p>
              Things began to align the moment I stopped forcing them. The right people appeared.
              The right conversations happened. I didn&apos;t gain something new; I released what
              was no longer needed. The tension vanished, and a sense of direction took its place.
            </p>
          </div>
        </motion.div>

        {/* --- Section 4: The Choice for Maturity --- */}
        <motion.div variants={FADE_IN_UP_ITEM} className="space-y-4">
          <h2 className="text-primary font-serif text-xl font-medium md:text-2xl">
            The Choice for Maturity
          </h2>
          <div className="text-secondary space-y-4 font-sans leading-relaxed">
            <p>
              We live in a time where it is easy to follow, to adapt, and to let our lives be shaped
              by external narratives. But there comes a moment where that no longer holds. A moment
              where the &quot;Gap&quot; between how your life looks and how it is experienced
              becomes unbearable.
            </p>
            <p>
              I don&apos;t believe change depends on the leaders we see on the news. They are
              trapped in the same surface-level reactions, the same childish dualities. They are not
              ready. We cannot wait for &quot;Wise Elders&quot; to save us. We must become them.
            </p>
            <p>
              Transform to Liberation is a space for that shift. It is for those who have lived,
              adapted, and given much—and are now ready to own what is truly theirs.
            </p>
            <p>
              I want you to shine. Not because you have &quot;improved&quot; yourself, but because
              you have reduced the distance between your truth and your expression. I want you to
              choose greatness over perfection, and intimacy over distance.
            </p>
            <p>
              The path is here. The question is whether you are willing to recognize it, and to act
              from the truth you already know.
            </p>
            <p className="text-dark-primary pt-2 font-bold">
              I am Michiel Stokman. I am no longer living the lie. Will you join me in the deep?
            </p>
          </div>
        </motion.div>

        {/* --- Decorative Space & Footer Navigation --- */}
        <motion.div
          variants={FADE_IN_UP_ITEM}
          className="border-t border-[#F1E9E4] pt-8 text-center"
        >
          <Link
            href="/about"
            className="text-primary/80 hover:text-primary font-serif text-xs font-medium tracking-wide transition-all hover:underline md:text-sm"
          >
            &larr; Back to Why Transform to Liberation
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default FoundersWordPage;
