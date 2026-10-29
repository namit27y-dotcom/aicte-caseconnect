import React from 'react';

interface DataTableProps {
  ariaLabel: string;
  headers: React.ReactNode[];
  children: React.ReactNode;
  isEmpty?: boolean;
  emptyState?: React.ReactNode;
  className?: string;
}

export const DataTable: React.FC<DataTableProps> = ({
  ariaLabel,
  headers,
  children,
  isEmpty = false,
  emptyState,
  className = '',
}) => {
  return (
    <div className={`bg-white border border-[#E6E1D8] rounded-lg shadow-2xs overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs" aria-label={ariaLabel}>
          <thead>
            <tr className="bg-[#FAF8F5] border-b border-[#E6E1D8] text-[11px] font-semibold text-[#5C6460] uppercase tracking-wider">
              {headers.map((header, idx) => (
                <th key={idx} className="py-3 px-4 font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E6E1D8]">
            {isEmpty ? (
              <tr>
                <td colSpan={headers.length} className="py-12 px-4 text-center">
                  {emptyState}
                </td>
              </tr>
            ) : (
              children
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
