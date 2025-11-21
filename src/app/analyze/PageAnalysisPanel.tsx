'use client';

import ExtractionField from './ExtractionField';

interface PageAnalysisPanelProps {
  pageIndex: number;
  height: number;
}

export default function PageAnalysisPanel({
  pageIndex,
  height,
}: PageAnalysisPanelProps) {
  return (
    <div
      className="w-full bg-gray-700 rounded flex flex-col items-start justify-start py-2.5 text-white overflow-x-auto"
      style={{ height: `${height}px` }}
    >
      <div className="w-full border border-gray-500 border-solid h-full overflow-x-auto">
        {/* Header with field labels */}
        <div className="flex h-12.5 text-white px-4 items-center gap-4 flex-shrink-0 border mt-4 border-gray-500 bg-gray-800">
          {/* ICON */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-sm font-medium whitespace-nowrap w-6">
              ICON
            </span>
          </div>

          {/* NRo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-sm font-medium whitespace-nowrap w-16">
              NRo
            </span>
          </div>

          {/* Kuvateksti */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-sm font-medium whitespace-nowrap w-64">
              Kuvateksti
            </span>
          </div>

          {/* Suoja */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-sm font-medium whitespace-nowrap w-20">
              Suoja
            </span>
          </div>

          {/* Kaapeli */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-sm font-medium whitespace-nowrap w-36">
              Kaapeli
            </span>
          </div>
        </div>

        {/* Data rows */}
        <ExtractionField pageIndex={pageIndex} />
        <ExtractionField pageIndex={pageIndex} />
        <ExtractionField pageIndex={pageIndex} />
        <ExtractionField pageIndex={pageIndex} />
        <ExtractionField pageIndex={pageIndex} />
        <ExtractionField pageIndex={pageIndex} />
        <ExtractionField pageIndex={pageIndex} />
        <ExtractionField pageIndex={pageIndex} />
        <ExtractionField pageIndex={pageIndex} />
        <ExtractionField pageIndex={pageIndex} />
      </div>
    </div>
  );
}
