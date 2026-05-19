import { SidebarHeader } from '@/components/ui/sidebar';
import Link from 'next/link';

function SidebarHeaderSection({ state }: { state: string }) {
  return (
    <SidebarHeader className="mt-4">
      <div>
        <Link href="/">
          <h2
            className={`text-primary mb-2 text-xl font-semibold ${state === 'expanded' ? 'ps-3' : 'hidden'}`}
          >
            Transform to Liberation
          </h2>
        </Link>
      </div>
    </SidebarHeader>
  );
}

export default SidebarHeaderSection;
