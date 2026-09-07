'use client';

import DynamicBadge from '@/components/dashboard/DynamicBadge/DynamicBadge';
import { mapPublicationDetail } from '@/lib/publications/adapter';
import { useGetModerationStoryDetailsQuery } from '@/redux/features/admin/adminModeration/adminModeration.api';
import type { PublicationDetail } from '@/types/publication.types';
import { AlertTriangle, ArrowLeft, FileText, Image as ImageIcon, Mic2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';
import AssetStatusRail from '../../_components/AssetStatusRail';
import ContactPanel from './ContactPanel';
import ContentTab from './ContentTab';
import DangerZone from './DangerZone';
import PublishPanel from './PublishPanel';
import StoryCardTab from './StoryCardTab';
import VoiceTab from './VoiceTab';
import { useWorkspaceDraft } from './useWorkspaceDraft';

const TABS = [
  { id: 'content', label: 'Content', icon: FileText },
  { id: 'card', label: 'Story Card', icon: ImageIcon },
  { id: 'voice', label: 'Voice', icon: Mic2 },
] as const;

type TabId = (typeof TABS)[number]['id'];

const WorkspaceSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-24 w-full rounded-xl bg-[#EDE7E1]" />
    <div className="h-96 w-full rounded-xl bg-[#EDE7E1]" />
  </div>
);

const PublicationWorkspace = ({ id }: { id: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data, isLoading, isError } = useGetModerationStoryDetailsQuery(id);

  const detail = useMemo(
    () => mapPublicationDetail(data?.data as Record<string, unknown> | undefined),
    [data],
  );

  const tabParam = searchParams.get('tab');
  const activeTab: TabId = TABS.some((tab) => tab.id === tabParam)
    ? (tabParam as TabId)
    : 'content';

  const setTab = useCallback(
    (tab: TabId) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('tab', tab);
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  // 1/2/3 jump between tabs.
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const index = ['1', '2', '3'].indexOf(event.key);
      if (index >= 0) {
        event.preventDefault();
        setTab(TABS[index].id);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setTab]);

  if (isLoading) return <WorkspaceSkeleton />;

  if (isError || !detail) {
    return (
      <div className="rounded-md border border-[#E5CDCD] bg-[#FFF8F8] p-6">
        <p className="inline-flex items-center gap-2 text-sm font-medium text-[#A80000]">
          <AlertTriangle size={16} /> This publication could not be loaded.
        </p>
        <button
          type="button"
          onClick={() => router.push('/dashboard/publications')}
          className="mt-3 cursor-pointer text-sm font-semibold text-[#BF7758]"
        >
          Back to publications
        </button>
      </div>
    );
  }

  return <Workspace detail={detail} activeTab={activeTab} setTab={setTab} />;
};

/** Split out so the form hook only mounts once the detail is known. */
const Workspace = ({
  detail,
  activeTab,
  setTab,
}: {
  detail: PublicationDetail;
  activeTab: TabId;
  // eslint-disable-next-line no-unused-vars -- callback prop type
  setTab: (tab: TabId) => void;
}) => {
  const router = useRouter();
  const { form, patch, reset, isDirty, isSaving, save } = useWorkspaceDraft(detail);

  // Review state belongs to the server, so the rail reflects what is saved.
  const statuses = detail.statuses;

  const leave = () => {
    if (isDirty && !window.confirm('You have unsaved edits. Leave anyway?')) return;
    router.push('/dashboard/publications');
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={leave}
        className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-[#BF7758]"
      >
        <ArrowLeft size={14} /> Publications
      </button>

      <div className="space-y-4 rounded-md border border-[#F1E9E4] bg-[#F8F7F3] p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <DynamicBadge text={detail.typeLabel} color="#5C3A21" size="sm" />
              {detail.explicit ? <DynamicBadge text="Explicit" color="#C82323" size="sm" /> : null}
              <span className="text-xs text-[#8A6E5F]">Submitted {detail.submittedLabel}</span>
            </div>
            <h2 className="text-secondary truncate text-xl font-bold sm:text-2xl">
              {form.title || 'Untitled'}
            </h2>
          </div>
          {isDirty ? (
            <span className="rounded-full border border-[#E4D3C6] bg-[#FDF6F0] px-2.5 py-1 text-[11px] font-semibold text-[#A2673F]">
              Unsaved edits
            </span>
          ) : null}
        </div>

        <div className="border-y border-[#EDE4DD] py-3">
          <AssetStatusRail statuses={statuses} voiceNotRequired={detail.voiceNotRequired} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,280px)]">
          <div className="min-w-0 space-y-4">
            <div
              role="tablist"
              aria-label="Publication sections"
              className="flex gap-1 overflow-x-auto border-b border-[#EDE4DD]"
            >
              {TABS.map((tab, index) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={active}
                    type="button"
                    onClick={() => setTab(tab.id)}
                    className={`relative inline-flex cursor-pointer items-center gap-2 px-4 py-2.5 text-sm font-medium text-nowrap transition-colors ${
                      active ? 'text-primary' : 'text-muted hover:text-secondary'
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                    <span className="text-[10px] text-[#BFAEA2]">{index + 1}</span>
                    {active ? (
                      <span className="bg-primary absolute bottom-0 left-0 h-0.5 w-full" />
                    ) : null}
                  </button>
                );
              })}
            </div>

            {activeTab === 'content' ? (
              <ContentTab
                detail={detail}
                form={form}
                patch={patch}
                isDirty={isDirty}
                isSaving={isSaving}
                save={save}
                reset={reset}
              />
            ) : null}
            {activeTab === 'card' ? (
              <StoryCardTab
                detail={detail}
                form={form}
                patch={patch}
                isDirty={isDirty}
                isSaving={isSaving}
                save={save}
                reset={reset}
              />
            ) : null}
            {activeTab === 'voice' ? (
              <VoiceTab
                detail={detail}
                form={form}
                patch={patch}
                isDirty={isDirty}
                isSaving={isSaving}
                save={save}
              />
            ) : null}
          </div>

          <aside className="space-y-3">
            <PublishPanel
              id={detail.id}
              statuses={statuses}
              blockers={detail.publishBlockers}
              isDirty={isDirty}
              onSaveFirst={() => save({ silent: true })}
            />
            <ContactPanel detail={detail} />
            {detail.background || detail.personality || detail.lifestyle || detail.situation ? (
              <details className="rounded-xl border border-[#E6DFDA] bg-white p-4 text-sm text-[#614E43]">
                <summary className="cursor-pointer text-[11px] font-bold tracking-wider text-[#A08170] uppercase">
                  Character brief
                </summary>
                <div className="mt-2 space-y-1">
                  {detail.background ? (
                    <p>
                      <strong>Background:</strong> {detail.background}
                    </p>
                  ) : null}
                  {detail.personality ? (
                    <p>
                      <strong>Personality:</strong> {detail.personality}
                    </p>
                  ) : null}
                  {detail.lifestyle ? (
                    <p>
                      <strong>Lifestyle:</strong> {detail.lifestyle}
                    </p>
                  ) : null}
                  {detail.situation ? (
                    <p>
                      <strong>Situation:</strong> {detail.situation}
                    </p>
                  ) : null}
                </div>
              </details>
            ) : null}
            <DangerZone id={detail.id} title={detail.title} />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PublicationWorkspace;
