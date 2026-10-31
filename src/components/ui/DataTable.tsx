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
    <div className={`bg-white border border-[#E7E4DB] rounded-lg shadow-2xs overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs" aria-label={ariaLabel}>
          <thead>
            <tr className="bg-[#F7F5EF] border-b border-[#E7E4DB] text-[11px] font-semibold text-[#737A72] uppercase tracking-wider">
              {headers.map((header, idx) => (
                <th key={idx} className="py-3 px-4 font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7E4DB]">
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

