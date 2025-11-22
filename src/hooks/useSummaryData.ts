import { useMemo } from 'react';
import {
  useExtractionData,
  ExtractionRowData,
} from '@/contexts/ExtractionDataContext';
import { getSymbolById } from '@/models/symbols';

export interface DeviceRow {
  id: string;
  pageNumber: number;
  icons: string[];
  nro: string;
  kuvateksti: string;
  suoja: string;
  kaapeli: string;
}

export interface AggregatedItem {
  id: string;
  iconType: string; // Serialized icon combination
  icons: string[];
  suoja: string;
  count: number;
  kaapeliTypes: string[]; // All unique cable types in this group
  hasCableMismatch: boolean; // Warning flag
  devices: DeviceRow[];
}

export interface AggregatedByProtection {
  suoja: string;
  count: number;
  devices: DeviceRow[];
}

export function useSummaryData() {
  const { extractionData } = useExtractionData();

  const processedData = useMemo(() => {
    const allDevices: DeviceRow[] = [];
    let rowCounter = 0;

    // Flatten all pages and rows into a single array of devices
    Object.entries(extractionData).forEach(([pageIndexStr, rows]) => {
      const pageNumber = parseInt(pageIndexStr, 10);

      rows.forEach((row: ExtractionRowData) => {
        // Only include rows that have at least some data
        if (
          row.nro ||
          row.kuvateksti ||
          row.suoja ||
          row.kaapeli ||
          (row.icons && row.icons.length > 0)
        ) {
          allDevices.push({
            id: `page-${pageNumber}-row-${rowCounter++}`,
            pageNumber: pageNumber + 1, // Display as 1-indexed
            icons: row.icons || [],
            nro: row.nro || '',
            kuvateksti: row.kuvateksti || '',
            suoja: row.suoja || '',
            kaapeli: row.kaapeli || '',
          });
        }
      });
    });

    // Calculate total count
    const totalCount = allDevices.length;

    // Aggregate by icon combination + suoja (protection value)
    const aggregationMap = new Map<string, AggregatedItem>();

    allDevices.forEach((device) => {
      if (device.icons.length > 0 && device.suoja) {
        // Create a unique key for icon combination + suoja
        const iconKey = device.icons.sort().join('+');
        const aggregationKey = `${iconKey}::${device.suoja}`;

        if (aggregationMap.has(aggregationKey)) {
          const existing = aggregationMap.get(aggregationKey)!;
          existing.count++;
          existing.devices.push(device);

          // Track cable types for mismatch detection
          if (
            device.kaapeli &&
            !existing.kaapeliTypes.includes(device.kaapeli)
          ) {
            existing.kaapeliTypes.push(device.kaapeli);
            if (existing.kaapeliTypes.length > 1) {
              existing.hasCableMismatch = true;
            }
          }
        } else {
          aggregationMap.set(aggregationKey, {
            id: aggregationKey,
            iconType: iconKey,
            icons: [...device.icons],
            suoja: device.suoja,
            count: 1,
            kaapeliTypes: device.kaapeli ? [device.kaapeli] : [],
            hasCableMismatch: false,
            devices: [device],
          });
        }
      }
    });

    const aggregatedItems = Array.from(aggregationMap.values()).sort(
      (a, b) => b.count - a.count
    );

    // Count unique icon types (regardless of suoja)
    const uniqueIconTypes = new Set(
      aggregatedItems.map((item) => item.iconType)
    ).size;

    // Aggregate by protection value (suoja)
    const protectionMap = new Map<string, AggregatedByProtection>();

    allDevices.forEach((device) => {
      if (device.suoja) {
        if (protectionMap.has(device.suoja)) {
          const existing = protectionMap.get(device.suoja)!;
          existing.count++;
          existing.devices.push(device);
        } else {
          protectionMap.set(device.suoja, {
            suoja: device.suoja,
            count: 1,
            devices: [device],
          });
        }
      }
    });

    const aggregatedByProtection = Array.from(protectionMap.values()).sort(
      (a, b) => b.count - a.count
    );
    const uniqueProtections = aggregatedByProtection.length;

    return {
      allDevices,
      totalCount,
      aggregatedItems,
      uniqueTypes: uniqueIconTypes,
      aggregatedByProtection,
      uniqueProtections,
    };
  }, [extractionData]);

  return processedData;
}
