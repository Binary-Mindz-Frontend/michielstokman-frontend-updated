/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { FileSearch, FileText, Images, LayoutGrid, MessageSquare, Mic2, Route } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function SidebarContentSection() {
  const pathname = usePathname();
  const { setOpenMobile, isMobile, state } = useSidebar();

  const currentSections = [
    {
      items: [
        { title: 'Dashboard', url: '/dashboard/overview', icon: LayoutGrid },
        { title: 'Moderation Queue', url: '/dashboard/moderation-queue', icon: FileSearch },
        { title: 'Metrics Chat', url: '/dashboard/metrics-chat', icon: MessageSquare },
        { title: 'Voice Review', url: '/dashboard/voice-review', icon: Mic2 },
        { title: 'Photo Management', url: '/dashboard/photo-management', icon: Images },
        { title: 'Journey Management', url: '/dashboard/journey-management', icon: Route },
        { title: 'Order History', url: '/dashboard/order-history', icon: FileText },
      ],
    },
  ];

  return (
    <SidebarContent
      className={`${state === 'expanded' ? 'ps-5 pr-2.5' : 'ps-2'} no-scrollbar pt-6`}
    >
      <SidebarMenu className="gap-2">
        {currentSections.map((section: any) =>
          section.items.map((item: any) => {
            const isActive = pathname === item?.url;
            const Icon = item?.icon;

            return (
              <SidebarMenuItem key={item?.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={state === 'collapsed' ? item?.title : undefined}
                  className={`gap-3.5 px-3 py-6 tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'bg-primary! text-white! shadow-sm'
                      : 'text-secondary hover:bg-primary/10'
                  }`}
                >
                  <Link href={item?.url} onClick={() => isMobile && setOpenMobile(false)}>
                    {Icon && (
                      <Icon size={22} className={isActive ? 'text-white' : 'text-secondary'} />
                    )}
                    <span className={`${state === 'collapsed' ? 'hidden' : 'block'}`}>
                      {item?.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }),
        )}
      </SidebarMenu>
    </SidebarContent>
  );
}

export default SidebarContentSection;
