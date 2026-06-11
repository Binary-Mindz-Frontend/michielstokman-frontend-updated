/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { logoutUser } from '@/services/auth/auth.service';
import { logout as authLogout } from '@/redux/features/auth/authSlice';
import { apiClient } from '@/redux/apiClient/apiClient';
import { useAppDispatch } from '@/redux/hooks';

import { useCurrentUser } from '@/redux/features/auth/authSlice';
import { useAppSelector } from '@/redux/hooks';

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export default function LoginRequiredModal({ isOpen, onClose }: LoginRequiredModalProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(useCurrentUser) as any;
  const isGuest = user?.is_guest;

  return (
    <Dialog open={isOpen} onOpenChange={onClose || (() => router.push('/'))}>
      <DialogContent className="text-center sm:max-w-106.25 sm:text-left">
        <DialogHeader className="flex flex-col items-center gap-2 sm:items-start sm:gap-1">
          {/* Warning Icon */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20">
            <Heart className="h-5 w-5 text-amber-600 dark:text-amber-500" />
          </div>

          <DialogTitle className="mt-2 text-xl font-semibold">
            {isGuest ? 'Unlock Full Access' : 'Enter Your Safe Space'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground pt-1">
            {isGuest
              ? 'Your journey has just begun. Log in or create an account to read unlimited stories, embark on deep liberation journeys, and share your own experiences.'
              : 'To share something real, vulnerable, or meaningful, we first ask you to enter your safe space.'}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            onClick={() => {
              if (onClose) onClose();
              router.push('/');
            }}
            className="w-full sm:w-auto"
          >
            Go Back Home
          </Button>
          <Button
            onClick={async () => {
              dispatch(authLogout());
              dispatch(apiClient.util.resetApiState());
              await logoutUser();
              window.location.href = '/login';
            }}
            className="bg-primary hover:bg-primary/90 w-full text-white sm:w-auto"
          >
            Log In Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
