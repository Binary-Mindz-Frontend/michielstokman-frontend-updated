/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import InputField from '@/components/dashboard/Fields/InputField/InputField';
import TextAreaField from '@/components/dashboard/Fields/TextAreaField/TextAreaField';
import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import { cn } from '@/lib/utils';
import { useGenerateStoryMutation, useGetVoicesQuery } from '@/redux/features/aiStory/aiStory.api';
import { appToast } from '@/utils/appToast';
import { appendStoryPayloadToFormData } from '@/utils/storyGenerate.utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pause, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import SuccessModal from '../SuccessModal/SuccessModal';
import { composeEditorialStoryInput, countWords } from '../submitStory.utils';

const CONFESSION_MIN_WORDS = 1000;
const CONFESSION_MAX_WORDS = 1800;
const MEDITATION_MAX_WORDS = 1800;
const MAX_AUDIO_BYTES = 10 * 1024 * 1024;

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'This field is required'),
  aboutYou: z.string().optional(),
  context: z.string().optional(),
  coverName: z.string().optional(),
  voiceMode: z.enum(['our_voice', 'own_narration']),
  voiceName: z.string().optional(),
  editorialConsent: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

const STEP_LABELS = ['Your piece', 'About you', 'Bring it alive', 'Voice', 'Review & submit'];

