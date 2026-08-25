import { toast } from 'sonner';

type AppToastOptions = {
  description?: string;
};

/**
 * Brand toast helper — uses the global Sonner toaster in `layout.tsx`
 * (Playpen, cream card, #D22D4C error / #486221 success).
 * Reuse anywhere instead of calling `toast` directly.
 */
export const appToast = {
  error: (message: string, options?: AppToastOptions) => toast.error(message, options),
  success: (message: string, options?: AppToastOptions) => toast.success(message, options),
  warning: (message: string, options?: AppToastOptions) => toast.warning(message, options),
  info: (message: string, options?: AppToastOptions) => toast.info(message, options),
};
