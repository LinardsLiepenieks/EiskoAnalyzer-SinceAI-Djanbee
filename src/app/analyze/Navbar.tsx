'use client';

import { useRouter } from 'next/navigation';
import { useExtractionData } from '@/contexts/ExtractionDataContext';

interface NavbarProps {
  isPdfVisible: boolean;
  onTogglePdf: () => void;
}

export default function Navbar({ isPdfVisible, onTogglePdf }: NavbarProps) {
  const router = useRouter();
  const { extractionData } = useExtractionData();

  const handleSummarize = () => {
    console.log('Extraction Data:', extractionData);
    router.push('/summary');
  };

  return (
    <div className="h-16 bg-gray-800 text-white flex items-center px-4 gap-4">
      <span className="text-xl font-bold">NAVBAR</span>
      <button
        onClick={handleSummarize}
        className="ml-auto px-4 py-2 bg-green-500 hover:bg-green-600 rounded transition-colors font-semibold"
      >
        Summarize
      </button>
      <button
        onClick={onTogglePdf}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded transition-colors"
      >
        {isPdfVisible ? 'Hide PDF' : 'Show PDF'}
      </button>
    </div>
  );
}
