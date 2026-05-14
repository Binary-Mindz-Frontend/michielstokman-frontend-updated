import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import JourneyManagementTable from './journeyManagementTable/journeyManagementTable';
function DashboardJourneyManagementPage() {
  return (
    <div className="space-y-6">
      <DynamicPageHeader title="Journey Management" />
      <JourneyManagementTable />
    </div>
  );
}

export default DashboardJourneyManagementPage;
