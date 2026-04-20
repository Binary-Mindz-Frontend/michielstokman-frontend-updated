import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import PhotoManagementTable from './_components/PhotoManagementTable/PhotoManagementTable';

function DashboardPhotoManagement() {
  return (
    <section>
      <DynamicPageHeader title="Photo Management" />
      <PhotoManagementTable />
    </section>
  );
}

export default DashboardPhotoManagement;
