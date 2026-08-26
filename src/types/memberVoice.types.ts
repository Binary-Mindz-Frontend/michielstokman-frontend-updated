export type CustomVoiceResponse = {
  has_custom_voice: boolean;
  voice_name?: string | null;
  created_at?: string | null;
  message: string;
};

export type UploadCustomVoiceArgs = {
  recordings: File[];
  displayName?: string;
};
