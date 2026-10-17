'use client';

import { Button } from '@/components/ui/button';
import {
  useBulkConfirmIngestMutation,
  useBulkParseDocumentMutation,
} from '@/redux/features/admin/adminModeration/adminModeration.api';
import {
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  Loader2,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react';
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import { toast } from 'sonner';

export interface ExtractedStory {
  title: string;
  story_type: string;
  story_text: string;
  first_name?: string | null;
  age?: number | null;
  gender?: string | null;
  city?: string | null;
  country?: string | null;
  occupation?: string | null;
  sexual_orientation?: string | null;
  growth_areas?: string[];
  life_phase?: string | null;
  tags?: string[];
  high_intensity?: boolean;
  hero_hook?: string | null;
  hero_tagline?: string | null;
}

interface IngestedStory {
  id: string;
  story_number?: number;
  title: string;
  story_type: string;
  cover_status: string;
  voice_status: string;
}

const ACCEPTED_EXTENSIONS = ['.docx', '.pdf', '.txt', '.md'];

const BulkStoryImport: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'upload' | 'preview' | 'success'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [defaultStoryType, setDefaultStoryType] = useState<string>('');
  const [generateCovers, setGenerateCovers] = useState(true);
  const [generateAudio, setGenerateAudio] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [extractedStories, setExtractedStories] = useState<ExtractedStory[]>([]);
  const [ingestedStories, setIngestedStories] = useState<IngestedStory[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [bulkParse, { isLoading: isParsing }] = useBulkParseDocumentMutation();
  const [bulkConfirm, { isLoading: isConfirming }] = useBulkConfirmIngestMutation();

  const resetState = () => {
    setSelectedFile(null);
    setExtractedStories([]);
    setIngestedStories([]);
    setStep('upload');
    setIsDragging(false);
  };

  const handleClose = () => {
    if (isParsing || isConfirming) return;
    setIsOpen(false);
    resetState();
  };

  const validateAndSetFile = (file: File) => {
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      toast.error(`Unsupported file type. Please upload ${ACCEPTED_EXTENSIONS.join(', ')}`);
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      toast.error('File size exceeds 25 MB limit.');
      return;
    }
    setSelectedFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const handleStartParsing = async () => {
    if (!selectedFile) {
      toast.error('Please select a document first.');
      return;
    }

    try {
      const res = await bulkParse({
        file: selectedFile,
        defaultStoryType: defaultStoryType || undefined,
      }).unwrap();

      const stories = res?.data?.stories || [];
      if (!stories.length) {
        toast.error('No stories were identified in this document.');
        return;
      }

      setExtractedStories(stories);
      setStep('preview');
      toast.success(`Found ${stories.length} stories! Review before importing.`);
    } catch (err: unknown) {
      const msg =
        (err as { data?: { detail?: string } })?.data?.detail ||
        'Could not separate stories from the document.';
      toast.error(msg);
    }
  };

  const handleRemoveStory = (index: number) => {
    setExtractedStories((prev) => prev.filter((_, i) => i !== index));
    if (extractedStories.length <= 1) {
      toast.info('All stories removed. Returning to upload.');
      setStep('upload');
    }
  };

  const handleUpdateStoryTitle = (index: number, newTitle: string) => {
    setExtractedStories((prev) =>
      prev.map((item, i) => (i === index ? { ...item, title: newTitle } : item)),
    );
  };

  const handleConfirmIngest = async () => {
    if (!extractedStories.length) return;

    try {
      const res = await bulkConfirm({
        stories: extractedStories,
        generate_covers: generateCovers,
        generate_audio: generateAudio,
      }).unwrap();

      const created = res?.data?.stories || [];
      setIngestedStories(created);
      setStep('success');
      toast.success(`Successfully imported ${created.length} stories!`);
    } catch (err: unknown) {
      const msg =
        (err as { data?: { detail?: string } })?.data?.detail ||
        'Could not ingest stories into the publication queue.';
      toast.error(msg);
    }
  };

  return (
    <>
      <Button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-secondary border-primary/20 inline-flex items-center gap-2 rounded-md border bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
      >
        <FileSpreadsheet size={16} /> Bulk story upload
      </Button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#EAE3DC] px-6 py-4">
              <div>
                <h2 className="font-serif text-lg font-semibold text-[#4A3B32]">
                  Bulk Story Ingestion
                </h2>
                <p className="text-xs text-[#8A7569]">
                  Upload a multi-story document. AI will separate and extract each story
                  automatically.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                disabled={isParsing || isConfirming}
                className="cursor-pointer rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-40"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {step === 'upload' && (
                <div className="space-y-5">
                  {/* Dropzone */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                      isDragging
                        ? 'border-[#BF7758] bg-[#FDF9F6]'
                        : selectedFile
                          ? 'border-[#149443]/40 bg-[#F4FAF6]'
                          : 'border-[#E1D7CE] bg-[#FAF8F5] hover:bg-[#F6F2EE]'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".docx,.pdf,.txt,.md"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <UploadCloud
                      size={36}
                      className={`mb-2 ${selectedFile ? 'text-[#149443]' : 'text-[#BF7758]'}`}
                    />
                    {selectedFile ? (
                      <div>
                        <p className="text-sm font-semibold text-[#301C05]">{selectedFile.name}</p>
                        <p className="text-xs text-[#8A7569]">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · Click to choose
                          another file
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-medium text-[#4A3B32]">
                          Click to upload or drag & drop your document
                        </p>
                        <p className="mt-1 text-xs text-[#8A7569]">
                          Supports .docx, .pdf, .txt, .md (Word, PDF, Plain text)
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Options */}
                  <div className="space-y-3 rounded-xl border border-[#F0EAE5] bg-[#FAF8F5] p-4">
                    <span className="block text-[11px] font-bold tracking-wider text-[#A08170] uppercase">
                      Ingestion Settings
                    </span>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="flex cursor-pointer items-start gap-2.5 text-xs text-[#4A3B32]">
                        <input
                          type="checkbox"
                          checked={generateCovers}
                          onChange={(e) => setGenerateCovers(e.target.checked)}
                          className="mt-0.5 rounded text-[#BF7758]"
                        />
                        <span>
                          <strong className="block text-[#301C05]">Auto-generate AI Cover</strong>
                          Creates warm sepia V2 story card artwork in background
                        </span>
                      </label>

                      <label className="flex cursor-pointer items-start gap-2.5 text-xs text-[#4A3B32]">
                        <input
                          type="checkbox"
                          checked={generateAudio}
                          onChange={(e) => setGenerateAudio(e.target.checked)}
                          className="mt-0.5 rounded text-[#BF7758]"
                        />
                        <span>
                          <strong className="block text-[#301C05]">Auto-generate Narration</strong>
                          Generates audio with ElevenLabs in background
                        </span>
                      </label>
                    </div>

                    <div className="border-t border-[#EAE3DC] pt-2">
                      <label className="mb-1 block text-xs font-medium text-[#4A3B32]">
                        Default Story Type (or allow AI auto-detection)
                      </label>
                      <select
                        value={defaultStoryType}
                        onChange={(e) => setDefaultStoryType(e.target.value)}
                        className="w-full rounded-md border border-[#E1D7CE] bg-white px-3 py-2 text-xs text-[#4A3B32] outline-none focus:ring-1 focus:ring-[#BF7758]"
                      >
                        <option value="">Auto-detect each story type</option>
                        <option value="confession">Confession</option>
                        <option value="meditation">Meditation</option>
                        <option value="transformation">Transformation / Liberation</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {step === 'preview' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-[#EDE5DC] bg-[#F8F4EF] p-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-[#149443]" />
                      <span className="text-xs font-semibold text-[#4A3B32]">
                        {extractedStories.length} distinct{' '}
                        {extractedStories.length === 1 ? 'story' : 'stories'} detected
                      </span>
                    </div>
                    <span className="text-[11px] text-[#8A7569]">
                      Review titles and details before importing
                    </span>
                  </div>

                  <div className="max-h-[48vh] space-y-3 overflow-y-auto pr-1">
                    {extractedStories.map((story, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-[#E8E1D9] bg-white p-4 shadow-2xs transition-colors hover:border-[#D6C7BC]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="inline-block rounded-xs border border-[#EBE4D5] bg-[#FAF5F0] px-2 py-0.5 text-[10px] font-bold text-[#8A7569] uppercase">
                                Story {idx + 1} · {story.story_type}
                              </span>
                              {story.life_phase ? (
                                <span className="inline-block rounded-xs border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] text-amber-800">
                                  {story.life_phase}
                                </span>
                              ) : null}
                              <span className="text-[11px] text-gray-400">
                                ~{story.story_text.split(/\s+/).length} words
                              </span>
                            </div>

                            <input
                              type="text"
                              value={story.title}
                              onChange={(e) => handleUpdateStoryTitle(idx, e.target.value)}
                              className="w-full border-b border-transparent bg-transparent font-serif text-sm font-semibold text-[#301C05] outline-none hover:border-gray-200 focus:border-[#BF7758]"
                            />

                            {story.hero_hook ? (
                              <p className="line-clamp-2 text-xs text-[#5C4A3A] italic">
                                &ldquo;{story.hero_hook}&rdquo;
                              </p>
                            ) : null}

                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              {story.first_name ? (
                                <span className="text-[11px] text-[#8A7569]">
                                  by {story.first_name}
                                  {story.city ? `, ${story.city}` : ''}
                                </span>
                              ) : null}
                              {story.growth_areas?.slice(0, 3).map((g) => (
                                <span
                                  key={g}
                                  className="rounded-xs border border-[#EBE4D5] bg-[#FAF7F2] px-1.5 py-0.5 text-[10px] text-[#5C4A3A]"
                                >
                                  {g}
                                </span>
                              ))}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveStory(idx)}
                            className="cursor-pointer p-1 text-gray-400 hover:text-red-500"
                            title="Remove this story"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 'success' && (
                <div className="space-y-5 py-4 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <CheckCircle2 size={32} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#301C05]">
                      Stories Ingested Successfully!
                    </h3>
                    <p className="mt-1 text-xs text-[#8A7569]">
                      {ingestedStories.length} stories are now in your publication queue ready for
                      review.
                      {generateCovers ? ' AI covers are being generated in the background.' : ''}
                    </p>
                  </div>

                  <div className="max-h-48 space-y-2 overflow-y-auto rounded-xl border border-[#EFE8E1] bg-[#FAF8F5] p-3 text-left">
                    {ingestedStories.map((story) => (
                      <div
                        key={story.id}
                        className="flex items-center justify-between border-b border-[#F0EAE5] py-1 text-xs last:border-b-0"
                      >
                        <div>
                          <span className="font-semibold text-[#4A3B32]">{story.title}</span>
                          <span className="ms-2 text-[10px] text-[#8A7569] uppercase">
                            ({story.story_type})
                          </span>
                        </div>
                        <Link
                          href={`/dashboard/publications/${story.id}`}
                          onClick={handleClose}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-[#BF7758] hover:underline"
                        >
                          Review story <ArrowRight size={12} />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between rounded-b-2xl border-t border-[#EAE3DC] bg-[#FCFBF9] px-6 py-4">
              {step === 'upload' && (
                <>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="cursor-pointer text-xs font-medium text-gray-500 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <Button
                    type="button"
                    onClick={handleStartParsing}
                    disabled={!selectedFile || isParsing}
                    className="inline-flex items-center gap-2 rounded-md bg-[#BF7758] px-5 py-2 text-xs font-semibold text-white hover:bg-[#A86447] disabled:opacity-50"
                  >
                    {isParsing ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Analyzing & Separating with AI...
                      </>
                    ) : (
                      <>
                        Separate Stories with AI <ArrowRight size={14} />
                      </>
                    )}
                  </Button>
                </>
              )}

              {step === 'preview' && (
                <>
                  <button
                    type="button"
                    onClick={() => setStep('upload')}
                    disabled={isConfirming}
                    className="cursor-pointer text-xs font-medium text-gray-500 hover:text-gray-800"
                  >
                    ← Back to Upload
                  </button>
                  <Button
                    type="button"
                    onClick={handleConfirmIngest}
                    disabled={isConfirming || !extractedStories.length}
                    className="inline-flex items-center gap-2 rounded-md bg-[#149443] px-5 py-2 text-xs font-semibold text-white hover:bg-[#118039] disabled:opacity-50"
                  >
                    {isConfirming ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Ingesting {extractedStories.length} Stories...
                      </>
                    ) : (
                      <>Confirm & Ingest {extractedStories.length} Stories</>
                    )}
                  </Button>
                </>
              )}

              {step === 'success' && (
                <div className="flex w-full justify-end">
                  <Button
                    type="button"
                    onClick={handleClose}
                    className="rounded-md bg-[#301C05] px-6 py-2 text-xs font-semibold text-white hover:bg-[#4A3B32]"
                  >
                    Done
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default BulkStoryImport;
