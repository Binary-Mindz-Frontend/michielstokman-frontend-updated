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

  const apiError = error as ApiErrorShape & {
    data?: {
      message?: string;
      detail?: string | Array<{ msg?: string }>;
    };
  };

  if (apiError.status === 401 || apiError.status === 403) {
    return 'Please sign in again to view this story.';
  }

  if (typeof apiError.data?.message === 'string' && apiError.data.message.trim()) {
    return apiError.data.message;
  }

  const detail = apiError.data?.detail;
  if (typeof detail === 'string' && detail.trim()) {
    return detail;
  }

  if (apiError.status === 500) {
    return 'Something went wrong loading this story. Please try again.';
  }

  return 'Story not found.';
}
