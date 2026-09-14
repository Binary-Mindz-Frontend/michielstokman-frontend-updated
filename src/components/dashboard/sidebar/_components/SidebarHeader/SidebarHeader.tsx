'use client';

import logoSvg from '@/assets/navbar/logo.svg';
import { SidebarHeader } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

function SidebarHeaderSection({ state }: { state: string }) {
  const collapsed = state === 'collapsed';

  return (
    <SidebarHeader
      className={cn(
        'border-sidebar-border/80 border-b',
        collapsed ? 'items-center px-2 py-3' : 'px-3 py-4',
      )}
    >
      <Link
        href="/dashboard/overview"
        className={cn(
          'flex w-full items-center gap-3 rounded-md transition-opacity hover:opacity-90',
          collapsed ? 'justify-center' : 'px-1',
        )}
        aria-label="Admin dashboard"
      >
        <span className="relative h-9 w-11 shrink-0">
          <Image src={logoSvg} alt="" fill className="object-contain" priority />
        </span>

        {!collapsed ? (
          <span className="min-w-0 flex-1">
            <span className="text-primary block truncate text-sm leading-tight font-bold tracking-wide">
              Transform to Liberation
            </span>
            <span className="mt-1 inline-flex items-center rounded-full border border-[#D29B38]/50 bg-[#EEA13D]/15 px-2 py-0.5 text-[10px] font-bold tracking-wider text-[#8A6E5F] uppercase">
              Admin
            </span>
          </span>
        ) : null}
      </Link>
    </SidebarHeader>
  );
}

export default SidebarHeaderSection;
