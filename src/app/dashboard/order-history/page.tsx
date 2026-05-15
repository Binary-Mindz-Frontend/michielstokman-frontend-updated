'use client';

import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';

import { useGetOrderHistoryQuery } from '@/redux/features/admin/orderHistory/orderHistory.api';
import { useSearchParams } from 'next/navigation';
import OrderHistorySummary from './_components/OrderHistorySummary/OrderHistorySummary';
import OrderHistoryTable from './_components/OrderHistoryTable/OrderHistoryTable';

function DashboardOrderHistoryPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  const days_back = searchParams.get('days_back') || '30';

  const { data, isLoading, isFetching } = useGetOrderHistoryQuery({
    search,
    days_back: Number(days_back),
    limit: 50,
    offset: 0,
  });

  // Order Stats
  const orderStats = {
    totalRevenue: data?.data?.total_revenue || 0,
    totalOrders: data?.data?.total_orders || 0,
  };

  // Orders Data for Table
  const orders = data?.data?.orders || [];

  return (
    <div className="space-y-6">
      <DynamicPageHeader title="Order History" />
      <OrderHistorySummary
        revenue={orderStats?.totalRevenue}
        ordersCount={orderStats?.totalOrders}
        isLoading={isLoading || isFetching}
      />
      <OrderHistoryTable data={orders} isLoading={isLoading || isFetching} />
    </div>
  );
}

export default DashboardOrderHistoryPage;
