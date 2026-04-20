import { SidebarHeader } from '@/components/ui/sidebar';

function SidebarHeaderSection({ state }: { state: string }) {
  return (
    <SidebarHeader className="mt-4">
      <div>
        <h2
          className={`text-primary mb-2 text-xl font-semibold ${state === 'expanded' ? 'ps-3' : 'hidden'}`}
        >
          Transform to Liberation
        </h2>
      </div>
    </SidebarHeader>
  );
}

export default SidebarHeaderSection;
