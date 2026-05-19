export interface IPhotoManagementData {
  id: string | number;
  image_url: string | null;
  story_type: string;
  is_active?: boolean;
  uploaded_by?: string;
  created_at?: string;
  updated_at?: string;
}
