'use client';

import { useAuthState } from '@/redux/features/auth/authSlice';
import { useGetProfileQuery } from '@/redux/features/userProfile/userProfile.api';
import { useAppSelector } from '@/redux/hooks';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function UserAvatarDropdown() {
  const { user } = useAppSelector(useAuthState);
  const { data: profileResponse } = useGetProfileQuery(undefined, { skip: !user });
  const profileData = profileResponse?.data;

  const displayName = profileData?.true_name || (user?.email ? user.email.split('@')[0] : 'Admin');
  const roleLabel = user?.is_admin ? 'Admin' : 'Member';

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <Link
        href="/"
        className="text-secondary hover:text-primary border-primary/15 inline-flex items-center gap-1.5 rounded-md border bg-white/70 px-2.5 py-1.5 text-xs font-semibold transition-colors hover:bg-white"
        title="View public site"
      >
        <ExternalLink size={14} strokeWidth={1.75} />
        <span className="hidden sm:inline">View site</span>
      </Link>

      <Link
        href="/profile"
        className="hover:bg-primary/5 flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors"
        title="Open your profile"
      >
        <span
          className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold"
          aria-hidden
        >
          {(displayName || 'A').charAt(0).toUpperCase()}
        </span>
        <span className="hidden text-left lg:block">
          <span className="text-secondary block text-sm leading-tight font-semibold">
            {displayName}
          </span>
          <span className="text-secondary/80 block text-xs">{roleLabel}</span>
        </span>
      </Link>
    </div>
  );
}
