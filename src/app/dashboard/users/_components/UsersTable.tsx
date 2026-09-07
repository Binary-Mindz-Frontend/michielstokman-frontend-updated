'use client';

import CustomPagination from '@/components/dashboard/CustomPagination/CustomPagination';
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
import {
  AdminUserListItem,
  useGetAdminUsersQuery,
} from '@/redux/features/admin/adminUsers/adminUsers.api';
import { TColumn } from '@/types/custom-table.types';
import { FormatDateTime } from '@/utils/formatDateTime';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function UsersTable() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get('search') || '';
  const isActive = searchParams.get('is_active') || 'all';
  const isAdmin = searchParams.get('is_admin') || 'all';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const { data, isLoading, isFetching } = useGetAdminUsersQuery({
    q: q || undefined,
    is_active: isActive === 'all' ? undefined : isActive,
    is_admin: isAdmin === 'all' ? undefined : isAdmin,
    page: currentPage,
    limit: 20,
  });

  const users: AdminUserListItem[] = data?.data?.users || [];
  const meta = data?.data?.meta;

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') params.delete(key);
    else params.set(key, value);
    params.set('page', '1');
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const columns: TColumn<AdminUserListItem>[] = [
    {
      header: 'Email',
      cell: (row) => (
        <Link
          href={`/dashboard/users/${row.id}`}
          className="font-semibold text-[#5C3D2E] underline-offset-2 hover:underline"
        >
          {row.email}
        </Link>
      ),
    },
    {
      header: 'Name',
      cell: (row) => <span>{row.display_name || '—'}</span>,
    },
    {
      header: 'Role',
      cell: (row) => (
        <span className={row.is_admin ? 'font-semibold text-[#8B4513]' : 'text-secondary'}>
          {row.is_admin ? 'Admin' : 'Member'}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (row) => (
        <span className={row.is_active ? 'text-emerald-700' : 'text-[#A80000]'}>
          {row.is_active ? 'Active' : 'Banned'}
        </span>
      ),
    },
    {
      header: 'Stories',
      cell: (row) => <span>{row.story_count}</span>,
    },
    {
      header: 'Joined',
      cell: (row) => <span>{FormatDateTime(row.created_at)}</span>,
    },
    {
      header: 'Last login',
      cell: (row) => <span>{row.last_login ? FormatDateTime(row.last_login) : '—'}</span>,
    },
  ];

  return (
    <div className="w-full space-y-6 rounded-md border border-[#F1E9E4] bg-[#F8F7F3] p-6">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="w-full md:max-w-md">
          <SearchField placeholder="Search email or name" queryKey="search" />
        </div>
        <div className="flex w-full flex-wrap items-center gap-3 md:w-auto">
          <Select value={isActive} onValueChange={(value) => setFilter('is_active', value)}>
            <SelectTrigger className="md:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Banned</SelectItem>
            </SelectContent>
          </Select>
          <Select value={isAdmin} onValueChange={(value) => setFilter('is_admin', value)}>
            <SelectTrigger className="md:w-40">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="true">Admins</SelectItem>
              <SelectItem value="false">Members</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        {isLoading || isFetching ? (
          <TableSkeleton SKELETON_COLS={7} />
        ) : users.length === 0 ? (
          <TableEmptyState message="No users found!" />
        ) : (
          <CustomTable columns={columns} data={users} />
        )}
      </div>
      {!isLoading && !isFetching && meta && <CustomPagination meta={meta} />}
    </div>
  );
}

export default UsersTable;
