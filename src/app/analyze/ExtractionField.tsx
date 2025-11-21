'use client';

interface ExtractionFieldProps {
  pageIndex: number;
}

export default function ExtractionField({ pageIndex }: ExtractionFieldProps) {
  return (
    <div className="flex h-10 text-white px-4 items-center gap-4 flex-shrink-0 border border-gray-500">
      {/* ICON */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-6 h-6 bg-red-500 rounded flex-shrink-0"></div>
      </div>

      {/* NRo */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <input
          type="text"
          maxLength={4}
          className="w-16 text-xs px-2 py-1 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-400"
          placeholder="####"
        />
      </div>

      {/* Kuvateksti */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <input
          type="text"
          className="w-64 text-xs px-2 py-1 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-400"
          placeholder="Enter description..."
        />
      </div>

      {/* Suoja */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <input
          type="text"
          maxLength={6}
          className="w-20 text-xs px-2 py-1 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-400"
          placeholder="######"
        />
      </div>

      {/* Kaapeli */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <input
          type="text"
          maxLength={14}
          className="w-36 text-xs px-2 py-1 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-400"
          placeholder="##############"
        />
      </div>
    </div>
  );
}
