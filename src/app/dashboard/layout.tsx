import NavigationBar from '@/components/dashboard/navigationBar/NavigationBar';
import { AppSidebar } from '@/components/dashboard/sidebar/AppSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="dashboard-typography">
      <SidebarProvider>
        {/* Dashboard Aside Bar */}
        <AppSidebar />
        <SidebarInset>
          {/* Dashboard Navigation Bar */}
          <NavigationBar />
          <main className="text-foreground h-full w-full overflow-hidden p-4">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};
export default DashboardLayout;
