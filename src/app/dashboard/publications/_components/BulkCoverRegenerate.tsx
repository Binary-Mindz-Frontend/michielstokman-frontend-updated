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
import { useRegenerateStoryCoversMutation } from '@/redux/features/admin/photoManagement/photoManagement.api';
import { Images, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

/**
 * The only cover regeneration the backend exposes today is this batch job, which
 * picks stories by filter rather than by id. Carried over from Photo Management.
 */
const BulkCoverRegenerate = () => {
  const [open, setOpen] = useState(false);
  const [limit, setLimit] = useState(25);
  const [onlyMissing, setOnlyMissing] = useState(true);
  const [regenerate, { isLoading }] = useRegenerateStoryCoversMutation();

  const handleRegenerate = async () => {
    try {
      const res = await regenerate({
        limit,
        only_missing_or_default: onlyMissing,
      }).unwrap();
      const queued = res?.data?.queued ?? 0;
      toast.success(res?.message || `Queued ${queued} cover${queued === 1 ? '' : 's'}`);
      setOpen(false);
    } catch {
      toast.error('Could not queue cover regeneration');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-secondary border-primary/20 flex items-center gap-2 rounded-md bg-white px-4 py-5 font-medium hover:bg-gray-50"
        >
          <Images size={18} /> Regenerate covers
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Regenerate story covers</DialogTitle>
          <DialogDescription>
            Queues a batch job. Covers a member uploaded themselves are never touched.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <label className="block space-y-1">
            <span className="text-[11px] font-bold tracking-wider text-[#A08170] uppercase">
              How many
            </span>
            <input
              type="number"
              min={1}
              max={80}
              value={limit}
              onChange={(event) => setLimit(Number(event.target.value) || 1)}
              className="w-full rounded-md border border-[#E1D7CE] bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#BF7758]/40"
            />
            <span className="text-[11px] text-[#8A6E5F]">Backend caps each run at 80.</span>
          </label>

          <label className="flex items-center gap-2 text-sm text-[#5C3A21]">
            <input
              type="checkbox"
              checked={onlyMissing}
              onChange={(event) => setOnlyMissing(event.target.checked)}
            />
            Only stories with a missing or default cover
          </label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleRegenerate} disabled={isLoading} className="btn-styles">
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : null}
            Queue regeneration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkCoverRegenerate;
