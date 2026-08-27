export type CoverImageMode = 'ai_generated' | 'user_uploaded';

/**
 * Build create-story payload for JSON or multipart submission.
 * Custom voice and cover image mode are independent — any combination works.
 */
export function buildStoryGeneratePayload(form: {
  story_type: string;
  title: string;
  first_name: string;
  story_input: string;
  growth_areas: string[];
  life_phase: string;
  tags: string[];
  high_intensity: boolean;
  voice_name?: string;
  use_custom_voice?: boolean;
  cover_mode: CoverImageMode;
}): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    story_type: form.story_type,
    title: form.title,
    first_name: form.first_name,
    story_input: form.story_input,
    growth_areas: form.growth_areas,
    life_phase: form.life_phase,
    tags: form.tags,
    high_intensity: form.high_intensity,
    image_mode: form.cover_mode,
  };

  if (form.use_custom_voice) {
    payload.use_custom_voice = true;
  } else if (form.voice_name) {
    payload.voice_name = form.voice_name;
  }

  return payload;
}

export function appendStoryPayloadToFormData(
  formData: FormData,
  payload: Record<string, unknown>,
): void {
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
      return;
    }
    if (typeof value === 'boolean') {
      formData.append(key, value ? 'true' : 'false');
      return;
    }
    formData.append(key, String(value));
  });
}
