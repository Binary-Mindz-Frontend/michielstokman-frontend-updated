import { redirect } from 'next/navigation';

export default function PhotoManagementRedirect() {
  redirect('/dashboard/publications');
}
