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
import { useGetOrderHistoryQuery } from '@/redux/features/admin/orderHistory/orderHistory.api';
import { TColumn } from '@/types/custom-table.types';
import { FormatDateTime } from '@/utils/formatDateTime';
import { useRouter, useSearchParams } from 'next/navigation';

interface IOrderHistory {
  id: string;
  plan_name: string;
  amount: number;
  currency: string;
  user_email: string;
  paid_at: string;
}

function OrderHistoryTable() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  const days_back = searchParams.get('days_back') || '30';
  const router = useRouter();

  // API Query Call
  const { data, isLoading, isFetching } = useGetOrderHistoryQuery({
    search,
    days_back: Number(days_back),
    limit: 50,
    offset: 0,
  });

  const orderList = data?.data?.orders || [];

  const handlePeriodChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('days_back', val);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const tableConfig: TColumn<IOrderHistory>[] = [
    {
      header: 'Sl',
      accessor: 'id',
    },
    {
      header: 'Name',
      cell: (row) => (
        <p className="text-dark-primary line-clamp-1 font-semibold">{row?.plan_name || 'N/A'}</p>
      ),
    },
    {
      header: 'Price',
      cell: (row) => <span>€ {row?.amount ? row.amount.toFixed(2) : '0.00'}</span>,
    },
    {
      header: 'Date',
      cell: (row) => <span>{row?.paid_at ? FormatDateTime(row.paid_at) : 'N/A'}</span>,
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
          <Select value={days_back} onValueChange={handlePeriodChange}>
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
        {isLoading || isFetching ? (
          <TableSkeleton SKELETON_COLS={5} />
        ) : orderList.length === 0 ? (
          <TableEmptyState message="No orders found!" />
        ) : (
          <CustomTable columns={tableConfig} data={orderList} />
        )}
      </div>
    </div>
  );
}

export default OrderHistoryTable;
