import { Inbox } from 'lucide-react';

const TableEmptyState = ({ message = 'No records found.' }: { message?: string }) => {
  return (
    <div className="text-secondary overflow-x-auto rounded-md bg-[#F5F2F0]">
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-400">
        <Inbox size={40} strokeWidth={1.5} />
        <p className="text-base">{message}</p>
      </div>
    </div>
  );
};

export default TableEmptyState;
