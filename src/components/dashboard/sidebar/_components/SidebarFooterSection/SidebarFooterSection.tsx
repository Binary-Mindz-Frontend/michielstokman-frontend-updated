'use client';
import { Button } from '@/components/ui/button';
import { SidebarFooter } from '@/components/ui/sidebar';
import { useLogout } from '@/hooks/useLogout';
import { LogOut } from 'lucide-react';

function SidebarFooterSection({ state }: { state: string }) {
  const logOut = useLogout();
  return (
    <SidebarFooter>
      <Button
        variant="ghost"
        className="text-error/80 hover:text-error bg-error/10 hover:bg-error/20 item-cen flex w-full justify-center gap-2 rounded-sm text-sm font-medium transition-all duration-700"
        onClick={() => logOut()}
      >
        <LogOut size={16} />
        Log Out
      </Button>
      <p className="m-2 text-[#6A7282]">
        ©{state === 'expanded' && <span> 2026 Transform to Liberation</span>}
      </p>
    </SidebarFooter>
  );
}

export default SidebarFooterSection;
