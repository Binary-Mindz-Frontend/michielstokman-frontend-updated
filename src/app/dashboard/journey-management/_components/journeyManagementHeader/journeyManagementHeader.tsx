import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function JourneyManagementHeader() {
  return (
    <div className="flex justify-between gap-4">
      <DynamicPageHeader title="Liberations" />

      <Link href={'/dashboard/journey-management/create'}>
        <Button className="btn-styles w-fit">Create New Journey</Button>
      </Link>
    </div>
  );
}

export default JourneyManagementHeader;
