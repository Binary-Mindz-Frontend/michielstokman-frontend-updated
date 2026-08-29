/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import InputField from '@/components/dashboard/Fields/InputField/InputField';
import TextAreaField from '@/components/dashboard/Fields/TextAreaField/TextAreaField';
import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import { cn } from '@/lib/utils';
import { useGenerateStoryMutation, useGetVoicesQuery } from '@/redux/features/aiStory/aiStory.api';
import { appToast } from '@/utils/appToast';
import { appendStoryPayloadToFormData, type CoverImageMode } from '@/utils/storyGenerate.utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pause, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import StoryCoverPicker from '../StoryCoverPicker/StoryCoverPicker';
import SuccessModal from '../SuccessModal/SuccessModal';
import { countWords } from '../submitStory.utils';

const CONFESSION_MIN_WORDS = 1000;
const CONFESSION_MAX_WORDS = 1800;
const MEDITATION_MAX_WORDS = 1800;

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'This field is required'),
  name: z.string().min(1, 'Name is required'),
  location: z.string().min(1, 'Location is required'),
  gender: z.string().min(1, 'Gender is required'),
  occupation: z.string().min(1, 'Occupation is required'),
  age: z
    .string()
    .trim()
    .min(1, 'Age is required')
    .refine((value) => {
      const parsed = Number(value);
      return Number.isInteger(parsed) && parsed >= 1 && parsed <= 120;
    }, 'Enter a valid age'),
  voiceName: z.string().min(1, 'Choose a voice'),
  editorialConsent: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

const STEP_LABELS = ['Your piece', 'Who this is about', 'Voice', 'Cover', 'Review & submit'];

export default function SubmitWizard({ category }: { category: string }) {
  const router = useRouter();
  const isConfession = category === 'Confessions';
  const [step, setStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [coverMode, setCoverMode] = useState<CoverImageMode>('ai_generated');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverError, setCoverError] = useState<string | null>(null);
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
      name: '',
      location: '',
      gender: '',
      occupation: '',
      age: '',
      voiceName: '',
      editorialConsent: false,
    },
  });

  const bodyValue = watch('body') || '';
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
    if (index === 1) {
      const ok = await trigger(['name', 'location', 'gender', 'occupation', 'age']);
      if (!ok) {
        appToast.error('Please complete who this piece is about.');
        return false;
      }
      return true;
    }
    if (index === 2) {
      if (!voiceName) {
        appToast.error('Choose a voice for the finished piece.');
        return false;
      }
      return true;
    }
    if (index === 3) {
      if (coverMode === 'user_uploaded' && !coverFile) {
        setCoverError('Upload a cover image or switch to Generate for me.');
        appToast.error('Upload a cover image or switch to Generate for me.');
        return false;
      }
      setCoverError(null);
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
    const voiceOk = await validateStep(2);
    if (!voiceOk) {
      setStep(2);
      return;
    }
    const coverOk = await validateStep(3);
    if (!coverOk) {
      setStep(3);
      return;
    }
    if (!data.editorialConsent) {
      appToast.error('Please confirm you understand how editorial review works before submitting.');
      return;
    }

    const payload: Record<string, unknown> = {
      story_type: isConfession ? 'confession' : 'meditation',
      title: data.title,
      first_name: data.name.trim(),
      location: data.location.trim(),
      gender: data.gender.trim(),
      occupation: data.occupation.trim(),
      age: Number(data.age),
      story_input: data.body.trim(),
      image_mode: coverMode,
    };

    if (data.voiceName) {
      payload.voice_name = data.voiceName;
    }

    const needsMultipart = coverMode === 'user_uploaded' && coverFile;

    try {
      let res;
      if (needsMultipart) {
        const formData = new FormData();
        appendStoryPayloadToFormData(formData, payload);
        if (coverFile) {
          formData.append('image', coverFile);
        }
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

  const stepTitle = isConfession
    ? ['Your confession', 'Who we meet', 'Voice', 'Cover', 'Review & submit']
    : ['Your meditation', 'Who this is about', 'Voice', 'Cover', 'Review & submit'];

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
                {isConfession
                  ? 'Who do we meet in the confession?'
                  : 'Who is this meditation about?'}
              </h3>
              <p className="font-sans text-sm leading-relaxed text-[#666]">
                These details appear on the public story page — name, place, gender, occupation, and
                age, stacked under the title.
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
            <InputField
              label="Location"
              name="location"
              placeholder="Place the story started or is set"
              control={control}
              error={errors.location?.message}
              required
            />
            <InputField
              label="Gender"
              name="gender"
              placeholder="e.g. Woman, Queer (bi)"
              control={control}
              error={errors.gender?.message}
              required
            />
            <InputField
              label="Occupation"
              name="occupation"
              placeholder="e.g. Mother, teacher"
              control={control}
              error={errors.occupation?.message}
              required
            />
            <InputField
              label="Age"
              name="age"
              type="number"
              placeholder="e.g. 37"
              control={control}
              error={errors.age?.message}
              required
            />
          </div>
        ) : null}

        {step === 2 ? (
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

        {step === 3 ? (
          <div className="space-y-4">
            <p className="font-sans text-sm leading-relaxed text-[#666]">
              Generate artwork after your story is written, or upload your own cover now. You can
              change it later from My Stories.
            </p>
            <StoryCoverPicker
              mode={coverMode}
              onModeChange={(mode) => {
                setCoverMode(mode);
                setCoverError(null);
              }}
              coverFile={coverFile}
              onFileChange={(file) => {
                setCoverFile(file);
                setCoverError(null);
              }}
              error={coverError ?? undefined}
            />
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
                  {coverMode === 'user_uploaded'
                    ? 'Your uploaded image will be the cover. You can replace it later from My Stories.'
                    : 'We create the cover artwork from your story and the identity you provided. You can upload a different image later from My Stories.'}
                </span>
                <span className="block">
                  We narrate the edited piece in the voice you chose. You can change the voice later
                  from My Stories.
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
