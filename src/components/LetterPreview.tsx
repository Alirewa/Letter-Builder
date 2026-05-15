'use client';

import { Eye } from 'lucide-react';
import { useLetterStore } from '@/store/letterStore';
import { usePreviewScale } from '@/hooks/usePreviewScale';
import LetterDocument from './LetterDocument';

export default function LetterPreview() {
  const letter = useLetterStore((s) => s.letter);
  const { containerRef, measureRef, scale } = usePreviewScale();

  return (
    // measureRef goes on the OUTER stable flex section — its width never changes due to zoom
    <div ref={measureRef} className="flex flex-col h-full min-h-0">

      {/* Live indicator toolbar */}
      <div className="no-print flex items-center gap-2 px-4 py-2 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex-shrink-0">
        <Eye size={15} className="text-green-500" />
        <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">پیش‌نمایش زنده</span>
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      </div>

      {/* Scroll container — overflow-x hidden prevents scrollbar-triggered oscillations */}
      <div
        ref={containerRef}
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden bg-slate-300 dark:bg-slate-700 scrollbar-thin"
      >
        <div className="flex justify-center py-4">
          <div
            style={{
              zoom: scale,
              flexShrink: 0,
              transformOrigin: 'top center',
            }}
          >
            <LetterDocument letter={letter} />
          </div>
        </div>
        <div className="h-4" />
      </div>
    </div>
  );
}
