import { SidebarFooter } from '@/components/ui/sidebar';

function SidebarFooterSection({ state }: { state: string }) {
  return (
    <SidebarFooter>
      <p className="m-2 text-[#6A7282]">
        ©{state === 'expanded' && <span> 2026 Transform to Liberation</span>}
      </p>
    </SidebarFooter>
  );
}

export default SidebarFooterSection;
