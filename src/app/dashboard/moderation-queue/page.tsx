import { redirect } from 'next/navigation';

export default function ModerationQueueRedirect() {
  redirect('/dashboard/publications');
}
