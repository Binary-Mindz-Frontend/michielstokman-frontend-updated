'use client';

import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';

interface FeatureUnderDevelopmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeatureUnderDevelopmentModal = ({ isOpen, onClose }: FeatureUnderDevelopmentModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="dev-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={onClose}
        >
          <motion.div
            key="dev-modal-card"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2 }}
            className="bg-background border-primary/15 w-full max-w-sm rounded-xl border p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-dark-primary mb-2 font-serif text-xl font-semibold">
              Feature Under Development
            </h2>
            <p className="text-secondary mb-6 text-sm leading-relaxed">
              This feature is currently under development and will be available soon.
            </p>
            <Button onClick={onClose} className="btn-styles w-full">
              Got it
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeatureUnderDevelopmentModal;
