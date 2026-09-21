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
import { apiErrorMessage } from '@/lib/publications/apiError';
import {
  useRejectStoryMutation,
  useRequestStoryChangesMutation,
  useSuggestStoryFieldMutation,
} from '@/redux/features/admin/adminModeration/adminModeration.api';
import type { PublicationDetail } from '@/types/publication.types';
import { Check, Columns2, Loader2, RefreshCw, Rows2, Undo2, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useAssetApproval } from './useAssetApproval';
import type { WorkspaceForm } from './useWorkspaceDraft';

const paragraphsOf = (text: string): string[] =>
  text
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

const countWords = (text: string): number => (text.trim() ? text.trim().split(/\s+/).length : 0);

const inputClass =
  'w-full rounded-md border border-[#E1D7CE] bg-white px-3 py-2 text-sm text-[#4A3B32] outline-none focus:ring-1 focus:ring-[#BF7758]/40';

/** Paragraph-level compare: enough to spot what an editor changed. */
const CompareView = ({
  original,
  edited,
  layout,
}: {
  original: string;
  edited: string;
  layout: 'split' | 'stacked';
}) => {
  const { originalParas, editedParas, originalSet, editedSet } = useMemo(() => {
    const originalList = paragraphsOf(original);
    const editedList = paragraphsOf(edited);
    return {
      originalParas: originalList,
      editedParas: editedList,
      originalSet: new Set(originalList),
      editedSet: new Set(editedList),
    };
  }, [original, edited]);

  const column = (
    label: string,
    paras: string[],
    otherSet: Set<string>,
    tone: 'removed' | 'added',
  ) => (
    <div className="min-w-0 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold tracking-wider text-[#A08170] uppercase">
          {label}
        </span>
        <span className="text-[11px] text-[#A08170]">
          {paras.reduce((total, para) => total + countWords(para), 0)} words
        </span>
      </div>
      <div className="custom-scrollbar max-h-[26rem] space-y-2 overflow-y-auto rounded-lg border border-[#EDE7E1] bg-white p-3">
        {paras.length ? (
          paras.map((para, index) => {
            const changed = !otherSet.has(para);
            return (
              <p
                key={`${index}-${para.slice(0, 24)}`}
                className={`rounded px-2 py-1 font-serif text-sm leading-relaxed whitespace-pre-line ${
                  changed
                    ? tone === 'removed'
                      ? 'bg-[#FDECEC] text-[#7A3A3A]'
                      : 'bg-[#EAF7EE] text-[#2C5D3C]'
                    : 'text-[#4A3B32]'
                }`}
              >
                {para}
              </p>
            );
          })
        ) : (
          <p className="text-xs text-[#8A6E5F]">Nothing here.</p>
        )}
      </div>
    </div>
  );

  return (
    <div className={layout === 'split' ? 'grid gap-4 xl:grid-cols-2' : 'space-y-4'}>
      {column('Original submission', originalParas, editedSet, 'removed')}
      {column('Edited version', editedParas, originalSet, 'added')}
    </div>
  );
};

