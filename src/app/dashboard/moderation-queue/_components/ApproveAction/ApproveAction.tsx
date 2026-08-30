/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import {
  useApproveStoryMutation,
  useDeleteStoryMutation,
  useRejectStoryMutation,
} from '@/redux/features/admin/adminModeration/adminModeration.api';
import { useState } from 'react';
import { toast } from 'sonner';

interface ActionProps {
  id: string;
  onSuccess: () => void;
  notes?: string;
}

// --- APPROVE ---
export const ApproveAction = ({ id, onSuccess, notes }: ActionProps) => {
  const [approve, { isLoading }] = useApproveStoryMutation();
  const [optionalNote, setOptionalNote] = useState(notes || '');
  const handleApprove = async () => {
    try {
      const trimmed = optionalNote.trim();
      const res = await approve({
        storyId: id,
        notes: trimmed || undefined,
      }).unwrap();
      if (res.success) {
        toast.success(res.message);
        onSuccess();
      }
    } catch (err) {
      console.log(err);
      toast.error('Failed to approve');
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-center">
        Are you sure you want to <strong>Approve</strong> this story?
      </p>
      <div className="space-y-2">
        <label className="text-mute text-[10px] font-bold tracking-wider uppercase">
          Note to member (optional)
        </label>
        <textarea
          value={optionalNote}
          onChange={(e) => setOptionalNote(e.target.value)}
          placeholder="Shown on My Stories only if you later request changes or reject."
          className="border-primary/20 min-h-20 w-full rounded-md border bg-white p-3 text-sm outline-none focus:ring-1"
        />
      </div>
      <Button onClick={handleApprove} disabled={isLoading} className="btn-styles w-full">
        Confirm Approval
      </Button>
    </div>
  );
};

// --- REJECT ---
export const RejectAction = ({ id, onSuccess }: ActionProps) => {
  const [reason, setReason] = useState('');
  const [reject, { isLoading }] = useRejectStoryMutation();

  const handleReject = async () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      const res = await reject({
        storyId: id,
        data: { reason: reason.trim() },
      }).unwrap();

      if (res.success) {
        toast.success(res.message || 'Story rejected successfully');
      }
      onSuccess();
    } catch (err: any) {
      console.error('Rejection Error:', err);
      const errorMsg = err?.data?.message || 'Failed to reject story';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="space-y-5">
      <div className="text-center">
        <p className="text-secondary font-medium">
          Are you sure you want to <span className="text-error font-bold">Reject</span> this story?
        </p>
        <p className="text-mute mt-1 text-xs">Please provide a reason for the author.</p>
      </div>

      <div className="space-y-2">
        <label className="text-mute text-[10px] font-bold tracking-wider uppercase">
          Rejection Reason
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Inappropriate content, formatting issues..."
          className="border-primary/20 focus:ring-error/30 min-h-25 w-full rounded-md border bg-white p-3 text-sm outline-none focus:ring-1"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={onSuccess} className="flex-1" disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleReject}
          disabled={isLoading || !reason.trim()}
          variant="destructive"
          className="flex-1"
        >
          {isLoading ? 'Rejecting...' : 'Confirm Rejection'}
        </Button>
      </div>
    </div>
  );
};

// --- DELETE ---
export const DeleteAction = ({ id, onSuccess }: ActionProps) => {
  const [remove, { isLoading }] = useDeleteStoryMutation();
  const handleDelete = async () => {
    try {
      const res = await remove(id).unwrap();

      if (res.success) {
        toast.success(res.message);
        onSuccess();
      }
    } catch (err) {
      console.log(err);
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-4 text-center">
      <p className="text-error">This action is permanent!</p>
      <Button onClick={handleDelete} disabled={isLoading} variant="destructive" className="w-full">
        Delete Permanently
      </Button>
    </div>
  );
};
