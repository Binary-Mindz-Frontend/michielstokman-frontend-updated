export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export type SubmitWizardFormValues = {
  submissionMode: 'studio' | 'human_ready';
  title: string;
  body: string;
  name: string;
  city: string;
  country: string;
  gender: string;
  sexualOrientation: string;
  occupation: string;
  age: string;
  background: string;
  personality: string;
  lifestyle: string;
  situation: string;
  highIntensity: boolean;
  voiceName: string;
  editorialConsent: boolean;
  termsAccepted: boolean;
};

export const SUBMIT_WIZARD_DEFAULTS: SubmitWizardFormValues = {
  submissionMode: 'studio',
  title: '',
  body: '',
  name: '',
  city: '',
  country: '',
  gender: '',
  sexualOrientation: '',
  occupation: '',
  age: '',
  background: '',
  personality: '',
  lifestyle: '',
  situation: '',
  highIntensity: false,
  voiceName: '',
  editorialConsent: false,
  termsAccepted: false,
};

export type SubmitWizardDraft = {
  step: number;
  values: SubmitWizardFormValues;
  hadAudio: boolean;
};

function draftKey(category: string) {
  return `submit_wizard_draft_${category}`;
}

export function loadSubmitWizardDraft(category: string): SubmitWizardDraft | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(draftKey(category));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SubmitWizardDraft>;
    if (!parsed || typeof parsed !== 'object') return null;
    return {
      step: typeof parsed.step === 'number' && parsed.step >= 0 ? parsed.step : 0,
      values: { ...SUBMIT_WIZARD_DEFAULTS, ...(parsed.values ?? {}) },
      hadAudio: Boolean(parsed.hadAudio),
    };
  } catch {
    return null;
  }
}

export function saveSubmitWizardDraft(category: string, draft: SubmitWizardDraft) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(draftKey(category), JSON.stringify(draft));
  } catch {
    // Ignore quota / private-mode failures.
  }
}

export function clearSubmitWizardDraft(category: string) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(draftKey(category));
  } catch {
    // Ignore storage failures.
  }
}

export function isSubmitWizardDraftDirty(values: SubmitWizardFormValues, step: number): boolean {
  if (step > 0) return true;
  return Boolean(
    values.title.trim() ||
    values.body.trim() ||
    values.name.trim() ||
    values.city.trim() ||
    values.country.trim() ||
    values.gender.trim() ||
    values.sexualOrientation.trim() ||
    values.occupation.trim() ||
    values.age.trim() ||
    values.background.trim() ||
    values.personality.trim() ||
    values.lifestyle.trim() ||
    values.situation.trim() ||
    values.highIntensity ||
    values.voiceName.trim() ||
    values.editorialConsent ||
    values.termsAccepted ||
    values.submissionMode !== 'studio',
  );
}
