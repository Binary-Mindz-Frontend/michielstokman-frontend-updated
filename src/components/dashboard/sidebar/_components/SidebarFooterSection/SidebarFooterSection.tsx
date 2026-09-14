'use client';

import { Button } from '@/components/ui/button';
import { SidebarFooter } from '@/components/ui/sidebar';
import { useLogout } from '@/hooks/useLogout';
import { cn } from '@/lib/utils';
import { useAuthState } from '@/redux/features/auth/authSlice';
import { useGetProfileQuery } from '@/redux/features/userProfile/userProfile.api';
import { useAppSelector } from '@/redux/hooks';
import { ChevronRight, LogOut } from 'lucide-react';
import Link from 'next/link';

function SidebarFooterSection({ state }: { state: string }) {
  const logOut = useLogout();
  const { user } = useAppSelector(useAuthState);
  const { data: profileResponse } = useGetProfileQuery(undefined, { skip: !user });
  const profileData = profileResponse?.data;

  const collapsed = state === 'collapsed';
  const displayName = profileData?.true_name || (user?.email ? user.email.split('@')[0] : 'Admin');
  const email = user?.email || '';
  const initial = (displayName || 'A').charAt(0).toUpperCase();

  return (
    <SidebarFooter
      className={cn(
        'border-sidebar-border/80 gap-3 border-t',
        collapsed ? 'items-center px-2 py-3' : 'px-3 py-3',
      )}
    >
      {!collapsed ? (
        <Link
          href="/profile"
          className="group hover:border-primary/30 flex items-center gap-2.5 rounded-md border border-[#E1D7CE] bg-white/70 px-2.5 py-2 transition-colors hover:bg-white"
          title="Open profile"
        >
          <span
            className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
            aria-hidden
          >
            {initial}
          </span>
          <span className="min-w-0 flex-1">
            <span className="text-foreground block truncate text-xs font-semibold">
              {displayName}
            </span>
            {email ? (
              <span className="text-secondary block truncate text-[11px]">{email}</span>
            ) : null}
            <span className="text-primary mt-0.5 block text-[10px] font-semibold tracking-wide">
              View profile
            </span>
          </span>
          <ChevronRight
            size={14}
            className="text-secondary/70 group-hover:text-primary shrink-0 transition-colors"
          />
        </Link>
      ) : (
        <Link
          href="/profile"
          className="bg-primary/10 text-primary hover:bg-primary/15 flex size-8 items-center justify-center rounded-full text-xs font-bold transition-colors"
          title={`${displayName} — profile`}
          aria-label={`Open profile for ${displayName}`}
        >
          {initial}
        </Link>
      )}

      <Button
        variant="ghost"
        size={collapsed ? 'icon' : 'default'}
        title="Log out"
        aria-label="Log out"
        className={cn(
          'text-error/80 hover:text-error bg-error/10 hover:bg-error/20 gap-2 rounded-md text-sm font-medium transition-colors',
          collapsed ? 'size-9 shrink-0' : 'w-full justify-center',
        )}
        onClick={() => logOut()}
      >
        <LogOut size={16} />
        {!collapsed ? <span>Log out</span> : null}
      </Button>

      {!collapsed ? (
        <p className="px-1 text-center text-[10px] leading-relaxed tracking-wide text-[#8A6E5F]">
          © {new Date().getFullYear()} Transform to Liberation
        </p>
      ) : null}
    </SidebarFooter>
  );
}

export default SidebarFooterSection;
