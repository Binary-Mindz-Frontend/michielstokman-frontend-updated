'use client';

import CustomTable from '@/components/dashboard/CustomTable/CustomTable';
import SearchField from '@/components/dashboard/Fields/SearchField/SearchField';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TColumn } from '@/types/custom-table.types';

interface IOrderHistory {
  id: number;
  name: string;
  price: string;
  date: string;
  email: string;
}

function OrderHistoryTable() {
  const orderData: IOrderHistory[] = [
    {
      id: 1,
      name: 'Feel More Vital – 7 Days to More Life Energy',
      price: '$50',
      date: '12 Jan 26',
      email: 'exmaple@gmail.com',
    },
    {
      id: 2,
      name: 'Feel More Vital – 7 Days to More Life Energy',
      price: '$50',
      date: '12 Jan 26',
      email: 'exmaple@gmail.com',
    },
    {
      id: 3,
      name: 'Feel More Vital – 7 Days to More Life Energy',
      price: '$50',
      date: '12 Jan 26',
      email: 'exmaple@gmail.com',
    },
    {
      id: 4,
      name: 'Feel More Vital – 7 Days to More Life Energy',
      price: '$50',
      date: '12 Jan 26',
      email: 'exmaple@gmail.com',
    },
    {
      id: 5,
      name: 'Feel More Vital – 7 Days to More Life Energy',
      price: '$50',
      date: '12 Jan 26',
      email: 'exmaple@gmail.com',
    },
    {
      id: 6,
      name: 'Feel More Vital – 7 Days to More Life Energy',
      price: '$50',
      date: '12 Jan 26',
      email: 'exmaple@gmail.com',
    },
    {
      id: 7,
      name: 'Feel More Vital – 7 Days to More Life Energy',
      price: '$50',
      date: '12 Jan 26',
      email: 'exmaple@gmail.com',
    },
  ];

  const tableConfig: TColumn<IOrderHistory>[] = [
    {
      header: 'Sl',
      cell: (row) => <span className="text-secondary">{row?.id}</span>,
    },
    {
      header: 'Name',
      cell: (row) => <p className="text-dark-primary line-clamp-1 font-semibold">{row?.name}</p>,
    },
    {
      header: 'Price',
      accessor: 'price',
    },
    {
      header: 'Date',
      accessor: 'date',
    },
    {
      header: 'Email',
      accessor: 'email',
    },
  ];

  return (
    <div className="w-full space-y-6 rounded-md border border-[#F1E9E4] bg-[#F8F7F3] p-6">
      {/* Top Bar: Search & Select Filters */}
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="w-full md:max-w-md">
          <SearchField placeholder="Search by name" queryKey="search" />
        </div>

        <div className="flex w-full items-center gap-3 md:w-auto">
          <Select defaultValue="30">
            <SelectTrigger className="md:w-45">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="30">
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

      {/* Table Section */}
      <CustomTable columns={tableConfig} data={orderData} />
    </div>
  );
}

export default OrderHistoryTable;
