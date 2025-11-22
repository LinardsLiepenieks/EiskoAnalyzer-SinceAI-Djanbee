'use client';

import dynamic from 'next/dynamic';

const PDFViewer = dynamic(() => import('./PDFViewer'), { ssr: false });

interface PDFSidebarProps {
  isVisible: boolean;
  onHeights: (heights: number[]) => void;
}

export default function PDFSidebar({ isVisible, onHeights }: PDFSidebarProps) {
  return (
    <>
      {/* Backdrop for mobile */}
      {isVisible && (
        <div
          className="absolute inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-500"
          onClick={() => {}} // Will need to pass onToggle prop if you want backdrop click to close
        />
      )}

      {/* Sidebar container */}
      <div
        className={`
          transition-all duration-500 ease-in-out
          
          /* Mobile: Absolute overlay within parent */
          absolute lg:relative
          right-0 top-0 bottom-0
          w-full sm:w-3/4 md:w-2/3
          z-50 lg:z-auto
          ${isVisible ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          
          /* Desktop: Relative positioning with width transition */
          ${isVisible ? 'lg:w-1/2' : 'lg:w-0'}
        `}
      >
        <div
          className={`
            overflow-x-scroll overflow-y-hidden
            h-full
            bg-background
            transition-all duration-500 ease-in-out
            
            /* Mobile and Desktop opacity */
            ${isVisible ? 'opacity-100' : 'opacity-0'}
            
            /* Desktop: absolute positioning to slide right */
            lg:absolute lg:inset-0
            ${isVisible ? '' : 'lg:translate-x-full'}
          `}
        >
          <PDFViewer onHeights={onHeights} />
        </div>
      </div>
    </>
  );
}
