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

function OrderHistorySummary() {
  const summaryData = {
    totalRevenue: '$284,920',
    totalOrders: '123',
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
      <SummaryCard label="Total Revenue" value={summaryData?.totalRevenue} />
      <SummaryCard label="Total Orders" value={summaryData?.totalOrders} />
    </div>
  );
}

export default OrderHistorySummary;
