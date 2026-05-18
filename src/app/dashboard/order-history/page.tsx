'use client';

import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';

import OrderHistorySummary from './_components/OrderHistorySummary/OrderHistorySummary';
import OrderHistoryTable from './_components/OrderHistoryTable/OrderHistoryTable';

function DashboardOrderHistoryPage() {
  return (
    <div className="space-y-6">
      <DynamicPageHeader title="Order History" />
      <OrderHistorySummary />
      <OrderHistoryTable />
    </div>
  );
}

export default DashboardOrderHistoryPage;
