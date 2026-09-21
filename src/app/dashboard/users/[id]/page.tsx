'use client';

import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  useDeleteAdminUserMutation,
  useGetAdminUserQuery,
  usePatchAdminUserMutation,
} from '@/redux/features/admin/adminUsers/adminUsers.api';
import { FormatDateTime } from '@/utils/formatDateTime';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

function UserDetailPage() {
  const params = useParams();
  const userId = String(params?.id || '');
  const router = useRouter();
  const { data, isLoading, isError } = useGetAdminUserQuery(userId, { skip: !userId });
  const [patchUser, { isLoading: patching }] = usePatchAdminUserMutation();
  const [deleteUser, { isLoading: deleting }] = useDeleteAdminUserMutation();
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState('');

  const user = data?.data;
  const expected = user?.email?.trim() || 'DELETE';
  const canDelete = confirmation.trim() === expected;

  const runPatch = async (body: { is_active?: boolean; is_admin?: boolean }, ok: string) => {
    try {
      const res = await patchUser({ userId, body }).unwrap();
      if (res?.success) toast.success(res.message || ok);
    } catch (err: unknown) {
      const detail =
        err && typeof err === 'object' && 'data' in err
          ? (err as { data?: { message?: string; detail?: string } }).data?.message ||
            (err as { data?: { detail?: string } }).data?.detail
          : undefined;
      toast.error(detail || 'Update failed');
    }
  };

  const handleDelete = async () => {
    if (!canDelete) return;
    try {
      const res = await deleteUser(userId).unwrap();
      if (res?.success) {
        const wiped = res?.data?.stories_deleted ?? 0;
        toast.success(res.message || `User deleted (${wiped} stories wiped)`);
      }
      router.push('/dashboard/users');
    } catch (err: unknown) {
      const detail =
        err && typeof err === 'object' && 'data' in err
          ? (err as { data?: { message?: string } }).data?.message
          : undefined;
      toast.error(detail || 'Delete failed');
    }
  };

  if (isLoading) {
    return <p className="text-secondary p-6 text-sm">Loading user…</p>;
  }

  if (isError || !user) {
    return (
      <div className="space-y-4 p-6">
        <Link
          href="/dashboard/users"
          className="text-secondary inline-flex items-center gap-2 text-sm"
        >
          <ArrowLeft size={14} /> Back to users
        </Link>
        <p className="text-[#A80000]">User not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/users"
          className="text-secondary inline-flex items-center gap-1 text-sm hover:underline"
        >
          <ArrowLeft size={14} /> Users
        </Link>
      </div>
      <DynamicPageHeader title={user.email} />

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4 rounded-md border border-[#F1E9E4] bg-[#F8F7F3] p-6">
          <h2 className="text-sm font-semibold tracking-wide text-[#5C3D2E] uppercase">Account</h2>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-secondary text-xs">Display name</dt>
              <dd>{user.display_name || user.profile?.true_name || '—'}</dd>
            </div>
            <div>
              <dt className="text-secondary text-xs">Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt className="text-secondary text-xs">Role</dt>
              <dd>{user.is_admin ? 'Admin' : 'Member'}</dd>
            </div>
            <div>
              <dt className="text-secondary text-xs">Status</dt>
              <dd className={user.is_active ? 'text-emerald-700' : 'text-[#A80000]'}>
                {user.is_active ? 'Active' : 'Banned'}
              </dd>
            </div>
            <div>
              <dt className="text-secondary text-xs">Stories</dt>
              <dd>{user.story_count}</dd>
            </div>
            <div>
              <dt className="text-secondary text-xs">Credits today</dt>
              <dd>{user.credits_remaining ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-secondary text-xs">Subscription</dt>
              <dd>{user.has_active_subscription ? 'Active' : 'None'}</dd>
            </div>
            <div>
              <dt className="text-secondary text-xs">Joined</dt>
              <dd>{FormatDateTime(user.created_at)}</dd>
            </div>
            <div>
              <dt className="text-secondary text-xs">Last login</dt>
              <dd>{user.last_login ? FormatDateTime(user.last_login) : '—'}</dd>
            </div>
            <div>
              <dt className="text-secondary text-xs">Place</dt>
              <dd>
                {[user.profile?.city, user.profile?.country].filter(Boolean).join(', ') || '—'}
              </dd>
            </div>
          </dl>
        </div>

        <div className="space-y-4">
          <div className="space-y-3 rounded-md border border-[#F1E9E4] bg-white p-4">
            <h2 className="text-sm font-semibold tracking-wide text-[#5C3D2E] uppercase">
              Actions
            </h2>
            {user.is_active ? (
              <Button
                variant="outline"
                className="w-full"
                disabled={patching}
                onClick={() => runPatch({ is_active: false }, 'User banned')}
              >
                Ban user
              </Button>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                disabled={patching}
                onClick={() => runPatch({ is_active: true }, 'User unbanned')}
              >
                Unban user
              </Button>
            )}
            {user.is_admin ? (
              <Button
                variant="outline"
                className="w-full"
                disabled={patching}
                onClick={() => runPatch({ is_admin: false }, 'Admin demoted')}
              >
                Remove admin
              </Button>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                disabled={patching}
                onClick={() => runPatch({ is_admin: true }, 'User promoted to admin')}
              >
                Make admin
              </Button>
            )}
          </div>

          <div className="rounded-xl border border-[#E5CDCD] bg-[#FFF8F8] p-4">
            <span className="text-[11px] font-bold tracking-wider text-[#A80000] uppercase">
              Danger zone
            </span>
            <p className="mt-1 mb-3 text-[11px] text-[#8A6E5F]">
              Hard delete wipes this account and all of their stories, feedback, journeys and
              billing rows.
            </p>

            <Dialog
              open={open}
              onOpenChange={(next) => {
                setOpen(next);
                if (!next) setConfirmation('');
              }}
            >
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-[#E5CDCD] bg-white px-4 py-2 text-sm font-medium text-[#A80000] hover:bg-[#FFF5F5]"
                >
                  <Trash2 size={14} /> Delete user permanently
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Delete this user?</DialogTitle>
                  <DialogDescription>
                    This cannot be undone. Type <span className="font-semibold">{expected}</span> to
                    confirm.
                  </DialogDescription>
                </DialogHeader>
                <input
                  value={confirmation}
                  onChange={(event) => setConfirmation(event.target.value)}
                  placeholder={expected}
                  className="w-full rounded-md border border-[#E1D7CE] bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#C82323]/30"
                />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)} disabled={deleting}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={!canDelete || deleting}
                  >
                    {deleting ? 'Deleting…' : 'Delete permanently'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetailPage;
