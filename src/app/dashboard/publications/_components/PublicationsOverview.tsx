'use client';

import placeholder from '@/assets/shared/table_placeholder_image.jpg';
import CustomPagination from '@/components/dashboard/CustomPagination/CustomPagination';
import TableEmptyState from '@/components/dashboard/CustomTable/TableEmptyState';
import TableSkeleton from '@/components/dashboard/CustomTable/TableSkeleton';
import FilterTabs from '@/components/dashboard/FilterTabs/FilterTabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useExportData from '@/hooks/useExportData';
import { PUBLICATION_TYPE_LABEL } from '@/lib/publications/adapter';
import { STATUS_META, STATUS_ORDER } from '@/lib/publications/status';
import type { PublicationRow, PublicationStatus, PublicationType } from '@/types/publication.types';
import { ArrowRight, Images, Search, Upload } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import BulkCoverRegenerate from './BulkCoverRegenerate';
import PublicationCard from './PublicationCard';
import StatusChip from './StatusChip';
import { usePublicationRows, type MissingAsset, type PublicationSort } from './usePublicationRows';

const PAGE_SIZE = 10;

const SORT_OPTIONS: { value: PublicationSort; label: string }[] = [
  { value: 'submitted_desc', label: 'Newest submission' },
  { value: 'submitted_asc', label: 'Oldest submission' },
  { value: 'updated_desc', label: 'Recently updated' },
  { value: 'updated_asc', label: 'Least recently updated' },
];

const MISSING_OPTIONS: { value: MissingAsset; label: string; hint?: string }[] = [
  {
    value: 'text',
    label: 'No text',
    hint: 'Needs story_text on the queue payload - matches nothing until the backend adds it',
  },
  { value: 'cover', label: 'No cover' },
  { value: 'voice', label: 'No voice' },
];

const selectClass =
  'rounded-md border border-[#E1D7CE] bg-white px-3 py-2 text-sm text-[#4A3B32] outline-none focus:ring-1 focus:ring-[#BF7758]/40';

