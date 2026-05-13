/* eslint-disable react-hooks/incompatible-library */
'use client';

import flower1Image from '@/assets/home/flower1.png';
import flower2Image from '@/assets/home/flower2.png';
import flower3Image from '@/assets/home/flower3.png';
import TextAreaField from '@/components/dashboard/Fields/TextAreaField/TextAreaField';
import DynamicSectionHeader from '@/components/main/DynamicSectionHeader/DynamicSectionHeader';
import GrowthSlider from '@/components/main/GrowthSlider/GrowthSlider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { JOURNEY } from './data/Journey.data';

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase =
  | 'landing'
  | 'before-begin'
  | 'day-checkin'
  | 'exercise'
  | 'reflection'
  | 'day-complete'
  | 'overview'
  | 'liberation-complete';

// ─── Zod Schemas ──────────────────────────────────────────────────────────────
const checkinSchema = z.object({
  feeling: z.string().optional(),
});
type CheckinData = z.infer<typeof checkinSchema>;

const reflectionSchema = z.object({
  energyLevel: z.number().min(0).max(10),
  whatOpened: z.string().optional(),
  keyTakeaway: z.string().optional(),
});
type ReflectionData = z.infer<typeof reflectionSchema>;

// ─── Google Calendar URL builder ──────────────────────────────────────────────
function buildGoogleCalendarUrl(title: string, reminderTime: string, days = 7) {
  const [hours, minutes] = reminderTime.split(':').map(Number);
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
  const end = new Date(start.getTime() + 10 * 60 * 1000);
  const recEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + days - 1);

  const pad = (n: number) => String(n).padStart(2, '0');
  const fmtDT = (d: Date) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  const fmtD = (d: Date) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `🌿 ${title} — Daily Practice`,
    dates: `${fmtDT(start)}/${fmtDT(end)}`,
    details: `Your daily practice reminder for the "${title}" liberation journey?. Take 3 minutes for yourself today.`,
    recur: `RRULE:FREQ=DAILY;COUNT=${days};UNTIL=${fmtD(recEnd)}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// ─── Step Progress Bar ────────────────────────────────────────────────────────
function StepBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="mb-8 flex gap-3">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-0.75 flex-1 rounded-full transition-all duration-500',
            i < current ? 'bg-primary' : 'bg-primary/25',
          )}
        />
      ))}
    </div>
  );
}

// ─── Exercise Image Placeholder ───────────────────────────────────────────────
function ExerciseImage() {
  return (
    <div className="mb-6 overflow-hidden rounded-lg bg-[#F0EBE0]" style={{ minHeight: 200 }}>
      <div className="flex h-52 items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-[#C4855A]/40">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M21 15l-5-5L5 21"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-xs">Exercise illustration</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function JourneyPage() {
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>('landing');
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [timerRunning, setTimerRunning] = useState(false);

  // ── Before You Begin state ──
  const [checkedPreps, setCheckedPreps] = useState<string[]>([]);
  const [selectedReminder, setSelectedReminder] = useState('early-bird');
  const [calendarAdded, setCalendarAdded] = useState(false);

  const currentDay = JOURNEY?.days[currentDayIndex];
  const currentExercise = currentDay?.exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === currentDay?.exercises.length - 1;
  const totalSteps = 1 + (currentDay?.exercises.length ?? 0);
  const currentStep = phase === 'day-checkin' ? 1 : 2 + currentExerciseIndex;

  const allPrepsChecked = checkedPreps.length === JOURNEY?.preparations.length;

  // ── Checkin Form ──
  const checkinForm = useForm<CheckinData>({
    resolver: zodResolver(checkinSchema),
    mode: 'onChange',
    defaultValues: { feeling: '' },
  });

  // ── Reflection Form ──
  const reflectionForm = useForm<ReflectionData>({
    resolver: zodResolver(reflectionSchema),
    mode: 'onChange',
    defaultValues: { energyLevel: 5, whatOpened: '', keyTakeaway: '' },
  });

  const energyLevel = reflectionForm.watch('energyLevel');

  // ── Handlers ──
  const handleBeginLiberation = () => setPhase('before-begin');

  const togglePrep = (id: string) => {
    setCheckedPreps((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  const handleAddToCalendar = () => {
    const reminder = JOURNEY?.reminders.find((r) => r.id === selectedReminder);
    if (!reminder) return;
    const url = buildGoogleCalendarUrl(JOURNEY?.title, reminder.time);
    window.open(url, '_blank', 'noopener,noreferrer');
    setCalendarAdded(true);
  };

  const handleStartDay = () => {
    checkinForm.reset({ feeling: '' });
    setCurrentExerciseIndex(0);
    setPhase('day-checkin');
  };

  const handleBeginExercises = () => setPhase('exercise');

  const handleNextExercise = () => {
    if (isLastExercise) {
      reflectionForm.reset({ energyLevel: 5, whatOpened: '', keyTakeaway: '' });
      setPhase('reflection');
    } else {
      setCurrentExerciseIndex((i) => i + 1);
    }
  };

  const handleCompleteDay = reflectionForm.handleSubmit(() => {
    setCompletedDays((prev) => [...prev, currentDayIndex]);
    setPhase('day-complete');
  });

  const handleContinueAfterDay = () => {
    if (currentDayIndex === JOURNEY?.days.length - 1) {
      setPhase('liberation-complete');
    } else {
      setPhase('overview');
    }
  };

  const handleStartNextDay = (dayIndex: number) => {
    if (completedDays.includes(dayIndex)) return;
    if (dayIndex !== 0 && !completedDays.includes(dayIndex - 1)) return;
    setCurrentDayIndex(dayIndex);
    setCurrentExerciseIndex(0);
    setPhase('day-checkin');
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // SCREEN: LANDING
  // ─────────────────────────────────────────────────────────────────────────────
  if (phase === 'landing') {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12">
        <button
          onClick={() => router.back()}
          className="text-primary mb-4 flex cursor-pointer items-center gap-1 text-sm transition-opacity hover:opacity-80"
        >
          ← Back
        </button>
        <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center text-center">
          <div className="mb-8">
            <Image
              src={flower1Image}
              width={400}
              height={400}
              alt="Flower"
              className="h-full w-full max-w-100"
            />
          </div>
          <h1 className="text-dark-primary mb-3 font-serif text-3xl font-bold md:text-4xl">
            {JOURNEY?.title}
          </h1>
          <p className="text-secondary mb-2 text-sm">{JOURNEY?.subtitle}</p>
          <p className="text-secondary mb-10 text-sm">{JOURNEY?.stats}</p>
          <Button onClick={handleBeginLiberation} className="btn-styles w-fit px-6">
            Begin Your Liberation
          </Button>
        </div>
      </section>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SCREEN: BEFORE YOU BEGIN
  // ─────────────────────────────────────────────────────────────────────────────
  if (phase === 'before-begin') {
    return (
      <section className="mx-auto min-h-screen max-w-2xl px-4 py-12">
        <button
          onClick={() => setPhase('landing')}
          className="text-primary mb-8 flex cursor-pointer items-center gap-1 text-sm transition-opacity hover:opacity-80"
        >
          ← Back
        </button>

        <div>
          <DynamicSectionHeader
            title="Before You Begin"
            description="Set yourself up for 7 days of gentle liberation."
          />

          {/* ── Preparation Checklist — selectable ── */}
          <div className="space-y-3">
            {JOURNEY?.preparations.map((prep) => {
              const isChecked = checkedPreps.includes(prep.id);
              return (
                <button
                  key={prep.id}
                  type="button"
                  onClick={() => togglePrep(prep.id)}
                  className={cn(
                    'flex w-full cursor-pointer items-center justify-between rounded-md border px-5 py-4 text-left text-sm transition-all duration-200',
                    isChecked
                      ? 'border-primary/40 bg-primary/5 text-primary'
                      : 'border-primary/15 text-dark-primary hover:border-primary/30',
                  )}
                >
                  <span>{prep.label}</span>
                  <span
                    className={cn(
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200',
                      isChecked
                        ? 'border-primary bg-primary text-white'
                        : 'border-primary/25 bg-transparent',
                    )}
                  >
                    {isChecked && <Check size={11} strokeWidth={3} />}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ── Daily Reminders ── */}
          <div className="border-primary/15 mt-6 rounded-md border p-4">
            <p className="text-dark-primary mb-4 font-medium">Daily Reminders</p>
            <div className="space-y-2">
              {JOURNEY?.reminders.map((reminder) => (
                <button
                  key={reminder.id}
                  type="button"
                  onClick={() => setSelectedReminder(reminder.id)}
                  className={cn(
                    'w-full cursor-pointer rounded-sm border px-5 py-3 text-left text-sm transition-all duration-200',
                    selectedReminder === reminder.id
                      ? 'border-primary/40 bg-primary/5 text-primary'
                      : 'border-primary/15 text-dark-primary hover:border-primary/30',
                  )}
                >
                  {reminder.label}
                </button>
              ))}
            </div>

            {/* ── Add To Calendar — Google Calendar ── */}
            <Button
              type="button"
              onClick={handleAddToCalendar}
              className={cn(
                'mt-4 w-full rounded-md border bg-transparent py-4 text-sm transition-all hover:bg-transparent',
                calendarAdded
                  ? 'border-primary/40 text-primary'
                  : 'border-primary/20 text-primary hover:border-primary/40',
              )}
            >
              {calendarAdded ? '✓ Added to Google Calendar' : 'Add To Calendar'}
            </Button>
          </div>

          {/* ── Start Day 1 — disabled until all 3 checked ── */}
          <Button onClick={handleStartDay} disabled={!allPrepsChecked} className="btn-styles mt-6">
            {allPrepsChecked
              ? 'Start Day 1'
              : `Check ${JOURNEY?.preparations.length - checkedPreps.length} item${JOURNEY?.preparations.length - checkedPreps.length === 1 ? '' : 's'} above`}
          </Button>
        </div>
      </section>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SCREEN: DAY CHECK-IN
  // ─────────────────────────────────────────────────────────────────────────────
  if (phase === 'day-checkin') {
    return (
      <section className="mx-auto min-h-screen max-w-3xl px-4 py-12">
        <button
          onClick={() => setPhase(currentDayIndex === 0 ? 'before-begin' : 'overview')}
          className="text-primary mb-4 flex cursor-pointer items-center gap-1 text-sm transition-opacity hover:opacity-80"
        >
          ← Back
        </button>
        <StepBar current={currentStep} total={totalSteps} />

        <div>
          <div className="mb-8 text-center">
            <p className="text-primary mb-1 text-sm">Day {currentDay.day}</p>
            <h1 className="text-dark-primary font-serif text-2xl font-semibold md:text-3xl">
              {currentDay.title}
            </h1>
          </div>

          <form onSubmit={checkinForm.handleSubmit(handleBeginExercises)} className="space-y-6">
            <TextAreaField
              label={currentDay.checkinPrompt}
              name="feeling"
              control={checkinForm.control}
              placeholder="A word or two is enough"
              rows={4}
            />
            <Button type="submit" className="btn-styles">
              Begin Exercises →
            </Button>
          </form>
        </div>
      </section>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SCREEN: EXERCISE
  // ─────────────────────────────────────────────────────────────────────────────
  if (phase === 'exercise' && currentExercise) {
    return (
      <section className="mx-auto min-h-screen max-w-3xl px-4 py-12">
        <button
          onClick={() =>
            currentExerciseIndex === 0
              ? setPhase('day-checkin')
              : setCurrentExerciseIndex((i) => i - 1)
          }
          className="text-primary mb-4 flex cursor-pointer items-center gap-1 text-sm transition-opacity hover:opacity-80"
        >
          ← Back
        </button>
        <StepBar current={currentStep} total={totalSteps} />

        <div>
          <p className="text-primary mb-4 text-sm font-medium">{currentExercise.type}</p>

          <ExerciseImage />

          <h2 className="text-dark-primary mb-3 font-serif text-xl font-bold">
            {currentExercise.title}
          </h2>

          <div className="border-primary/10 bg-primary/5 mb-5 rounded-md border px-4 py-3 text-sm text-[#7A6155] italic">
            {currentExercise.quote}
          </div>

          <h3 className="text-dark-primary mb-2 font-semibold">What to do</h3>
          <p className="text-secondary mb-4 text-sm leading-relaxed">{currentExercise.whatToDo}</p>

          <ol className="text-secondary mb-6 space-y-1.5 text-sm">
            {currentExercise.steps.map((step, i) => (
              <li key={i}>
                {i + 1}. {step}
              </li>
            ))}
          </ol>

          <h3 className="text-dark-primary mb-2 font-semibold">Why this exercise</h3>
          <p className="text-secondary mb-8 text-sm leading-relaxed">{currentExercise.whyThis}</p>

          <div className="mb-6 flex items-center justify-between">
            <span className="text-secondary text-sm">{currentExercise.duration}</span>
            <Button
              type="button"
              onClick={() => setTimerRunning(!timerRunning)}
              className={cn(
                'rounded-md border bg-transparent px-5 py-2 text-sm transition-all hover:bg-transparent',
                timerRunning
                  ? 'border-primary/50 text-primary'
                  : 'border-primary/20 text-secondary',
              )}
            >
              {timerRunning ? 'Stop Timer' : 'Start Timer'}
            </Button>
          </div>

          <Button onClick={handleNextExercise} className="btn-styles">
            {isLastExercise ? 'Complete & Reflect' : 'Done — Next Exercise →'}
          </Button>
        </div>
      </section>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SCREEN: REFLECTION
  // ─────────────────────────────────────────────────────────────────────────────
  if (phase === 'reflection') {
    return (
      <section className="mx-auto min-h-screen max-w-3xl px-4 py-12">
        <button
          onClick={() => setPhase('exercise')}
          className="text-primary mb-8 flex cursor-pointer items-center gap-1 text-sm transition-opacity hover:opacity-80"
        >
          ← Back
        </button>
        <div>
          <div className="mb-8 text-center">
            <p className="text-primary mb-1 text-sm">Day {currentDay.day} Complete</p>
            <h1 className="text-dark-primary font-serif text-2xl font-semibold md:text-3xl">
              How did today land?
            </h1>
          </div>

          <form onSubmit={handleCompleteDay} className="space-y-6">
            <GrowthSlider
              label="Energy Level"
              value={energyLevel}
              onChange={(val) =>
                reflectionForm.setValue('energyLevel', val, { shouldValidate: true })
              }
            />

            <TextAreaField
              label="What opened today?"
              name="whatOpened"
              control={reflectionForm.control}
              placeholder="A feeling, a realization, a release"
              rows={4}
            />

            <TextAreaField
              label="One key takeaway"
              name="keyTakeaway"
              control={reflectionForm.control}
              placeholder="What will you carry forward"
              rows={4}
            />

            <Button type="submit" className="btn-styles">
              Complete Day {currentDay.day}
            </Button>
          </form>
        </div>
      </section>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SCREEN: DAY COMPLETE
  // ─────────────────────────────────────────────────────────────────────────────
  if (phase === 'day-complete') {
    return (
      <section className="mx-auto min-h-screen max-w-3xl px-4 py-12">
        <button
          onClick={() => setPhase('reflection')}
          className="text-primary mb-4 flex cursor-pointer items-center gap-1 text-sm transition-opacity hover:opacity-80"
        >
          ← Back
        </button>
        <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center text-center">
          <div className="mb-8">
            <Image
              src={flower2Image}
              width={400}
              height={400}
              alt="Flower"
              className="h-full w-full max-w-100"
            />
          </div>
          <h1 className="text-dark-primary mb-2 font-serif text-2xl font-semibold md:text-3xl">
            Day {currentDay.day} Complete
          </h1>
          <p className="text-secondary mb-6 max-w-xs text-sm leading-relaxed">
            You let go of another layer today — beautiful.
          </p>
          <Button onClick={handleContinueAfterDay} className="btn-styles w-fit px-6">
            Continue
          </Button>
        </div>
      </section>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SCREEN: OVERVIEW
  // ─────────────────────────────────────────────────────────────────────────────
  if (phase === 'overview') {
    return (
      <section className="mx-auto h-full max-w-3xl px-4 py-12">
        <button
          onClick={() => router.back()}
          className="text-primary mb-4 flex cursor-pointer items-center gap-1 text-sm transition-opacity hover:opacity-80"
        >
          ← Back
        </button>
        <div>
          <div className="mb-6 flex flex-col items-center text-center">
            <Image
              src={flower1Image}
              width={400}
              height={400}
              alt="Flower"
              className="h-full w-full max-w-100"
            />
            <p className="text-secondary mt-4 text-sm">
              {completedDays.length > 0
                ? `${completedDays.length * 7 + 42} others are on this liberation today`
                : '42 others are on this liberation today'}
            </p>
          </div>

          <div className="space-y-3">
            {JOURNEY?.days.map((day, i) => {
              const isCompleted = completedDays.includes(i);
              const isReadyToStart = i === 0 || completedDays.includes(i - 1);
              const isLocked = !isCompleted && !isReadyToStart;

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => !isLocked && !isCompleted && handleStartNextDay(i)}
                  disabled={isLocked}
                  className={cn(
                    'w-full rounded-md border px-5 py-4 text-left transition-all',
                    isCompleted && 'border-success/30 bg-success/10',
                    isReadyToStart &&
                      !isCompleted &&
                      'border-error/30 bg-error/5 hover:border-error/50 cursor-pointer',
                    isLocked && 'border-primary/10 cursor-default bg-transparent opacity-60',
                  )}
                >
                  <p
                    className={cn(
                      'font-medium',
                      isCompleted && 'text-success',
                      isReadyToStart && !isCompleted && 'text-dark-primary',
                      isLocked && 'text-secondary',
                    )}
                  >
                    Day {day.day}: {day.title}
                  </p>
                  <p
                    className={cn(
                      'mt-0.5 text-sm',
                      isCompleted && 'text-success',
                      isReadyToStart && !isCompleted && 'text-primary',
                      isLocked && 'text-secondary',
                    )}
                  >
                    {isCompleted ? 'Completed' : isReadyToStart ? 'Ready to Start' : 'Locked'}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SCREEN: LIBERATION COMPLETE
  // ─────────────────────────────────────────────────────────────────────────────
  if (phase === 'liberation-complete') {
    return (
      <section className="mx-auto min-h-screen max-w-3xl px-4 py-12">
        <button
          onClick={() => setPhase('overview')}
          className="text-primary mb-4 flex cursor-pointer items-center gap-1 text-sm transition-opacity hover:opacity-80"
        >
          ← Back
        </button>
        <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center text-center">
          <div className="mb-8">
            <Image
              src={flower3Image}
              width={400}
              height={400}
              alt="Flower"
              className="h-full w-full max-w-100"
            />
          </div>
          <h1 className="text-dark-primary mb-3 font-serif text-2xl font-bold md:text-3xl">
            Your Liberation is Complete 🌸
          </h1>
          <p className="text-secondary mb-10 max-w-xs text-sm leading-relaxed">
            Seven days of showing up for yourself. Seven petals bloomed. This energy is yours to
            keep.
          </p>
          <div className="w-full max-w-sm space-y-3">
            <Button
              type="button"
              onClick={() => {
                setCompletedDays([]);
                setCurrentDayIndex(0);
                setCurrentExerciseIndex(0);
                setCheckedPreps([]);
                setCalendarAdded(false);
                setPhase('landing');
              }}
              className="border-primary/20 text-primary w-full rounded-md border bg-transparent py-5 text-sm hover:bg-transparent"
            >
              Repeat This Liberation
            </Button>
            <Button type="button" onClick={() => router.push('/')} className="btn-styles">
              Explore More Liberations
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return null;
}
