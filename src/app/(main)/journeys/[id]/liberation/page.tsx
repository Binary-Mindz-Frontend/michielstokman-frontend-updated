/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/incompatible-library */
'use client';

import BeforeYouBeginStep from './_components/BeforeYouBeginStep/BeforeYouBeginStep';
import DayCheckinStep from './_components/DayCheckinStep/DayCheckinStep';
import DayCompleteStep from './_components/DayCompleteStep/DayCompleteStep';
import ExerciseStep from './_components/ExerciseStep/ExerciseStep';
import JourneyBeginStep from './_components/JourneyBeginStep/JourneyBeginStep';
import JourneyOverviewStep from './_components/JourneyOverviewStep/JourneyOverviewStep';
import LiberationCompleteStep from './_components/LiberationCompleteStep/LiberationCompleteStep';
import ReflectionStep from './_components/ReflectionStep/ReflectionStep';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetLiberationDetailsQuery } from '@/redux/features/discoveryFeed/discoveryFeed.api';
import {
  useCompleteDayMutation,
  useEnrollJourneyMutation,
  useGenerateDayExerciseMutation,
  useGetDayExercisesQuery,
  useGetJourneyStatusQuery,
  useRepeatJourneyMutation,
} from '@/redux/features/liberation/liberation.api';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence } from 'framer-motion';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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