const ContentTab = ({
  detail,
  form,
  patch,
  isDirty,
  isSaving,
  save,
  reset,
}: {
  detail: PublicationDetail;
  form: WorkspaceForm;
  // eslint-disable-next-line no-unused-vars -- callback prop type
  patch: (partial: Partial<WorkspaceForm>) => void;
  isDirty: boolean;
  isSaving: boolean;
  // eslint-disable-next-line no-unused-vars -- callback prop type
  save: (options?: { silent?: boolean }) => Promise<boolean>;
  reset: () => void;
}) => {
  const [layout, setLayout] = useState<'split' | 'stacked'>('split');
  const [note, setNote] = useState('');
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [suggesting, setSuggesting] = useState(false);

  const [suggestField] = useSuggestStoryFieldMutation();
  const [requestChanges, { isLoading: isRequesting }] = useRequestStoryChangesMutation();
  const [rejectStory, { isLoading: isRejecting }] = useRejectStoryMutation();
  const { setApproved, isLoading: isApproving } = useAssetApproval(detail.id, 'content');

  const approved = detail.statuses.text === 'approved';

  const handleSuggestAnalysis = async () => {
    setSuggesting(true);
    try {
      const res = await suggestField({ storyId: detail.id, field: 'analysis' }).unwrap();
      const payload = (res?.data ?? res) as { editorial_brief?: string };
      const value = String(payload?.editorial_brief || '').trim();
      if (!value) {
        toast.error('Nothing came back — try again');
        return;
      }
      patch({ editorialBrief: value });
      toast.success('Filled — edit in place, then save');
    } catch {
      toast.error('Could not generate an editorial note');
    } finally {
      setSuggesting(false);
    }
  };

  const handleRequestChanges = async () => {
    if (!note.trim()) {
      toast.error('Write a short note the member will see');
      return;
    }
    if (isDirty && !(await save({ silent: true }))) return;
    try {
      const res = await requestChanges({ storyId: detail.id, reason: note.trim() }).unwrap();
      if (res?.success) toast.success('Changes requested');
      setNote('');
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Failed to request changes'));
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    try {
      const res = await rejectStory({
        storyId: detail.id,
        data: { reason: rejectReason.trim() },
      }).unwrap();
      if (res?.success) toast.success(res.message || 'Publication rejected');
      setRejectOpen(false);
      setRejectReason('');
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Failed to reject'));
    }
  };

  const toggleApproved = async () => {
    // Approve what is actually on file: saving edits afterwards would send the
    // text straight back for review.
    if (isDirty && !(await save({ silent: true }))) return;
    await setApproved(!approved);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#6B5648]">
          Compare what the member submitted against the edited version, then approve or send it
          back.
        </p>
        <button
          type="button"
          onClick={() => setLayout((value) => (value === 'split' ? 'stacked' : 'split'))}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-[#E1D7CE] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#5C3A21] hover:bg-[#F5F0EB]"
        >
          {layout === 'split' ? <Rows2 size={12} /> : <Columns2 size={12} />}
          {layout === 'split' ? 'Stack' : 'Side by side'}
        </button>
      </div>

      <CompareView original={detail.storyInput} edited={form.storyText} layout={layout} />

      <label className="block space-y-1">
        <span className="text-[11px] font-bold tracking-wider text-[#A08170] uppercase">
          Edit the written content
        </span>
        <textarea
          className={`${inputClass} min-h-64 font-serif leading-relaxed`}
          value={form.storyText}
          onChange={(event) => patch({ storyText: event.target.value })}
        />
        <span className="text-[11px] text-[#8A6E5F]">
          {countWords(form.storyText)} words
          {detail.storyInput && form.storyText === detail.storyInput
            ? ' · identical to the submission'
            : ''}
        </span>
      </label>

      <div className="space-y-2 rounded-xl border border-[#F0EAE5] bg-[#FAF8F5] p-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="block text-[11px] font-bold tracking-wider text-[#A08170] uppercase">
              Editorial status
            </span>
            <p className="text-[11px] text-[#8A6E5F]">Private note — never shown publicly</p>
          </div>
          <button
            type="button"
            onClick={handleSuggestAnalysis}
            disabled={suggesting}
            className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-md border border-[#E1D7CE] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#5C3A21] hover:bg-[#F5F0EB] disabled:opacity-60"
          >
            {suggesting ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
            AI draft
          </button>
        </div>
        <textarea
          className={`${inputClass} min-h-24`}
          value={form.editorialBrief}
          onChange={(event) => patch({ editorialBrief: event.target.value })}
        />
      </div>

      <div className="space-y-2 rounded-xl border border-[#F0EAE5] p-3">
        <span className="text-[11px] font-bold tracking-wider text-[#A08170] uppercase">
          Note to member
        </span>
        <textarea
          className={`${inputClass} min-h-16`}
          placeholder="Required to request changes."
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
        {detail.moderationNotes ? (
          <p className="text-[11px] text-[#8A6E5F]">Last note on file: {detail.moderationNotes}</p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-[#E6DFDA] pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => save()}
          disabled={!isDirty || isSaving}
          className="border-[#D1C7BD] bg-white text-[#5C4D43]"
        >
          {isSaving ? 'Saving…' : 'Save text'}
        </Button>
        {isDirty ? (
          <button
            type="button"
            onClick={reset}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-[#E6DFDA] bg-white px-3 py-2 text-sm text-[#5C4D43]"
          >
            <Undo2 size={14} /> Discard
          </button>
        ) : null}

        <button
          type="button"
          onClick={handleRequestChanges}
          disabled={isRequesting || isSaving}
          className="cursor-pointer rounded-md border border-[#E6DFDA] bg-[#F5EFEA] px-4 py-2 text-sm font-medium text-[#5C3A21] disabled:opacity-60"
        >
          {isRequesting ? 'Sending…' : 'Request changes'}
        </button>

        <div className="ms-auto flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={toggleApproved}
            disabled={isApproving || isSaving}
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60 ${
              approved
                ? 'bg-[#149443] text-white'
                : 'border border-[#B9D9C4] bg-white text-[#149443] hover:bg-[#F1FAF4]'
            }`}
          >
            {isApproving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            {approved ? 'Content approved' : 'Approve content'}
          </button>

          <button
            type="button"
            onClick={() => setRejectOpen(true)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-[#C82323] px-4 py-2 text-sm font-medium text-white"
          >
            <XCircle size={14} /> Reject
          </button>
        </div>
      </div>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject this publication?</DialogTitle>
            <DialogDescription>
              The member sees your reason on My Stories. This blocks publishing.
            </DialogDescription>
          </DialogHeader>

          <textarea
            value={rejectReason}
            onChange={(event) => setRejectReason(event.target.value)}
            placeholder="e.g. Inappropriate content, formatting issues…"
            className={`${inputClass} min-h-24`}
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)} disabled={isRejecting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectReason.trim() || isRejecting}
            >
              {isRejecting ? 'Rejecting…' : 'Confirm rejection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentTab;
