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
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import SuccessModal from '../SuccessModal/SuccessModal';
import { countWords } from '../submitStory.utils';

const CONFESSION_MIN_WORDS = 1000;
const CONFESSION_MAX_WORDS = 1800;
const MEDITATION_MAX_WORDS = 1800;
const MAX_AUDIO_BYTES = 10 * 1024 * 1024;
const AUDIO_ACCEPT =
  'audio/mpeg,audio/wav,audio/mp4,audio/x-m4a,audio/ogg,audio/webm,.mp3,.wav,.m4a,.ogg,.webm';

const schema = z.object({
  submissionMode: z.enum(['studio', 'human_ready']),
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'This field is required'),
  name: z.string().min(1, 'Name is required'),
  city: z.string(),
  country: z.string(),
  gender: z.string(),
  sexualOrientation: z.string(),
  occupation: z.string(),
  age: z
    .string()
    .trim()
    .refine((value) => {
      if (!value) return true;
      const parsed = Number(value);
      return Number.isInteger(parsed) && parsed >= 1 && parsed <= 120;
    }, 'Enter a valid age'),
  background: z.string(),
  personality: z.string(),
  lifestyle: z.string(),
  situation: z.string(),
  highIntensity: z.boolean(),
  voiceName: z.string(),
  editorialConsent: z.boolean(),
  termsAccepted: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

const STEP_LABELS = [
  'How you’ll submit',
  'Your piece',
  'Who this is about',
  'Voice',
  'Review & submit',
];

function optionalText(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

export default function SubmitWizard({ category }: { category: string }) {
  const router = useRouter();
  const isConfession = category === 'Confessions';
  const [step, setStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
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
      submissionMode: 'studio',
      title: '',
      body: '',
      name: '',
      city: '',
      country: '',
      gender: '',
      sexualOrientation: '',
      occupation: '',
      age: '',
      background: '',
      personality: '',
      lifestyle: '',
      situation: '',
      highIntensity: false,
      voiceName: '',
      editorialConsent: false,
      termsAccepted: false,
    },
  });

  const bodyValue = watch('body') || '';
  const voiceName = watch('voiceName');
  const submissionMode = watch('submissionMode');
  const editorialConsent = watch('editorialConsent');
  const termsAccepted = watch('termsAccepted');
  const isStudio = submissionMode === 'studio';
  const wordCount = countWords(bodyValue);

  useEffect(() => {
    if (!isStudio || !voices.length || voiceName) return;
    const fallback =
      voices.find((voice) => voice.name === voicesCatalog?.default_voice) || voices[0];
    if (fallback) setValue('voiceName', fallback.name);
  }, [isStudio, voices, voicesCatalog?.default_voice, voiceName, setValue]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const validateStep = async (index: number) => {
    if (index === 0) {
      if (!submissionMode) {
        appToast.error('Choose how you want to submit.');
        return false;
      }
      return true;
    }
    if (index === 1) {
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
    if (index === 2) {
      const ok = await trigger(['name', 'age']);
      if (!ok) {
        appToast.error(errors.name?.message || errors.age?.message || 'Please add a name.');
        return false;
      }
      return true;
    }
    if (index === 3) {
      if (isStudio) {
        if (!voiceName) {
          appToast.error('Choose a voice for the finished piece.');
          return false;
        }
        return true;
      }
      if (!audioFile) {
        setAudioError('Upload the finished narration.');
        appToast.error('Upload the finished narration.');
        return false;
      }
      setAudioError(null);
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
    const pieceOk = await validateStep(1);
    if (!pieceOk) {
      setStep(1);
      return;
    }
    const identityOk = await validateStep(2);
    if (!identityOk) {
      setStep(2);
      return;
    }
    const voiceOk = await validateStep(3);
    if (!voiceOk) {
      setStep(3);
      return;
    }
    if (!data.termsAccepted) {
      appToast.error('Please agree to the Terms & Conditions before submitting.');
      return;
    }
    if (isStudio && !data.editorialConsent) {
      appToast.error('Please confirm you understand how editorial review works before submitting.');
      return;
    }

    const payload: Record<string, unknown> = {
      story_type: isConfession ? 'confession' : 'meditation',
      title: data.title,
      first_name: data.name.trim(),
      city: optionalText(data.city),
      country: optionalText(data.country),
      // Joined for older API deployments that still only read `location`.
      location:
        [optionalText(data.city), optionalText(data.country)].filter(Boolean).join(', ') ||
        undefined,
      gender: optionalText(data.gender),
      sexual_orientation: optionalText(data.sexualOrientation),
      occupation: optionalText(data.occupation),
      story_input: data.body.trim(),
      background: optionalText(data.background),
      personality: optionalText(data.personality),
      lifestyle: optionalText(data.lifestyle),
      situation: optionalText(data.situation),
      high_intensity: data.highIntensity,
      submission_mode: data.submissionMode,
      image_mode: 'ai_generated',
    };

    if (data.age.trim()) {
      payload.age = Number(data.age);
    }

    try {
      let res;
      if (data.submissionMode === 'human_ready') {
        payload.skip_rewrite = true;
        payload.skip_narration = true;
        const formData = new FormData();
        appendStoryPayloadToFormData(formData, payload);
        if (audioFile) {
          formData.append('audio', audioFile);
        }
        res = await generateStory(formData).unwrap();
      } else {
        if (data.voiceName) {
          payload.voice_name = data.voiceName;
        }
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

  const handleAudioChange = (file: File | null) => {
    if (!file) {
      setAudioFile(null);
      setAudioError(null);
      return;
    }
    if (file.size > MAX_AUDIO_BYTES) {
      setAudioFile(null);
      setAudioError('Narration must be 10 MB or smaller.');
      appToast.error('Narration must be 10 MB or smaller.');
      return;
    }
    setAudioFile(file);
    setAudioError(null);
  };

  const stepTitle = isConfession
    ? [
        'How you’ll submit',
        'Your confession',
        'Who we meet',
        isStudio ? 'Voice' : 'Your narration',
        'Review & submit',
      ]
    : [
        'How you’ll submit',
        'Your meditation',
        'Who this is about',
        isStudio ? 'Voice' : 'Your narration',
        'Review & submit',
      ];

  const canSubmit = termsAccepted && (isStudio ? editorialConsent : true) && !isGenerating;

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
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-sans text-sm font-bold text-[#1A1A1A]">How you’ll submit</h3>
              <p className="font-sans text-sm leading-relaxed text-[#666]">
                Choose one path. You can still withdraw later from My Stories.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setValue('submissionMode', 'studio')}
              className={cn(
                'w-full rounded-lg border p-4 text-left',
                isStudio ? 'border-[#EEA13D] bg-[#EEA13D]/10' : 'border-[#B39B7F]',
              )}
            >
              <span className="block font-sans text-sm font-bold text-[#1A1A1A]">
                Confession/meditation + Studio Voice
              </span>
              <span className="mt-1 block font-sans text-sm leading-relaxed text-[#666]">
                You submit the text. We edit it, then narrate the finished piece in one of our four
                studio voices.
              </span>
            </button>
            <button
              type="button"
              onClick={() => setValue('submissionMode', 'human_ready')}
              className={cn(
                'w-full rounded-lg border p-4 text-left',
                !isStudio ? 'border-[#EEA13D] bg-[#EEA13D]/10' : 'border-[#B39B7F]',
              )}
            >
              <span className="block font-sans text-sm font-bold text-[#1A1A1A]">
                Fully narrated confession/meditation
              </span>
              <span className="mt-1 block font-sans text-sm leading-relaxed text-[#666]">
                You submit a complete script and a complete narration in your own voice. We do not
                rewrite it or replace your voice. It is reviewed as submitted and either published
                or not accepted.
              </span>
            </button>
          </div>
        ) : null}

        {step === 1 ? (
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

        {step === 2 ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-sans text-sm font-bold text-[#1A1A1A]">
                {isConfession
                  ? 'Who do we meet in the confession?'
                  : 'Who is this meditation about?'}
              </h3>
              <p className="font-sans text-sm leading-relaxed text-[#666]">
                Name is required. Skip anything you don&apos;t want to share. Name, gender, city and
                country also determine the cover portrait, the name on the tape, and the
                narrator&apos;s voice.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="font-sans text-xs font-bold tracking-wider text-[#8A6E5F] uppercase">
                  On the story card
                </h4>
                <p className="font-sans text-xs leading-relaxed text-[#888]">
                  Shown publicly on the finished confession or meditation.
                </p>
              </div>
              <InputField
                label="Name"
                name="name"
                placeholder="First name or pseudonym"
                control={control}
                error={errors.name?.message}
                required
              />
              <p className="font-sans text-xs leading-relaxed text-[#888]">
                Shown on the cover tape and is who this piece is narrated as.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <InputField
                    label="City"
                    name="city"
                    placeholder="e.g. Amsterdam"
                    control={control}
                    error={errors.city?.message}
                  />
                  <p className="font-sans text-xs leading-relaxed text-[#888]">
                    Sets the cover scene. Optional.
                  </p>
                </div>
                <div className="space-y-1">
                  <InputField
                    label="Country"
                    name="country"
                    placeholder="e.g. Netherlands"
                    control={control}
                    error={errors.country?.message}
                  />
                  <p className="font-sans text-xs leading-relaxed text-[#888]">
                    Used for the cover flag and setting. Optional.
                  </p>
                </div>
              </div>
              <InputField
                label="Gender / sex"
                name="gender"
                placeholder="e.g. Woman"
                control={control}
                error={errors.gender?.message}
              />
              <p className="font-sans text-xs leading-relaxed text-[#888]">
                Shapes the cover portrait and the narrator&apos;s voice. Optional.
              </p>
              <InputField
                label="Sexual orientation"
                name="sexualOrientation"
                placeholder="e.g. Queer, bisexual"
                control={control}
                error={errors.sexualOrientation?.message}
              />
              <InputField
                label="Occupation"
                name="occupation"
                placeholder="e.g. Mother, teacher"
                control={control}
                error={errors.occupation?.message}
              />
              <InputField
                label="Age"
                name="age"
                type="number"
                placeholder="e.g. 37"
                control={control}
                error={errors.age?.message}
              />
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#B39B7F] p-4">
                <input
                  type="checkbox"
                  className="mt-1 size-4 accent-[#301C05]"
                  checked={watch('highIntensity')}
                  onChange={(event) => setValue('highIntensity', event.target.checked)}
                />
                <span className="space-y-1">
                  <span className="block font-sans text-sm font-bold text-[#1A1A1A]">
                    Mark as explicit
                  </span>
                  <span className="block font-sans text-xs leading-relaxed text-[#666]">
                    Turn this on when the piece includes explicit sexual language or themes. Readers
                    can filter explicit stories out.
                  </span>
                </span>
              </label>
            </div>

            <div className="space-y-4 border-t border-[#E8DFD4] pt-5">
              <div className="space-y-1">
                <h4 className="font-sans text-xs font-bold tracking-wider text-[#8A6E5F] uppercase">
                  Character notes
                </h4>
                <p className="font-sans text-xs leading-relaxed text-[#888]">
                  Optional. Used to create the cover and help editorial — never shown on the public
                  card.
                </p>
              </div>
              <TextAreaField
                label="Background"
                name="background"
                placeholder="What should we know about their history?"
                control={control}
                rows={3}
              />
              <TextAreaField
                label="Personality"
                name="personality"
                placeholder="How they come across"
                control={control}
                rows={3}
              />
              <TextAreaField
                label="Lifestyle"
                name="lifestyle"
                placeholder="How they live day to day"
                control={control}
                rows={3}
              />
              <TextAreaField
                label="Situation"
                name="situation"
                placeholder="Where they are right now"
                control={control}
                rows={3}
              />
            </div>
          </div>
        ) : null}

        {step === 3 && isStudio ? (
          <div className="space-y-5">
            <div className="space-y-2">
              <h3 className="font-sans text-sm font-bold text-[#1A1A1A]">Who reads this</h3>
              <p className="font-sans text-sm leading-relaxed text-[#666]">
                After editorial rewrite, we narrate the finished piece in one of our voices. Choose
                one and listen first.
              </p>
            </div>
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
                          <span className="block font-sans text-sm font-bold">{voice.label}</span>
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
                          aria-label={playing ? `Pause ${voice.label}` : `Listen to ${voice.label}`}
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
        ) : null}

        {step === 3 && !isStudio ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-sans text-sm font-bold text-[#1A1A1A]">Your narration</h3>
              <p className="font-sans text-sm leading-relaxed text-[#666]">
                Upload the complete recording in your own voice. This is the published narration. We
                do not replace it with AI.
              </p>
            </div>
            <input
              type="file"
              accept={AUDIO_ACCEPT}
              onChange={(event) => handleAudioChange(event.target.files?.[0] ?? null)}
              className="block w-full font-sans text-sm text-[#503225]"
            />
            {audioFile ? <p className="font-sans text-xs text-[#666]">{audioFile.name}</p> : null}
            {audioError ? (
              <p className="font-sans text-xs font-semibold text-[#D22D4C]">{audioError}</p>
            ) : null}
            <p className="font-sans text-xs text-[#888]">
              mp3, wav, m4a, ogg or webm · up to 10 MB
            </p>
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

            <p className="font-sans text-sm leading-relaxed text-[#666]">
              We create the cover from the finished piece and the details you shared about this
              person. You can regenerate artwork later from My Stories.
            </p>

            {isStudio ? (
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
                    Transform to Liberation is an editorial platform, not a self-publishing
                    platform.
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
                    Publication can take up to two months. Submission does not guarantee
                    publication.
                  </span>
                  <span className="block">
                    We narrate the edited piece in the voice you chose. You can change the voice
                    later from My Stories.
                  </span>
                </span>
              </label>
            ) : (
              <p className="rounded-lg border border-[#B39B7F] p-4 font-sans text-sm leading-relaxed text-[#503225]">
                This submission is reviewed as you sent it — your text and your voice. If it is not
                publication-ready, it will not be published.
              </p>
            )}

            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#B39B7F] p-4">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(event) => setValue('termsAccepted', event.target.checked)}
                className="mt-1 size-4 shrink-0"
              />
              <span className="font-sans text-sm leading-relaxed text-[#503225]">
                I have read and agree to the{' '}
                <Link
                  href="/terms"
                  target="_blank"
                  className="font-bold underline underline-offset-2"
                >
                  Terms &amp; Conditions
                </Link>
                .
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
                disabled={!canSubmit}
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