const PublicationsOverview = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { exportToCSV } = useExportData({ fileName: 'publications' });

  const searchInputRef = useRef<HTMLInputElement>(null);
  /** Tracked by id, not index, so it survives re-sorting and paging without a reset effect. */
  const [activeId, setActiveId] = useState<string | null>(null);

  const moderationTab = searchParams.get('status') || 'all';
  const type = (searchParams.get('type') || 'all') as PublicationType | 'all';
  const state = (searchParams.get('state') || 'all') as PublicationStatus | 'all';
  const sort = (searchParams.get('sort') || 'submitted_desc') as PublicationSort;
  const page = Number(searchParams.get('page')) || 1;
  const urlSearch = searchParams.get('search') || '';
  const missing = useMemo(
    () =>
      (searchParams.get('missing') || '')
        .split(',')
        .filter((value): value is MissingAsset => ['text', 'cover', 'voice'].includes(value)),
    [searchParams],
  );

  const [searchDraft, setSearchDraft] = useState(urlSearch);

  /** Any filter change also returns to page 1, so results never look empty by accident. */
  const updateParams = useCallback(
    (next: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(next)) {
        if (value === null || value === '') params.delete(key);
        else params.set(key, value);
      }
      params.set('page', '1');
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  // Debounced so a query is not fired on every keystroke.
  useEffect(() => {
    if (searchDraft === urlSearch) return;
    const timer = setTimeout(() => updateParams({ search: searchDraft.trim() || null }), 350);
    return () => clearTimeout(timer);
  }, [searchDraft, urlSearch, updateParams]);

  const { rows, counts, meta, isLoading, isFetching, isError } = usePublicationRows({
    search: urlSearch,
    moderationStatus: moderationTab === 'all' ? undefined : moderationTab,
    page,
    limit: PAGE_SIZE,
    type,
    status: state,
    missing,
    sort,
  });

  const toggleMissing = (asset: MissingAsset) => {
    const next = missing.includes(asset)
      ? missing.filter((value) => value !== asset)
      : [...missing, asset];
    updateParams({ missing: next.join(',') || null });
  };

  const openRow = useCallback(
    (row: PublicationRow) => router.push(`/dashboard/publications/${row.id}`),
    [router],
  );

  const activeIndex = activeId ? rows.findIndex((row) => row.id === activeId) : -1;

  // Keyboard-first: "/" jumps to search, j/k walks the list, Enter opens.
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      if (event.key === '/' && !typing) {
        event.preventDefault();
        searchInputRef.current?.focus();
        return;
      }
      if (typing || event.metaKey || event.ctrlKey || !rows.length) return;

      if (event.key === 'j' || event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveId(rows[Math.min(activeIndex + 1, rows.length - 1)].id);
      } else if (event.key === 'k' || event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveId(rows[Math.max(activeIndex - 1, 0)].id);
      } else if (event.key === 'Enter' && activeIndex >= 0) {
        event.preventDefault();
        openRow(rows[activeIndex]);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [rows, activeIndex, openRow]);

  const handleExport = () => {
    if (!rows.length) return;
    exportToCSV(
      rows.map((row) => ({
        ID: row.id,
        Title: row.title,
        Author: row.author,
        Type: row.typeLabel,
        Submitted: row.submittedLabel,
        Updated: row.updatedLabel || '',
        Text: STATUS_META[row.text].label,
        Cover: STATUS_META[row.cover].label,
        Voice: STATUS_META[row.voice].label,
        Publication: STATUS_META[row.overall].label,
      })),
      'publications',
    );
  };

  const tabs = [
    { label: 'All', value: 'all', count: counts.all },
    { label: 'Pending', value: 'pending', count: counts.pending },
    { label: 'Flagged', value: 'flagged', count: counts.flagged },
    { label: 'Approved', value: 'approved', count: counts.approved },
    { label: 'Rejected', value: 'rejected', count: counts.rejected },
  ];

  return (
    <div className="w-full space-y-6 rounded-md border border-[#F1E9E4] bg-[#F8F7F3] p-4 sm:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-lg">
          <Search className="text-muted absolute top-1/2 left-3 -translate-y-1/2" size={18} />
          <Input
            ref={searchInputRef}
            type="text"
            value={searchDraft}
            onChange={(event) => setSearchDraft(event.target.value)}
            placeholder="Search by title or author…  (press /)"
            className="bg-muted/5 border-muted/10 focus:ring-primary w-full rounded-md border py-5 pr-4 pl-10 shadow-none focus:ring-1 focus:outline-none"
          />
        </div>

        <div className="ms-auto flex flex-wrap items-center gap-2">
          <Link
            href="/dashboard/publications/cover-library"
            className="text-secondary border-primary/20 inline-flex items-center gap-2 rounded-md border bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
          >
            <Images size={16} /> Cover library
          </Link>
          <BulkCoverRegenerate />
          <Button
            onClick={handleExport}
            disabled={!rows.length}
            className="text-secondary border-primary/20 flex items-center gap-2 rounded-md border bg-white px-4 py-5 font-medium hover:bg-gray-50"
          >
            <Upload size={18} /> Export
          </Button>
        </div>
      </div>

      <FilterTabs tabs={tabs} />

      <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
        <label className="space-y-1">
          <span className="block text-[11px] font-bold tracking-wider text-[#A08170] uppercase">
            Type
          </span>
          <select
            className={selectClass}
            value={type}
            onChange={(event) => updateParams({ type: event.target.value })}
          >
            <option value="all">All types</option>
            {(Object.keys(PUBLICATION_TYPE_LABEL) as PublicationType[]).map((value) => (
              <option key={value} value={value}>
                {PUBLICATION_TYPE_LABEL[value]}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1">
          <span className="block text-[11px] font-bold tracking-wider text-[#A08170] uppercase">
            Publication status
          </span>
          <select
            className={selectClass}
            value={state}
            onChange={(event) => updateParams({ state: event.target.value })}
          >
            <option value="all">Any status</option>
            {STATUS_ORDER.map((value) => (
              <option key={value} value={value}>
                {STATUS_META[value].label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1">
          <span className="block text-[11px] font-bold tracking-wider text-[#A08170] uppercase">
            Sort by
          </span>
          <select
            className={selectClass}
            value={sort}
            onChange={(event) => updateParams({ sort: event.target.value })}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className="space-y-1">
          <span className="block text-[11px] font-bold tracking-wider text-[#A08170] uppercase">
            Missing
          </span>
          <div className="flex gap-2">
            {MISSING_OPTIONS.map((option) => {
              const active = missing.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  title={option.hint}
                  aria-pressed={active}
                  onClick={() => toggleMissing(option.value)}
                  className={`cursor-pointer rounded-md border px-3 py-2 text-sm transition-colors ${
                    active
                      ? 'border-[#BF7758] bg-[#BF7758] text-white'
                      : 'border-[#E1D7CE] bg-white text-[#5C4D43] hover:bg-[#F5F0EB]'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {isError ? (
        <TableEmptyState message="Could not load publications. Refresh to try again." />
      ) : isLoading || isFetching ? (
        <TableSkeleton SKELETON_COLS={9} />
      ) : !rows.length ? (
        <TableEmptyState message="No publications match these filters." />
      ) : (
        <>
          {/* Desktop table */}
          <div className="text-secondary hidden overflow-x-auto rounded-md bg-[#F5F2F0] lg:block">
            <table className="divide-primary/10 min-w-full divide-y">
              <thead>
                <tr>
                  {[
                    'Publication',
                    'Author',
                    'Type',
                    'Submitted',
                    'Text',
                    'Cover',
                    'Voice',
                    'Overall',
                    '',
                  ].map((header) => (
                    <th
                      key={header}
                      scope="col"
                      className="text-primary px-4 py-4 text-left text-sm font-semibold tracking-wider text-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-primary/10 divide-y">
                {rows.map((row, index) => (
                  <tr
                    key={row.id}
                    onClick={() => openRow(row)}
                    onMouseEnter={() => setActiveId(row.id)}
                    className={`cursor-pointer transition-colors ${
                      index === activeIndex ? 'bg-[#EFE7E1]' : 'hover:bg-[#F0EAE5]'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex max-w-sm items-center gap-3">
                        <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded bg-[#E9E1DA]">
                          <Image
                            src={row.coverImageUrl || placeholder}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <p className="text-secondary line-clamp-2 leading-snug font-semibold">
                          {row.title}
                        </p>
                      </div>
                    </td>
                    <td className="max-w-[180px] px-4 py-3 text-sm">
                      <span className="block truncate" title={row.author}>
                        {row.author}
                      </span>
                      {row.authorIsAccountEmail ? (
                        <span className="text-[10px] text-[#A08170]">account email</span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">{row.typeLabel}</td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      {row.submittedLabel}
                      {row.updatedLabel ? (
                        <span className="block text-[10px] text-[#A08170]">
                          updated {row.updatedLabel}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <StatusChip status={row.text} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusChip status={row.cover} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusChip
                        status={row.voice}
                        note={row.voiceNotRequired ? 'by design' : undefined}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <StatusChip status={row.overall} />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/publications/${row.id}`}
                        onClick={(event) => event.stopPropagation()}
                        className="bg-primary inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold text-white"
                      >
                        Open <ArrowRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="grid gap-3 sm:grid-cols-2 lg:hidden">
            {rows.map((row) => (
              <PublicationCard key={row.id} row={row} />
            ))}
          </div>
        </>
      )}

      {!isLoading && !isFetching && meta ? <CustomPagination meta={meta} /> : null}
    </div>
  );
};

export default PublicationsOverview;
