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
  showCable: boolean;
  separateInputOutput: boolean;
}

export default function ExportButton({
  aggregatedItems,
  allDevices,
  aggregatedByProtection,
  totalCount,
  showCable,
  separateInputOutput,
}: ExportButtonProps) {
  const parseSuoja = (suoja: string) => {
    if (separateInputOutput && suoja.includes('/')) {
      const [input, output] = suoja.split('/').map((s) => s.trim());
      return { input, output };
    }
    return { input: suoja, output: null };
  };

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
      E: '',
      F: '',
    });

    // Column headers - conditional based on showCable and separateInputOutput
    const headers: any = {
      A: 'Type',
    };

    let currentCol = 'B';
    if (separateInputOutput) {
      headers[currentCol] = 'Suoja Input';
      currentCol = String.fromCharCode(currentCol.charCodeAt(0) + 1);
      headers[currentCol] = 'Suoja Output';
      currentCol = String.fromCharCode(currentCol.charCodeAt(0) + 1);
    } else {
      headers[currentCol] = 'Suoja';
      currentCol = String.fromCharCode(currentCol.charCodeAt(0) + 1);
    }

    if (showCable) {
      headers[currentCol] = 'Cable Types';
      currentCol = String.fromCharCode(currentCol.charCodeAt(0) + 1);
    }

    headers[currentCol] = 'Quantity';
    summaryData.push(headers);

    // Aggregated items
    aggregatedItems.forEach((item) => {
      const { input, output } = parseSuoja(item.suoja);
      const row: any = {
        A: item.icons.join(' + '),
      };

      let col = 'B';
      if (separateInputOutput) {
        row[col] = input;
        col = String.fromCharCode(col.charCodeAt(0) + 1);
        row[col] = output || '';
        col = String.fromCharCode(col.charCodeAt(0) + 1);
      } else {
        row[col] = item.suoja;
        col = String.fromCharCode(col.charCodeAt(0) + 1);
      }

      if (showCable) {
        row[col] =
          item.kaapeliTypes.join(', ') +
          (item.hasCableMismatch ? ' ⚠️ MISMATCH' : '');
        col = String.fromCharCode(col.charCodeAt(0) + 1);
      }

      row[col] = item.count;
      summaryData.push(row);
    });

    // Total row
    const totalRow: any = {};
    let totalCol = 'A';

    if (separateInputOutput) {
      totalCol = 'C';
    } else {
      totalCol = 'B';
    }

    if (showCable) {
      totalCol = String.fromCharCode(totalCol.charCodeAt(0) + 1);
    }

    totalRow[totalCol] = 'TOTAL:';
    totalRow[String.fromCharCode(totalCol.charCodeAt(0) + 1)] = totalCount;
    summaryData.push(totalRow);

    // Empty row to separate sections
    summaryData.push({});

    // Prepare a separate sheet for ALL EXTRACTED DEVICES
    const devicesData: any[] = [];

    // All Devices Header (will go to second sheet)
    devicesData.push({ A: 'ALL EXTRACTED DEVICES' });

    // Column headers for all devices
    const deviceHeaders: any = {
      A: 'Page',
      B: 'Type',
      C: 'NRo',
      D: 'Kuvateksti',
    };

    let deviceCol = 'E';
    if (separateInputOutput) {
      deviceHeaders[deviceCol] = 'Suoja Input';
      deviceCol = String.fromCharCode(deviceCol.charCodeAt(0) + 1);
      deviceHeaders[deviceCol] = 'Suoja Output';
      deviceCol = String.fromCharCode(deviceCol.charCodeAt(0) + 1);
    } else {
      deviceHeaders[deviceCol] = 'Suoja';
      deviceCol = String.fromCharCode(deviceCol.charCodeAt(0) + 1);
    }

    if (showCable) {
      deviceHeaders[deviceCol] = 'Kaapeli';
    }

    devicesData.push(deviceHeaders);

    // All devices data (goes to devicesData, not summaryData)
    allDevices.forEach((device) => {
      const { input, output } = parseSuoja(device.suoja);
      const deviceRow: any = {
        A: device.pageNumber,
        B: device.icons.join(' + '),
        C: device.nro,
        D: device.kuvateksti,
      };

      let col = 'E';
      if (separateInputOutput) {
        deviceRow[col] = input;
        col = String.fromCharCode(col.charCodeAt(0) + 1);
        deviceRow[col] = output || '';
        col = String.fromCharCode(col.charCodeAt(0) + 1);
      } else {
        deviceRow[col] = device.suoja;
        col = String.fromCharCode(col.charCodeAt(0) + 1);
      }

      if (showCable) {
        deviceRow[col] = device.kaapeli;
      }

      devicesData.push(deviceRow);
    });

    // Convert summary to first sheet
    const worksheet = XLSX.utils.json_to_sheet(summaryData, {
      skipHeader: true,
    });

    // Set column widths - adjust based on options (Summary sheet)
    const colWidths = [
      { wch: 25 }, // A - Icons/Page
      { wch: 12 }, // B - Type/Suoja Input
    ];

    if (separateInputOutput) {
      colWidths.push({ wch: 12 }); // C - Suoja Output
    }

    colWidths.push({ wch: 20 }); // NRo
    colWidths.push({ wch: 30 }); // Kuvateksti

    if (!separateInputOutput) {
      colWidths.push({ wch: 10 }); // Suoja (if not separated)
    }

    if (showCable) {
      colWidths.push({ wch: 20 }); // Kaapeli
    }

    worksheet['!cols'] = colWidths;

    // Add the summary sheet as first sheet
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Summary Report');

    // Convert devicesData to second sheet
    const devicesSheet = XLSX.utils.json_to_sheet(devicesData, {
      skipHeader: true,
    });

    // Column widths for devices sheet
    const devCols: any[] = [
      { wch: 8 }, // Page
      { wch: 25 }, // Type
      { wch: 12 }, // NRo
      { wch: 30 }, // Kuvateksti
    ];
    if (!separateInputOutput) {
      devCols.push({ wch: 12 }); // Suoja
    } else {
      devCols.push({ wch: 12 }); // Suoja Input
      devCols.push({ wch: 12 }); // Suoja Output
    }
    if (showCable) {
      devCols.push({ wch: 20 }); // Kaapeli
    }
    devicesSheet['!cols'] = devCols;

    // Add the devices sheet as second sheet
    XLSX.utils.book_append_sheet(workbook, devicesSheet, 'All Devices');

    // Generate filename with date
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0];
    const filename = `device-summary-${dateStr}.xlsx`;

    // Download workbook with two sheets
    XLSX.writeFile(workbook, filename);
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
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
