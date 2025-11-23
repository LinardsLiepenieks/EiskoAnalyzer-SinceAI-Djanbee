'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { PageExtractionData, ExtractionRowData } from './ExtractionDataContext';
import { getSymbolByName, getSymbolByApiId } from '@/models/symbols';

interface PDFContextType {
  pdfFile: string | null;
  setPdfFile: (file: string | null) => void;
  uploadPDF: (
    file: File,
    setExtractionData?: (data: PageExtractionData) => void
  ) => Promise<any>;
  uploadStatus: 'idle' | 'uploading' | 'success' | 'error';
  uploadError: string | null;
  extractionResult: any;
}

const PDFContext = createContext<PDFContextType | undefined>(undefined);

// Transform API response to ExtractionDataContext format
function transformExtractionData(apiData: any): PageExtractionData {
  const transformed: PageExtractionData = {};

  if (!apiData?.pages) return transformed;

  apiData.pages.forEach((page: any) => {
    const pageIndex = (page.page_number ?? page.page_number) - 1; // Convert to 0-based index

    transformed[pageIndex] = (page.rows || []).map((row: any) => {
      const rowData: ExtractionRowData = {
        nro: String(row.row_index ?? ''),
        kuvateksti: row.kuvaus ?? row.kuvateksti ?? '',
        suoja: row.suoja ?? '',
        kaapeli: row.kaapeli ?? '',
      };

      // The extractor returns `symbols: ["NAME_OR_APIID"]` (and symbol_scores).
      // Map each returned symbol to an internal `Symbol.id`.
      const symbolsList: string[] =
        row.symbols || row.symbol
          ? Array.isArray(row.symbols)
            ? row.symbols
            : [row.symbol]
          : [];

      if (symbolsList.length > 0) {
        const mapped: string[] = [];

        symbolsList.forEach((s: string) => {
          const key = String(s || '').trim();
          if (!key) return;

          // Try matching by human-readable name first, then by apiId.
          const byName = getSymbolByName(key);
          if (byName) {
            mapped.push(byName.id);
            console.log(`✓ Mapped symbol "${key}" → "${byName.id}" (by name)`);
            return;
          }

          const byApi = getSymbolByApiId ? getSymbolByApiId(key) : undefined;
          if (byApi) {
            mapped.push(byApi.id);
            console.log(`✓ Mapped symbol "${key}" → "${byApi.id}" (by apiId)`);
            return;
          }

          console.warn(`⚠️ Unknown symbol from extractor: "${key}"`);
        });

        if (mapped.length > 0) {
          rowData.icons = mapped;
        }
      }

      return rowData;
    });
  });

  return transformed;
}

export function PDFProvider({ children }: { children: ReactNode }) {
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    'idle' | 'uploading' | 'success' | 'error'
  >('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [extractionResult, setExtractionResult] = useState<any>(null);

  const uploadPDF = async (
    file: File,
    setExtractionData?: (data: PageExtractionData) => void
  ) => {
    setUploadStatus('uploading');
    setUploadError(null);
    setExtractionResult(null);

    console.log('📤 Starting PDF upload...', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });

    try {
      // Read file as data URL for local display
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Store locally for immediate display
      setPdfFile(dataUrl);
      localStorage.setItem('uploadedPDF', dataUrl);

      // Upload to backend and extract
      const formData = new FormData();
      formData.append('file', file);

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000';
      const extractUrl = `${apiUrl}/extract`;

      console.log('🚀 Calling extraction endpoint:', extractUrl);

      const response = await fetch(extractUrl, {
        method: 'POST',
        body: formData,
      });

      console.log('📡 Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();

      console.log('✅ Extraction successful!');
      console.log('📊 Extraction Result:', JSON.stringify(data, null, 2));
      console.log('📄 Total Pages:', data.total_pages);
      console.log('📝 Total Rows:', data.total_rows);
      console.log('📋 Pages Data:', data.pages);

      // Store extraction result
      setExtractionResult(data);
      localStorage.setItem('extractionResult', JSON.stringify(data));

      // Transform and populate ExtractionDataContext
      if (setExtractionData) {
        const transformedData = transformExtractionData(data);
        console.log(
          '🔄 Transformed data for ExtractionDataContext:',
          transformedData
        );
        setExtractionData(transformedData);
        localStorage.setItem(
          'extractedPageData',
          JSON.stringify(transformedData)
        );
      }

      setUploadStatus('success');
      return data;
    } catch (error) {
      console.error('❌ Error uploading PDF:', error);
      setUploadStatus('error');
      setUploadError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
      throw error;
    }
  };

  // Initialize from localStorage on mount
  if (typeof window !== 'undefined' && pdfFile === null) {
    const stored = localStorage.getItem('uploadedPDF');
    if (stored) {
      setPdfFile(stored);
    }
  }

  return (
    <PDFContext.Provider
      value={{
        pdfFile,
        setPdfFile,
        uploadPDF,
        uploadStatus,
        uploadError,
        extractionResult,
      }}
    >
      {children}
    </PDFContext.Provider>
  );
}

export function usePDF() {
  const context = useContext(PDFContext);
  if (context === undefined) {
    throw new Error('usePDF must be used within a PDFProvider');
  }
  return context;
}
