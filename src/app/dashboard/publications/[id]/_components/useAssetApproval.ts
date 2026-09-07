'use client';

import { apiErrorMessage } from '@/lib/publications/apiError';
import {
  useApprovePublicationAssetMutation,
  type PublicationAsset,
} from '@/redux/features/admin/adminModeration/adminModeration.api';
import { useCallback } from 'react';
import { toast } from 'sonner';

/**
 * Approve one asset of a publication, or send it back for review. The server
 * refuses to approve an asset that does not exist yet and says why.
 */
export const useAssetApproval = (storyId: string, asset: PublicationAsset) => {
  const [approveAsset, { isLoading }] = useApprovePublicationAssetMutation();

  const setApproved = useCallback(
    async (approved: boolean) => {
      try {
        const res = await approveAsset({ storyId, asset, approved }).unwrap();
        if (res?.success) toast.success(res.message || 'Saved');
        return true;
      } catch (error) {
        toast.error(apiErrorMessage(error, 'Could not update the approval'));
        return false;
      }
    },
    [approveAsset, asset, storyId],
  );

  return { setApproved, isLoading };
};