export default function SubmitWizard({ category }: { category: string }) {
  const router = useRouter();
  const isConfession = category === 'Confessions';
  const [step, setStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [playingName, setPlayingName] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [generateStory, { isLoading: isGenerating }] = useGenerateStoryMutation();
  const { data: voicesCatalog, isLoading: isVoicesLoading } = useGetVoicesQuery();

  const voices = useMemo(
    () => (voicesCatalog?.voices ?? []).filter((voice) => !voice.is_custom).slice(0, 4),
    [voicesCatalog],
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      body: '',
      aboutYou: '',
      context: '',
      coverName: '',
      voiceMode: 'our_voice',
      voiceName: '',
      editorialConsent: false,
    },
  });

  const bodyValue = watch('body') || '';
  const voiceMode = watch('voiceMode');
  const voiceName = watch('voiceName');
  const editorialConsent = watch('editorialConsent');
  const wordCount = countWords(bodyValue);

  useEffect(() => {
    if (!voices.length || voiceName) return;
    const fallback =
      voices.find((voice) => voice.name === voicesCatalog?.default_voice) || voices[0];
    if (fallback) setValue('voiceName', fallback.name);
  }, [voices, voicesCatalog?.default_voice, voiceName, setValue]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const validateStep = async (index: number) => {
    if (index === 0) {
      const ok = await trigger(['title', 'body']);
      if (!ok) {
        appToast.error(
          errors.title?.message || errors.body?.message || 'Please complete this step.',
        );
        return false;
      }
      if (isConfession && (wordCount < CONFESSION_MIN_WORDS || wordCount > CONFESSION_MAX_WORDS)) {
        appToast.error(
          `Confession should be ${CONFESSION_MIN_WORDS}–${CONFESSION_MAX_WORDS} words.`,
        );
        return false;
      }
      if (!isConfession && wordCount > MEDITATION_MAX_WORDS) {
        appToast.error(`Meditation should be under ${MEDITATION_MAX_WORDS} words.`);
        return false;
      }
      return true;
    }
    if (index === 3) {
      if (voiceMode === 'our_voice' && !voiceName) {
        appToast.error('Choose one of our voices, or upload your own narration.');
        return false;
      }
      if (voiceMode === 'own_narration' && !audioFile) {
        appToast.error('Upload your finished audio recording, or choose one of our voices.');
        return false;
      }
      return true;
    }
    return true;
  };

  const goNext = async () => {
    const ok = await validateStep(step);
    if (!ok) return;
    setStep((current) => Math.min(current + 1, STEP_LABELS.length - 1));
  };

  const onSubmit = async (data: FormValues) => {
    const lastOk = await validateStep(3);
    if (!lastOk) {
      setStep(3);
      return;
    }
    if (!data.editorialConsent) {
      appToast.error('Please confirm you understand how editorial review works before submitting.');
      return;
    }

    const story_input = composeEditorialStoryInput({
      isConfession,
      body: data.body,
      aboutYou: data.aboutYou || '',
      context: data.context || '',
    });

    const payload: Record<string, unknown> = {
      story_type: isConfession ? 'confession' : 'meditation',
      title: data.title,
      first_name: data.coverName?.trim() || undefined,
      story_input,
      growth_areas: [],
      tags: [],
      high_intensity: false,
      image_mode: 'ai_generated',
    };

    if (data.voiceMode === 'own_narration' && audioFile) {
      payload.skip_narration = true;
    } else if (data.voiceName) {
      payload.voice_name = data.voiceName;
    }

    try {
      let res;
      if (data.voiceMode === 'own_narration' && audioFile) {
        const formData = new FormData();
        appendStoryPayloadToFormData(formData, payload);
        formData.append('audio', audioFile);
        res = await generateStory(formData).unwrap();
      } else {
        res = await generateStory(payload).unwrap();
      }

      if (res.success) {
        setIsSuccess(true);
      }
    } catch (error: any) {
      appToast.error(error?.data?.message || error?.data?.detail || 'Something went wrong.');
    }
  };

  const handlePreview = (name: string, url: string | null) => {
    if (!url) return;
    if (playingName === name) {
      audioRef.current?.pause();
      setPlayingName(null);
      return;
    }
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;
    audio.src = url;
    audio.onended = () => setPlayingName(null);
    audio
      .play()
      .then(() => setPlayingName(name))
      .catch(() => {
        setPlayingName(null);
        appToast.error('Voice preview could not be played.');
      });
  };

  const handleAudioFile = (file: File | null) => {
    if (!file) {
      setAudioFile(null);
      return;
    }
    if (file.size > MAX_AUDIO_BYTES) {
      appToast.error('Audio must be 10 MB or smaller.');
      return;
    }
    setAudioFile(file);
  };

  const stepTitle = isConfession
    ? [
        'Your confession',
        'About you — the author',
        'About the main character',
        'Voice',
        'Review & submit',
      ]
    : ['Your meditation', 'About you', 'Bring the meditation alive', 'Voice', 'Review & submit'];

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-3">
        <p className="font-sans text-xs font-semibold tracking-wide text-[#888] uppercase">
          Step {step + 1} of {STEP_LABELS.length} · {stepTitle[step]}
        </p>
        <button
          type="button"
          onClick={() => router.push('/create')}
          className="font-sans text-xs font-semibold text-[#777] underline underline-offset-2 hover:text-[#503225]"
        >
          Change type
        </button>
      </div>

      <div className="mb-6 flex gap-1">
        {STEP_LABELS.map((label, index) => (
          <div
            key={label}
            className={cn(
              'h-1 flex-1 rounded-full',
              index <= step ? 'bg-[#EEA13D]' : 'bg-[#EBE4D5]',
            )}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {step === 0 ? (
          <div className="space-y-5">
            <InputField
              label="Title"
              name="title"
              placeholder={isConfession ? 'Title of your confession' : 'Title of your meditation'}
              control={control}
              error={errors.title?.message}
              required
            />
            <TextAreaField
              label={isConfession ? 'Confession' : 'Meditation text'}
              name="body"
              placeholder={
                isConfession
                  ? 'Write freely. Raw is good.'
                  : 'Write the meditation you want to share.'
              }
              control={control}
              error={errors.body?.message}
              required
              rows={12}
            />
            <p
              className={cn(
                'text-right font-sans text-xs',
                isConfession &&
                  (wordCount < CONFESSION_MIN_WORDS || wordCount > CONFESSION_MAX_WORDS)
                  ? 'font-bold text-[#D22D4C]'
                  : 'font-semibold text-[#888]',
              )}
            >
              {wordCount} words
              {isConfession ? ` · ${CONFESSION_MIN_WORDS}–${CONFESSION_MAX_WORDS} words` : ''}
            </p>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-sans text-sm font-bold text-[#1A1A1A]">
                {isConfession ? 'Help us understand who is behind this.' : 'About you'}
              </h3>
              <p className="font-sans text-sm leading-relaxed text-[#666]">
                {isConfession
                  ? 'Who are you? Age, gender, where you’re from, where you live, occupation, relationship situation, sexual orientation, personality, interests, lifestyle — anything that brings you alive.'
                  : 'Tell us anything about yourself that helps us understand where this meditation comes from.'}
              </p>
              <p className="font-sans text-xs leading-relaxed text-[#888]">
                Nothing here is required. Share what feels relevant. This information helps us
                understand and edit your {isConfession ? 'confession' : 'meditation'}; it does not
                mean this is how you will be identified publicly.
              </p>
            </div>
            <TextAreaField
              label="About you"
              name="aboutYou"
              placeholder="Optional"
              control={control}
              rows={8}
            />
            <InputField
              label="Name on the cover (optional)"
              name="coverName"
              placeholder="First name or pseudonym"
              control={control}
            />
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-4">
            {isConfession ? (
              <>
                <h3 className="font-sans text-sm font-bold text-[#1A1A1A]">
                  Who do we meet in the confession?
                </h3>
                <p className="font-sans text-sm leading-relaxed text-[#666]">
                  The main character can be you, a version of you, or someone else. Sometimes
                  changing details creates just enough distance to make a difficult confession
                  possible.
                </p>
                <p className="font-sans text-sm leading-relaxed text-[#666]">
                  Tell us anything useful: name/pseudonym, age, gender, location, background,
                  occupation, relationship situation, sexual orientation, personality, interests,
                  lifestyle, dreams, fears, etc.
                </p>
                <p className="font-sans text-xs leading-relaxed text-[#888]">
                  Again: nothing is required. More detail simply helps us make the confession vivid,
                  human and impactful — and helps us create the right cover.
                </p>
              </>
            ) : (
              <>
                <h3 className="font-sans text-sm font-bold text-[#1A1A1A]">
                  Bring the meditation alive
                </h3>
                <p className="font-sans text-sm leading-relaxed text-[#666]">
                  What should the listener experience? Where does it take them? What should they
                  feel, see, imagine or transform?
                </p>
                <p className="font-sans text-sm leading-relaxed text-[#666]">
                  Give us any context, atmosphere, characters, setting, fantasy, emotion or imagery
                  that helps us make it powerful.
                </p>
              </>
            )}
            <TextAreaField
              label={isConfession ? 'About the main character' : 'Context and atmosphere'}
              name="context"
              placeholder="Optional"
              control={control}
              rows={8}
            />
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-5">
            <p className="font-sans text-sm font-bold text-[#1A1A1A]">Choose one</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setValue('voiceMode', 'our_voice')}
                className={cn(
                  'rounded-lg border-2 px-4 py-3 text-left font-sans text-sm font-semibold',
                  voiceMode === 'our_voice'
                    ? 'border-[#EEA13D] text-[#1A1A1A]'
                    : 'border-[#EBE4D5] text-[#666]',
                )}
              >
                Our voice
              </button>
              <button
                type="button"
                onClick={() => setValue('voiceMode', 'own_narration')}
                className={cn(
                  'rounded-lg border-2 px-4 py-3 text-left font-sans text-sm font-semibold',
                  voiceMode === 'own_narration'
                    ? 'border-[#EEA13D] text-[#1A1A1A]'
                    : 'border-[#EBE4D5] text-[#666]',
                )}
              >
                My own narration
              </button>
            </div>

            {voiceMode === 'our_voice' ? (
              <div className="space-y-3">
                <label className="block font-sans text-sm font-semibold">Select a voice</label>
                {isVoicesLoading ? (
                  <p className="font-sans text-xs text-[#888]">Loading voices…</p>
                ) : (
                  <div className="space-y-2">
                    {voices.map((voice) => {
                      const selected = voiceName === voice.name;
                      const playing = playingName === voice.name;
                      return (
                        <div
                          key={voice.name}
                          className="flex items-center gap-3 rounded-md border border-[#B39B7F] px-4 py-3"
                        >
                          <button
                            type="button"
                            onClick={() => setValue('voiceName', voice.name)}
                            className="flex min-w-0 flex-1 items-center gap-3 text-left"
                          >
                            <span
                              className={cn(
                                'size-5 rounded-full border-2 border-[#EEA13D]',
                                selected && 'bg-[#EEA13D]',
                              )}
                            />
                            <span>
                              <span className="block font-sans text-sm font-bold">
                                {voice.label}
                              </span>
                              <span className="block font-sans text-xs text-[#666]">
                                {voice.description}
                              </span>
                            </span>
                          </button>
                          {voice.preview_url ? (
                            <button
                              type="button"
                              onClick={() => handlePreview(voice.name, voice.preview_url)}
                              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#E8DFD4]"
                              aria-label={
                                playing ? `Pause ${voice.label}` : `Listen to ${voice.label}`
                              }
                            >
                              {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
                            </button>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                )}
                <p className="font-sans text-xs text-[#888]">Every voice has a Listen button.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="font-sans text-sm text-[#666]">
                  Upload your finished audio recording. We will not generate a new narration.
                </p>
                <input
                  type="file"
                  accept="audio/mpeg,audio/wav,audio/mp4,audio/x-m4a,audio/ogg,audio/webm,.mp3,.wav,.m4a,.ogg,.webm"
                  onChange={(event) => handleAudioFile(event.target.files?.[0] || null)}
                  className="block w-full font-sans text-sm"
                />
                {audioFile ? (
                  <p className="font-sans text-xs text-[#666]">Selected: {audioFile.name}</p>
                ) : null}
              </div>
            )}
          </div>
        ) : null}

        {step === 4 ? (
          <div className="space-y-6">
            <div className="rounded-lg border-2 border-[#D22D4C]/40 bg-[#D22D4C]/5 p-4">
              <p className="font-sans text-sm font-bold text-[#D22D4C]">Explicit is welcome.</p>
              <p className="mt-2 font-sans text-sm leading-relaxed text-[#503225]">
                You can use explicit language and describe consensual sexuality, desires and
                fantasies. A meditation can also be sensual or explicitly sexual.
              </p>
              <p className="mt-2 font-sans text-sm leading-relaxed text-[#503225]">
                Consent is essential. No sexual violence, coercion or non-consensual sexual content.
                No violence.
              </p>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#B39B7F] p-4">
              <input
                type="checkbox"
                checked={editorialConsent}
                onChange={(event) => setValue('editorialConsent', event.target.checked)}
                className="mt-1 size-4 shrink-0"
              />
              <span className="space-y-2 font-sans text-sm leading-relaxed text-[#503225]">
                <span className="block font-bold">Before you submit</span>
                <span className="block">
                  Transform to Liberation is an editorial platform, not a self-publishing platform.
                </span>
                <span className="block">
                  We may rewrite, shorten, restructure or substantially change your Confession or
                  Meditation. We do this to create something we believe our audience will love.
                </span>
                <span className="block">
                  You may dislike some of our changes. That&apos;s okay. You can withdraw your
                  submission if you don&apos;t want our edited version published.
                </span>
                <span className="block">
                  Publication can take up to two months. Sometimes we&apos;re overloaded, or we
                  receive many submissions about the same subject. Submission does not guarantee
                  publication.
                </span>
                <span className="block">
                  We create the cover artwork based on the information you provide.
                </span>
              </span>
            </label>
          </div>
        ) : null}

        <div className="flex gap-3 pt-2">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep((current) => current - 1)}
              className="flex-1 rounded-none border-2 border-[#B39B7F] py-2.5 font-sans text-sm font-semibold text-[#503225] uppercase"
            >
              Back
            </button>
          ) : null}
          {step < STEP_LABELS.length - 1 ? (
            <div className="flex-1">
              <DynamicActionButton text="Continue" onClick={goNext} fullWidth />
            </div>
          ) : (
            <div className="flex-1">
              <DynamicActionButton
                text={isGenerating ? 'Submitting…' : 'Submit'}
                type="submit"
                disabled={isGenerating || !editorialConsent}
                fullWidth
              />
            </div>
          )}
        </div>
      </form>

      <SuccessModal isOpen={isSuccess} onClose={() => setIsSuccess(false)} category={category} />
    </>
  );
}
