import JourneyManagementHeader from './_components/journeyManagementHeader/journeyManagementHeader';
import JourneyManagementTable from './_components/journeyManagementTable/journeyManagementTable';
function DashboardJourneyManagementPage() {
  return (
    <div className="space-y-4">
      <JourneyManagementHeader />
      <JourneyManagementTable />
    </div>
  );
}

export default DashboardJourneyManagementPage;
