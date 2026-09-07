'use client';

import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import UsersTable from './_components/UsersTable';

function DashboardUsersPage() {
  return (
    <div className="space-y-6">
      <DynamicPageHeader title="Users" />
      <UsersTable />
    </div>
  );
}

export default DashboardUsersPage;
