import { SidebarTrigger } from '@/components/ui/sidebar';
import RightSection from './_components/RightSection/RightSection';

export default function NavigationBar() {
  return (
    <header className="bg-sidebar sticky top-0 z-50 flex h-20 shrink-0 items-center justify-between gap-10 border-b px-2 sm:px-4 lg:px-6">
      {/* Left Section */}
      <div className="flex w-full items-center gap-4 md:gap-6 lg:max-w-2/5">
        {/* Sidebar Trigger */}
        <SidebarTrigger className="text-primary/90 bg-primary/10 hover:bg-primary/20 hover:text-primary h-9 w-9 cursor-pointer rounded-md" />
      </div>
      {/* Right Section */}
      <RightSection />
    </header>
  );
}
