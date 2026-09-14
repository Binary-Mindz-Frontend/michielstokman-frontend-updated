'use client';

import { LibraryBig, MessageSquare, Plus } from 'lucide-react';
import Link from 'next/link';

const actions = [
  {
    href: '/dashboard/publications/create?type=Confessions',
    label: 'New confession',
    icon: Plus,
  },
  {
    href: '/dashboard/publications/create?type=Meditation',
    label: 'New meditation',
    icon: Plus,
  },
  {
    href: '/dashboard/publications',
    label: 'Publications',
    icon: LibraryBig,
  },
  {
    href: '/dashboard/metrics-chat',
    label: 'Metrics chat',
    icon: MessageSquare,
  },
] as const;

export default function OverviewQuickActions() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {actions.map(({ href, label, icon: Icon }) => (
        <Link
          key={href + label}
          href={href}
          className="text-secondary border-primary/15 hover:border-primary/30 inline-flex items-center gap-2 rounded-md border bg-white/80 px-3.5 py-2 text-sm font-medium shadow-[0_1px_0_rgba(65,70,81,0.04)] transition-colors hover:bg-white"
        >
          <Icon size={15} strokeWidth={1.75} className="text-primary" />
          {label}
        </Link>
      ))}
    </div>
  );
}
