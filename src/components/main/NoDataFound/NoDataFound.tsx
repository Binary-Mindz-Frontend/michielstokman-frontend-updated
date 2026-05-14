'use client';
import { FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import { FileSearch } from 'lucide-react';

interface NoDataProps {
  title?: string;
  description?: string;
}

export default function NoDataFound({
  title = 'No Content Available',
  description = "We couldn't find any data at the moment. Please try again later.",
}: NoDataProps) {
  return (
    <motion.div
      variants={FADE_IN_UP_ITEM}
      initial="hidden"
      animate="visible"
      className="border-primary/10 bg-primary/5 flex min-h-100 flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center"
    >
      <div className="bg-primary/10 mb-4 flex h-20 w-20 items-center justify-center rounded-full">
        <FileSearch className="text-primary/60 h-10 w-10" />
      </div>

      <h3 className="text-dark-primary text-2xl font-semibold">{title}</h3>

      <p className="text-secondary mt-2 max-w-md">{description}</p>

      {/* Optional: Action Button */}
      <button
        onClick={() => window.location.reload()}
        className="bg-primary hover:bg-primary/90 mt-6 cursor-pointer rounded-full px-6 py-2 text-sm font-medium text-white transition-all active:scale-95"
      >
        Refresh Feed
      </button>
    </motion.div>
  );
}
