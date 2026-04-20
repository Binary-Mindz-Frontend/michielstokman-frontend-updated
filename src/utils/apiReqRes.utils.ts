/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IGlobalErrorResponse, TQueryParam, TResponseRedux } from '@/types/apiResponse.types';
import { toast } from 'sonner';

// format global error response
export const formatGlobalErrorResponse = (error: any) => {
  const serverResponse = error?.data as any;

  return {
    success: serverResponse?.success ?? false,
    message: serverResponse?.data?.message || serverResponse?.message || 'Something went wrong',
    error: serverResponse?.data?.error || 'Error',
    statusCode: serverResponse?.data?.statusCode || error?.status || 500,
  };
};

//Construct query params
export const constructQueryParams = (args: TQueryParam[] | undefined): URLSearchParams => {
  const params = new URLSearchParams();
  if (args) {
    args.forEach((item) => {
      params.append(item.name, item.value as string);
    });
  }
  return params;
};

//Common transform response
export const commonTransformResponse = <T>(response: TResponseRedux<T>) => {
  return {
    data: response.data,
    meta: response.meta,
  };
};

/**
 * Catch a promise and return the resolved value or null if the promise is rejected.
 * If the promise is resolved, call onSuccess with the resolved value.
 * If the promise is rejected, call onError with the rejected value if provided, otherwise toast with a default error message.
 */
export const catchAsyncMutation = async <T>(
  mutationPromise: Promise<T>,
  onSuccess?: (res: T) => void,
  onError?: (err: IGlobalErrorResponse) => void,
): Promise<T | null> => {
  try {
    const res = await mutationPromise;

    if ((res as any)?.success) {
      if (onSuccess) onSuccess(res);
    }

    return res;
  } catch (err) {
    const error = err as IGlobalErrorResponse;
    toast.error(error.message || 'Something went wrong!');

    if (onError) {
      onError(error);
    }

    return null;
  }
};
