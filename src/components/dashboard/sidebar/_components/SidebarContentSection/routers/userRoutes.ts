import { BarChart2, Bell, BookOpen, Home, Sparkles, TrendingUp } from 'lucide-react';
import { ISidebarSection } from '.';

export const userRoutes: ISidebarSection[] = [
  {
    items: [
      {
        title: 'Dashboard',
        url: '/dashboard/user/overview',
        icon: Home,
      },
      {
        title: 'Insight Sandbox',
        url: '/dashboard/user/insight-sandbox',
        icon: TrendingUp,
      },
      {
        title: 'Market Context',
        url: '/dashboard/user/market-context',
        icon: BarChart2,
      },
      {
        title: 'Learn Fundamentals',
        url: '/dashboard/user/learn-fundamentals',
        icon: BookOpen,
      },
      {
        title: 'AI Observations',
        url: '/dashboard/user/ai-observations',
        icon: Sparkles,
      },
      {
        title: 'Observations Log',
        url: '/dashboard/user/observations-log',
        icon: Bell,
      },
    ],
  },
];
