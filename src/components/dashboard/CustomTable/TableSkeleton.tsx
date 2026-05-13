const SKELETON_ROWS = 6;
const SKELETON_COLS = 7;

const TableSkeleton = () => {
  return (
    <div className="text-secondary overflow-x-auto rounded-md bg-[#F5F2F0]">
      <table className="divide-primary/10 min-w-full divide-y">
        <thead>
          <tr>
            {Array.from({ length: SKELETON_COLS }).map((_, i) => (
              <th key={i} className="px-6 py-4">
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-primary/10 divide-y">
          {Array.from({ length: SKELETON_ROWS }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: SKELETON_COLS }).map((_, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  <div className="h-4 animate-pulse rounded bg-gray-200" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;
