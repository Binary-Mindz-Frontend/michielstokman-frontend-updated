import NavigationBar from '@/components/dashboard/navigationBar/NavigationBar';
import { AppSidebar } from '@/components/dashboard/sidebar/AppSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <SidebarProvider>
      {/* Dashboard Aside Bar */}
      <AppSidebar />
      <SidebarInset>
        {/* Dashboard Navigation Bar */}
        <NavigationBar />
        <main className="text-dark-primary h-full w-full overflow-hidden p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};
export default DashboardLayout;
