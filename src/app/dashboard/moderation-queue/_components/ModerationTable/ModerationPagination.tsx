'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import useSetSearchQueryInURL from '@/hooks/useSetSearchQueryInURL';

interface PaginationProps {
  totalItems: number;
  limit: number;
}

const ModerationPagination = ({ totalItems, limit }: PaginationProps) => {
  const { setQuery, searchParams } = useSetSearchQueryInURL();

  const currentOffset = parseInt(searchParams.get('offset') || '0');
  const currentPage = Math.floor(currentOffset / limit) + 1;
  const totalPages = Math.ceil(totalItems / limit);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const nextOffset = (newPage - 1) * limit;
      setQuery('offset', nextOffset);
    }
  };

  if (totalPages <= 1) return null;
  return (
    <div className="mt-4 flex items-center justify-between border-t border-[#F1E9E4] pt-6">
      <p className="text-secondary text-sm">
        Showing <span className="font-medium">{currentOffset + 1}</span> to{' '}
        <span className="font-medium">{Math.min(currentOffset + limit, totalItems)}</span> of{' '}
        <span className="font-medium">{totalItems}</span> results
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="cursor-pointer rounded-md border border-[#F1E9E4] bg-white p-2 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft size={18} className="text-secondary" />
        </button>

        <div className="flex items-center gap-1">
          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            if (
              pageNum === 1 ||
              pageNum === totalPages ||
              (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
            ) {
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`cursor-pointer rounded-md px-3.5 py-1.5 text-sm font-medium transition-all ${
                    currentPage === pageNum
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-secondary border border-[#F1E9E4] bg-white hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
              return (
                <span key={pageNum} className="text-secondary px-1 text-xs">
                  ...
                </span>
              );
            }
            return null;
          })}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="cursor-pointer rounded-md border border-[#F1E9E4] bg-white p-2 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronRight size={18} className="text-secondary" />
        </button>
      </div>
    </div>
  );
};

export default ModerationPagination;
