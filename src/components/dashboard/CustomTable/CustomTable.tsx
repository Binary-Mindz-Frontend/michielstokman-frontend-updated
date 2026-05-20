import { ITableProps } from '@/types/custom-table.types';

const CustomTable = <T extends object>({ columns, data }: ITableProps<T>) => {
  return (
    <div className="text-secondary overflow-x-auto rounded-md bg-[#F5F2F0]">
      <table className="divide-primary/10 min-w-full divide-y">
        <thead>
          <tr>
            {columns?.map((column, index) => (
              <th
                key={index}
                scope="col"
                className="text-primary px-6 py-4 text-left text-sm font-semibold tracking-wider text-nowrap"
              >
                {column?.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-primary/10 divide-y">
          {data?.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-6 py-4 text-sm whitespace-nowrap">
                  {'accessor' in column && column.accessor
                    ? String(row[column.accessor] ?? '')
                    : column.cell?.(row, rowIndex)}{' '}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
