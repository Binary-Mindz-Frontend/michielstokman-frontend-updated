import React from 'react';

const ProductCardSkeleton = () => {
  return (
    <div className="flex h-full flex-col justify-between rounded-md bg-[#F8F3ED] p-4">
      <div className="animate-pulse">
        {/* Top Image Box */}
        <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-md bg-[#EADED5]" />

        {/* Category Label */}
        <div className="mb-2 h-3 w-20 rounded bg-[#EADED5]" />

        {/* Title */}
        <div className="mt-1 mb-3 h-6 w-3/4 rounded bg-[#EADED5]" />

        {/* Description Excerpt */}
        <div className="mb-4 space-y-2">
          <div className="h-3 w-full rounded bg-[#EADED5]" />
          <div className="h-3 w-full rounded bg-[#EADED5]" />
          <div className="h-3 w-4/5 rounded bg-[#EADED5]" />
        </div>

        {/* Identity + audio meta */}
        <div className="my-2 space-y-2">
          <div className="h-3 w-2/5 rounded bg-[#EADED5]" />
          <div className="h-3 w-3/5 rounded bg-[#EADED5]" />
          <div className="h-3 w-1/2 rounded bg-[#EADED5]" />
        </div>
      </div>

      {/* Start Listening Action Button */}
      <div className="mt-2 animate-pulse">
        <div className="h-10 w-full rounded border-2 border-transparent bg-[#EADED5]" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
