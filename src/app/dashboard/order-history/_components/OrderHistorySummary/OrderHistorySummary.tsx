'use client';

import { useGetOrdersStatsQuery } from '@/redux/features/admin/orderHistory/orderHistory.api';

interface SummaryCardProps {
  label: string;
  value: string | number;
}

const SummaryCard = ({ label, value }: SummaryCardProps) => (
  <div className="rounded-md bg-[#F5F2F0] p-6">
    <p className="text-secondary mb-2 text-sm font-medium">{label}</p>
    <h2 className="text-primary text-2xl font-semibold sm:text-3xl">{value}</h2>
  </div>
);

function OrderHistorySummary() {
  const { data, isLoading } = useGetOrdersStatsQuery(undefined);
  const orderData = data?.data;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        {/* Card 1 Skeleton */}
        <div className="animate-pulse space-y-3 rounded-md bg-[#F5F2F0] p-6">
          <div className="h-4 w-24 rounded bg-[#E5DFDC]" />
          <div className="h-8 w-32 rounded bg-[#E5DFDC]" />
        </div>
        {/* Card 2 Skeleton */}
        <div className="animate-pulse space-y-3 rounded-md bg-[#F5F2F0] p-6">
          <div className="h-4 w-24 rounded bg-[#E5DFDC]" />
          <div className="h-8 w-16 rounded bg-[#E5DFDC]" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
      <SummaryCard label="Total Revenue" value={`€${orderData?.total_revenue || 0}`} />
      <SummaryCard label="Total Orders" value={orderData?.total_orders || 0} />
    </div>
  );
}

export default OrderHistorySummary;
