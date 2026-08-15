'use client';

import btnBg from '@/assets/shared/btnBg.png';
import submitSuccessBg from '@/assets/shared/submit-success.png';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

export default function SuccessModal({
  isOpen,
  onClose,
  category = 'Confessions',
}: SuccessModalProps) {
  const router = useRouter();
  const isConfession = category === 'Confessions';

  const handleRedirect = () => {
    onClose();
    router.push(isConfession ? '/confessions' : '/meditations');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-135 border-none bg-transparent p-0 shadow-none focus:outline-none [&>button]:hidden">
        {/* Main Torn Paper Container */}
        <div className="relative flex min-h-55 w-full flex-col items-center justify-center p-6 text-center">
          {/* Torn Paper Graphic Background */}
          <div className="absolute inset-0 h-full w-full">
            <Image
              src={submitSuccessBg}
              alt="Torn Paper Background"
              fill
              className="object-fill drop-shadow-md"
              priority
            />
          </div>

          {/* Content inside Torn Paper */}
          <div className="relative z-10 flex max-w-xs flex-col items-center justify-center px-2 sm:max-w-sm sm:px-4">
            {/* Submission Message */}
            <p className="font-sans text-sm leading-snug font-bold text-[#503225] sm:text-base">
              Your submission will be reviewed within 1-4 months. We&apos;ll notify you via email.
            </p>

            {/* READ CONFESSIONS / MEDITATIONS Button */}
            <button
              type="button"
              onClick={handleRedirect}
              className="relative mt-4 flex h-11 w-48 cursor-pointer items-center justify-center transition-transform hover:scale-105 sm:mt-5 sm:h-12 sm:w-56"
            >
              <div className="absolute inset-0 h-full w-full">
                <Image src={btnBg} alt="Button background" fill className="object-fill" />
              </div>
              <span className="relative z-10 font-sans text-xs font-black tracking-widest text-[#503225] uppercase sm:text-sm">
                {isConfession ? 'READ CONFESSIONS —>' : 'READ MEDITATIONS —>'}
              </span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
