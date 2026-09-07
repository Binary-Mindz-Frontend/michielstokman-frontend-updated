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
import { usePublishPublicationMutation } from '@/redux/features/admin/adminModeration/adminModeration.api';
import type { PublicationStatuses } from '@/types/publication.types';
import { CheckCircle2, Globe2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

/**
 * The final gate. The server decides whether this publication may go live and
 * names anything outstanding, so the button only mirrors that verdict.
 */
const PublishPanel = ({
  id,
  statuses,
  blockers,
  isDirty,
  onSaveFirst,
}: {
  id: string;
  statuses: PublicationStatuses;
  blockers: string[];
  isDirty: boolean;
  onSaveFirst: () => Promise<boolean>;
}) => {
  const [open, setOpen] = useState(false);
  const [publishPublication, { isLoading }] = usePublishPublicationMutation();

  const published = statuses.overall === 'published';
  const canPublish = blockers.length === 0 && !published;

  const handlePublish = async () => {
    if (isDirty) {
      const saved = await onSaveFirst();
      if (!saved) return;
    }
    try {
      const res = await publishPublication(id).unwrap();
      if (res?.success) toast.success(res.message || 'Publication is live');
      setOpen(false);
    } catch (error) {
      const message =
        error && typeof error === 'object' && 'data' in error
          ? (error as { data?: { message?: string } }).data?.message
          : undefined;
      toast.error(message || 'Could not publish');
    }
  };

  return (
    <div className="rounded-xl border border-[#E6DFDA] bg-white p-4">
      <span className="text-[11px] font-bold tracking-wider text-[#A08170] uppercase">
        Publication control
      </span>

      {published ? (
        <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-[#0F766E]">
          <Globe2 size={14} /> Live in the public catalogue
        </p>
      ) : canPublish ? (
        <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-[#149443]">
          <CheckCircle2 size={14} /> Ready to publish
        </p>
      ) : (
        <ul className="mt-2 space-y-1">
          {blockers.map((blocker) => (
            <li key={blocker} className="text-xs text-[#8A6E5F]">
              • {blocker}
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={!canPublish || isLoading}
        className="bg-primary mt-3 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Globe2 size={14} />}
        Publish
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Publish this publication?</DialogTitle>
            <DialogDescription>
              The approved text, story card and voice go live together in the public catalogue and
              the member sees it as approved.
            </DialogDescription>
          </DialogHeader>

          {isDirty ? (
            <p className="text-xs text-[#A2673F]">Unsaved edits will be saved before publishing.</p>
          ) : null}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handlePublish} disabled={isLoading} className="btn-styles">
              {isLoading ? 'Publishing…' : 'Publish now'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PublishPanel;
