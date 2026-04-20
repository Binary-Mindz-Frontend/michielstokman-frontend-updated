export type TModerationStatus = 'Approved' | 'Rejected' | 'Pending';

export interface IModerationData {
  id: number | string;
  title: string;
  image: string;
  type: string;
  author: string;
  date: string;
  status: TModerationStatus;
}