// ─── Main Component ───────────────────────────────────────────────────────────
export default function JourneyPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const journeyId = params?.id as string;

  const initialPhase = (searchParams.get('phase') as Phase) || 'landing';
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [timerRunning, setTimerRunning] = useState(false);

  // ── API Mutations & Queries ──
  const { data: detailsResponse, isError: isDetailsError } =
    useGetLiberationDetailsQuery(journeyId);
  const liberationDetails = detailsResponse?.data;
  const journeyCode = liberationDetails?.journey_code || journeyId;

  const { data: statusResponse, isError: isStatusError } = useGetJourneyStatusQuery(journeyCode, {
    skip: !journeyCode,
  });
  const journeyStatus = statusResponse?.data;

  const [completeDay, { isLoading: isCompleting }] = useCompleteDayMutation();
  const [enrollJourney, { isLoading: isEnrolling }] = useEnrollJourneyMutation();
  const [generateDayExercise, { isLoading: isGenerating }] = useGenerateDayExerciseMutation();
  const [repeatJourney, { isLoading: isRepeating }] = useRepeatJourneyMutation();

  // ── Sync completedDays from API ──
  useEffect(() => {
    if (journeyStatus?.steps) {
      const completedIndices: number[] = [];
      journeyStatus.steps.forEach((step: any, idx: number) => {
        if (step.status === 'completed') {
          completedIndices.push(idx);
        }
      });
      setCompletedDays(completedIndices);
    }
  }, [journeyStatus]);

  // Determine if the user is enrolled
  const isEnrolled =
    journeyStatus?.is_enrolled === true ||
    journeyStatus?.journey_status === 'active' ||
    (Array.isArray(journeyStatus?.steps) && journeyStatus.steps.length > 0);

  // Derive active phase immediately to prevent any split-second useEffect delay flicker
  const activePhase = phase === 'landing' && isEnrolled ? 'overview' : phase;

  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate state from localStorage on client mount
  useEffect(() => {
    if (journeyId) {
      try {
        const saved = localStorage.getItem(`liberation_state_${journeyId}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.phase) setPhase(parsed.phase);
          if (typeof parsed.currentDayIndex === 'number')
            setCurrentDayIndex(parsed.currentDayIndex);
          if (typeof parsed.currentExerciseIndex === 'number')
            setCurrentExerciseIndex(parsed.currentExerciseIndex);
        }
      } catch (e) {
        console.error('Failed to restore persisted liberation state:', e);
      } finally {
        setIsHydrated(true);
      }
    }
  }, [journeyId]);

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    if (journeyId && isHydrated) {
      try {
        const stateToPersist = {
          phase,
          currentDayIndex,
          currentExerciseIndex,
        };
        localStorage.setItem(`liberation_state_${journeyId}`, JSON.stringify(stateToPersist));
      } catch (e) {
        console.error('Failed to save persisted liberation state:', e);
      }
    }
  }, [phase, currentDayIndex, currentExerciseIndex, journeyId, isHydrated]);

  const [hasRestoredProgress, setHasRestoredProgress] = useState(false);

  // ── Restore progress phase on initial load if user is already enrolled ──
  useEffect(() => {
    if (journeyStatus && !hasRestoredProgress && phase === 'landing') {
      if (isEnrolled) {
        setPhase('overview');
      }
      setHasRestoredProgress(true);
    }
  }, [journeyStatus, phase, hasRestoredProgress, isEnrolled]);

  // ── Redirect to journey detail page if user does not have access ──
  useEffect(() => {
    if (detailsResponse && liberationDetails && liberationDetails.has_access === false) {
      router.replace(`/journeys/${journeyId}`);
    }
  }, [detailsResponse, liberationDetails, journeyId, router]);

  // ── Scroll to top on step transitions ──
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, [activePhase]);

  // ── Before You Begin state ──
  const [checkedPreps, setCheckedPreps] = useState<string[]>([]);
  const [selectedReminder, setSelectedReminder] = useState('early-bird');
  const [calendarAdded, setCalendarAdded] = useState(false);

  const currentDay = JOURNEY?.days[currentDayIndex];

  const { data: dayExercisesResponse } = useGetDayExercisesQuery(
    { journey_code: journeyCode, day: currentDay?.day },
    { skip: !journeyCode || !currentDay?.day },
  );
  const dayExercisesData = dayExercisesResponse?.data;

  // ── Timer State & Effects ──
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    let intervalId: any;
    if (timerRunning) {
      intervalId = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [timerRunning]);

  useEffect(() => {
    setTimerRunning(false);
    setSecondsElapsed(0);
  }, [currentExerciseIndex, phase]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins}:${remainderSecs.toString().padStart(2, '0')} min`;
  };

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

  const handleStartDay = async () => {
    try {
      if (journeyId) {
        await enrollJourney(journeyId).unwrap();
        // toast.success('Journey started successfully!');
      }
      checkinForm.reset({ feeling: '' });
      setCurrentExerciseIndex(0);
      setPhase('day-checkin');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to start journey. Please try again.');
      console.error('Enroll journey error:', error);
    }
  };

  const handleBeginExercises = async (data: CheckinData) => {
    try {
      if (journeyCode && currentDay?.day !== undefined) {
        await generateDayExercise({
          journey_code: journeyCode,
          day: currentDay.day,
          data: {
            morning_feeling: data.feeling || '',
          },
        }).unwrap();
      }
      setPhase('exercise');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to generate exercises. Please try again.');
      console.error('Generate exercise error:', error);
    }
  };

  const handleNextExercise = () => {
    reflectionForm.reset({ energyLevel: 5, whatOpened: '', keyTakeaway: '' });
    setPhase('reflection');
  };

  const handleCompleteDay = reflectionForm.handleSubmit(async (data) => {
    try {
      if (journeyCode) {
        await completeDay({
          journey_id: journeyCode,
          day: currentDay.day,
          data: {
            energy_level: data.energyLevel,
            what_opened: data.whatOpened || '',
            key_takeaway: data.keyTakeaway || '',
          },
        }).unwrap();
      }

      setCompletedDays((prev) => [...prev, currentDayIndex]);
      setPhase('day-complete');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to complete day. Please try again.');
      console.error('Complete day error:', error);
    }
  });

  const handleContinueAfterDay = () => {
    if (currentDayIndex === JOURNEY?.days.length - 1) {
      setPhase('liberation-complete');
    } else {
      setPhase('overview');
    }
  };

  const handleRepeatLiberation = async () => {
    try {
      if (journeyCode) {
        await repeatJourney(journeyCode).unwrap();
      }
      setCompletedDays([]);
      setCurrentDayIndex(0);
      setCurrentExerciseIndex(0);
      setCheckedPreps([]);
      setCalendarAdded(false);
      setPhase('landing');
      toast.success('Journey reset successfully. You can begin again!');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to reset journey progress. Please try again.');
      console.error('Repeat journey error:', error);
    }
  };

  const handleStartNextDay = (dayIndex: number) => {
    if (completedDays.includes(dayIndex)) return;
    if (dayIndex !== 0 && !completedDays.includes(dayIndex - 1)) return;
    checkinForm.reset({ feeling: '' });
    setCurrentDayIndex(dayIndex);
    setCurrentExerciseIndex(0);
    setPhase('day-checkin');
  };

  // ── Loading Skeleton State ──
  const isPageLoading =
    !isHydrated ||
    (!detailsResponse && !isDetailsError) ||
    (journeyCode && !statusResponse && !isStatusError);

  if (isPageLoading) {
    return (
      <section className="relative min-h-screen w-full overflow-x-hidden bg-[#FAF7F2] px-4 py-8 md:px-8 md:py-12">
        {/* Back Button Skeleton */}
        <div className="absolute top-4 left-4 z-10 sm:top-6 sm:left-8 md:top-8 md:left-10">
          <Skeleton className="h-9 w-20 animate-pulse rounded-xs bg-[#52277F]/20!" />
        </div>

        {/* Centered Content Skeleton */}
        <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-4xl flex-col items-center justify-center text-center">
          {/* Title Skeleton */}
          <div className="mb-4 flex justify-center">
            <Skeleton className="h-10 w-64 animate-pulse rounded-md bg-[#52277F]/20! sm:h-14 sm:w-96 md:h-16 md:w-120" />
          </div>

          {/* Subtitle & Stats Skeleton */}
          <div className="mb-10 flex flex-col items-center space-y-3">
            <Skeleton className="h-5 w-72 animate-pulse rounded-md bg-[#344054]/15! sm:h-6 sm:w-115" />
            <Skeleton className="h-4 w-52 animate-pulse rounded-md bg-[#667085]/15! sm:h-4 sm:w-72" />
          </div>

          {/* CTA Button Skeleton */}
          <div>
            <Skeleton className="h-12 w-56 animate-pulse rounded-xs bg-[#52277F]/20! sm:h-14 sm:w-64" />
          </div>
        </div>
      </section>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SCREEN: LANDING
  // ─────────────────────────────────────────────────────────────────────────────
  const renderPhaseContent = () => {
    if (activePhase === 'landing') {
      return (
        <JourneyBeginStep
          title={JOURNEY?.title}
          subtitle={JOURNEY?.subtitle}
          stats={JOURNEY?.stats}
          onBeginLiberation={handleBeginLiberation}
          onBack={() => router.back()}
        />
      );
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // SCREEN: BEFORE YOU BEGIN
    // ─────────────────────────────────────────────────────────────────────────────
    if (activePhase === 'before-begin') {
      return (
        <BeforeYouBeginStep
          preparations={JOURNEY?.preparations}
          checkedPreps={checkedPreps}
          togglePrep={togglePrep}
          reminders={JOURNEY?.reminders}
          selectedReminder={selectedReminder}
          setSelectedReminder={setSelectedReminder}
          calendarAdded={calendarAdded}
          handleAddToCalendar={handleAddToCalendar}
          handleStartDay={handleStartDay}
          allPrepsChecked={allPrepsChecked}
          isEnrolling={isEnrolling}
          onBack={() => setPhase('landing')}
        />
      );
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // SCREEN: DAY CHECK-IN
    // ─────────────────────────────────────────────────────────────────────────────
    if (activePhase === 'day-checkin') {
      return (
        <DayCheckinStep
          dayNumber={currentDay?.day}
          dayTitle={currentDay?.title}
          checkinPrompt={currentDay?.checkinPrompt}
          register={checkinForm.register}
          onSubmit={checkinForm.handleSubmit(handleBeginExercises)}
          isGenerating={isGenerating}
          onBack={() => setPhase(currentDayIndex === 0 ? 'before-begin' : 'overview')}
        />
      );
    }

    // SCREEN: EXERCISE
    if (activePhase === 'exercise') {
      const exerciseType = currentDay?.exercises?.[0]?.type || 'Morning Exercise';
      const title = dayExercisesData?.day_theme || currentDay?.title;
      const greeting = dayExercisesData?.ai_greeting || currentDay?.exercises?.[0]?.quote;
      const rawWhatToDo =
        dayExercisesData?.ai_exercise_text || currentDay?.exercises?.[0]?.whatToDo;
      const rawWhyThis = dayExercisesData?.ai_why_text || currentDay?.exercises?.[0]?.whyThis;
      const duration = currentDay?.exercises?.[0]?.duration || '2 Min';

      return (
        <ExerciseStep
          exerciseType={exerciseType}
          imageUrl={dayExercisesData?.image_url}
          title={title}
          greeting={greeting}
          whatToDo={rawWhatToDo}
          whyThis={rawWhyThis}
          duration={duration}
          secondsElapsed={secondsElapsed}
          timerRunning={timerRunning}
          setTimerRunning={setTimerRunning}
          formatTime={formatTime}
          onNextExercise={handleNextExercise}
          onBack={() => setPhase('day-checkin')}
        />
      );
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // SCREEN: REFLECTION
    // ─────────────────────────────────────────────────────────────────────────────
    if (activePhase === 'reflection') {
      return (
        <ReflectionStep
          dayNumber={currentDay?.day}
          energyLevel={energyLevel}
          setEnergyLevel={(val) =>
            reflectionForm.setValue('energyLevel', val, { shouldValidate: true })
          }
          register={reflectionForm.register}
          onSubmit={handleCompleteDay}
          isCompleting={isCompleting}
          onBack={() => setPhase('exercise')}
        />
      );
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // SCREEN: DAY COMPLETE
    // ─────────────────────────────────────────────────────────────────────────────
    if (activePhase === 'day-complete') {
      return (
        <DayCompleteStep
          dayNumber={currentDay?.day}
          subtitle="You let go of another layer today — beautiful."
          onContinue={handleContinueAfterDay}
          onBack={() => setPhase('reflection')}
        />
      );
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // SCREEN: OVERVIEW
    // ─────────────────────────────────────────────────────────────────────────────
    if (activePhase === 'overview') {
      return (
        <JourneyOverviewStep
          journeyDays={JOURNEY?.days}
          journeyStatus={journeyStatus}
          completedDays={completedDays}
          handleStartNextDay={handleStartNextDay}
          onBack={() => router.back()}
        />
      );
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // SCREEN: LIBERATION COMPLETE
    // ─────────────────────────────────────────────────────────────────────────────
    if (activePhase === 'liberation-complete') {
      return (
        <LiberationCompleteStep
          onExploreMore={() => router.push('/journeys')}
          onRepeatLiberation={handleRepeatLiberation}
          isRepeating={isRepeating}
          onBack={() => setPhase('overview')}
        />
      );
    }

    return null;
  };

  return <AnimatePresence mode="wait">{renderPhaseContent()}</AnimatePresence>;
}
