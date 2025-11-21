'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface PDFContextType {
  pdfFile: string | null;
  setPdfFile: (file: string | null) => void;
  uploadPDF: (file: File) => Promise<void>;
}

const PDFContext = createContext<PDFContextType | undefined>(undefined);

export function PDFProvider({ children }: { children: ReactNode }) {
  const [pdfFile, setPdfFile] = useState<string | null>(null);

  const uploadPDF = async (file: File) => {
    return new Promise<void>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPdfFile(result);
        // Store in localStorage for persistence across page reloads
        localStorage.setItem('uploadedPDF', result);
        resolve();
      };
      reader.readAsDataURL(file);
    });
  };

  // Initialize from localStorage on mount
  if (typeof window !== 'undefined' && pdfFile === null) {
    const stored = localStorage.getItem('uploadedPDF');
    if (stored) {
      setPdfFile(stored);
    }
  }

  return (
    <PDFContext.Provider value={{ pdfFile, setPdfFile, uploadPDF }}>
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
