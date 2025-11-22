'use client';

import { AggregatedItem } from '@/hooks/useSummaryData';
import { getSymbolById } from '@/models/symbols';

interface SummaryTableProps {
  data: AggregatedItem[];
  totalCount: number;
}

export default function SummaryTable({ data, totalCount }: SummaryTableProps) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">Device Summary</h2>
        <p className="text-sm text-gray-400 mt-1">
          Aggregated by icon combination and protection value
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-750 border-b border-gray-700">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Icons
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Suoja
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Cable Types
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Quantity
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-750 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {item.icons.map((iconId, idx) => {
                      const symbol = getSymbolById(iconId);
                      return symbol ? (
                        <div
                          key={idx}
                          className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center"
                        >
                          <img
                            src={`/el_icons/${symbol.iconFileName}`}
                            alt={symbol.name}
                            className="w-6 h-6 object-contain"
                          />
                        </div>
                      ) : null;
                    })}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900 text-yellow-200">
                    {item.suoja}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    {item.kaapeliTypes.length > 0 ? (
                      item.kaapeliTypes.map((cable, idx) => (
                        <span key={idx} className="text-xs text-gray-300">
                          {cable}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500 italic">-</span>
                    )}
                    {item.hasCableMismatch && (
                      <span className="text-xs text-orange-400 flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Mismatch
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded bg-blue-600 text-white text-sm font-semibold">
                    {item.count}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-900 border-t-2 border-gray-600">
              <td colSpan={3} className="px-4 py-4 text-right">
                <span className="text-sm font-medium text-gray-300">
                  Total Devices:
                </span>
              </td>
              <td className="px-4 py-4 text-right">
                <span className="inline-flex items-center justify-center min-w-[3rem] px-3 py-1 rounded bg-green-600 text-white text-lg font-bold">
                  {totalCount}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
