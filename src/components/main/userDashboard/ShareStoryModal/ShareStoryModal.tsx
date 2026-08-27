'use client';

import {
  useGetSharePackageQuery,
  useRegenerateSocialIntrosMutation,
} from '@/redux/features/memberStory/memberStory.api';
import { Check, Copy, Download, Loader2, RefreshCw, X } from 'lucide-react';
import Image from 'next/image';
import React, { useCallback, useState } from 'react';

interface ShareStoryModalProps {
  isOpen: boolean;
  storyId: string | null;
  storyTitle?: string;
  onClose: () => void;
}

type PlatformKey = 'instagram' | 'facebook' | 'spotify';

const PLATFORMS: { key: PlatformKey; label: string; hint: string }[] = [
  { key: 'instagram', label: 'Instagram', hint: 'Caption / story teaser (≤ 220 chars)' },
  { key: 'facebook', label: 'Facebook', hint: 'Post teaser (≤ 400 chars)' },
  { key: 'spotify', label: 'Spotify', hint: 'Show notes or intro track (100–180 words)' },
];

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function formatDuration(seconds: number | null | undefined): string | null {
  if (!seconds || seconds <= 0) return null;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function extensionFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const match = pathname.match(/\.(jpe?g|png|webp|gif)$/i);
    return match ? match[1].toLowerCase() : 'jpg';
  } catch {
    return 'jpg';
  }
}

function buildCoverFilename(
  coverUrl: string,
  storyReference?: string | null,
  title?: string | null,
): string {
  const ext = extensionFromUrl(coverUrl);
  const base =
    storyReference?.trim() ||
    title
      ?.trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') ||
    'story-cover';
  return `${base}-cover.${ext}`;
}

async function downloadCoverImage(url: string, filename: string): Promise<void> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch cover image');
    }
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(blobUrl);
  } catch {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}

