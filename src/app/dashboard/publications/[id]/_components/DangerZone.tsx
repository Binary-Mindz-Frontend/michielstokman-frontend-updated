'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useDeleteStoryMutation } from '@/redux/features/admin/adminModeration/adminModeration.api';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

/** Permanent delete, carried over from the moderation queue. Requires typing the title. */
const DangerZone = ({ id, title }: { id: string; title: string }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [deleteStory, { isLoading }] = useDeleteStoryMutation();

  const expected = title.trim() || 'delete';
  const canDelete = confirmation.trim() === expected;

  const handleDelete = async () => {
    if (!canDelete) return;
    try {
      const res = await deleteStory(id).unwrap();
      if (res?.success) toast.success(res.message || 'Publication deleted');
      router.push('/dashboard/publications');
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="rounded-xl border border-[#E5CDCD] bg-[#FFF8F8] p-4">
      <span className="text-[11px] font-bold tracking-wider text-[#A80000] uppercase">
        Danger zone
      </span>
      <p className="mt-1 mb-3 text-[11px] text-[#8A6E5F]">
        Deleting removes the text, cover and audio for good.
      </p>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setConfirmation('');
        }}
      >
        <DialogTrigger asChild>
          <button
            type="button"
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-[#E5CDCD] bg-white px-4 py-2 text-sm font-medium text-[#A80000] hover:bg-[#FFF5F5]"
          >
            <Trash2 size={14} /> Delete publication
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete this publication?</DialogTitle>
            <DialogDescription>
              This cannot be undone. Type <span className="font-semibold">{expected}</span> to
              confirm.
            </DialogDescription>
          </DialogHeader>

          <input
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            placeholder={expected}
            className="w-full rounded-md border border-[#E1D7CE] bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#C82323]/30"
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={!canDelete || isLoading}>
              {isLoading ? 'Deleting…' : 'Delete permanently'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DangerZone;
