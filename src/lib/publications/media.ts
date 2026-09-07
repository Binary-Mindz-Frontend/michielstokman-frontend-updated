/**
 * The API is inconsistent about media URLs: the voice-review list runs
 * `audio_path` through `format_media_url`, but the story detail endpoint returns
 * `audio_path` and `cover_image_url` exactly as stored. When media is served by
 * the backend rather than S3 those values are relative (`media/audio/x.mp3`), so
 * an <audio> or <Image> on this origin would resolve them against localhost and
 * fail. Absolutise them against the API origin instead.
 */

const API_ORIGIN = (() => {
  const base = process.env.NEXT_PUBLIC_BASE_API;
  if (!base) return '';
  try {
    return new URL(base).origin;
  } catch {
    return '';
  }
})();

const ABSOLUTE = /^(https?:|data:|blob:)/i;

export const resolveMediaUrl = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  if (ABSOLUTE.test(trimmed)) return trimmed;
  if (!API_ORIGIN) return trimmed;
  return `${API_ORIGIN}/${trimmed.replace(/^\/+/, '')}`;
};
