'use client';

import { Sidebar, useSidebar } from '@/components/ui/sidebar';
import * as React from 'react';
import SidebarContentSection from './_components/SidebarContentSection/SidebarContentSection';
import SidebarFooterSection from './_components/SidebarFooterSection/SidebarFooterSection';
import SidebarHeaderSection from './_components/SidebarHeader/SidebarHeader';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeaderSection state={state} />
      <SidebarContentSection />
      <SidebarFooterSection state={state} />
    </Sidebar>
  );
}
