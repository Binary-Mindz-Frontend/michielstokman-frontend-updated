type ApiErrorShape = {
  status?: number;
  data?: {
    message?: string;
  };
};

export function getMemberStoryQueryErrorMessage(error: unknown): string {
  if (!error || typeof error !== 'object') {
    return 'Story not found.';
  }

  const apiError = error as ApiErrorShape;

  if (apiError.status === 401 || apiError.status === 403) {
    return 'Please sign in again to view this story.';
  }

  if (typeof apiError.data?.message === 'string' && apiError.data.message.trim()) {
    return apiError.data.message;
  }

  return 'Story not found.';
}
