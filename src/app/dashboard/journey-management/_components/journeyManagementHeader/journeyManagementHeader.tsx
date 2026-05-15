import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import { Button } from '@/components/ui/button';

function JourneyManagementHeader() {
  return (
    <div className="flex justify-between gap-4">
      <DynamicPageHeader title="Journey Management" />
      <Button className="btn-styles w-fit">Create New Journey</Button>
    </div>
  );
}

export default JourneyManagementHeader;
