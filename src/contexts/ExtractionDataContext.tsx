'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';

export interface ExtractionRowData {
  icons?: string[];
  nro?: string;
  kuvateksti?: string;
  suoja?: string;
  kaapeli?: string;
}

// Map of pageIndex -> array of row data
export type PageExtractionData = Record<number, ExtractionRowData[]>;

interface ExtractionDataContextType {
  extractionData: PageExtractionData;
  setExtractionData: (data: PageExtractionData) => void;
  updatePageData: (pageIndex: number, rowData: ExtractionRowData[]) => void;
  updateRowData: (
    pageIndex: number,
    rowIndex: number,
    rowData: ExtractionRowData
  ) => void;
  getPageData: (pageIndex: number) => ExtractionRowData[];
  getRowData: (
    pageIndex: number,
    rowIndex: number
  ) => ExtractionRowData | undefined;
}

const ExtractionDataContext = createContext<
  ExtractionDataContextType | undefined
>(undefined);

export function ExtractionDataProvider({ children }: { children: ReactNode }) {
  const [extractionData, setExtractionData] = useState<PageExtractionData>({
    // Dummy data for development
    0: [
      {
        icons: ['TULPPAVAROKE_3'],
        nro: '12',
        kuvateksti: 'Aurinkovoimalat',
        suoja: 'C25',
      },
      {
        icons: ['TULPPAVAROKE_3'],
        nro: '13',
        kuvateksti: 'Varalla',
        suoja: 'C16',
      },
      {
        icons: ['JOHDONSUOJA_1'],
        nro: '14',
        kuvateksti: 'Varalla',
        suoja: 'C16',
      },
    ],
  });

  const updatePageData = useCallback(
    (pageIndex: number, rowData: ExtractionRowData[]) => {
      setExtractionData((prev) => ({
        ...prev,
        [pageIndex]: rowData,
      }));
    },
    []
  );

  const updateRowData = useCallback(
    (pageIndex: number, rowIndex: number, rowData: ExtractionRowData) => {
      setExtractionData((prev) => {
        const pageData = prev[pageIndex] || [];
        const newPageData = [...pageData];
        newPageData[rowIndex] = rowData;
        return {
          ...prev,
          [pageIndex]: newPageData,
        };
      });
    },
    []
  );

  const getPageData = useCallback(
    (pageIndex: number): ExtractionRowData[] => {
      return extractionData[pageIndex] || [];
    },
    [extractionData]
  );

  const getRowData = useCallback(
    (pageIndex: number, rowIndex: number): ExtractionRowData | undefined => {
      const pageData = extractionData[pageIndex];
      return pageData ? pageData[rowIndex] : undefined;
    },
    [extractionData]
  );

  return (
    <ExtractionDataContext.Provider
      value={{
        extractionData,
        setExtractionData,
        updatePageData,
        updateRowData,
        getPageData,
        getRowData,
      }}
    >
      {children}
    </ExtractionDataContext.Provider>
  );
}

export function useExtractionData() {
  const context = useContext(ExtractionDataContext);
  if (context === undefined) {
    throw new Error(
      'useExtractionData must be used within an ExtractionDataProvider'
    );
  }
  return context;
}
