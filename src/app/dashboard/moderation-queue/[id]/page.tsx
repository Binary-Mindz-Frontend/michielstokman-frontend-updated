import { redirect } from 'next/navigation';

export default async function ModerationDeskRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/dashboard/publications/${id}`);
}