export default function ShareStoryModal({
  isOpen,
  storyId,
  storyTitle,
  onClose,
}: ShareStoryModalProps) {
  const {
    data: shareResponse,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetSharePackageQuery(storyId ?? '', {
    skip: !isOpen || !storyId,
  });

  const [regenerate, { isLoading: isRegenerating }] = useRegenerateSocialIntrosMutation();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isDownloadingCover, setIsDownloadingCover] = useState(false);

  const share = shareResponse?.data;

  const handleCopy = useCallback(async (key: string, text: string) => {
    const ok = await copyText(text);
    if (ok) {
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 2000);
    }
  }, []);

  const handleRegenerate = async () => {
    if (!storyId) return;
    await regenerate(storyId).unwrap();
    refetch();
  };

  const handleDownloadCover = useCallback(async () => {
    if (!share?.cover_image_url || isDownloadingCover) return;
    setIsDownloadingCover(true);
    try {
      await downloadCoverImage(
        share.cover_image_url,
        buildCoverFilename(share.cover_image_url, share.story_reference, share.title),
      );
    } finally {
      setIsDownloadingCover(false);
    }
  }, [isDownloadingCover, share]);

  if (!isOpen || !storyId) return null;

  const isBusy = isLoading || isFetching || isRegenerating;
  const title = share?.title || storyTitle || 'Share story';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="animate-in fade-in zoom-in-95 relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#EBE4D5] bg-[#FAF7F2] shadow-2xl duration-150">
        <div className="flex shrink-0 items-center justify-between border-b border-[#EBE4D5] px-6 py-4">
          <div>
            <h3 className="font-edo text-xl font-bold tracking-wider text-[#D98755]">SHARE</h3>
            <p className="mt-0.5 font-sans text-xs text-gray-600">{title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-200"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-gray-600">
              <Loader2 className="h-8 w-8 animate-spin text-[#D98755]" />
              <p className="font-sans text-sm font-medium">Preparing your share package…</p>
              <p className="max-w-xs text-center font-sans text-xs text-gray-500">
                Platform introductions are written on the first request and may take a few seconds.
              </p>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-center">
              <p className="font-sans text-sm font-semibold text-red-700">
                Could not load the share package.
              </p>
              <p className="mt-1 font-sans text-xs text-red-600">
                Make sure the story has finished generating, then try again.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="font-playpen mt-4 rounded-xl bg-[#D22D4C] px-4 py-2 text-xs font-bold text-white"
              >
                Retry
              </button>
            </div>
          ) : share ? (
            <div className="space-y-5">
              <div className="flex gap-4">
                {share.cover_image_url ? (
                  <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={share.cover_image_url}
                      alt={title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <div className="min-w-0 flex-1 space-y-2">
                  {share.story_reference ? (
                    <p className="font-sans text-xs font-semibold tracking-wider text-[#301C05] uppercase">
                      {share.story_reference}
                    </p>
                  ) : null}
                  {share.author_name ? (
                    <p className="font-sans text-sm text-gray-700">by {share.author_name}</p>
                  ) : null}
                  {formatDuration(share.audio_duration_seconds) ? (
                    <p className="font-sans text-xs text-gray-500">
                      Audio · {formatDuration(share.audio_duration_seconds)}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {share.share_url ? (
                  <CopyLinkRow
                    label="Story link"
                    value={share.share_url}
                    copyKey="share_url"
                    copiedKey={copiedKey}
                    onCopy={handleCopy}
                  />
                ) : null}
                {share.audio_url ? (
                  <CopyLinkRow
                    label="Audio file"
                    value={share.audio_url}
                    copyKey="audio_url"
                    copiedKey={copiedKey}
                    onCopy={handleCopy}
                  />
                ) : null}
                {share.cover_image_url ? (
                  <DownloadCoverRow
                    label="Cover artwork"
                    url={share.cover_image_url}
                    isDownloading={isDownloadingCover}
                    onDownload={handleDownloadCover}
                  />
                ) : null}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-playpen text-sm font-bold text-gray-900">
                    Platform introductions
                  </h4>
                  <button
                    type="button"
                    onClick={handleRegenerate}
                    disabled={isBusy}
                    className="font-playpen flex items-center gap-1.5 rounded-lg border border-[#EBE4D5] bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                  >
                    <RefreshCw size={12} className={isRegenerating ? 'animate-spin' : ''} />
                    Regenerate
                  </button>
                </div>

                {PLATFORMS.map(({ key, label, hint }) => (
                  <PlatformIntroBlock
                    key={key}
                    platform={key}
                    label={label}
                    hint={hint}
                    text={share.intros[key]}
                    copiedKey={copiedKey}
                    onCopy={handleCopy}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="shrink-0 border-t border-[#EBE4D5] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="font-playpen w-full rounded-xl border border-[#EBE4D5] bg-white py-2.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-100"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line no-unused-vars -- callback signature
type OnCopyHandler = (copyKey: string, value: string) => void;

function DownloadCoverRow({
  label,
  url,
  isDownloading,
  onDownload,
}: {
  label: string;
  url: string;
  isDownloading: boolean;
  onDownload: () => void;
}) {
  return (
    <div className="rounded-xl border border-[#EBE4D5] bg-white p-3 sm:col-span-2">
      <div className="flex items-center justify-between gap-2">
        <span className="font-playpen text-xs font-semibold text-gray-800">{label}</span>
        <button
          type="button"
          onClick={onDownload}
          disabled={isDownloading}
          className="flex items-center gap-1 rounded-md px-2 py-1 font-sans text-xs font-semibold text-[#D98755] hover:bg-[#FAF7F2] disabled:opacity-50"
        >
          {isDownloading ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
          {isDownloading ? 'Downloading…' : 'Download cover'}
        </button>
      </div>
      <p className="mt-1 truncate font-sans text-xs text-gray-500">{url}</p>
    </div>
  );
}

function CopyLinkRow({
  label,
  value,
  copyKey,
  copiedKey,
  onCopy,
}: {
  label: string;
  value: string;
  copyKey: string;
  copiedKey: string | null;
  onCopy: OnCopyHandler;
}) {
  const copied = copiedKey === copyKey;

  return (
    <div className="rounded-xl border border-[#EBE4D5] bg-white p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="font-playpen text-xs font-semibold text-gray-800">{label}</span>
        <button
          type="button"
          onClick={() => onCopy(copyKey, value)}
          className="flex items-center gap-1 rounded-md px-2 py-1 font-sans text-xs font-semibold text-[#D98755] hover:bg-[#FAF7F2]"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <p className="mt-1 truncate font-sans text-xs text-gray-500">{value}</p>
    </div>
  );
}

function PlatformIntroBlock({
  platform,
  label,
  hint,
  text,
  copiedKey,
  onCopy,
}: {
  platform: PlatformKey;
  label: string;
  hint: string;
  text: string;
  copiedKey: string | null;
  onCopy: OnCopyHandler;
}) {
  const copyKey = `intro-${platform}`;
  const copied = copiedKey === copyKey;

  return (
    <div className="rounded-xl border border-[#EBE4D5] bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-playpen text-sm font-bold text-gray-900">{label}</p>
          <p className="font-sans text-xs text-gray-500">{hint}</p>
        </div>
        <button
          type="button"
          onClick={() => onCopy(copyKey, text)}
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#D22D4C] px-3 py-1.5 font-sans text-xs font-bold text-white transition-colors hover:bg-[#b5243f]"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy intro'}
        </button>
      </div>
      <p className="mt-3 font-sans text-sm leading-relaxed whitespace-pre-wrap text-gray-800">
        {text}
      </p>
    </div>
  );
}
