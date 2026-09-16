import { apiClient } from '@/redux/apiClient/apiClient';

export type AdminUserListItem = {
  id: string;
  email: string;
  display_name?: string | null;
  is_active: boolean;
  is_admin: boolean;
  is_verified: boolean;
  story_count: number;
  created_at: string;
  last_login?: string | null;
};

export type AdminUserDetail = AdminUserListItem & {
  is_profile_setup: boolean;
  token_version: number;
  profile?: {
    true_name?: string | null;
    city?: string | null;
    country?: string | null;
    gender?: string | null;
    profile_image_url?: string | null;
  } | null;
  credits_remaining?: number | null;
  has_active_subscription: boolean;
};

export const adminUsersApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getAdminUsers: builder.query({
      query: ({
        q,
        is_active,
        is_admin,
        page = 1,
        limit = 20,
      }: {
        q?: string;
        is_active?: string;
        is_admin?: string;
        page?: number;
        limit?: number;
      }) => {
        const params = new URLSearchParams();
        if (q) params.append('q', q);
        if (is_active === 'true' || is_active === 'false') {
          params.append('is_active', is_active);
        }
        if (is_admin === 'true' || is_admin === 'false') {
          params.append('is_admin', is_admin);
        }
        params.append('page', String(page));
        params.append('limit', String(limit));
        return { url: `/admin/users?${params.toString()}`, method: 'GET' };
      },
      providesTags: ['AdminUsers'],
    }),

    getAdminUser: builder.query({
      query: (userId: string) => ({
        url: `/admin/users/${userId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, userId) => [{ type: 'AdminUsers', id: userId }],
    }),

    patchAdminUser: builder.mutation({
      query: ({
        userId,
        body,
      }: {
        userId: string;
        body: { is_active?: boolean; is_admin?: boolean };
      }) => ({
        url: `/admin/users/${userId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        'AdminUsers',
        { type: 'AdminUsers', id: userId },
      ],
    }),

    deleteAdminUser: builder.mutation({
      query: (userId: string) => ({
        url: `/admin/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminUsers', 'ModerationQueue', 'MemberStories'],
    }),
  }),
});

export const {
  useGetAdminUsersQuery,
  useGetAdminUserQuery,
  usePatchAdminUserMutation,
  useDeleteAdminUserMutation,
} = adminUsersApi;
