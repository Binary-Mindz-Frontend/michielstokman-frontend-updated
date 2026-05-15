'use client';

import CustomTable from '@/components/dashboard/CustomTable/CustomTable';
import TableEmptyState from '@/components/dashboard/CustomTable/TableEmptyState';
import TableSkeleton from '@/components/dashboard/CustomTable/TableSkeleton';
import SearchField from '@/components/dashboard/Fields/SearchField/SearchField';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TColumn } from '@/types/custom-table.types';
import { useRouter, useSearchParams } from 'next/navigation';

interface IOrderHistory {
  id: string;
  plan_name: string;
  amount_cents: number;
  currency: string;
  user_email: string;
  paid_at: string;
}

function OrderHistoryTable({ data, isLoading }: { data: IOrderHistory[]; isLoading: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentDays = searchParams.get('days_back') || '30';

  const handlePeriodChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('days_back', val);
    router.push(`?${params.toString()}`);
  };

  const tableConfig: TColumn<IOrderHistory>[] = [
    {
      header: 'Sl',
      cell: (_, index) => <span className="text-secondary">{(index || 0) + 1}</span>,
    },
    {
      header: 'Name',
      cell: (row) => (
        <p className="text-dark-primary line-clamp-1 font-semibold">{row?.plan_name}</p>
      ),
    },
    {
      header: 'Price',
      cell: (row) => (
        <span>
          {row?.currency === 'EUR' ? '€' : '$'}
          {row?.amount_cents / 100}
        </span>
      ),
    },
    {
      header: 'Date',
      cell: (row) => (
        <span>
          {new Date(row?.paid_at).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: '2-digit',
          })}
        </span>
      ),
    },
    {
      header: 'Email',
      accessor: 'user_email',
    },
  ];

  return (
    <div className="w-full space-y-6 rounded-md border border-[#F1E9E4] bg-[#F8F7F3] p-6">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="w-full md:max-w-md">
          <SearchField placeholder="Search by name" queryKey="search" />
        </div>

        <div className="flex w-full items-center gap-3 md:w-auto">
          <Select value={currentDays} onValueChange={handlePeriodChange}>
            <SelectTrigger className="md:w-45">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        {isLoading ? (
          <TableSkeleton />
        ) : data.length === 0 ? (
          <TableEmptyState message="No orders found!" />
        ) : (
          <CustomTable columns={tableConfig} data={data} />
        )}
      </div>
    </div>
  );
}

export default OrderHistoryTable;
