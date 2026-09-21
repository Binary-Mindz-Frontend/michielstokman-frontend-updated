/**
 * Pull a readable message out of an RTK Query error.
 *
 * Successful admin responses are wrapped as `{ message, data }`, but a raised
 * HTTPException comes back as FastAPI's `{ detail }` — which is where the useful
 * text lives when publishing is refused or an upload is rejected.
 */
export const apiErrorMessage = (error: unknown, fallback: string): string => {
  if (!error || typeof error !== 'object' || !('data' in error)) return fallback;

  const data = (error as { data?: unknown }).data;
  if (typeof data === 'string') return data || fallback;
  if (!data || typeof data !== 'object') return fallback;

  const record = data as { message?: unknown; detail?: unknown };
  const text = record.message ?? record.detail;
  return typeof text === 'string' && text.trim() ? text : fallback;
};
