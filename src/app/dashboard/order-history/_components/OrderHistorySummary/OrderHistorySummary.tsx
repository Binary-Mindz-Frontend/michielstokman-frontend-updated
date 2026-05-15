'use client';

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

function OrderHistorySummary({
  revenue,
  ordersCount,
  isLoading,
}: {
  revenue: number;
  ordersCount: number;
  isLoading: boolean;
}) {
  const formattedRevenue = new Intl.NumberFormat('en-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(revenue / 100);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
      <SummaryCard label="Total Revenue" value={isLoading ? '...' : formattedRevenue} />
      <SummaryCard label="Total Orders" value={isLoading ? '...' : ordersCount} />
    </div>
  );
}

export default OrderHistorySummary;
