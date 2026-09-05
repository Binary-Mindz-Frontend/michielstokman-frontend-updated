import { redirect } from 'next/navigation';

export default function VoiceReviewRedirect() {
  redirect('/dashboard/publications');
}
