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
        <div className="relative flex min-h-55 w-full flex-col items-center justify-center p-6 text-center">
          <div className="absolute inset-0 h-full w-full">
            <Image
              src={submitSuccessBg}
              alt="Torn Paper Background"
              fill
              className="object-fill drop-shadow-md"
              priority
            />
          </div>

          <div className="relative z-10 flex max-w-xs flex-col items-center justify-center px-2 sm:max-w-sm sm:px-4">
            <p className="font-sans text-sm leading-snug font-bold text-[#503225] sm:text-base">
              Publication can take up to two months. We&apos;ll email you. Submission does not
              guarantee publication.
            </p>

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

            <button
              type="button"
              onClick={() => {
                onClose();
                router.push('/user-dashboard');
              }}
              className="mt-3 font-sans text-xs font-semibold tracking-wider text-[#777] underline underline-offset-2 hover:text-[#503225]"
            >
              Go to My Stories
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
