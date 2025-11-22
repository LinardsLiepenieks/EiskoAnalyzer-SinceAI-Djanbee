'use client';

import * as XLSX from 'xlsx';
import {
  AggregatedItem,
  DeviceRow,
  AggregatedByProtection,
} from '@/hooks/useSummaryData';

interface ExportButtonProps {
  aggregatedItems: AggregatedItem[];
  allDevices: DeviceRow[];
  aggregatedByProtection: AggregatedByProtection[];
  totalCount: number;
}

export default function ExportButton({
  aggregatedItems,
  allDevices,
  aggregatedByProtection,
  totalCount,
}: ExportButtonProps) {
  const handleExport = () => {
    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Prepare Summary Section
    const summaryData: any[] = [];

    // Header
    summaryData.push({
      A: 'DEVICE SUMMARY',
      B: '',
      C: '',
      D: '',
    });

    // Column headers
    summaryData.push({
      A: 'Type',
      B: 'Suoja',
      C: 'Cable Types',
      D: 'Quantity',
    });

    // Aggregated items
    aggregatedItems.forEach((item) => {
      summaryData.push({
        A: item.icons.join(' + '),
        B: item.suoja,
        C:
          item.kaapeliTypes.join(', ') +
          (item.hasCableMismatch ? ' ⚠️ MISMATCH' : ''),
        D: item.count,
      });
    });

    // Total row
    summaryData.push({
      A: '',
      B: '',
      C: 'TOTAL:',
      D: totalCount,
    });

    // Empty row
    summaryData.push({
      A: '',
      B: '',
      C: '',
      D: '',
    });

    // Protection Breakdown Header
    summaryData.push({
      A: 'BY PROTECTION VALUE',
      B: '',
      C: '',
      D: '',
    });

    summaryData.push({
      A: 'Suoja',
      B: 'Count',
      C: 'Percentage',
      D: '',
    });

    // Protection breakdown
    aggregatedByProtection.forEach((item) => {
      const percentage =
        totalCount > 0 ? ((item.count / totalCount) * 100).toFixed(1) : '0.0';
      summaryData.push({
        A: item.suoja,
        B: item.count,
        C: `${percentage}%`,
        D: '',
      });
    });

    // Empty rows for separation
    summaryData.push({
      A: '',
      B: '',
      C: '',
      D: '',
    });
    summaryData.push({
      A: '',
      B: '',
      C: '',
      D: '',
    });

    // All Devices Header
    summaryData.push({
      A: 'ALL EXTRACTED DEVICES',
      B: '',
      C: '',
      D: '',
    });

    summaryData.push({
      A: 'Page',
      B: 'Type',
      C: 'NRo',
      D: 'Kuvateksti',
      E: 'Suoja',
      F: 'Kaapeli',
    });

    // All devices data
    allDevices.forEach((device) => {
      summaryData.push({
        A: device.pageNumber,
        B: device.icons.join(' + '),
        C: device.nro,
        D: device.kuvateksti,
        E: device.suoja,
        F: device.kaapeli,
      });
    });

    // Convert to sheet
    const worksheet = XLSX.utils.json_to_sheet(summaryData, {
      skipHeader: true,
    });

    // Set column widths
    worksheet['!cols'] = [
      { wch: 25 }, // A - Icons/Page
      { wch: 12 }, // B - Suoja/Icons
      { wch: 20 }, // C - Cable Types/NRo
      { wch: 30 }, // D - Quantity/Kuvateksti
      { wch: 10 }, // E - Suoja
      { wch: 20 }, // F - Kaapeli
    ];

    // Add the sheet
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Summary Report');

    // Generate filename with date
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0];
    const filename = `device-summary-${dateStr}.xlsx`;

    // Download
    XLSX.writeFile(workbook, filename);
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      Export to Excel
    </button>
  );
}
