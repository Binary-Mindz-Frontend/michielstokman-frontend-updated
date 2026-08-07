/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import DynamicBackButton from '@/components/main/DynamicBackButton/DynamicBackButton';
import { JourneyDetailSkeleton } from '@/components/main/Skeletons/JourneyDetailSkeleton';

import brushTextBg from '@/assets/shared/brush-text-bg.png';
import purpleCheckBorder from '@/assets/journeys/purple-check-border.png';
import purpleCircleBadge from '@/assets/journeys/purple-circle-badge.png';
import purpleUnderline from '@/assets/journeys/purple-underline.png';

import { setAuth, useCurrentUser } from '@/redux/features/auth/authSlice';
import { useGetLiberationDetailsQuery } from '@/redux/features/discoveryFeed/discoveryFeed.api';
import { useStartCheckoutMutation } from '@/redux/features/payment/payment.api';
import { useGetProfileQuery } from '@/redux/features/userProfile/userProfile.api';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { IPaymentCheckoutRequest } from '@/types/payment.types';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';

export default function JourneyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const storyId = params?.id as string;

  // Hooks
  const {
    data: response,
    isLoading: isDetailsLoading,
    isError,
  } = useGetLiberationDetailsQuery(storyId, {
    skip: !storyId,
  });

  const librationData = response?.data;
  const { data: profileResponse } = useGetProfileQuery(undefined);
  const profileData = profileResponse?.data;

  const [startCheckout, { isLoading: isProcessing }] = useStartCheckoutMutation();
  const user = useAppSelector(useCurrentUser) as any;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (profileData && user) {
      const profileUserId = profileData.user_id;
      const profileId = profileData.id;

      if (user.user_id !== profileUserId || user.id !== profileId) {
        dispatch(
          setAuth({
            user: {
              ...user,
              user_id: profileUserId || user.user_id,
              id: profileId || user.id,
            },
          }),
        );
      }
    }
  }, [profileData, user, dispatch]);

  if (!storyId || isDetailsLoading || (!librationData && !isError)) {
    return <JourneyDetailSkeleton />;
  }

  const handleCheckout = async () => {
    if (librationData?.has_access) {
      router.push(`/journeys/${storyId}/liberation`);
      return;
    }

    if (!user || user?.is_guest) {
      toast.error(
        user?.is_guest
          ? 'Please register an account to unlock purchases'
          : 'Please login to start checkout',
      );
      if (user?.is_guest) {
        setTimeout(() => router.push('/register'), 2000);
      }
      return;
    }

    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const checkoutData: IPaymentCheckoutRequest = {
        user_id: profileData?.user_id || user?.user_id,
        journey_code: librationData?.journey_code || storyId,
        provider: 'stripe' as const,
        success_url: `${baseUrl}/journeys/${storyId}/liberation`,
        cancel_url: `${baseUrl}/journeys/${storyId}`,
      };

      const result = await startCheckout(checkoutData).unwrap();

      if (result.success && result.data?.checkout_url) {
        window.location.href = result.data.checkout_url;
      } else {
        toast.error(result.message || 'Failed to start checkout');
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Checkout failed. Please try again.');
      console.error('Checkout error:', error);
    }
  };

  // Pure dynamic data from API
  const titleText = librationData?.title || 'FEEL MORE VITAL - 7 DAYS TO MORE LIFE ENERGY';
  const subtitleText = librationData?.subtitle || 'The Morning I Stopped Running';
  const descriptionText = librationData?.description;
  const expectItems = Array.isArray(librationData?.what_to_expect)
    ? librationData.what_to_expect
    : [];
  const priceValue = librationData?.price;
  const priceDisplay = priceValue !== undefined && priceValue !== null ? `€${priceValue}` : '€47';
  const heroImageSrc = librationData?.cover_image_url;

  return (
    <main className="min-h-screen bg-[#FAF7F2] pb-16 font-sans text-black">
      {/* Brand Hero Container */}
      <div className="mx-auto w-full max-w-350 px-4 pt-4 pb-8 sm:px-8">
        {/* Top Back Button */}
        <div className="mb-6 sm:mb-8">
          <DynamicBackButton href="/" bgColor="#4A229D" />
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={FADE_IN_UP_CONTAINER}
          className="flex w-full flex-col items-center justify-between gap-6 md:flex-row md:items-center"
        >
          {/* TITLE SECTION (Top on Mobile & Left Column on Desktop) */}
          <motion.div
            variants={FADE_IN_UP_ITEM}
            className="flex w-full flex-col items-center text-center md:w-1/2 md:items-start md:text-left"
          >
            {/* Main Title */}
            {titleText && (
              <div className="font-edo leading-none font-medium uppercase">
                <h1 className="max-w-2xl text-center text-3xl tracking-wider text-[#4A229D] sm:text-4xl md:text-left md:text-5xl lg:text-6xl">
                  {titleText}
                </h1>
              </div>
            )}

            {/* Brush Subtitle on Desktop */}
            {subtitleText && (
              <div className="relative mt-6 hidden min-h-16 w-full max-w-[320px] -rotate-1 transform items-center justify-center sm:mt-8 sm:min-h-20 sm:max-w-105 md:flex">
                <div className="absolute inset-0 h-full w-full">
                  <Image src={brushTextBg} alt="Brush background" fill className="object-fill" />
                </div>
                <p className="relative z-10 px-4 py-2 text-center font-sans text-xs font-medium tracking-wide text-white uppercase sm:px-6 sm:text-sm">
                  {subtitleText.includes('Stopped') ? (
                    <>
                      {subtitleText.split('Stopped')[0]}
                      <span className="font-semibold text-[#E81A66]">Stopped</span>
                      {subtitleText.split('Stopped')[1]}
                    </>
                  ) : (
                    subtitleText
                  )}
                </p>
              </div>
            )}
          </motion.div>

          {/* HERO IMAGE SECTION (Middle on Mobile & Right Column on Desktop) */}
          <motion.div
            variants={FADE_IN_UP_ITEM}
            className="relative flex w-full justify-center md:w-1/2"
          >
            <div className="relative h-72 w-full max-w-85 shrink-0 sm:h-100 sm:max-w-115 md:max-w-140 lg:h-120 lg:max-w-160">
              {/* Main Hero Image */}
              {heroImageSrc && (
                <Image
                  src={heroImageSrc}
                  alt={titleText || 'Journey Cover'}
                  fill
                  className="object-contain"
                  priority
                  unoptimized={typeof heroImageSrc === 'string'}
                />
              )}

              {/* Yellow Badge Circle on Bottom Left */}
              <div className="absolute bottom-2 left-2 z-20 flex h-22 w-22 -rotate-6 transform flex-col items-center justify-center rounded-full bg-[#F3A134] p-2 text-center shadow-md sm:bottom-4 sm:left-4 sm:h-28 sm:w-28">
                <p className="font-sans text-[10px] leading-tight font-bold text-black sm:text-xs">
                  Break Free. <br /> Become Real.
                </p>
                <div className="mt-0.5 h-0.5 w-5 bg-black sm:mt-1 sm:w-6" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* MOBILE BRUSH SUBTITLE (rendered below image on mobile) */}
      {subtitleText && (
        <div className="relative mx-auto mt-4 flex min-h-16 w-full max-w-75 -rotate-1 transform items-center justify-center md:hidden">
          <div className="absolute inset-0 h-full w-full">
            <Image src={brushTextBg} alt="Brush background" fill className="object-fill" />
          </div>
          <p className="relative z-10 px-4 py-2 text-center font-sans text-xs font-medium tracking-wide text-white uppercase sm:px-6">
            {subtitleText.includes('Stopped') ? (
              <>
                {subtitleText.split('Stopped')[0]}
                <span className="font-semibold text-[#E81A66]">Stopped</span>
                {subtitleText.split('Stopped')[1]}
              </>
            ) : (
              subtitleText
            )}
          </p>
        </div>
      )}

      {/* Intro Description Paragraph & Floating Purple Circle Badge Beside Description on Desktop */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={FADE_IN_UP_CONTAINER}
        className="relative mx-auto mt-8 mb-10 max-w-5xl px-4"
      >
        {/* Description Text */}
        <motion.p
          variants={FADE_IN_UP_ITEM}
          className="mx-auto max-w-xl text-center font-sans text-sm leading-relaxed font-semibold text-[#3A3A3A] sm:text-base md:max-w-2xl md:px-12"
        >
          {descriptionText ? (
            descriptionText
          ) : (
            <>
              <span className="font-bold text-[#4A229D]">This Liberation</span> Gently Guides You
              Through 7 Days Of Simple Body-Mind Practices. Each Day Builds On The Last —{' '}
              <span className="font-bold text-[#4A229D]">Waking Up Your</span> Breath, Softening
              Tension, And Opening Space For Genuine Vitality To Return.
            </>
          )}
        </motion.p>

        {/* Purple Circle Badge: Floating beside Description Text on Desktop (Right side with space, no overlap) */}
        <div className="relative mx-auto my-6 flex h-24 w-24 shrink-0 items-center justify-center md:absolute md:top-1/2 md:right-4 md:my-0 md:h-28 md:w-28 md:-translate-y-1/2 lg:right-12">
          <Image src={purpleCircleBadge} alt="Badge" fill className="object-contain" />
          <div className="relative z-10 flex rotate-6 items-center justify-center text-lg font-bold text-[#4A229D] sm:text-xl">
            <span className="mr-0.5 font-sans font-extrabold">€</span>
            <span className="font-edo">{librationData?.price ?? 47}</span>
          </div>
        </div>
      </motion.div>

      {/* "WHAT TO EXPECT" Card */}
      {expectItems.length > 0 && (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={FADE_IN_UP_CONTAINER}
          className="mx-auto max-w-6xl px-4"
        >
          <motion.div
            variants={FADE_IN_UP_ITEM}
            className="flex flex-col items-center rounded-lg border border-[#EDE8E8] bg-[#FBF9F3] p-5 text-center shadow-xs sm:pt-10"
          >
            {/* Card Header & Purple Underline */}
            <div className="mb-6 flex flex-col items-center justify-center text-center">
              <h2 className="font-edo text-2xl font-black tracking-wider text-black uppercase sm:text-3xl">
                WHAT TO EXPECT
              </h2>
              <div className="relative mt-1.5 h-3.5 w-48 sm:w-64">
                <Image
                  src={purpleUnderline}
                  alt="Purple Underline"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* List Items */}
            <ul className="w-full space-y-4 text-left">
              {expectItems.map((item: string, idx: number) => (
                <li key={idx} className="flex items-center gap-3.5">
                  <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                    <Image
                      src={purpleCheckBorder}
                      alt="check"
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-secondary font-sans text-sm font-semibold">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}

      {/* CTA Button Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={FADE_IN_UP_CONTAINER}
        className="mx-auto max-w-2xl px-4"
      >
        <motion.div
          variants={FADE_IN_UP_ITEM}
          className="mt-8 flex flex-col items-center justify-center"
        >
          <div className="w-full max-w-xs sm:max-w-sm">
            <DynamicActionButton
              text={
                isProcessing
                  ? 'Processing...'
                  : librationData?.has_access
                    ? 'Continue Your Liberation'
                    : `Start This Liberation ${priceDisplay}`.trim()
              }
              onClick={handleCheckout}
              bgColor="#4A229D"
              textColor="white"
              showArrow={true}
              fullWidth={true}
              disabled={isProcessing}
            />
          </div>

          <p className="text-secondary mt-3 text-center font-sans text-xs font-medium">
            One-time payment · Lifetime access · 30-day guarantee
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}
