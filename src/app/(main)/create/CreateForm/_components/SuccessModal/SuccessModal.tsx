'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  const router = useRouter();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-[#FAF7F5] [&>button]:hidden">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-dark-primary font-serif text-2xl leading-tight font-semibold">
            Your submission will be reviewed within 1-4 months. We&apos;ll notify you via email.
          </h2>

          <Button
            onClick={() => {
              onClose();
              router.push('/');
            }}
            className="btn-styles mt-6"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
