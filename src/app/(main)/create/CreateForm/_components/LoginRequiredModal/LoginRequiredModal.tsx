'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LoginRequiredModalProps {
  isOpen: boolean;
}

export default function LoginRequiredModal({ isOpen }: LoginRequiredModalProps) {
  const router = useRouter();

  return (
    <Dialog open={isOpen} onOpenChange={() => router.push('/')}>
      <DialogContent className="text-center sm:max-w-106.25 sm:text-left">
        <DialogHeader className="flex flex-col items-center gap-2 sm:items-start sm:gap-1">
          {/* Warning Icon */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20">
            <Heart className="h-5 w-5 text-amber-600 dark:text-amber-500" />
          </div>

          <DialogTitle className="mt-2 text-xl font-semibold">Enter Your Safe Space</DialogTitle>
          <DialogDescription className="text-muted-foreground pt-1">
            To share something real, vulnerable, or meaningful, we first ask you to enter your safe
            space.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => router.push('/')} className="w-full sm:w-auto">
            Go Back Home
          </Button>
          <Button
            onClick={() => router.push('/login')}
            className="bg-primary hover:bg-primary/90 w-full text-white sm:w-auto"
          >
            Log In Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
