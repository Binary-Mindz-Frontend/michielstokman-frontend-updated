import {
  BookOpen,
  ChartColumnDecreasing,
  CreditCard,
  FileText,
  Headphones,
  LayoutDashboard,
  Settings,
  Sparkles,
  Users,
} from 'lucide-react';
import { ISidebarSection } from '.';

export const superAdminRoutes: ISidebarSection[] = [
  {
    items: [
      {
        title: 'Dashboard',
        url: '/dashboard/super-admin/overview',
        icon: LayoutDashboard,
      },
      {
        title: 'User Management',
        url: '/dashboard/super-admin/user-management',
        icon: Users,
      },
      {
        title: 'Subscription & Plans',
        url: '/dashboard/super-admin/subscription-plans',
        icon: CreditCard,
      },
      {
        title: 'Market Data Control',
        url: '/dashboard/super-admin/market-data-control',
        icon: BookOpen,
      },
      {
        title: 'AI Observation Control',
        url: '/dashboard/super-admin/ai-observation-control',
        icon: Sparkles,
      },
      {
        title: 'Content Management',
        url: '/dashboard/super-admin/content-management',
        icon: FileText,
      },
      {
        title: 'Reports & Analytics',
        url: '/dashboard/super-admin/reports-analytics',
        icon: ChartColumnDecreasing,
      },
      {
        title: 'Support & Tickets',
        url: '/dashboard/super-admin/support-tickets',
        icon: Headphones,
      },
      {
        title: 'System Settings',
        url: '/dashboard/super-admin/system-settings',
        icon: Settings,
      },
    ],
  },
];
